# PVL-StockPlus - Custom ROM for Motorola Defy Plus

<!--[options]
name: PVL-StockPlus - Custom ROM for Motorola Defy Plus
date: 2012-04-05T00:00:00.000Z
url: 2012/04/pvl-stockplus-custom-rom-for-motorola_05.html
tags:
 - Tech
 - Mobile
 - Operating-Systems
-->

<blockquote class="green"><p class="italic">&ldquo;**wow i never seen a smoother and a faster rom, is very responsive and i love status bar, animations and roboto!! thanks for this awesome rom!!**&rdquo; - FraRiva91 (XDA)<br/><br/>
&ldquo;**Thanks! Rom is very fast and smooth.**&rdquo; - korto (XDA)</p></blockquote>

So, after staying at CM for a long time, I came across the recent release of Motorola's ROM. And I must admit, for the first time, I was quite impressed. It was snappy, fast and stable. So, I guess I came to a point where I wanted everything to just work instead of hovering around nightlies, making this stock version a perfect base to rectify Motorola's shortcomings, like the God-awful transitions, the complex and ugly loading icon, and well, root, busybox, memory optimizations and all the other performance goodies. I'm a fan of keeping things simple and elegant, rather than complicating things unnecessarily. And I thought, I would share it this time, for those who prefer to use a stable stock version but will all the goodies. So, here: PVL-StockPlus.

**XDA Thread:** <a href="https://forum.xda-developers.com/showthread.php?t=1582187" target="_blank">https://forum.xda-developers.com/showthread.php?t=1582187</a>

**Base:** DEFYPLUS_U3_4.5.1-134_DFP-231-AsiaRetail<br/>
**Languages:** en_US, en_GB, fr_FR, it_IT, es_ES, es_US, de_DE, de_AT, nl_NL, zh_CN, vi_VN, tl_PH, th_TH, id_ID.

**Compatible Devices:** Motorola Defy Plus (MB526), Motorola Defy (MB525+, MB525 - Bayer camera module only, devices with green lens is not supported)

**Core Additions:**

- Rooted.
- Added Busybox.
- Added latest Bootmenu.
- Added 720p video recording and playback.
- Added panorama mode.
- Added init.d support.
- Added official Motorola's full version of QuickOffice instead of Lite.
- Automatic zip-align on boot.
- Added ramscript.
- Enabled Multi-touch support upto 10 points. (Can be edited in `/system/build.prop`)
- Adjustable Button Backlight (Can be edited in `/system/build.prop`)
- Added Deep Sleep support. (Extends your battery life significantly)
- Volume Buttons Wake Support.
- Dalvik Tweaks.
- Fully De-Odexed.

**UI Changes:**

- Full black status bar.
- Full ICS animations.
- Roboto (ICS) Fonts.
- Simple circle battery icon.
- A much simpler and more elegant loading icon.

**System Application Changes:**

- Added Google Play Music.
- Removed ZinioReader. (Download it from Market if you'd like)
- Removed CardioTrainer Stub.
- Removed MotoLounge Stub.
- Removed HelpCentre Stub.

**Ramscript Configurations:**

- minfree - 1536,2048,4096,10240,14800,20360
- swapiness - 20
- vfs_cache_pressure - 70
- dirty_expire_centisecs - 3000
- dirty_writeback_centisecs - 500
- dirty_ratio - 15
- dirty_background_ratio - 3

**Download Links:**

- Version 2 : <a href="http://www.mediafire.com/download.php?t7v2wl8l22x722a" target="_blank">PVL-StockPlus-v2.zip</a> [194MB]
- Version 1 : <a href="http://www.mediafire.com/?l6knpemg37znl8b" target="_blank">PVL-StockPlus-v1.zip</a> [191MB]

**Note:** If you're installing it on a Defy (not Defy+), you need to only restore "system" using "Advanced Restore", and flash 4.5.3-109-DHT Kernel from here - <a href="http://ge.tt/969Z8xC/v/3" target="_blank">http://ge.tt/969Z8xC/v/3</a>.

**Updates:**

**Note:** All the updates below are already integrated into Version 2. You don't have to download any of these below.

<a href="http://www.mediafire.com/?tb605505kdttbd0" target="_blank">ResponsivenessUpdate.zip</a> [156Kb] (Will work on any ROM with init.d support - Tweaks to ramscript)
<a href="http://www.mediafire.com/?4n6u3b7o8a1sk55" target="_blank">MP4VideoUpdate.zip</a> [158Kb] - VGA+ resolution videos including 720p now use MP4 containers. (Info: 720p uses generic MPEG4 Part-2 encoding while others use H264 (Part-10 AVC) as frame-rate with 720p using H264 is too low, although it provides better quality. Edit `/system/build.prop` if you wish to change that.)

**Screenshots:**

<style>
    .content-imageset {
        padding: 4px;
        height: 320px;
    }
</style>
<p style="display:flex; flex-flow: row wrap;">
<img src="//3.bp.blogspot.com/-_uIDBm9ReK0/T3y5llUcL4I/AAAAAAAAAIg/dLcS8y8h1Lc/s1600/Screenshot1.jpg" alt="Screenshot 1" class="content-imageset" />
<img src="//2.bp.blogspot.com/-2SO1pSNyAuo/T3y5nUf2QNI/AAAAAAAAAIo/IH-1OA2Jn9s/s320/Screenshot2.png" alt="Screenshot 2" class="content-imageset" />
<img src="//3.bp.blogspot.com/--4RgtNQRnMY/T3y5o8upjrI/AAAAAAAAAIw/ECc7-E0q2go/s320/Screenshot3.png" alt="Screenshot 3" class="content-imageset" />
<img src="//2.bp.blogspot.com/-Nw0A4u00yUM/T3zi8P5P5QI/AAAAAAAAAI8/wa23Bj2mo_0/s320/Screenshot4.png" alt="Screenshot 4" class="content-imageset" />
</p>

**How to Install:**

1. Root your Phone and Install Bootmenu (<a href="https://forum.xda-developers.com/attachment.php?attachmentid=792601&d=1322064151" target="_blank">SndInitDefy_2.0.apk</a>)
1. Extract the downloaded file to the SD card at: `/sdcard/clockworkmod/backup`
1. Copy all the update zip files, if any, anywhere into your SD card.
1. Reboot
1. Boot into 2nd-init (Volume-Down on Blue LED)
1. Go to "Recovery" -> "Custom Recovery" -> "Backup and Restore" -> "Restore" -> "PVL-StockPlus-v2"
1. To install the updates, if any, choose "Install from zip from sdcard" -> Select all the update zips one by one and install.
1. Wipe data (Optional but recommended) and cache (Strictly required).
1. Reboot

**Changelog:**

**Version 2 - 17th April 2012 :**

- Fix: zipalign executable missing.
- Fix: Panorama mode build.prop typo (Thanks to Walter at XDA)
- Number of Multi-touch points can be edited in `/system/build.prop`
- Button backlight can now be edited in `/system/build.prop`
- Added Deep Sleep support. (Extends your battery life significantly)
- Volume Buttons Wake Support.
- Dalvik Tweaks.
- Fully De-Odexed.
- Added Google Play Music.
- Integrated all of v1's updates.
- More build.prop tweaks.

**Note: Please use only the XDA thread for comments, questions, requests and/or suggestions. I may not respond to comments here.**

For those who share my taste and prefer simplicity, enjoy. Others, no one's stopping you either.