import { Article, CodeBlock, Link } from "../../../components/Article";
import codeblock1 from "./data/data-1.txt";
import codeblock2 from "./data/data-2.txt";

export const meta = {
    title: "Crash Analysis: Windows Graphics Stack Bug",
    date: "2016-02-12T04:54:02.577Z",
    tags: ["windows", "kernel", "crash-analysis"],
    description: "Crash analysis of a Graphics bug in the Windows 10 kernel based on Threshold/RedStone release"
}

export default () => {
    return <Article {...meta}>
        <p className="note">
            This issue has been filed with Microsoft, and the current state of the issue can be followed up on Microsoft TechNet if you're affected by it or would like to add on to it here: <a href="https://social.technet.microsoft.com/Forums/en-US/d45e4063-3d73-4f51-a295-972f3be3a456/graphics-stack-bug-windows-10-build-threshold-release-10586-including-redstone?forum=win10itprogeneral">Graphics stack bug - Windows 10 Build Threshold Release (10586+, including RedStone)</a>
        </p>

        <h2>Affected Configuration</h2>

        <ul>
            <li>Windows 10 - Threshold Release (10586+, including the initial builds of RedStone)</li>
            <li>Intel HD Graphics 5500 with Nvidia GeForce 950M (Optimus pipeline)</li>
        </ul>

        <h2>Context</h2>

        <p>A few weeks ago, being on the Insider Fast Ring, I updated myself to the first release based on the Redstone build likely during the first few hours. Some of the issues I noticed ended up being documented a few days later. My laptop was a HP Envy 15 with an Nvidia Optimus based GeForce 950M, and Intel HD Graphics 5500. However, I noticed weird issues as my screen turned black (but didn't switch off), and the cursor was occasionally visible once every 5-10 seconds or so (but cursor response took about 20-30 seconds). Strange. Most reasonable guess was the graphics driver. Hard reset of the laptop, and everything seemed to be quite fine. Strangely, there were no memory dumps (since the system actually didn't crash I guess), but fortunately the event logs did have a never-ending list of <code>Graphics card crashed and recovered unexpectedly.</code></p>

        <p><b>The RedStone update also ended up in weird bugs and event logs filled with errors, mostly due to COM permission issues and so on</b>. Meanwhile, a few hours later, there was an update available for my Intel HD 5500. Great, I was optimistic the issue was getting fixed. However, installing the driver (through Windows Update), ended up in the same blank screen again. Another hard reset, where Windows recovered itself to the last known state, and with similar errors. Meanwhile, my Nvidia card had an update. That was fast. Perhaps, that was the missing piece, and the Nvidia driver this time - same results. Since, the Optimus pipeline relies on the Intel card, it still provided nothing conclusive. Just blank screen. Another hard reset, but now I decided to do a full reset. (This was two days before it was documented that the RedStone build's <em>Reset</em> ended up in an unusable system completely breaking it requiring a fresh clean install).</p>

        <p>So, there it was. Now, I decided that I had enough with the new RedStone build, and move back to 10586 - the stable build. To my surprise, the graphics drivers ended up with the same result, and blank screen! Another hard reset and the graphics driver worked however. It always seemed to crash repeatedly during the install. However, thankfully, this time, I ended up with a lot of LiveKernelReports. Finally, we are getting somewhere. But a bit too many memorydumps.</p>

        <p>
            <img className="img-fluid" src={require("./data/crash-analysis-screen-1.jpg")} alt="[Screenshot 1]" />
        </p>
        
        <p><strong>493 minidumps!</strong> Hmm.</p>

        <h2>Analysis</h2>

        <p>Naturally, next step was to figure out what was wrong. So, WinDbg for all of them resulted in the following call stack:</p>

        <CodeBlock children={codeblock1} />

        <p>Ok, that was <strong>dxgkrnl</strong> - the graphics stack. Next up the analysis ended up with straight forward message:</p>

        <CodeBlock children={codeblock2} />

        <p>I'd have generally chalked it up as an Intel driver issue and moved on, however, interesting I received about 2 or 3 different updates from Windows Update for the same Intel Graphics driver. Windows update seemed to have been the most reliable place for drivers which are expected to have been well tested, but all of them ended up crashing exactly the same way.</p>

        <h3>Could it be the hardware?</h3>

        <p>This was an interesting issue since even the kernel logger failed to capture anything useful for the events on the release builds. And so, I had to ensure that the fault didn't lie in the hardware first. UEFI Diagnostics seemed to show no inconsistencies. Besides, older builds of Windows, coupled with older drivers (as well as my Linux OSes - though that might not necessarily prove much in this context) doesn't seem to have these problems. This issue didn't exist before the 10586 build, but seems to exist in all later insider builds till date.</p>

        <p className="note"><strong>So, I was left with no reason to doubt the hardware.</strong></p>

        <h3>Potential cause</h3>

        <p>This was on the retail build (10586). And the same thing happens on Safe Mode as well during the installation. It generates numerous minidumps. The Insider builds for some reason didn't generate the minidumps which were generated on the retail build. So, based on the watchdog reports, it seems like <strong>the driver fails on infinite loop, but just not quickly enough for the watch dog to catch it and crash</strong>. So, it ends up on a blank screen instead of BSOD. However that doesn't explain the lack of more logging on when the driver crashed. So, that puts me on a track to the likely suspect: <strong>The Windows Graphics Stack</strong>. There has been a signficant amount of changes into the RedStone build, and there were also more bug stack bugs that were reported. But it could also be something terribly wrong in the driver.</p>

        <p>However without the correct symbols or the debug build, this is as much as I could narrow it down to. Likely, <strong>the problems lie in both the new Graphics Stack (which hopefully will get fixed in the newer builds), and Intel's driver</strong>.</p>

        <p>The only real data that were reliable enough for analysis were the numerous minidumps. And my guess is that, even them, probably mostly only contains where the WatchDog timeouts happen, and likely provide an insight into the problematic driver and zones, though not helping much with the precise problem in the driver.</p>

        <h2>Minidumps</h2>

        <p>I did end up with a full memory dump and shared them with Microsoft. However, the rest of the minidumps are shared publicly here for the inquisitive minds:</p>

        <p><strong>2016-Q1-Kernel-Graphics</strong> (OneDrive folder with all the dumps):<br />
            <a href="https://1drv.ms/f/s!Agt9I4vUjzpCg4d1Je-LckF4grKXnw">https://1drv.ms/f/s!Agt9I4vUjzpCg4d1Je-LckF4grKXnw</a>
        </p>

        <p>This includes the <i>LiveKernelReports</i> (Watchdog dumps), and the <i>WER Kernel Reports</i>.</p>

    </Article>
}

