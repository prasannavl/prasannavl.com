import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "Introducing WinApi: The Evolution",
    date: "2016-10-22T13:51:30.195Z",
    tags: ["windows", "dotnet"],
    featured: true,
    description: "Article on WinApi - Part 1",    
}

export default () => {
    return <Article {...meta}>
        <p><b>GitHub: </b><a href="https://github.com/prasannavl/WinApi">WinApi</a></p>

        <p>The Windows API is over two decades old - yet one of the most used APIs that has stood the test of time. In today's short lived software world, you don't see a lot of user mode public APIs that stay the same for even a short time. But even a program that was written 20 years ago (assuming only the official and documented APIs by Microsoft were used) will run spot-on as intended, with almost no changes - That's quite cool if you think about it. You can't say that even about some of the oldest user mode UNIX APIs. It's a testimony to the well-design architecture and the amount of work Microsoft put into compatibility while modernizing everything both underneath, and above it, while keeping the core user mode APIs exactly the same.</p>

        <h2>The good old C-lang way</h2>

        <p>A <code>Hello World</code> of Windows, in C today, would resemble something like this below.</p>

        <CodeBlock children={`
#define UNICODE
#define _UNICODE
#define WIN32_LEAN_AND_MEAN

#include <windows.h>
#include <iostream>

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance,
        PWSTR pCmdLine, int nCmdShow);
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam,
        LPARAM lParam);

int wmain()
{
    wWinMain(nullptr, nullptr, nullptr, 0);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, 
    PWSTR pCmdLine, int nCmdShow)
{
    WNDCLASSEX wc = { 0 };
    wc.hInstance = hInstance;
    wc.lpszClassName = L"MainWindow";
    wc.cbSize = sizeof(WNDCLASSEX);
    wc.hIcon = LoadIcon(nullptr, IDI_APPLICATION);
    wc.hCursor = LoadCursor(nullptr, IDC_ARROW);
    wc.style = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc = WindowProc;
    auto regRes = RegisterClassEx(&wc);
    if (!regRes)
    {
        std::cerr << "window registration failed" << std::endl;
        return regRes;
    }
    auto hwnd = CreateWindowEx(0, wc.lpszClassName, L"Hello", 
        WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT,
        CW_USEDEFAULT, nullptr, nullptr, hInstance, nullptr);
    if (hwnd == nullptr)
    {
        std::cerr << "window couldn't be created" << std::endl;
        return -1;
    }

    ShowWindow(hwnd, SW_SHOWNORMAL);

    MSG msg = {};
    while (GetMessage(&msg, nullptr, 0, 0))
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return 0;
}

LRESULT HandleDestroy(HWND hWnd)
{
    PostQuitMessage(0);
    return 0;
}

LRESULT HandlePaint(HWND hwnd)
{
    PAINTSTRUCT ps;
    auto hdc = BeginPaint(hwnd, &ps);
    FillRect(hdc, &ps.rcPaint, (HBRUSH)(COLOR_WINDOW));
    EndPaint(hwnd, &ps);
    return 0;
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    switch (uMsg)
    {
    case WM_ERASEBKGND:
        return 1;
    case WM_DESTROY:
        return HandleDestroy(hwnd);
    case WM_PAINT:
        return HandlePaint(hwnd);
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
        `} />

        <p>Unfortunately, about half the programmers I meet today never use this kind of code, and even less knew exactly what each codepath did underneath - They were simply never accustomed to writing low-level code. While the above is not assembly, it may still show some age. However, it's still the most performant and the most reliable way to run software on the Windows ecosystem. While frameworks on top it - MFC, WinForms, WPF, and the more modern Windows Runtime all provide great convenience, its the raw APIs that you end up dipping into inevitably in more than just a few scenarios. Until Windows Runtime came along, ATL/WTL has been the most fantastic of all - Not because it provides some unmatched great feature, but because it stays closest to bare metal, and yet managed to provide a very clever way of writing code, productively and with high-efficiency. It essentially translates almost exactly into code similar to the above right before compilation.</p>

        <h2>The C++ way</h2>

        <p>So, here's how the same piece of code in ATL/WTL today, with modern C++:</p>

        <CodeBlock children={`
#define UNICODE
#define _UNICODE
#define WIN32_LEAN_AND_MEAN
#include <windows.h>

#include <wrl.h>
#include <atlbase.h>
#include <atlapp.h>
#include <atlwin.h>
#include <atlmisc.h>
#include <atlcrack.h>

class CAppWindow : public CWindowImpl<CAppWindow, CWindow, CFrameWinTraits>
{
private:
    BEGIN_MSG_MAP(CAppWindow)
        MSG_WM_DESTROY(OnDestroy)
        MSG_WM_PAINT(OnPaint)
        MSG_WM_ERASEBKGND(OnEraseBkgnd)
    END_MSG_MAP()

public:
    DECLARE_WND_CLASS_EX(nullptr, 0, -1)
    int Run();

protected:
    void OnDestroy();
    LRESULT OnEraseBkgnd(HDC hdc);
    void OnPaint(HDC hdc);
};

int CAppWindow::Run()
{
    auto hwnd = Create(0, 0, L"Hello");
    ShowWindow(SW_SHOWNORMAL);
    MSG msg;
    BOOL result;
    while (result = GetMessage(&msg, 0, 0, 0))
    {
        if (result == -1)
            return GetLastError();
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return 0;
}

void CAppWindow::OnDestroy()
{
    PostQuitMessage(0);
}

LRESULT CAppWindow::OnEraseBkgnd(HDC hdc)
{
    SetMsgHandled(true);
    return 1;
}

void CAppWindow::OnPaint(HDC hdc)
{
    PAINTSTRUCT ps;
    BeginPaint(&ps);
    FillRect(hdc, &ps.rcPaint, (HBRUSH)COLOR_WINDOW);
    EndPaint(&ps);
    SetMsgHandled(true);
}

int wWinMain(HINSTANCE hInstance, HINSTANCE, LPWSTR, int)
{
    CAppWindow win;
    return win.Run();
}
    `} />

        <p>Far better. However, it does show its age. Nonetheless, its as good as it gets when you want to stick to C/C++, and is also the approach I'd recommend today for native applications, unless you switch over to the more modern Windows Runtime.</p>

        <h2>What has changed today</h2>

        <p>In modern software, some of the most overlooked pieces of technology are the compilers, JIT, code analyzers and optimizers. They are not what they were 10 years ago, or what people tend to learn in schools, not even the most advanced courses in the best of schools have today's architecture. With technologies like <code>LLVM</code>, <code>Roslyn</code>, <code>RyuJIT</code> - They're fundamentally very different and far more advanced than most imagine. Its practically the Batman of modern computing - The most appropriate way to describe would be this quote from the <em>Dark Knight</em>:</p>
        
        <blockquote className="blockquote note">
            The silent guardian, a watchful protector.
            <footer className="blockquote-footer"><cite>The Dark Knight</cite></footer>
        </blockquote>

        <p>Not just figuratively, but they are quite literally the guardians and protectors of memory safety. They are what created the world as it is today, with people across the globe being able to create great things even with no knowledge of the core APIs underneath (That's both advantageous, and disastrous. I'd say its <code>one of the reasons why a majority of the softwares are still so inconsistent with questionable reliability, and even worse - making unreliability the socially acceptable norm</code>). On the other hand, it has given an opportunity for a great many number of inventions, since it lowered the learning curve exponentially - which would have been cumbersome otherwise and restricted high-grade software to an elite few.</p>

        <p>When many of these were designed a few years ago, it was generally found to be pleasant that the these abstractions hid away everything underneath. But the fact is, it diverged the application ecosystem into many forked paths, each with its own learning curve, complications, and deviations. Windows APIs got older, less used directly.</p>

        <h2>Enter the CLR, <span>C#</span></h2>

        <p>It should be obvious now that the CLR is like Batman in the managed Windows world. The CLR is the one protecting you from shooting yourself in your feet. But there's a very astutue change, that most other managed languages like Java, Python or Javascript was never designed to do - You can tell the CLR - <code>Hey, I know what I'm doing - If I shoot my self in the feet, I'm doing it for a reason</code>. With the so called <code>unsafe</code> context, the CLR steps completely out of the way, trusting you implicitly. Pointer arithmetic, reinterpretation casts, you can do it all. Sometimes, even Bruce Wayne needs to be taught he is not always right. It allows you to play Alfred, and to make very personal choices for the Bat.</p>

        <p>With the CLR, came WinForms - Microsoft's recommended way of accessing the Windows API with the CLR. If you take a peek into the history, WinForms was designed with one great purpose - To make the Windows API cool again. It was to use the CLR to provide a very neat way of writing code where the memory is (almost) entirely managed by the CLR. However, there were also decisions made, to abstract things much further than just memory, and create another ecosystem that have no resemblance to the native layers underneath - And it was a great decision to do so, at that time. While Java is just a historic footnote to the .NET community today, with C# on CLR far exceeding the productivity and efficiency of the Java ecosystem, it still probably owes its thanks to Java in its initial stages, where it picked up those traits.</p>

        <p>And soon, the above code, looked something like this:</p>

        <CodeBlock children={`
internal static class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new MainWindow());
    }
}

public partial class MainWindow : Form
{
    public MainWindow()
    {
        InitializeComponent();
    }
}
    `} />

        <p>Looks much nicer. But lets get the fact that this is not C++ out of the way first - in most scenarios the advanced capabilities really aren't required and you can always use C++ when you really need and simply PInvoke even though <code>a C# idiomatic high-performance solution almost always exists as well - with techniques like memory pooling, structs, and stackalloc</code>. Because, when you realize you need such optimizations especially memory pooling, chances are C/C++ would benefit with memory pooling as well. And <strong>once you start efficiently pooling memory and reducing the GC pressure, the performance differences between the two languages start to disappear for the most part</strong>. That aside, there are still some inherent problems.</p>

        <p>Even though it used all the native layers, <code>it provided no way to use any of them directly without going through the abstractions</code> - which actually makes a lot of sense since you want new APIs to be built on the abstractions, not the layers below. But fast-forward a decade later - and its not exactly as appealing as it once was. While most of the abstractions make sense, the inability to access the native layers without a whole bunch of redundant PInvoke isn't.</p>

        <p>This also comes with the GC tax - <code>Every message sent to a Windows Message Loop, ends up adding pressure to GC</code>. While much of this is very well optimized today, and practically a non-issue - for high-performance scenarios like games, and high-frame rate AV, it does come into significance.</p>

        <p>However, the most important problem - <code>it deviates from the raw Windows API</code>. For example, it introduces concepts like <code>ControlStyles</code>, which changes the behavior which in many occasions is completely different from how the raw Windows API handles it. There are many circumstances where the default behavior changes, even though subtle and small - <code>it adds up, and now you have to learn a whole new API and understand its quirks</code>. It also uses GDI+, which is not always required, when you either just want the GDI for simple optimized tasks, or you use DirectX. And its adds quite a few hefty system images as dependencies.</p>

        <h2>Enter WinApi</h2>

        <p>Apart from WinForms, there's really no other idiomatic way to access the Windows API from C#. That's quite disconcerting if you don't want to pay the prices mentioned above. Well, there's WPF - but that's a parallel framework, which is built off Direct2D and Direct3D technologies, instead of GDI plus that WinForms relies on. It doesn't really concern itself with the Windows API.</p>

        <p>What if you'd like to combine, GDI, DirectX, and GDI plus. There's no clean way to do this in .NET. But a more practical requirement, is you want to control the underlying graphics technology, and use a framework like Cario, Skia or raw DirectX.</p>

        <p>All of this brought me to this - <strong>We need a clean, stable way to access the Windows API from .NET.</strong> And along the way, I also decided to solve the above mentioned issues with WinForms.</p>
        <p>And that brings us to <code>WinApi</code> which ultimately lets you do this below, while solving all of the problems above:</p>

        <CodeBlock children={`
static int Main(string[] args)
{
    using (var win = Window.Create(text: "Hello"))
    {
        win.Show();
        return new EventLoop().Run(win);
    }
}
    `} />

        <p>I'll discuss more about how it solves the problems, and how to use it in the next article.</p>
    </Article>
}