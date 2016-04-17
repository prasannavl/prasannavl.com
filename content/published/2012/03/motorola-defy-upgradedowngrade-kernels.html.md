# Motorola Defy - Upgrade/Downgrade kernels

<!--[options]
name: Motorola Defy - Upgrade/Downgrade kernels
date: 2012-03-18T00:00:00.000Z
url: 2012/03/motorola-defy-upgradedowngrade-kernels.html
tags:
 - Tech
 - Mobile
 - Operating-Systems
 - Hacks
-->

Motorola has a strange way of controlling their phone. They release an update which prevents us from upgrading to newer kernels released for the same phone in different geographic regions. So, after almost bricking my phone, I finally was able to find a way to downgrade my kernel, so that I can upgrade to an even newer version again.

**So, here's my post regarding the same on XDA:**

People who are stuck with `4.5.1-134_DFP-13XX` Kernels and or any BL6 SBFs on the Motorola Defy(+) may now freely switch between any kernels they require, using the below SBF.

Say for example, to upgrade to Walter's fixed SBF of 4.5.3_109 Kernel from 4.5.1-134_DFP-13XX, do the following.

1. Flash `Defy-BL6Downgrade-CDT.sbf` through RSD Lite.
1. Flash walter's `4.5.3_109 kernel sbf` right away after that or an update zip package if you have a functional recovery. (Actually, you may flash any kernel. Even Froyo kernels)
1. Have a cup of coffee while it flashes, and enjoy after that ;)

Wipe data/cache in case you get stuck at boot. No more bootloader errors.

This is based on <a href="https://forum.xda-developers.com/showthread.php?t=1486731" target="_blank">https://forum.xda-developers.com/showthread.php?t=1486731</a>
Credits go to dlhxr for that.

Note: If you have an SBF which you want to flash after this, just the `BL6Downgrade-CDT.sbf` [47Kb] is enough.

If you want to get into a custom recovery (only if you already have it), then you have to flash BL6Downgrade.SBF, or you will end up with a Bootloader ERR screen.

**Files:**

BL6Downgrade.SBF [34MB] - <a href="http://www.mediafire.com/download.php?vdpp0nnr5f12e95" target="_blank">http://www.mediafire.com/download.php?vdpp0nnr5f12e95</a><br/>
Original XDA Thread: <a href="https://forum.xda-developers.com/showthread.php?t=1552152" target="_blank">https://forum.xda-developers.com/showthread.php?t=1552152</a>