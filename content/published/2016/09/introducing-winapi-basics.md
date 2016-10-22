<!--[options]
name: 'Introducing WinApi: Basics'
date: 2016-10-22T14:01:11.533Z
url: 2016/09/introducing-winapi-basics
tags: 
 - winapi
 - dotnet
 - c#
-->

# Introducing WinApi: Basics

> GitHub: https://github.com/prasannavl/WinApi 

In the previous article <a href="/2016/09/introducing-winapi-the-evolution">here</a>, I discussed the evolution of programs that use the Windows API with C/C++ and C# snippets, and it ultimately ended out with this C# snippet:

```c#
    static int Main(string[] args)
    {
        using (var win = Window.Create(text: "Hello"))
        {
            win.Show();
            return new EventLoop().Run(win);
        }
    }
```

Yup. That's fully functional code that works. Just add references to `WinApi`, and `WinApi.Controls` which are both `less than 150kb` combined, and it'll do what its excepted to do. However, before I get into samples that look nifty, let's look at a precise translation of the C/C++ program in the previous article, without the use of the `Window` abstraction that `WinApi` provides in the helper namespace `WinApi.Windows`.

A very raw program that uses the Windows API would look like this:

```c#

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
```

Why would one do this? Because you can. You have no reason to go this really tedious way, however - if you want you always can. The primary function of `WinApi` is after-all to provide a clean high-performance interop story.

It does exactly what the previous C/C++ programs did. There's no additional GC pressure, other than loading the CLR before the initialization of `Main` itself, `the JIT-compiled code would almost precisely match the assembly code of your C++`! Try doing that with Windows Forms. ;)

You can accomplish this in C# yourself, but you have to add all the ugly PInvokes, and method signatures aren't always straight-forward, and even sources like `pinvoke.net` aren't always correct and are riddled with subtle errors, all of which WinApi handles.

However, this program above is probably purely academic - not because it has to be, just because there better ways to do this using the `WinApi.Windows` namespace.

## WinApi structure

Before getting to the `WinApi.Windows` namespace, I'd like to briefly touch on how `WinApi` is organized.
Each library that corresponds to a `windows dll` gets its own namespace.

Examples, `kernel32.dll` functions all are in the `WinApi.Kernel32` namespace, `user32.dll` into `WinApi.User32` namespace, and so on.

And inside each namespace is a static class which ends with `Methods`. Ex: `User32Methods` - this class has all the functions of the user32.dll in its most primitive form. What this means is that, if a functions could potentially take multiple forms of input, say different structures, or variables enumerations - this method is the lower common factor, with the least marshalling performance impact.

As an example `User32Methods` has the following method defined:

```c#
        [DllImport(LibraryName, ExactSpelling = true)]
        public static extern int MapWindowPoints(IntPtr hWndFrom, IntPtr hWndTo, IntPtr lpPoints, int cPoints);
```

It takes all inputs in the form of `IntPtr`, which allows any kind of marshalling.

At the same time, `User32Helpers` has the following implementations:

```c#
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
```

Again, this provides straight forward Marshalling without any performance impact, since it simply pins the struct which already have C-Layouts, and passes in the pointers.

Similar concepts are followed throughout the library in the form of `Methods` and `Helpers` to provide both raw and safer signatures.

Then, there's also the `Experimental` namespace inside each of the library namespaces, that provide all the undocumented functions, and helpers.

## `WinApi.Windows`

Then comes the one namespace that is special - This is not named after any native library. This library provides helpers into `Windows` - the literal windows that your applications use. It provides a high-performance, GC-allocation-free message loop, that's resembles ATL/WTL programming.

### Class: `NativeWindow`

This is the class that is the thinnest layer of Window. It simply wraps the original `Win32` handle. And it only has a single member - an IntPtr of `Handle`, and provides a way to attach itself to any Handle, and allows nice wrappers to be used through out. 

For example:

```c#

var win = WindowFactory.CreateWindowFromHandle(someHwnd);
win.SetText("Hello");
win.SetPosition(100, 200);
win.Show();
win.Close();

```

### Class: `WindowFactory`

This is the class that's a `WNDCLASSEX` registration manager for Win32. It registers a class, and manages its lifetime, and creates Windows of a particular class.

It also provides all the convenience methods to be able to create classes as `NativeWindow`, or as any other derivative of `WindowCore`, and provides attachment, and connection implementations. It also has generic methods that are able to project the created class to any C# type that derives from `WindowCore`.

Take a look at the source code of the several static methods to see what it does. Naturally, you also provide any `CS` styles while creating a new factory, which for all practical purposes can be thought of as a Win32 equivalent of class registration.

### Class `WindowCore`

Now this is the class where all the magic happens. It provides the real connection by attaching your handle and connecting your `WindowProc` to the class instances. If you look at the internals of `ATL` code, this is done using a concept called `thunking` and its done in assembly which may seem like dark magic. However, `WinApi` does this very transparently, and with no performance impact.

It does this with the help of `WindowFactory`, and swapping out its procedure during the creation of the window (more precisely during the `WM_NCCREATE` message).

Once it provides the connections, the `OnMessage` instance method can be used directly from C# to process the messages.

### Class `EventedWindowCore`

`WindowCore` is still a super light weight class that does no message processing. Its stays completely out of the way, except for being able to control your message loop. But the keyword is `being able`. It doesn't not by default process any message by itself. Its simply passes it down to it default procedure. This is the lightest class that's fully functional.

Then comes the `EventedWindowCore` - this class decodes all the window messages, and breaks it down to its components, and passes them down to the relatives class instance's event methods.

For example

```C#
   public sealed class MainWindow : EventedWindowCore
    {
        protected override CreateWindowResult OnCreate(ref WindowMessage msg, ref CreateStruct createStruct)
        {
            return base.OnCreate(ref msg, ref createStruct);
        }

        protected override void OnSize(ref WindowMessage msg, WindowSizeFlag flag, ref Size size)
        {
            base.OnSize(ref msg, flag, ref size);
        }
    }
```

Internally it uses the `MessageDecoder` class that transparently decodes every message into its parameters. The `EventedWindowCore` handles most of the common window messages.

For example,

```c#
        public static void ProcessMove(ref WindowMessage msg, MoveHandler handler)
        {
            Point point;
            msg.LParam.BreakSafeInt32To16Signed(out point.Y, out point.X);
            handler(ref msg, ref point);
            // Standard return. 0 if already processed
        }
```

This is the implementation for `WM_MOVE` message decoder. It provides a very nice way to handle `WM_MOVE` as a `MoveHandler` that takes receives the original message, and a well decoded `Point` struct as input.

So, similar to ATL/WTL, if you use the `WindowCore` you could manually build only the events you want to handle, by using the `MessageDecoder` - though in really, there's really no reason to do it, since the `JIT` will optimize away the `EventedWindowCore` to give you similar code in the end.

That should be cool! You can use the `EventedWindowCore`, derive all its benefits, but yet maintain performance very similar to writing native code in `ATL` with C++. However, for some reason you still want to use `WindowCore`, all the decoders are directly available in `MessageDecoder` to build manually, as you like. No more dealing with `wparam` and `lparam`.

Infact, the way `EventedWindowCore` is implemented very similar to this:

```C#

public class EventedWindowCore : WindowCore {
    protected override OnMessage(ref WindowMessage msg) {
        switch (msg.Id) {
            ...
            case WM.MOVE {
                MessageDecoder.ProcessMove(ref msg, this.OnMove);
                break;
            }
            ...
            default:
            {
                this.OnMessageDefault(ref msg);
            }
        }
    }

    protected virtual OnMove(ref WindowMessage msg, ref Point point) => this.OnMessageDefault(ref msg);
}

```

And in the above case `OnMessageDefault` translates into calling the base window procedure, which would be the `DefWindowProc` method in `user32.dll` if its an plain window, or the window's default procedure if its an in-built class like `STATIC`, `EDIT`, etc.

Also, the `MessageDecoder` class is highly optimized to pass values on without any marshalling and additional copies of data. Even though many of the pointers are very naturally exposed in C# as its counterpart structs, they are involve additional copying. It uses very neat interop techniques to perform `reinterpret` casting into the C# managed boundary.

## Putting it all together

```c#
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
        protected override void OnMove(ref WindowMessage msg, ref Point point)
        {
            base.OnPaint(ref msg, ref point);
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
                    // basis, when I need it since all the default methods
                    // are publicly, exposed with the MessageDecoder class.
                    //
                    // MessageDecoder.OnEraseBkgnd(ref msg, this.OnMove);
                    // return;

                    msg.Result = new IntPtr(1);
                    return;
                }
            }
            base.OnMessage(ref msg);
        }
    }
```

The Samples included in the `WinApi` repository also has several programs that use DirectX, OpenGL, Skia, to paint windows. There are tons of other things that `WinApi` does, including one of the simplest ways of using `SendInput` with the helpers built right in, `DxUtils` that relives all the pain of managing the numerous Direct3D, Direct2D and also manages its versioning with ease, all while maintaining high-performance without any pressure on the GC.

Hopefully, I'll have the time to write about more of those later. But there's already `Sample.SimulateInput` as an example of `SendInput` and `Sample.DirectX` demonstrating `DxUtils` in the repo.