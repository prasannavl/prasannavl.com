<!--[options]
name: 'Crash Analysis: Windows Graphics Stack Bug'
date: 2016-02-12T04:54:02.577Z
url: 2016/02/crash-analysis-windows-graphics-stack-bug
tags:
- Tech
- Crash-Analysis
- Kernel
- Windows
-->

# Crash Analysis: Windows Graphics Stack Bug

<blockquote>
This issue has been filed with Microsoft, and the current state of the issue can be followed up on Microsoft TechNet if you're affected by it or would like to add on to it here:
<a href="https://social.technet.microsoft.com/Forums/en-US/d45e4063-3d73-4f51-a295-972f3be3a456/graphics-stack-bug-windows-10-build-threshold-release-10586-including-redstone?forum=win10itprogeneral" target="_blank">Graphics stack bug - Windows 10 Build Threshold Release (10586+, including RedStone)</a>
</blockquote>

## Affected Configuration

- Windows 10 - Threshold Release (10586+, including the initial builds of RedStone)
- Intel HD Graphics 5500 with Nvidia GeForce 950M (Optimus pipeline)

## The Context

A few weeks ago, being on the Insider Fast Ring, I updated myself to the first release based on the Redstone build likely during the first few hours. Some of the issues I noticed ended up being documented a few days later. My laptop was a HP Envy 15 with an Nvidia Optimus based GeForce 950M, and Intel HD Graphics 5500. However, I noticed weird issues as my screen turned black (but didn't switch off), and the cursor was occasionally visible once every 5-10 seconds or so (but cursor response took about 20-30 seconds). Strange. Most reasonable guess was the graphics driver. Hard reset of the laptop, and everything seemed to be quite fine. Strangely, there were no memory dumps (since the system actually didn't crash I guess), but fortunately the event logs did have a never-ending list of `Graphics card crashed and recovered unexpectedly.`

*The RedStone update also ended up in weird bugs and event logs filled with errors, mostly due to COM permission issues and so on*. Meanwhile, a few hours later, there was an update available for my Intel HD 5500. Great, I was optimistic the issue was getting fixed. However, installing the driver (through Windows Update), ended up in the same blank screen again. Another hard reset, where Windows recovered itself to the last known state, and with similar errors. Meanwhile, my Nvidia card had an update. That was fast. Perhaps, that was the missing piece, and the Nvidia driver this time - same results. Since, the Optimus pipeline relies on the Intel card, it still provided nothing conclusive. Just blank screen. Another hard reset, but now I decided to do a full reset. (This was two days before it was documented that the RedStone build's *Reset* ended up in an unusable system completely breaking it requiring a fresh clean install).

So, there it was. Now, I decided that I had enough with the new RedStone build, and move back to 10586 - the stable build. To my surprise, the graphics drivers ended up with the same result, and blank screen! Another hard reset and the graphics driver worked however. It always seemed to crash repeatedly during the install. However, thankfully, this time, I ended up with a lot of LiveKernelReports. Finally, we are getting somewhere. But a bit too many memorydumps.

<style>
.content-imageset {
    width:100%;
}
</style>
<img src="https://c2.staticflickr.com/8/7492/27100659534_a97b1f02f0_b_d.jpg" alt="[Screenshot 1]" class="content-imageset" />

**493 minidumps!** Hmm.

## The Analysis

Naturally, next step was to figure out what was wrong. So, WinDbg for all of them resulted in the following call stack:

```
0: kd> k
 # Child-SP          RetAddr           Call Site
00 ffffd000`275c3a00 fffff800`9d7671fc watchdog!WdDbgReportRecreate+0x104
01 ffffd000`275c3a50 fffff800`9d76675f dxgkrnl!TdrUpdateDbgReport+0xec
02 ffffd000`275c3aa0 fffff800`9d753345 dxgkrnl!TdrCollectDbgInfoStage2+0x1df
03 ffffd000`275c3ad0 fffff800`9d766e65 dxgkrnl!DXGADAPTER::Reset+0x21d
04 ffffd000`275c3b20 fffff800`9d766fbb dxgkrnl!TdrResetFromTimeout+0x15
05 ffffd000`275c3b50 fffff803`35e78b79 dxgkrnl!TdrResetFromTimeoutWorkItem+0x5b
06 ffffd000`275c3b80 fffff803`35e17125 nt!ExpWorkerThread+0xe9
07 ffffd000`275c3c10 fffff803`35f55916 nt!PspSystemThreadStartup+0x41
08 ffffd000`275c3c60 00000000`00000000 nt!KiStartSystemThread+0x16
```

Ok, that was **dxgkrnl** - the graphics stack. Next up the analysis ended up with straight forward message:

```
VIDEO_TDR_TIMEOUT_DETECTED (117)
The display driver failed to respond in timely fashion.
(This code can never be used for a real bugcheck.)
Arguments:
Arg1: ffffe0011e57d4c0, Optional pointer to internal TDR recovery context (TDR_RECOVERY_CONTEXT).
Arg2: fffff800a4c620f0, The pointer into responsible device driver module (e.g owner tag).
Arg3: 0000000000000000, The secondary driver specific bucketing key.
Arg4: 0000000000000000, Optional internal context dependent data.

Debugging Details:
------------------


DUMP_CLASS: 1

DUMP_QUALIFIER: 400

BUILD_VERSION_STRING:  10586.63.amd64fre.th2_release.160104-1513

DUMP_TYPE:  2

BUGCHECK_P1: ffffe0011e57d4c0

BUGCHECK_P2: fffff800a4c620f0

BUGCHECK_P3: 0

BUGCHECK_P4: 0

FAULTING_IP: 
igdkmd64+120f0
fffff800`a4c620f0 ??              ???

DEFAULT_BUCKET_ID:  GRAPHICS_DRIVER_TDR_TIMEOUT

TAG_NOT_DEFINED_202b:  *** Unknown TAG in analysis list 202b


CPU_COUNT: 4

CPU_MHZ: 95a

CPU_VENDOR:  GenuineIntel

CPU_FAMILY: 6

CPU_MODEL: 3d

CPU_STEPPING: 4

BUGCHECK_STR:  0x117

PROCESS_NAME:  System

CURRENT_IRQL:  0

ANALYSIS_SESSION_HOST:  PVL-FALCON

ANALYSIS_SESSION_TIME:  02-15-2016 06:26:31.0556

ANALYSIS_VERSION: 10.0.10586.567 amd64fre

STACK_TEXT:  
ffffd000`275c3a00 fffff800`9d7671fc : ffffe001`1e57d4c0 00000000`80000000 ffffe001`1e57d4c0 ffffe001`32fd3010 : watchdog!WdDbgReportRecreate+0x104
ffffd000`275c3a50 fffff800`9d76675f : ffffc000`00000000 ffffc000`cb9f1500 ffffe001`1e57d4c0 ffffe001`33482408 : dxgkrnl!TdrUpdateDbgReport+0xec
ffffd000`275c3aa0 fffff800`9d753345 : ffffc000`d1c89c24 ffffe001`334823a0 ffffe001`334823a0 ffffe001`33482408 : dxgkrnl!TdrCollectDbgInfoStage2+0x1df
ffffd000`275c3ad0 fffff800`9d766e65 : ffffe001`32370150 00000000`00000000 00000000`00000000 00000000`00000000 : dxgkrnl!DXGADAPTER::Reset+0x21d
ffffd000`275c3b20 fffff800`9d766fbb : 00000000`00000200 fffff803`361a1340 ffffe001`1c208c90 fffff803`35e90910 : dxgkrnl!TdrResetFromTimeout+0x15
ffffd000`275c3b50 fffff803`35e78b79 : ffffe001`333c7040 fffff800`9d766f60 ffffe001`1fe25610 fffff803`361a1340 : dxgkrnl!TdrResetFromTimeoutWorkItem+0x5b
ffffd000`275c3b80 fffff803`35e17125 : 00000005`b19bbdff 00000000`00000080 ffffe001`1b8a2040 ffffe001`333c7040 : nt!ExpWorkerThread+0xe9
ffffd000`275c3c10 fffff803`35f55916 : ffffd000`20720180 ffffe001`333c7040 fffff803`35e170e4 ffeceff1`ffeceff1 : nt!PspSystemThreadStartup+0x41
ffffd000`275c3c60 00000000`00000000 : ffffd000`275c4000 ffffd000`275be000 00000000`00000000 00000000`00000000 : nt!KiStartSystemThread+0x16


STACK_COMMAND:  kb

THREAD_SHA1_HASH_MOD_FUNC:  26032a29a837a16b5eba8813d816bfe6c3aea8a7

THREAD_SHA1_HASH_MOD_FUNC_OFFSET:  2a98f27881b30ef00b3362f6f34c45e22e7dcaf5

THREAD_SHA1_HASH_MOD:  7558c67383100ca76738f2615528c656f1c43af3

FOLLOWUP_IP: 
igdkmd64+120f0
fffff800`a4c620f0 ??              ???

SYMBOL_NAME:  igdkmd64+120f0

FOLLOWUP_NAME:  MachineOwner

MODULE_NAME: igdkmd64

IMAGE_NAME:  igdkmd64.sys

DEBUG_FLR_IMAGE_TIMESTAMP:  5678d0a8

FAILURE_BUCKET_ID:  LKD_0x117_IMAGE_igdkmd64.sys

BUCKET_ID:  LKD_0x117_IMAGE_igdkmd64.sys

PRIMARY_PROBLEM_CLASS:  LKD_0x117_IMAGE_igdkmd64.sys

TARGET_TIME:  2016-02-02T11:24:05.000Z

OSBUILD:  10586

OSSERVICEPACK:  0

SERVICEPACK_NUMBER: 0

OS_REVISION: 0

SUITE_MASK:  272

PRODUCT_TYPE:  1

OSPLATFORM_TYPE:  x64

OSNAME:  Windows 10

OSEDITION:  Windows 10 WinNt TerminalServer SingleUserTS

OS_LOCALE:  

USER_LCID:  0

OSBUILD_TIMESTAMP:  2016-01-05 06:58:56

BUILDDATESTAMP_STR:  160104-1513

BUILDLAB_STR:  th2_release

BUILDOSVER_STR:  10.0.10586.63.amd64fre.th2_release.160104-1513

ANALYSIS_SESSION_ELAPSED_TIME: 5dc

ANALYSIS_SOURCE:  KM

FAILURE_ID_HASH_STRING:  km:lkd_0x117_image_igdkmd64.sys

FAILURE_ID_HASH:  {df5cc292-6e03-34f8-7849-e22c43f13df4}
```

I'd have generally chalked it up as an Intel driver issue and moved on, however, interesting I received about 2 or 3 different updates from Windows Update for the same Intel Graphics driver. Windows update seemed to have been the most reliable place for drivers which are expected to have been well tested, but all of them ended up crashing exactly the same way.

### Could it be the hardware?

This was an interesting issue since even the kernel logger failed to capture anything useful for the events on the release builds. And so, I had to ensure that the fault didn't lie in the hardware first. UEFI Diagnostics seemed to show no inconsistencies. Besides, older builds of Windows, coupled with older drivers (as well as my Linux OSes - though that might not necessarily prove much in this context) doesn't seem to have these problems. This issue didn't exist before the 10586 build, but seems to exist in all later insider builds till date.

**So, I was left with no reason to doubt the hardware.**

### Potential cause

This was on the retail build (10586). And the same thing happens on Safe Mode as well during the installation. It generates numerous minidumps. The Insider builds for some reason didn't generate the minidumps which were generated on the retail build. So, based on the watchdog reports, it seems like **the driver fails on infinite loop, but just not quickly enough for the watch dog to catch it and crash**. So, it ends up on a blank screen instead of BSOD. However that doesn't explain the lack of more logging on when the driver crashed. So, that puts me on a track to the likely suspect: **The Windows Graphics Stack**. There has been a signficant amount of changes into the RedStone build, and there were also more bug stack bugs that were reported. But it could also be something terribly wrong in the driver.

However without the correct symbols or the debug build, this is as much as I could narrow it down to. Likely, **the problems lie in both the new Graphics Stack (which hopefully will get fixed in the newer builds), and Intel's driver**.

The only real data that were reliable enough for analysis were the numerous minidumps. And my guess is that, even them, probably mostly only contains where the WatchDog timeouts happen, and likely provide an insight into the problematic driver and zones, though not helping much with the precise problem in the driver.

### Minidumps

I did end up with a full memory dump and shared them with Microsoft. However, the rest of the minidumps are shared publicly here for the inquisitive minds:

**2016-Q1-Kernel-Graphics** (OneDrive folder with all the dumps):<br/>
<a href="https://1drv.ms/f/s!Agt9I4vUjzpCg4d1Je-LckF4grKXnw" target="_blank">https://1drv.ms/f/s!Agt9I4vUjzpCg4d1Je-LckF4grKXnw</a>

This includes the LiveKernelReports (Watchdog dumps), and the WER Kernel Reports.