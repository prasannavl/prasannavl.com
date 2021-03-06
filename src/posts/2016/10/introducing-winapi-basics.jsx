import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "Introducing WinApi: Basics",
    date: "2016-10-22T14:01:11.533Z",
    tags: ["dotnet", "windows"],
    featured: true,
    description: "Article on WinApi - Part 2",
}

export default () => {
    return <Article {...meta}>
        <p><b>GitHub: </b><a href="https://github.com/prasannavl/WinApi">WinApi</a></p>

        <p>In the previous article <Link to="/2016/10/introducing-winapi-the-evolution/">here</Link>, I discussed the evolution of programs that use the Windows API with C/C++ and C# snippets, and it ultimately ended out with this C# snippet:</p>

        <CodeBlock lang="csharp" children={`
static int Main(string[] args)
{
    using (var win = Window.Create(text: "Hello"))
    {
        win.Show();
        return new EventLoop().Run(win);
    }
}
        `} />


        <p>Yup. That's fully functional code that works. Just add references to <code>WinApi</code>, and <code>WinApi.Controls</code> which are both <code>less than 150kb</code> combined, and it'll do what its excepted to do. However, before I get into samples that look nifty, let's look at a precise translation of the C/C++ program in the previous article, without the use of the <code>Window</code> abstraction that <code>WinApi</code> provides in the helper namespace <code>WinApi.Windows</code>.</p>

        <p>A very raw program that uses the Windows API would look like this:</p>

        <CodeBlock lang="csharp" children={`
using System;
using System.Runtime.InteropServices;
using WinApi.Gdi32;
using WinApi.Kernel32;
using WinApi.User32;

namespace Sample.Win32
{
    internal class Program
    {
        static int Main(string[] args)
        {
            var instanceHandle = Kernel32Methods.GetModuleHandle(IntPtr.Zero);

            var wc = new WindowClassEx
            {
                Size = (uint) Marshal.SizeOf<WindowClassEx>(),
                ClassName = "MainWindow",
                CursorHandle = User32Helpers.LoadCursor(IntPtr.Zero, SystemCursor.IDC_ARROW),
                IconHandle = User32Helpers.LoadIcon(IntPtr.Zero, SystemIcon.IDI_APPLICATION),
                Styles = WindowClassStyles.CS_HREDRAW | WindowClassStyles.CS_VREDRAW,
                BackgroundBrushHandle = new IntPtr((int) StockObject.WHITE_BRUSH),
                WindowProc = WindowProc,
                InstanceHandle = instanceHandle
            };

            var resReg = User32Methods.RegisterClassEx(ref wc);
            if (resReg == 0)
            {
                Console.Error.WriteLine("registration failed");
                return -1;
            }

            var hwnd = User32Methods.CreateWindowEx(WindowExStyles.WS_EX_APPWINDOW,
                wc.ClassName, "Hello", WindowStyles.WS_OVERLAPPEDWINDOW,
                (int) CreateWindowFlags.CW_USEDEFAULT, (int) CreateWindowFlags.CW_USEDEFAULT,
                (int) CreateWindowFlags.CW_USEDEFAULT, (int) CreateWindowFlags.CW_USEDEFAULT,
                IntPtr.Zero, IntPtr.Zero, instanceHandle, IntPtr.Zero);

            if (hwnd == IntPtr.Zero)
            {
                Console.Error.WriteLine("window creation failed");
                return -1;
            }

            User32Methods.ShowWindow(hwnd, ShowWindowCommands.SW_SHOWNORMAL);
            User32Methods.UpdateWindow(hwnd);

            Message msg;
            int res;
            while ((res = User32Methods.GetMessage(out msg, IntPtr.Zero, 0, 0)) != 0)
            {
                User32Methods.TranslateMessage(ref msg);
                User32Methods.DispatchMessage(ref msg);
            }

            return res;
        }

        private static IntPtr WindowProc(IntPtr hwnd, uint umsg,
            IntPtr wParam, IntPtr lParam)
        {
            var msg = (WM) umsg;
            switch (msg)
            {
                case WM.ERASEBKGND:
                    return new IntPtr(1);
                case WM.CLOSE:
                {
                    User32Methods.PostQuitMessage(0);
                    break;
                }
                case WM.PAINT:
                {
                    PaintStruct ps;
                    var hdc = User32Methods.BeginPaint(hwnd, out ps);
                    User32Methods.FillRect(hdc, ref ps.PaintRect,
                        Gdi32Helpers.GetStockObject(StockObject.WHITE_BRUSH));
                    User32Methods.EndPaint(hwnd, ref ps);
                    break;
                }
            }
            return User32Methods.DefWindowProc(hwnd, umsg, wParam, lParam);
        }
    }
}
        `} />

        <p>Why would one do this? Because you can. You have no reason to go this really tedious way, however - if you want you always can. The primary function of <code>WinApi</code> is after-all to provide a clean high-performance interop story.</p>

        <p>It does exactly what the previous C/C++ programs did. There's no additional GC pressure, other than loading the CLR before the initialization of <code>Main</code> itself, <code>the JIT-compiled code would almost precisely match the assembly code of your C++</code>! Try doing that with Windows Forms. ;)</p>

        <p>You can accomplish this in C# yourself, but you have to add all the ugly PInvokes, and method signatures aren't always straight-forward, and even sources like <code>pinvoke.net</code> aren't always correct and are riddled with subtle errors, all of which WinApi handles.</p>

        <p>However, this program above is probably purely academic - not because it has to be, just because there better ways to do this using the <code>WinApi.Windows</code> namespace.</p>

        <h2>WinApi structure</h2>

        <p>Before getting to the <code>WinApi.Windows</code> namespace, I'd like to briefly touch on how <code>WinApi</code> is organized. Each library that corresponds to a <code>windows dll</code> gets its own namespace.</p>

        <p>Examples, <code>kernel32.dll</code> functions all are in the <code>WinApi.Kernel32</code> namespace, <code>user32.dll</code> into <code>WinApi.User32</code> namespace, and so on.</p>

        <p>And inside each namespace is a static class which ends with <code>Methods</code>. Ex: <code>User32Methods</code> - this class has all the functions of the user32.dll in its most primitive form. What this means is that, if a functions could potentially take multiple forms of input, say different structures, or variables enumerations - this method is the lower common factor, with the least marshalling performance impact.</p>

        <p>As an example <code>User32Methods</code> has the following method defined:</p>

        <CodeBlock lang="csharp" children={`
[DllImport(LibraryName, ExactSpelling = true)]
public static extern int MapWindowPoints(IntPtr hWndFrom, IntPtr hWndTo, IntPtr lpPoints, int cPoints);
        `} />

        <p>It takes all inputs in the form of <code>IntPtr</code>, which allows any kind of marshalling.</p>
        <p>At the same time, <code>User32Helpers</code> has the following implementations:</p>

        <CodeBlock lang="csharp" children={`
public static unsafe int MapWindowPoints(IntPtr hWndFrom, IntPtr hWndTo, ref Point point)
{
    fixed (Point* ptr = &point)
        return User32Methods.MapWindowPoints(hWndFrom, hWndTo, new IntPtr(ptr), 1);
}
    
public static unsafe int MapWindowPoints(IntPtr hWndFrom, IntPtr hWndTo, ref Rectangle rect)
{
    fixed (Rectangle* ptr = &rect)
    {
        var ptPtr = (Point*) ptr;
        return User32Methods.MapWindowPoints(hWndFrom, hWndTo, new IntPtr(ptPtr), 2);
    }
}
        `} />

        <p>Again, this provides straight forward Marshalling without any performance impact, since it simply pins the struct which already have C-Layouts, and passes in the pointers.</p>

        <p>Similar concepts are followed throughout the library in the form of <code>Methods</code> and <code>Helpers</code> to provide both raw and safer signatures.</p>

        <p>Then, there's also the <code>Experimental</code> namespace inside each of the library namespaces, that provide all the undocumented functions, and helpers.</p>

        <h2><code>WinApi.Windows</code></h2>
        <p>Then comes the one namespace that is special - This is not named after any native library. This library provides helpers into <code>Windows</code> - the literal windows that your applications use. It provides a high-performance, GC-allocation-free message loop, that's resembles ATL/WTL programming.</p>

        <h3>Class: <code>NativeWindow</code></h3>

        <p>This is the class that is the thinnest layer of Window. It simply wraps the original <code>Win32</code> handle. And it only has a single member - an IntPtr of <code>Handle</code>, and provides a way to attach itself to any Handle, and allows nice wrappers to be used through out.</p>

        <CodeBlock lang="csharp" children={`
var win = WindowFactory.CreateWindowFromHandle(someHwnd);
win.SetText("Hello");
win.SetPosition(100, 200);
win.Show();
win.Close();
        `} />

        <h3>Class: <code>WindowFactory</code></h3>
        <p>This is the class that acts as a <code>WNDCLASSEX</code> registration manager for Win32. It registers a class, manages its lifetime, and creates Windows of that particular class.</p>

        <p>It also provides all the convenience methods to be able to create classes as <code>NativeWindow</code>, or as any other derivative of <code>WindowCore</code>, and provides attachment, and connection implementations. It also has generic methods that are able to project the created class to any C# type that derives from <code>WindowCore</code>.</p>
        <p>Take a look at the source code of the several static methods to see what it does. Naturally, you also provide any <code>CS</code> styles, background brush, class name and others while creating a new factory - for all practical purposes it is the equivalent of Win32 class registration.</p>

        <h3>Class <code>WindowCore</code></h3>

        <p>Now this is the class where all the magic happens. It provides the actual connection by attaching your handle and connecting your <code>WindowProc</code> to the class instances. If you look at the internals of <code>ATL</code> code, this is done using a concept called <code>thunking</code> and its done in assembly which may seem like dark magic to many. However, <code>WinApi</code> does this very transparently, and with no performance impact.</p>

        <p>It does this with the help of <code>WindowFactory</code>, and swapping out its procedure during the creation of the window (more precisely during the <code>WM_NCCREATE</code> message).</p>

        <p>Once it provides the connections, the <code>OnMessage</code> instance method can be used directly from C# to process the messages.</p>

        <p><code>WindowCore</code> is still a super light weight class that does no message processing. Its stays completely out of the way, except for being able to control your message loop. But the keyword is <code>being able</code>. It doesn't not by default process any message by itself. Its simply passes it down to it default procedure. This is the lightest class that's fully functional.</p>

        <h3>Class <code>EventedWindowCore</code></h3>

        <p>Directly derived from <code>WindowCore</code> is the <code>EventedWindowCore</code> - this class decodes all the window messages, and breaks it down to its components, and passes them down to the relatives class instance's event methods.</p>

        <p>For example</p>

        <CodeBlock lang="csharp" children={`
public sealed class MainWindow : EventedWindowCore
{
    protected override void OnCreate(ref CreateWindowPacket packet)
    {
        base.OnCreate(ref packet);
    }

    protected override void OnSize(ref SizePacket packet)
    {
        var size = packet.Size;
        var flags = packet.Flag;
        base.OnSize(ref packet);
    }
}
        `} />

        <p>Internally it uses the <code>Packetizer</code> class that simples create a corresponding <code>Packet</code> struct, and transparently decodes every message into its parameters. The <code>EventedWindowCore</code> handles most of the common window messages. That's actually all it does. The implementation can be thought of as nothing but one giant switch case that does simply creates a packet and propagates the packet to its appropriate handler method.</p>

        <p>For example,</p>

        <CodeBlock lang="csharp" children={`
public static unsafe void ProcessMove(ref WindowMessage msg, EventedWindowCore window)
{
    fixed (WindowMessage* ptr = &msg)
    {
        var packet = new MovePacket(ptr);
        window.OnMove(ref packet);
    }
}
        `} />

        <p>This is the implementation for <code>WM_MOVE</code> handler. The <code>MovePacket</code> provides a very nice way to handle <code>WM_MOVE</code>, since it can both decode or encode the WM_MOVE messages into its parameter. It has the property <code>Point</code> as one of its properties.</p>

        <p>So, similar to ATL/WTL, if you use the <code>WindowCore</code> you could manually build only the events you want to handle, by using the corresponding <code>Packet</code> manually - though in really, there's really no reason to do it, since the <code>JIT</code> will optimize away the <code>EventedWindowCore</code> to give you similar code in the end.</p>

        <p>You can use the <code>EventedWindowCore</code>, derive all its benefits, but yet maintain performance very similar to writing native code in <code>ATL</code> with C++. However, for some reason you still want to use <code>WindowCore</code>, simply create the packet, to be able to decode the messages and build the logic manually, as you like. No more dealing with <code>wparam</code> and <code>lparam</code>.</p>

        <p>Infact, the way <code>EventedWindowCore</code> is implemented very similar to this:</p>

        <CodeBlock lang="csharp" children={`
public class EventedWindowCore : WindowCore {
    protected override OnMessage(ref WindowMessage msg) {
        switch (msg.Id) {
            ...
            case WM.MOVE {
                Packetizer.ProcessMove(ref msg, this);
                break;
            }
            ...
            default:
            {
                this.OnMessageDefault(ref msg);
            }
        }
    }

    ...
    protected internal virtual void OnMove(ref MovePacket packet)
    {
        // Call the OnMessageDefault here.
    }
    ...
}
        `} />

        <p>And in the above case <code>OnMessageDefault</code> translates into calling the base window procedure, which would be the <code>DefWindowProc</code> method in <code>user32.dll</code> if its an plain window, or the window's default procedure if its an in-built class like <code>STATIC</code>, <code>EDIT</code>, etc.</p>

        <p>Also, the every single <code>Packet</code> variant is highly optimized to pass values on without any marshalling and additional copies of data. Even though many of the pointers are very naturally exposed in C# as its counterpart structs, they involve no additional copying. It uses very neat interop techniques to perform <code>reinterpret</code> casting across the C# managed boundary.</p>

        <h2>Putting it all together</h2>

        <CodeBlock lang="csharp" children={`
internal class Program
{
    static int Main(string[] args)
    {
        // Window is just a wrapper over EventedWindowCore,
        // that provides more convinience methods, which has
        // its own self registered factory.
        //
        // Window is a part of WinApi.Windows.Controls.
        //
        // Samples contain code that also directly initiates
        // EventedWindowCore without depending on 
        // WinApi.Windows.Controls simply by creating 
        // WindowFactory
        using (var win = Window.Create<AppWindow>("Hello"))
        {
            win.Show();
            return new EventLoop().Run(win);
        }
    }
}

public class AppWindow : Window
{
    protected override void OnMove(ref MovePacket packet)
    {
        base.OnMove(ref packet);
    }

    protected override void OnMessage(ref WindowMessage msg)
    {
        switch (msg.Id)
        {
            // Note: OnEraseBkgnd method is already available in 
            // EventedWindowCore, but directly intercepted here
            // just for the sake of overriding the
            // message loop.
            // Also, note that the message loop is 
            // short-cicuited here.

            case WM.ERASEBKGND:
            {
                // I can even build the loop only on pay-per-use
                // basis, when I need it since all the Packets decoding,
                // and encoding are cleanly abstracted away into the Packet
                // structs itself.
                //
                // fixed (var msgPtr = &msg)
                // {
                //    var packet = new EraseBkgndPacket(msg);
                //    // Do anything you want with the packet.
                // }
                // return;

                msg.Result = new IntPtr(1);
                return;
            }
        }
        base.OnMessage(ref msg);
    }
}
    `} />

        <p>The Samples included in the <code>WinApi</code> repository also has several programs that use DirectX, OpenGL, Skia, to paint windows. There are tons of other things that <code>WinApi</code> does, including one of the simplest ways of using <code>SendInput</code> with the helpers built right in, <code>DxUtils</code> that relives all the pain of managing the numerous Direct3D, Direct2D and also manages its versioning with ease, all while maintaining high-performance without any pressure on the GC.</p>

        <p>Hopefully, I'll have the time to write about more of those later. But there's already <code>Sample.SimulateInput</code> as an example of <code>SendInput</code> and <code>Sample.DirectX</code> demonstrating <code>DxUtils</code> in the repo.</p>

    </Article>
}