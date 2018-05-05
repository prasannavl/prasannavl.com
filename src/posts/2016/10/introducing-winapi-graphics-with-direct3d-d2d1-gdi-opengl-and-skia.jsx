import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "Introducing WinApi: Graphics with Direct3D, D2D1, GDI, OpenGL and Skia",
    date: "2016-10-23T19:42:37.156Z",
    tags: ["dotnet", "windows", "graphics"],
    featured: true,
    description: "Article on WinApi - Part 3",    
}

export default () => {
    return <Article {...meta}>
        <p><b>GitHub: </b><a href="https://github.com/prasannavl/WinApi">WinApi</a></p>
        
        <p>As I introduced the basics of <a href="https://github.com/prasannavl/WinApi">WinApi</a> in my <Link to="/2016/10/introducing-winapi-basics/">previous articles</Link>, it may make sense to actually present something on the screen. And how better to do it, than by using the lowest-level of software drawing layers.</p>
        
        <p><img className="img-fluid" src={require("./data/gfx-expose.jpg")} alt="[Image]"  /></p>
        
        <p>Actually, the title probably includes every major drawing library other than <code>Cairo</code>, but I choose <code>Skia</code> for the purposes of demonstration here, since its at the crux of both <em>Google Chrome</em> and <em>Firefox</em>. It may seem overwhelming that I'm demoing all of these technologies in a single article, but this is where the helpers of <code>WinApi</code> gives a hand to make all this super easy, without compromising on the performance.</p>

        <h2>The GDI Window</h2>

        <p>Let's start with the most fundamental and built-in 2D graphics library with Windows - GDI.</p>

        <CodeBlock children={`
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
        `} />

        <p>This should be straight-forward. I'm using <code>WindowFactory</code> here to register a new class, which has a background brush which is white. If not, it would end up with the default window brush, which is the windows mild gray, that you generally see. This can also be set to <code>IntPtr.Zero</code> (basically null), and take care of the erasing either in with the <code>OnEraseBkgnd</code>, or by directly handling the erase during paint method as well (which I'll do later for the DirectX samples).</p>

        <p>So, this should look open up this window:</p>

        <p><img className="img-fluid" src={require("./data/gfx-gdi.jpg")} alt="[Image]" /></p>

        <p>That's about it. Nothing special to be done here, and all the Gdi methods can be used as usual.</p>

        <h2>The Skia Window</h2>

        <p>I'm going to skip right off to using <code>Skia</code> next. The best way to use Skia from C# is by using the <code>SkiaSharp</code> library from the Xamarin team.</p>

        <p>While using Skia, you have complete control over how and when you allocate the memory for your window bitmap. I prefer to allocate native memory, and pass the pointers directly to Skia. And in order to ease this, I've already written a <code>NativePixelBuffer</code> class into <code>WinApi.Utils</code>, that automatically manages the pixel buffer for a given size, and resizes the native memory as required. It should take care of the buffer length, and image stride (currently only supports 32-bit Rgba, which should be sufficient for most purposes).</p>

        <p>With all that out of the way, I'm going to start off with a paint handler given a <code>SKSurface</code>.</p>

        <CodeBlock children={`
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
                if (skPainted) Gdi32Helpers.SetRgbBitsToDevice(
                    hdc, size.Width, size.Height, pixelBuffer.Handle);
                User32Methods.EndPaint(hwnd, ref ps);
            }
        }
    }
        `} />

        <p>Looks simple enough. It simply creates a surface, and calls in a delegate that does all the painting. <strong>This can technically be optimized further by pooling, or caching the <code>SKSurface</code>, but I'm going to skip it for now</strong>.</p>

        <p>The interesting method here is the <code>Gdi32Helpers.SetRgbBitsToDevice</code>. Its simply a helper for <code>SetDIBitsToDevice</code> GDI method, that takes care of the bitmap header parameters, and blitting the surface over.</p>

        <p>Now, I can encapsulate a window that uses this:</p>

        <CodeBlock children={`
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
        `} />

        <p>Yup. That's about it. You can now go ahead and use Skia to handle all the painting.</p>

        <CodeBlock children={`
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
        `} />

        <p>And the result:</p>

        <p><img className="img-fluid" src={require("./data/gfx-skia.jpg")} alt="[Image]" /></p>

        <h2>The OpenGL Window</h2>

        <p>Moving on to OpenGL, I'm going to use <code>OpenGL.Net</code> as a raw wrapper to OpenGL. However, I'm going to leave the initialization of GL out of the sample here, since its quite complicated. I've already written a class <code>OpenGlWindow</code> that wraps over all of that in the sample that's already there in the <code>WinApi</code> repo:</p>

        <p><a href="https://github.com/prasannavl/WinApi/tree/master/Samples/Sample.OpenGL">https://github.com/prasannavl/WinApi/tree/master/Samples/Sample.OpenGL</a></p>

        <p>Reusing the class from there:</p>

        <CodeBlock children={`
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
        `} />

        <p>And here's the result:</p>

        <p><img className="img-fluid" src={require("./data/gfx-opengl.jpg")} alt="[Image]" /></p>

        <h2>The Direct3D and Direct2D Window</h2>

        <p>And finally to DirectX. I kept this for the last, because its generally considered to the most complex of it all - It requires in-depth knowledge of how the GPU pipeline actually works, swap chains, color formats and life-cycle management of the GPU meta resources, and a lot more. However, with <code>WinApi.DxUtils</code>, you don't have do any of that.</p>

        <p>And with DirectX, I also decided to up the game a little, even for the quick sample. If you look closely into the screenshot in the beginning of the article, there's <strong>a window that has per-pixel alpha with varying opacity blending beautifully into the desktop</strong>. Doing this the high-performance way requires you use <code>DirectComposition</code> in all its glory. Well, thanks to <code>WinApi.DxUtils</code>, all of that is already taken care of, again.</p>

        <p>First off, I'm going to create a window with <code>WS_EX_NOREDIRECTIONBITMAP</code> style. This works on Win 8+, designed specially for high-performance compositing to direct DWM to not allocate a redirection bitmap - The DXGI surface is shared with DWM directly on the GPU, making per-pixel alpha compositing super-performant. Internally, this is one of the things, all the modern Windows Runtime apps use, by default.</p>

        <CodeBlock children={`
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
        `} />

        <p>This ends up with a window without no surface at all, and just the non-client frames. And then, I'm going to use the <code>Dx11Component</code> for <code>WinApi.DxUtils</code>. This is <strong>a meta-resource manager that manages all of DXGI, D3D11, D2D1, DirectWrite, and DirectComposition</strong>.</p>

        <p>The really cool thing about the <code>Dx11Component</code> is that it conjures up the latest and greatest <code>Dx11</code> resource set that your platform can support. If you're on Window 7, it skips DirectComposition. Windows 8 also uses a slightly different codepath than Windows 8.1 and 10. All of these are handled seamlessly by DxUtils. I initially had written it with support for DXGI 1, but I decided to scrap it and use DXGI 1.2 as the lowest, simply to keep it baggage free. All the interfaces are still present, but it just doesn't provide default implementations for DXGI versions less than 1.2.</p>

        <p>So, in all its glory, the entire management of D3D11, D2D1, DirectWrite and DComp which can usually takes up a lot of code, now simply translates into:</p>

        <CodeBlock children={`
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
        `} />

        <p>Yup! That's all there is to it.</p>

        <p>But.. I just lied - <strong>you don't even have to write this</strong>!</p>

        <p>I showed this just so that you can. This gives you complete control over the creation, and configurations of the swapchain, formats and so on while creating the <code>Dx11Component</code>. However, for simpler scenarios, <code>DxUtils</code> already includes a <code>DxWindow</code>, that does all of this.</p>

        <p>So, all you need to do, is derive from <code>DxWindow</code>:</p>

        <CodeBlock children={`
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
        `} />

        <p>As far as I know, this is probably the quickest way that exists to date, to start off reliable DirectX applications, and all of this with no compromise on the performance in anyway. Unless you come across errors or device loss (handling of which are also fully automatic, btw) there's really no GC allocation on the painting path, and it provides you nothing but raw performance.</p>

        <p>And the result:</p>
        <p><img className="img-fluid" src={require("./data/gfx-dx.jpg")} alt="[Image]"  /></p>

    </Article>
}