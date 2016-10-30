<!--[options]
name: 'Introducing WinApi: Graphics with Direct3D, D2D1, GDI, OpenGL and Skia'
date: 2016-10-23T19:42:37.156Z
url: 2016/10/introducing-winapi-graphics-with-direct3d-d2d1-gdi-opengl-and-skia
tags:
 - WinApi
 - DotNet
 - C#
 - Graphics
 - Skia
 - DirectX
 - OpenGL
-->

# Introducing WinApi: Graphics with Direct3D, D2D1, GDI, OpenGL and Skia

As I introduced the basics of <a href="https://github.com/prasannavl/WinApi">WinApi</a> in my <a href="/2016/10/introducing-winapi-basics" class="route">previous articles</a>, it may make sense to actually present something on the screen. And how better to do it, than by using the lowest-level of software drawing layers.

<img src="https://c2.staticflickr.com/6/5327/30433710081_0e77692a47_b_d.jpg" alt="[Image]" style="width:100%;" />

Actually, the title probably includes every major drawing library other than `Cairo`, but I choose `Skia` for the purposes of demonstration here, since its at the crux of both *Google Chrome* and *Firefox*. It may seem overwhelming that I'm demoing all of these technologies in a single article, but this is where the helpers of `WinApi` gives a hand to make all this super easy, without compromising on the performance.

## The GDI Window

Let's start with the most fundamental and built-in 2D graphics library with Windows - GDI.

```c#
internal class Program
{
    static int Main(string[] args)
    {
        var factory = WindowFactory.Create(
            hBgBrush: Gdi32Helpers.GetStockObject(StockObject.WHITE_BRUSH));
        using (var win = factory.CreateWindow(() => new MainWindow(),
            "Hello", constructionParams: new FrameWindowConstructionParams()))
        {
            win.Show();
            return new EventLoop().Run(win);
        }
    }
}

public class MainWindow : Window
{
    protected override void OnPaint(ref PaintPacket packet)
    {
        PaintStruct ps;
        var hdc = BeginPaint(out ps);
        var rect = new Rectangle(500, 500);
        RectangleHelpers.Translate(ref rect, 100, 100);
        var brush = Gdi32Helpers.CreateSolidBrush(200, 140, 130);
        User32Methods.FillRect(hdc, ref rect, brush);
        Gdi32Methods.DeleteObject(brush);
        EndPaint(ref ps);
        base.OnPaint(ref packet);
    }
}
```

This should be straight-forward. I'm using `WindowFactory` here to register a new class, which has a background brush which is white. If not, it would end up with the default window brush, which is the windows mild gray, that you generally see. This can also be set to `IntPtr.Zero` (basically null), and take care of the erasing either in with the `OnEraseBkgnd`, or by directly handling the erase during paint method as well (which I'll do later for the DirectX samples).

So, this should look open up this window:

<img src="https://c1.staticflickr.com/9/8650/29889572904_742a97a9a9_b_d.jpg" alt="[Image]" style="width:100%;" />

That's about it. Nothing special to be done here, and all the Gdi methods can be used as usual.

## The Skia Window

I'm going to skip right off to using `Skia` next. The best way to use Skia from C# is by using the `SkiaSharp` library from the Xamarin team.

While using Skia, you have complete control over how and when you allocate the memory for your window bitmap. I prefer to allocate native memory, and pass the pointers directly to Skia. And in order to ease this, I've already written a `NativePixelBuffer` class into `WinApi.Utils`, that automatically manages the pixel buffer for a given size, and resizes the native memory as required. It should take care of the buffer length, and image stride (currently only supports 32-bit Rgba, which should be sufficient for most purposes).

With all that out of the way, I'm going to start off with a paint handler given a `SKSurface`.

```c#
public class SkiaPainter
{
    public static void ProcessPaint(ref PaintPacket packet, NativePixelBuffer pixelBuffer,
        Action<SKSurface> handler)
    {
        var hwnd = packet.Hwnd;
        Rectangle clientRect;
        User32Methods.GetClientRect(hwnd, out clientRect);
        var size = clientRect.GetSize();
        pixelBuffer.EnsureSize(size.Width, size.Height);
        PaintStruct ps;
        var hdc = User32Methods.BeginPaint(hwnd, out ps);
        var skPainted = false;
        try
        {
            using (var surface = SKSurface.Create(
                size.Width,
                size.Height,
                SKColorType.Bgra8888,
                SKAlphaType.Premul,
                pixelBuffer.Handle,
                pixelBuffer.Stride))
            {
                if (surface != null)
                {
                    handler(surface);
                    skPainted = true;
                }
            }
        }
        finally
        {
            if (skPainted) Gdi32Helpers.SetRgbBitsToDevice(hdc, size.Width, size.Height, pixelBuffer.Handle);
            User32Methods.EndPaint(hwnd, ref ps);
        }
    }
}
```

Looks simple enough. It simply creates a surface, and calls in a delegate that does all the painting. **This can technically be optimized further by pooling, or caching the `SKSurface`, but I'm going to skip it for now**.

The interesting method here is the `Gdi32Helpers.SetRgbBitsToDevice`. Its simply a helper for `SetDIBitsToDevice` GDI method, that takes care of the bitmap header parameters, and blitting the surface over.

Now, I can encapsulate a window that uses this:

```c#
public class SkiaWindowBase : EventedWindowCore
{
    private readonly NativePixelBuffer m_pixelBuffer = new NativePixelBuffer();

    protected virtual void OnSkiaPaint(SKSurface surface) {}

    protected override void OnPaint(ref PaintPacket packet)
    {
        SkiaPainter.ProcessPaint(ref packet, this.m_pixelBuffer, this.OnSkiaPaint);
    }

    protected override void Dispose(bool disposing)
    {
        this.m_pixelBuffer.Dispose();
        base.Dispose(disposing);
    }
}
```

Yup. That's about it. You can now go ahead and use Skia to handle all the painting.

```c#
static int Main(string[] args)
{
    try
    {
        ApplicationHelpers.SetupDefaultExceptionHandlers();
        var factory = WindowFactory.Create(hBgBrush: IntPtr.Zero);
        using (var win = factory.CreateWindow(() => new SkiaWindow(), "Hello",
            constructionParams: new FrameWindowConstructionParams()))
        {
            win.Show();
            return new EventLoop().Run(win);
        }
    }
    catch (Exception ex)
    {
        MessageBoxHelpers.ShowError(ex);
        return 1;
    }
}

public sealed class SkiaWindow : SkiaWindowBase
{
    protected override void OnSkiaPaint(SKSurface surface)
    {
        var windowRect = GetWindowRect();
        var clientRect = new Rectangle(windowRect.Width, windowRect.Height);
        var canvas = surface.Canvas;
        canvas.Clear(new SKColor(120, 50, 70, 200));
        var textPainter = new SKPaint {TextSize = 35, IsAntialias = true};
        var str = "Hello there!";
        var textBounds = new SKRect();
        var m = textPainter.MeasureText(str, ref textBounds);

        canvas.DrawText(str, (clientRect.Width - textBounds.Width)/2, 
            (clientRect.Height - textBounds.Height)/2,
            textPainter);

        base.OnSkiaPaint(surface);
    }
}
```

And the result:

<img src="https://c1.staticflickr.com/9/8676/29889574054_94206b699b_b_d.jpg" alt="[Image]" style="width:100%;" />

## The OpenGL Window

Moving on to OpenGL, I'm going to use `OpenGL.Net` as a raw wrapper to OpenGL. However, I'm going to leave the initialization of GL out of the sample here, since its quite complicated. I've already written a class `OpenGlWindow` that wraps over all of that in the sample that's already there in the `WinApi` repo:

https://github.com/prasannavl/WinApi/tree/master/Samples/Sample.OpenGL

Reusing the class from there:

```c#
class Program
{
    static int Main(string[] args)
    {
        try
        {
            ApplicationHelpers.SetupDefaultExceptionHandlers();
            Gl.Initialize();
            var factory = WindowFactory.Create(hBgBrush: 
                Gdi32Helpers.GetStockObject(StockObject.BLACK_BRUSH));
            using (var win = Window.Create<AppWindow>(factory: factory,
                    text: "Hello"))
            {
                win.Show();
                return new EventLoop().Run(win);
            }
        }
        catch (Exception ex)
        {
            MessageBoxHelpers.ShowError(ex);
            return 1;
        }
    }
}

public sealed class AppWindow : OpenGlWindow
{
    protected override void OnGlContextCreated()
    {
        Gl.MatrixMode(MatrixMode.Projection);
        Gl.LoadIdentity();
        Gl.Ortho(0.0, 1.0f, 0.0, 1.0, 0.0, 1.0);

        Gl.MatrixMode(MatrixMode.Modelview);
        Gl.LoadIdentity();
        base.OnGlContextCreated();
    }

    protected override void OnGlPaint(ref PaintStruct ps)
    {
        Gl.Clear(ClearBufferMask.ColorBufferBit);
        var size = GetClientSize();
        Gl.Viewport(0, 0, size.Width, size.Height);
        Gl.Begin(PrimitiveType.Triangles);
        Gl.Color3(1.0f, 0.0f, 0.0f);
        Gl.Vertex2(0.0f, 0.0f);
        Gl.Color3(0.0f, 1.0f, 0.0f);
        Gl.Vertex2(0.5f, 1.0f);
        Gl.Color3(0.0f, 0.0f, 1.0f);
        Gl.Vertex2(1.0f, 0.0f);
        Gl.End();
        DeviceContext.SwapBuffers();
    }
}
```

And here's the result:

<img src="https://c1.staticflickr.com/9/8599/30222129330_bb84398a1b_b_d.jpg" alt="[Image]" style="width:100%;" />

## The Direct3D and Direct2D Window

And finally to DirectX. I kept this for the last, because its generally considered to the most complex of it all - It requires in-depth knowledge of how the GPU pipeline actually works, swap chains, color formats and life-cycle management of the GPU meta resources, and a lot more. However, with `WinApi.DxUtils`, you don't have do any of that.

And with DirectX, I also decided to up the game a little, even for the quick sample. If you look closely into the screenshot in the beginning of the article, there's **a window that has per-pixel alpha with varying opacity blending beautifully into the desktop**. Doing this the high-performance way requires you use `DirectComposition` in all its glory. Well, thanks to `WinApi.DxUtils`, all of that is already taken care of, again.

First off, I'm going to create a window with `WS_EX_NOREDIRECTIONBITMAP` style. This works on Win 8+, designed specially for high-performance compositing to direct DWM to not allocate a redirection bitmap - The DXGI surface is shared with DWM directly on the GPU, making per-pixel alpha compositing super-performant. Internally, this is one of the things, all the modern Windows Runtime apps use, by default.

```c#
static int Main(string[] args)
{
    try
    {
        ApplicationHelpers.SetupDefaultExceptionHandlers();
        var factory = WindowFactory.Create(hBgBrush: IntPtr.Zero);
        using (
            var win = factory.CreateWindow(() => new MainWindow(), "Hello",
                constructionParams: new FrameWindowConstructionParams(),
                exStyles: WindowExStyles.WS_EX_APPWINDOW
                    | WindowExStyles.WS_EX_NOREDIRECTIONBITMAP))
        {
            win.CenterToScreen();
            win.Show();
            return new EventLoop().Run(win);
        }
    }
    catch (Exception ex)
    {
        MessageBoxHelpers.ShowError(ex);
        return 1;
    }
}
```

This ends up with a window without no surface at all, and just the non-client frames. And then, I'm going to use the `Dx11Component` for `WinApi.DxUtils`. This is **a meta-resource manager that manages all of DXGI, D3D11, D2D1, DirectWrite, and DirectComposition**.

The really cool thing about the `Dx11Component` is that it conjures up the latest and greatest `Dx11` resource set that your platform can support. If you're on Window 7, it skips DirectComposition. Windows 8 also uses a slightly different codepath than Windows 8.1 and 10. All of these are handled seamlessly by DxUtils. I initially had written it with support for DXGI 1, but I decided to scrap it and use DXGI 1.2 as the lowest, simply to keep it baggage free. All the interfaces are still present, but it just doesn't provide default implementations for DXGI versions less than 1.2.

So, in all its glory, the entire management of D3D11, D2D1, DirectWrite and DComp which can usually takes up a lot of code, now simply translates into:

```c#
public sealed class DxWindow : EventedWindowCore
{
    private readonly Dx11Component m_dx = new Dx11Component();

    protected override void OnCreate(ref CreateWindowPacket packet)
    {
        this.Dx.Initialize(this.Handle, this.GetClientSize());
        base.OnCreate(ref packet);
    }

    protected virtual void OnDxDraw(Dx11Component dx) {}
    protected override void OnPaint(ref PaintPacket packet)
    {
        m_dx.EnsureInitialized();
        try
        {
            OnDxDraw(m_dx);
            this.Validate();
        }
        catch (SharpDXException ex)
        {
            if (!m_dx.PerformResetOnException(ex))
                throw;
        }
    }

    protected override void OnSize(ref SizePacket packet)
    {
        this.Dx.Resize(packet.Size);
        base.OnSize(ref packet);
    }

    protected override void Dispose(bool disposing)
    {
        m_dx.Dispose();
        base.Dispose(disposing);
    }
}
```

Yup! That's all there is to it.

But.. I just lied - **you don't even have to write this**!

I showed this just so that you can. This gives you complete control over the creation, and configurations of the swapchain, formats and so on while creating the `Dx11Component`. However, for simpler scenarios, `DxUtils` already includes a `DxWindow`, that does all of this.

So, all you need to do, is derive from `DxWindow`:

```c#
public sealed class MainWindow : DxWindow
{
    protected override void OnDxPaint(Dx11Component resource)
    {
        var rand = new Random();

        var size = GetClientSize();
        var w = size.Width;
        var h = size.Height;
        var context = resource.D2D.Context;

        context.BeginDraw();
        context.Clear(new RawColor4(0, 0, 0, 0f));
        var b = new SolidColorBrush(context,
            new RawColor4(rand.NextFloat(), rand.NextFloat(), rand.NextFloat(), 0.4f));

        context.FillRectangle(new RawRectangleF(200, 200, 500, 700), b);

        for (var i = 0; i < 10; i++)
        {
            b.Color = new RawColor4(rand.NextFloat(), rand.NextFloat(), 
                rand.NextFloat(), 0.4f);
            context.FillEllipse(
                new Ellipse(new RawVector2(rand.NextFloat(0, w), 
                    rand.NextFloat(0, h)), rand.NextFloat(0, w),
                    rand.Next(0, h)), b);
            context.FillRectangle(
                new RawRectangleF(rand.NextFloat(0, w), 
                    rand.NextFloat(0, h), rand.NextFloat(0, w),
                    rand.NextFloat(0, h)), b);
        }
        b.Dispose();
        context.EndDraw();
    }
}
```

As far as I know, this is probably the quickest way that exists to date, to start off reliable DirectX applications, and all of this with no compromise on the performance in anyway. Unless you come across errors or device loss (handling of which are also fully automatic, btw) there's really no GC allocation on the painting path, and it provides you nothing but raw performance.

And the result:

<img src="https://c2.staticflickr.com/6/5824/30222132320_b302694543_b_d.jpg" alt="[Image]" style="width:100%;" />
