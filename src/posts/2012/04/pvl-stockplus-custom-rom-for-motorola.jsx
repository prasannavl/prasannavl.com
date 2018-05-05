import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "PVL-StockPlus - Custom ROM for Motorola Defy Plus",
    date: "2012-04-05T00:00:00.000Z",
    tags: ["android", "os"],
    featured: true,
    description: "PVL-StockPlus Android Custom ROM for Motorola Defy"
}

export default () => {
    return <Article {...meta}>

        <p><b>Original XDA Post: </b><a href="https://forum.xda-developers.com/showthread.php?t=1582187">[ROM][v2 - April 18th 2012] PVL-StockPlus [4.5.1-134_DFP-231]</a></p>

        <p>So, after staying at CM for a long time, I came across the recent release of Motorola's ROM. And I must admit, for the first time, I was quite impressed. It was snappy, fast and stable. So, I guess I came to a point where I wanted everything to just work instead of hovering around nightlies, making this stock version a perfect base to rectify Motorola's shortcomings, like the God-awful transitions, the complex and ugly loading icon, and well, root, busybox, memory optimizations and all the other performance goodies. I'm a fan of keeping things simple and elegant, rather than complicating things unnecessarily. And I thought, I would share it this time, for those who prefer to use a stable stock version but will all the goodies. So, here it is: <b>PVL-StockPlus.</b></p>

        <h2>Comments</h2>        
        <blockquote className="blockquote note">
            <p>wow i never seen a smoother and a faster rom, is very responsive and i love status bar, animations and roboto!! thanks for this awesome rom!!</p>
            <footer className="blockquote-footer"><cite>FraRiva91 (XDA)</cite></footer>
        </blockquote>
        <blockquote className="blockquote note">
            <p>Thanks! Rom is very fast and smooth.</p>
            <footer className="blockquote-footer"><cite>korto (XDA)</cite></footer>
        </blockquote>

        <h2>Core</h2>

        <p><b>Base:</b> DEFYPLUS_U3_4.5.1-134_DFP-231-AsiaRetail<br />
            <b>Languages:</b> en_US, en_GB, fr_FR, it_IT, es_ES, es_US, de_DE, de_AT, nl_NL, zh_CN, vi_VN, tl_PH, th_TH, id_ID.</p>

        <h2>Compatible Devices</h2>
        <ul>
            <li>Motorola Defy Plus - MB526</li>
            <li>Motorola Defy - MB525+</li>
            <li>Motorola Defy - MB525 (Bayer camera module only, devices with green lens is <strong>NOT</strong> supported)</li>
        </ul>

        <h2>Core Additions</h2>
        <ul>
            <li>Rooted.</li>
            <li>Added Busybox.</li>
            <li>Added latest Bootmenu.</li>
            <li>Added 720p video recording and playback.</li>
            <li>Added panorama mode.</li>
            <li>Added init.d support.</li>
            <li>Added official Motorola's full version of QuickOffice instead of Lite.</li>
            <li>Automatic zip-align on boot.</li>
            <li>Added ramscript.</li>
            <li>Enabled Multi-touch support upto 10 points. (Can be edited in <code>/system/build.prop</code>)</li>
            <li>Adjustable Button Backlight (Can be edited in <code>/system/build.prop</code>)</li>
            <li>Added Deep Sleep support. (Extends your battery life significantly)</li>
            <li>Volume Buttons Wake Support.</li>
            <li>Dalvik Tweaks.</li>
            <li>Fully De-Odexed.</li>
        </ul>

        <h2>UI Changes</h2>
        <ul>
            <li>Full black status bar.</li>
            <li>Full ICS animations.</li>
            <li>Roboto (ICS) Fonts.</li>
            <li>Simple circle battery icon.</li>
            <li>A much simpler and more elegant loading icon.</li>
        </ul>

        <h2>System Application Changes</h2>
        <ul>
            <li>Added Google Play Music.</li>
            <li>Removed ZinioReader. (Download it from Market if you'd like)</li>
            <li>Removed CardioTrainer Stub.</li>
            <li>Removed MotoLounge Stub.</li>
            <li>Removed HelpCentre Stub.</li>
        </ul>

        <h2>Ramscript Configurations</h2>
        <ul>
            <li>minfree - 1536,2048,4096,10240,14800,20360</li>
            <li>swapiness - 20</li>
            <li>vfs_cache_pressure - 70</li>
            <li>dirty_expire_centisecs - 3000</li>
            <li>dirty_writeback_centisecs - 500</li>
            <li>dirty_ratio - 15</li>
            <li>dirty_background_ratio - 3</li>
        </ul>

        <h2>Download Links</h2>
        <ul>
            <li>Version 2: <a href="http://www.mediafire.com/download.php?t7v2wl8l22x722a">PVL-StockPlus-v2.zip</a> [194MB]</li>
            <li>Version 1: <a href="http://www.mediafire.com/?l6knpemg37znl8b">PVL-StockPlus-v1.zip</a> [191MB]</li>
        </ul>

        <p><strong>Note:</strong> If you're installing it on a Defy (not Defy+), you need to only restore &quot;system&quot; using &quot;Advanced Restore&quot;, and flash 4.5.3-109-DHT Kernel from here - <a href="http://ge.tt/969Z8xC/v/3" >http://ge.tt/969Z8xC/v/3</a>.</p>

        <h2>Updates</h2>

        <p><strong>Note:</strong> All the updates below are already integrated into Version 2. You don't have to download any of these below.</p>

        <ul>
            <li><a href="http://www.mediafire.com/?tb605505kdttbd0">ResponsivenessUpdate.zip</a> (156Kb) (Will work on any ROM with init.d support - Tweaks to ramscript)</li>
            <li><a href="http://www.mediafire.com/?4n6u3b7o8a1sk55">MP4VideoUpdate.zip</a> (158Kb) - VGA+ resolution videos including 720p now use MP4 containers. (Info: 720p uses generic MPEG4 Part-2 encoding while others use H264 (Part-10 AVC) as frame-rate with 720p using H264 is too low, although it provides better quality. Edit <code>/system/build.prop</code> if you wish to change that).</li>
        </ul>

        <h2>Screenshots</h2>
        <style>{`
            .ctx-image-set {
                display: flex;
                flex-flow: row wrap;
            }
            .ctx-image-set img {
                padding: 4px;
                height: 320px;
            }
        `}
        </style>
        <p className="ctx-image-set">
            <img src={require("./data/screen-1.jpg")} alt="[Screenshot 1]" className="content-imageset" />
            <img src={require("./data/screen-2.jpg")} alt="[Screenshot 2]" className="content-imageset" />
            <img src={require("./data/screen-3.png")} alt="[Screenshot 3]" className="content-imageset" />
            <img src={require("./data/screen-4.png")} alt="[Screenshot 4]" className="content-imageset" />
        </p>

        <h2>How to Install</h2>

        <ol>
            <li>Root your Phone and Install Bootmenu (<a href={"https://forum.xda-developers.com/attachment.php?attachmentid=792601&d=1322064151"}>SndInitDefy_2.0.apk</a>)</li>
            <li>Extract the downloaded file to the SD card at: <code>/sdcard/clockworkmod/backup</code></li>
            <li>Copy all the update zip files, if any, anywhere into your SD card.</li>
            <li>Reboot</li>
            <li>Boot into 2nd-init (Volume-Down on Blue LED)</li>
            <li>Go to Recovery &gt; Custom Recovery &gt; Backup and Restore &gt; Restore &gt; PVL-StockPlus-v2</li>
            <li>To install the updates, if any, choose &quot;Install from zip from sdcard&quot; &gt; Select all the update zips one by one and install.</li>
            <li>Wipe data (Optional but recommended) and cache (Strictly required).</li>
            <li>Reboot</li>
        </ol>

        <h2>Changelog</h2>

        <h3>Version 2 <small class="text-muted">(17th April 2012)</small></h3>
        <ul>
            <li>Fix: zipalign executable missing.</li>
            <li>Fix: Panorama mode build.prop typo (Thanks to Walter at XDA)</li>
            <li>Number of Multi-touch points can be edited in <code>/system/build.prop</code></li>
            <li>Button backlight can now be edited in <code>/system/build.prop</code></li>
            <li>Added Deep Sleep support. (Extends your battery life significantly)</li>
            <li>Volume Buttons Wake Support.</li>
            <li>Dalvik Tweaks.</li>
            <li>Fully De-Odexed.</li>
            <li>Added Google Play Music.</li>
            <li>Integrated all of v1's updates.</li>
            <li>More build.prop tweaks.</li>
        </ul>

        <p><strong>Note: Please use only the XDA thread for comments, questions, requests and/or suggestions.</strong></p>

        <p>For those who share my taste and prefer simplicity, enjoy. Others, no one's stopping you either.</p>
    </Article>
}