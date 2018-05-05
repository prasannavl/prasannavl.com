import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "Motorola Defy - Upgrade/Downgrade kernels",
    date: "2012-03-18T00:00:00.000Z",
    tags: ["android", "kernel"],
    description: "Kernel downgrade workaround in order to upgrade to newer kernel on Motorola Defy",
}

export default () => {
    return <Article {...meta}>
        <p><b>Original XDA Post: </b><a href="https://forum.xda-developers.com/showthread.php?t=1552152">Upgrade/Downgrade Kernels</a></p>

        <p>Motorola did something strange to control their phone. They released an update which prevents us from upgrading to newer kernels released for the same phone in different geographic regions. That said, after almost bricking my phone, I was finally able to find a way to downgrade my kernel, so that I can upgrade to an even newer version again.</p>

        <p><strong>So, here's my post regarding the same on XDA:</strong></p>

        <p>People who are stuck with <code>4.5.1-134_DFP-13XX</code> Kernels and or any BL6 SBFs on the Motorola Defy(+) may now freely switch between any kernels they require, using the below SBF.</p>

        <p>Say for example, to upgrade to Walter's fixed SBF of 4.5.3_109 Kernel from 4.5.1-134_DFP-13XX, do the following.</p>

        <ol>
            <li>Flash <code>Defy-BL6Downgrade-CDT.sbf</code> through RSD Lite.</li>
            <li>Flash <i>walter's</i> <code>4.5.3_109 kernel sbf</code> right away after that or an update zip package if you have a functional recovery. (Actually, you may flash any kernel. Even Froyo kernels)</li>
            <li>Have a cup of coffee while it flashes, and enjoy after that ;)</li>
        </ol>

        <p>Wipe data/cache in case you get stuck at boot. No more bootloader errors.</p>

        <p>This is based on <a href="https://forum.xda-developers.com/showthread.php?t=1486731" >https://forum.xda-developers.com/showthread.php?t=1486731</a><br/>Hats off to <i>dlhxr</i> for putting this together.</p>
        
        <p><b>Note:</b> If you have an SBF which you want to flash after this, just the <code>BL6Downgrade-CDT.sbf</code> (47Kb) is enough.</p>

        <p>If you want to get into a custom recovery (only if you already have it), then you have to flash BL6Downgrade.SBF, or you will end up with a Bootloader ERR screen.</p>

        <h2>Files</h2>

        <p><b>BL6Downgrade.SBF</b> (34MB): <a href="http://www.mediafire.com/download.php?vdpp0nnr5f12e95" >http://www.mediafire.com/download.php?vdpp0nnr5f12e95</a><br /></p>

    </Article>
}