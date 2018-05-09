import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "Introducing WinApi: Comparing GC pressure and performance with WinForms",
    date: "2016-10-29T04:44:36.874Z",
    tags: ["dotnet", "windows", "perf"],
    featured: true,
    description: "Article on WinApi - Part 4",    
}

export default () => {
    return <Article {...meta}>
        <p><b>GitHub: </b><a href="https://github.com/prasannavl/WinApi">WinApi</a></p>
        <div>
            <section className="note">
                <h4 className="mt-2">TL;DR - Performance stats</h4>
                <ul className="list-unstyled list-dashed m-0">
                    <li>Direct message loop performance: <strong>20-35% faster</strong>.</li>
                    <li>Heap allocation: <strong>0MB vs. roughly, 0.75GB</strong> / 100k messages.</li>
                    <li>Memory page faults (Soft): <strong>0.005%</strong> - A mere <strong>5k vs. roughly 1 million</strong> faults/100k messages).</li>
                </ul>
            </section>
        </div>

        <p><a href="https://github.com/prasannavl/WinApi">WinApi's</a> primary objective is to provide access to the native layers of the Windows API from the CLR. However, even on first look it should be clear that the <code>WinApi.Windows</code> namespace infringes on the <code>WinForms</code> territory, even though its a tiny sub-fraction of the size of WinForms. Over the years WinForms has been well optimized to be <strong>decent</strong> - It's not the most efficient beast, but for common programs, it probably takes up less than 2-5% percent of your application's time that it doesn't matter on modern hardware - or so is the general line of thought. However, what one cannot refute is that it never was the same as say, <code>ATL/WTL</code> in C++ or direct Win32 programming to be able to handle message loop heavy applications, or high-performance games.</p>
        <h2>The WinApi.Windows advantage</h2>
        <ul>
            <li>The <strong>assembly code generated by the JIT is directly comparable</strong> to <code>ATL/WTL</code> or a Win32 application written by hand.</li>
            <li>The message loop is completely <strong>GC-allocation free</strong>.</li>
            <li>You have <strong>complete control over how messages are processed</strong>. You can entirely short-circuit, or manually extend connection points into the message loop logic.</li>
            <li>It's the perfect replacement for WinForms when you want to handle the GUI logic your own way - has no inherent GUI subclassing and drawing functionality - You're free to use any kind of external GUI logic, and drawing library powered by <code>DirectX</code> (like WPF and WinRT XAML), <code>Cairo</code>, <code>Skia</code> or even the defacto <code>System.Drawing</code> that uses <code>GdiPlus</code> underneath.</li>
        </ul>

        <h2>Performance analysis</h2>

        <h3>Setting the stage</h3>

        <p>Measuring GUI performance, is in general very tricky. Instead, I'm going to skip over the traditional benchmarking models, and do a little trick for a very quick and practically accurate analysis.</p>
        <p>The reason I'm doing this, is not just to do a really quick estimate, but traditional models will be unfair to <code>WinForms</code>. Why? Because, <code>WinApi.Windows</code> is a very efficient and light-weight wrapper. And it has no GC allocations during the message loop. So, a hefty framework like WinForms is always going to lose in micro-performance tests, and the results will be misleading.</p>
        <p>Rather, what I'm going to do, is to open up a simple window and give it a ton of messages to chew. But the idea is that these messages have to go through the entire process loop, but not generate additional calls to other areas such as the graphics API for example, since that would end up benchmarking the 2D, and 3D libraries.</p>
        <p>What's the simplest way to do this? Well, <code>resize the window</code>! Win32 sends off <code>WM_POSITIONCHANGING</code>, <code>WM_POSITIONCHANGED</code>, which in turn generates <code>WM_SIZE</code>, <code>WM_MOVE</code> by the <code>DefWindowProc</code> as you resize. This also ends up generating <code>WM_NCPAINT</code> and <code>WM_PAINT</code> messages as long as the <code>CS_REDRAW</code> styles are set. Perfect - except for the painting part. I do want <code>WM_PAINT</code> being generated since its one of the high-frequency messages, but I just don't want any of graphics API calls.</p>

        <p className="note">
            <strong>The key here is that, we don't care too much about how quickly the program runs to completion.</strong>
        </p>

        <p>Wait. What? Isn't that the whole point of this? - Not at all. Why? Because, no developer in the right mind would make a program that just goes on resizing itself and call it a useful piece of software. It's way too simple to emulate the conditions of a real-life program to provide any useful timing comparisons. However, the interesting part is that since we trigger the whole layout-paint cycle, we can indeed collect useful information on how the memory allocations take place, memory faults, garbage collections, and a few more - which in turns translates to very significant performance aspects in real-life programs.</p>

        <code>The trick is to use this otherwise useless program to give us useful data that's practically applicable.</code>

        <p className="note">
            <strong>Note:</strong> Most of the allocations for a program that's as simple as this will likely end up in <code>Generation-0</code>, which will <code>commonly mislead many developers to think its okay</code>. Gen-0 is after-all the most efficient, isn't it? However, in most practical scenarios <code>they get bumped up the generations since a lot of them survive the entire course of the event</code>, and havoc with fragmentation starts to show earlier than most would expect. Large objects are a whole another story which <strong>almost</strong> never gets defragmented during the course of the program.
        </p>

        <h3>The high-level test program</h3>

        <ul>
            <li>Create a simple window with nothing but 2 labels that are auto-stretched to the entire window.</li>
            <li>The controls should always react to changes, resizing itself and triggering the whole layout-paint cycle, but never painting anything other than its default background until the very end.</li>
            <li>Create one new thread, and keep triggering resize as fast as it can process the messages!</li>
            <li>Stop. Measure. Repeat.</li>
        </ul>

        <p>I'm going to set the thread to send off <code>100,000</code> resize messages, and then stop. 100k may be on the high-side for simple application, but not uncommon for high-performance realtime applications.</p>

        <p className="note">
            <strong>Note:</strong> This is likely to vary quite a bit depending on the background CPU usage. This particular type of program will also be heavily affected by dynamic CPU clocks, since it may well complete in it's quantum slice, and wait on the next message, <strong>which in turns will affect CPU sleep states</strong>. So, its important to use <code>High-performance mode, or a constant CPU clocking speed</code>. However, the rest is okay, since we don't care too much about how quickly it just finishes.
        </p>

        <h3>The WinForms program</h3>

        <CodeBlock children={`
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }

    private int m_times;
    private bool m_done;
    private DateTime m_startTime;
    private DateTime m_endTime;
    private const int Iterations = 100000;
    private Task m_task;

    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        var r = new Random();

        m_task = Task.Run(() =>
        {
            while (m_times < Iterations)
            {
                m_times++;
                this.SetBounds(50, 50, 1200 - r.Next(0, 1100), 900 - r.Next(0, 800));
            }
            m_endTime = DateTime.Now;
            m_done = true;
            this.SetBounds(50, 50, 700, 500);
        });
        m_startTime = DateTime.Now;
    }

    protected override void OnSizeChanged(EventArgs e)
    {
        base.OnSizeChanged(e);

        // Paint only after everything's done to show
        // the result.
        if (!m_done) return;

        var str = $"\\r\\n{DateTime.Now}: No. of changes done: {m_times}";
        textBox1.Text = str;

        var sb = new StringBuilder();

        sb.AppendLine($"Start Time: {m_startTime}");
        sb.AppendLine($"End Time: {m_endTime}");
        sb.AppendLine();

        if (m_endTime != DateTime.MinValue)
            sb.AppendLine($"Total Time: {m_endTime - m_startTime}");
        textBox2.Text = sb.ToString();
    }
}
        `} />

        <p>That's it. Very simple! Now, lets run it and wait until it ends.</p>

        <p><img className="img-fluid" src={require("./data/gc-comp-winforms.jpg")} alt="[Image]" /></p>

        <p>So, on my <code>i7</code> machine, it took about <code>4 minutes and 34 seconds</code>.<br />
            Okay, now, let's look at the more interesting data.</p>

        <p><img className="img-fluid" src={require("./data/gc-comp-winforms-stat-clr.jpg")} alt="[Image]" /></p>

        <p>The key data, that's of interest are:</p>

        <div className="note">
            <ul className="list-unstyled list-dashed m-0">
                <li>Gen 0 Collections: <strong>370</strong></li>
                <li>Gen 1 Collections: <strong>186</strong></li>
                <li>Finalization Survivors: <strong>1279</strong></li>
                <li>Total Bytes Allocated: <strong>749.18MB</strong></li>
            </ul>
        </div>

        <p>Yikes! That's a lot of allocations. Now, 186 Gen-1 is no small task. Infact, even if we ignore the fact that its Gen-1, and total all of them as Gen-0, its <code>370+186=556</code> collections. That's <strong>one GC collection every 180 messages!</strong>. And so, <strong>totally it allocates three-quarters of a gigabyte of memory for nothing, but just to process the messages</strong> - Add your application logic on top of that - not just for allocations, but also for GCs and more importantly, more of those from Gen 0 could very well have been promoted to Gen 1.</p>

        <p>Clearly, that's a lot of stuff that's going on. Let's just look at a little more data.</p>

        <p><img className="img-fluid" src={require("./data/gc-comp-winforms-stat.jpg")} alt="[Image]" /></p>

        <div className="note">
            <ul className="list-unstyled list-dashed m-0">
                <li>Cycles: <strong>514,070,543,274</strong></li>
                <li>Kernel time: <strong>2m:48s</strong></li>
                <li>User time: <strong>0m:46s</strong></li>
                <li>Total time: <strong>3m:34s</strong></li>
                <li>Page faults: <strong>1,119,365</strong></li>
            </ul>
        </div>

        <p>Note that while the <code>page faults</code> here is just the soft faults, it still means certain CPU caches will have to invalidated a lot more. We'll just leave it here. That's sufficient information for making a rough estimate. Let's move on.</p>

        <h3>The WinApi.Windows program</h3>

        <p>Now the same thing with WinApi,</p>

        <CodeBlock children={`
class Program
{
    static int Main(string[] args)
    {
        ApplicationHelpers.SetupDefaultExceptionHandlers();
        try
        {
            var factory = WindowFactory.Create();
            using (var win = factory.CreateWindow(() => new MainWindow(),
                "Hello", constructionParams: 
                    new FrameWindowConstructionParams()))
            {
                win.Show();
                return new EventLoop().Run(win);
            }
        }
        catch (Exception ex) {
            ApplicationHelpers.ShowCriticalError(ex);
        }
        return 0;
    }

    public sealed class MainWindow : EventedWindowCore
    {
        private const int Iterations = 100000;

        private readonly HorizontalStretchLayout m_layout = 
                new HorizontalStretchLayout();
        private bool m_done;
        private DateTime m_endTime;
        private DateTime m_startTime;
        private Task m_task;
        private StaticBox m_textBox1;
        private NativeWindow m_textBox2;
        private int m_times;

        protected override void OnCreate(ref CreateWindowPacket packet)
        {

            this.m_textBox1 = StaticBox.Create(hParent: this.Handle,
                styles: WindowStyles.WS_CHILD | WindowStyles.WS_VISIBLE, 
                exStyles: 0);

            // You can use this to create the static box like this as well. 
            // But there's rarely any performance benefit in doing so, and
            // this doesn't have a WindowProc that's connected.
            this.m_textBox2 = WindowFactory.CreateExternalWindow("static",
                hParent: this.Handle,
                styles: WindowStyles.WS_CHILD | WindowStyles.WS_VISIBLE,
                exStyles: 0);

            this.m_layout.ClientArea = this.GetClientRect();
            this.m_layout.Margin = new Rectangle(10, 10, 10, 10);
            this.m_layout.Children.Add(this.m_textBox1);
            this.m_layout.Children.Add(this.m_textBox2);
            this.m_layout.PerformLayout();

            var r = new Random();

            this.m_task = Task.Run(() =>
            {
                while (this.m_times < Iterations)
                {
                    this.m_times++;
                    this.SetPosition(50, 50,
                        1200 - r.Next(0, 1100),
                        900 - r.Next(0, 800));
                }
                this.m_endTime = DateTime.Now;
                this.m_done = true;
                this.SetPosition(50, 50, 700, 500);
            });
            this.m_startTime = DateTime.Now;
            base.OnCreate(ref packet);
        }

        protected override void OnSize(ref SizePacket packet)
        {
            var size = packet.Size;
            this.m_layout.SetSize(ref size);

            base.OnSize(ref packet);

            if (!this.m_done) return;

            var str = $"\\r\\n{DateTime.Now}: No. of changes done: {this.m_times}";
            this.m_textBox1.SetText(str);

            var sb = new StringBuilder();

            sb.AppendLine($"Start Time: {this.m_startTime}");
            sb.AppendLine($"End Time: {this.m_endTime}");
            sb.AppendLine();

            if (this.m_endTime != DateTime.MinValue) 
                sb.AppendLine($"Total Time: {this.m_endTime - this.m_startTime}");
            this.m_textBox2.SetText(sb.ToString());
        }
    }
}
`} />

        <p>There we go. It does exactly what the WinForms application does. Now, lets run this and see the results.</p>

        <p><img className="img-fluid" src={require("./data/gc-comp-winapi.jpg")} alt="[Image]" /></p>

        <p>It took about <code>3 minutes and 16 seconds</code>. That's <strong>over a minute faster!</strong>. <br />
            So, something clearly is more efficient. But why? Let's take a look at the memory stats.</p>

        <p><img className="img-fluid" src={require("./data/gc-comp-winapi-stat-clr.jpg")} alt="[Image]" /></p>

        <div className="note">
            <ul className="list-unstyled list-dashed m-0">
                <li>Gen 0 Collections: <strong>0</strong></li>
                <li>Gen 1 Collections: <strong>0</strong></li>
                <li>Finalization Survivors: <strong>0</strong></li>
                <li>Total Bytes Allocated: <strong>0</strong></li>
            </ul>
        </div>

        <p>What!? To be candid, this is quite misleading, though its <em>kinda</em> true. I use the excellent <code>Process Hacker</code> to collect the details of the CLR. However, the way this works is that, its needs to do a GC in order to get these statistics. But what happened here, is that a GC never took place. 100k message loops, but not even a single GC has happened!. That's really cool. Now we're barking up the C/C++ tree, and in style :)</p>

        <p>Let's look at the other bits of data.</p>

        <p><img className="img-fluid" src={require("./data/gc-comp-winapi-stat.jpg")} alt="[Image]" /></p>

        <div className="note">
            <ul className="list-unstyled list-dashed m-0">
                <li>Cycles: <strong>328,556,899,144</strong></li>
                <li>Kernel time: <strong>1m:58s</strong></li>
                <li>User time: <strong>0m:15s</strong></li>
                <li>Total time: <strong>2m:14s</strong></li>
                <li>Page faults: <strong>5494</strong></li>
            </ul>
        </div>

        <p>Here most of the stuff, including the <code>Cycles</code> doesn't interest us much, since we already know that from the timing. While these aren't very accurate (since there could have been a small difference when the application has been running beyond the life time of the test), it isn't in anyway going to skew our results. Evidently, WinApi has been highly efficient. But why? Look at the <code>Page faults</code>. Its a mere 5.5k as opposed to the 1 million 120 thousand that happened with windows forms. That should give a clue. By using the stack for almost everything, leaving the GC entirely for your application, <code>WinApi takes the C#/.NET Win32 desktop applications right into the C++ performance arena</code>.</p>

        <h2>What WinApi.Windows doesn't do</h2>

        <p>While you can do everything right on top WinApi, you'll have to do the layout, and control subclassing all by yourself. Actually, that's only major feature set that's missing from <code>WinApi</code>, that WinForms can do.</p>

        <p>Providing a set of base interfaces, and base classes, even in parity with WinForms's <code>IControl</code> shouldn't be too time consuming. However, the reason I haven't written them is I have no intent to even try to provide a replacement for <code>WinForms</code>, which already does what its designed to do quite well. My intent with this project is not a GUI library, but rather a lean, light and efficient native interop layer.</p>

        <p>If you want to build your own modern toolkit with technologies like <code>Direct2D</code>, <code>Skia</code>, etc, this should serve as the perfect foundation on Windows, and a low level way to interact with the OS.</p>

        <p><code>WinApi.Windows.Controls</code> provides some basic controls like <code>Button</code>, <code>Edit</code> and <code>Static</code> - but its more of a sample library on how to write GDI based controls at this stage, than an actual usable library. Today, we tend to build using the more modern libraries like <code>Direct2D</code> and <code>Skia</code> (WPF, and Windows Runtime XAML for example, both sit on top of DirectX) - not the aged GDI.</p>

    </Article>
}