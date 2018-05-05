import { Article, CodeBlock, Link } from "../../../components/Article";
import codeblock1 from "./data/data-1.txt";
import codeblock2 from "./data/data-2.txt";
import codeblock3 from "./data/data-3.txt";
import codeblock4 from "./data/data-4.txt";
import codeblock5 from "./data/data-5.txt";

export const meta = {
    title: "Crash Analysis: Windows BSOD - Netwbw02.sys",
    date: "2016-03-05T06:54:09.738Z",
    tags: ["windows", "kernel", "crash-analysis"],
    description: "Crash analysis of the networking stack bug in Netwbw02.sys in Windows 10"    
}

export default () => {
    return <Article {...meta}>

        <p className="note">
            This issue has been filed with Microsoft, and the current state of the issue can be followed up on Microsoft TechNet if you're affected by it or would like to add on to it here: <a href="https://social.technet.microsoft.com/Forums/en-US/57253a48-dce8-40cd-b66a-31fe30af7c47/windows-10-netwbw02sys-crash-on-all-threshold-and-redstone-builds-so-far?forum=win10itprogeneral">Windows 10: Netwbw02.sys crash on all Threshold and Redstone builds (so far)</a>
        </p>

        <h2>Affected Configuration</h2>

        <ul>
            <li>Windows 10 - OS Build 10586+</li>
            <li>Intel Dual-Band Wireless AC 3160</li>
        </ul>

        <h2>Error Codes</h2>

        <ul>
            <li>DRIVER_IRQL_NOT_LESS_OR_EQUAL</li>
            <li>0xdead039e</li>
            <li>0xdead7495</li>
        </ul>

        <h2>Context</h2>

        <p>Initally, I had few BSOD with the <code>Netwb02.sys</code> (Intel's WiFi driver) during the Windows Insider builds, with <code>DRIVER_IRQL_NOT_LESS_OR_EQUAL</code>. That's a straight forward issue with the self-explanatory problem code - the driver is accessing improper memory addresses which ended up in higher IRQL. Obviously, Intel's WiFi Driver is the culprit there. However, I also noticed the system crashing ocassionally with error code <code>0xdead039e</code>, and also at times, with the <code>0xdead7495</code> errors.</p>

        <p>Looking at all of these error stacks pointed to the same driver. The culprit was always the <code>Netwb02.sys</code>. It seems that Intel's driver is highly buggy. Initially, I attributed it to Intel's driver not yet up-to-date with the Insider builds, which is expected and perfectly reasonable. However as the issue started being disruptive with BSODs a few times a week, I went back to the stable retail build - 10586. But to no luck. Though, the frequency was seemingly reduced, the crashes still occured.</p>

        <style>{`
            .ctx-image-set {
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
            }
            .ctx-image-set img {
                padding: 4px;
                height: 100%;
                width: calc(50% - 8px);
            }
            @media (max-width: 600px) {
                .ctx-image-set img {
                    width: calc(100% - 8px);
                }
            }
        `}
        </style>
        <p className="ctx-image-set">
            <img src={require("./data/screen-1.jpg")} alt="[Screenshot 1]" />
            <img src={require("./data/screen-2.jpg")} alt="[Screenshot 2]" />
            <img src={require("./data/screen-3.jpg")} alt="[Screenshot 3]" />
            <img src={require("./data/screen-4.jpg")} alt="[Screenshot 4]" />
        </p>

        <h2>Analysis</h2>

        <p>While the sheer number of times this crash happened, and the frustration due to the driver made me document this on my personal weblog, <strong>this issue is blissfully straight forward, and a no-brainer to analyze</strong>.</p>

        <p>So, starting with <code>0xdead039e</code> error.</p>

        <CodeBlock children={codeblock1} />

        <p>Moving on to the next: <code>0xdead7495</code></p>

        <CodeBlock children={codeblock2} />

        <CodeBlock children={codeblock3} />

        <p>Now to the last <code>DRIVER_IRQL_NOT_LESS_OR_EQUAL</code> error:</p>

        <CodeBlock children={codeblock4} />

        <p>Another variant of <code>DRIVER_IRQL_NOT_LESS_OR_EQUAL</code> error:</p>

        <CodeBlock children={codeblock5} />

        <p>Clearly, its all caused by Intel's Netwbw02.sys. However, no common direct entry points, though a few addresses seem to be the same. I could dig in and explore the addresses. But it makes no sense, since this driver seems to be highly bugged. And it just isn't worth the trouble doing this without the symbols for the drivers, as clearly Intel has quite a lot of work to be done on this driver. Will just have to wait for Intel to fix this.</p>

        <h2>Minidumps</h2>

        <p>As usual, I've shared the full dumps with Microsoft. Hopefully, they'll forward it to Intel. And again, as always all the minidumps for the inquistive minds:</p>

        <p><strong>2016-Q1-Kernel-Netwbw02.sys</strong> (OneDrive folder with all the dumps):<br />
            <a href="https://1drv.ms/f/s!Agt9I4vUjzpCg4d2HQVRGdmUMQM92w">https://1drv.ms/f/s!Agt9I4vUjzpCg4d2HQVRGdmUMQM92w</a>
        </p>

        <p>They contain different dumps with different versions of the drivers, and Windows updates as and when it was released. Each of them seems to have mild variations in their stacks (Possible multiple issues).</p>

    </Article>
}