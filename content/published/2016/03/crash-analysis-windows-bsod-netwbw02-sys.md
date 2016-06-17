<!--[options]
name: 'Crash Analysis: Windows BSOD - Netwbw02.sys'
date: 2016-03-05T06:54:09.738Z
url: 2016/03/crash-analysis-windows-bsod-netwbw02-sys
tags:
- Tech
- Crash-Analysis
- Kernel
- Windows
-->

# Crash Analysis: Windows BSOD - Netwbw02.sys

<blockquote>
This issue has been filed with Microsoft, and the current state of the issue can be followed up on Microsoft TechNet if you're affected by it or would like to add on to it here:
<a href="https://social.technet.microsoft.com/Forums/en-US/57253a48-dce8-40cd-b66a-31fe30af7c47/windows-10-netwbw02sys-crash-on-all-threshold-and-redstone-builds-so-far?forum=win10itprogeneral" target="_blank">Windows 10: Netwbw02.sys crash on all Threshold and Redstone builds (so far)</a>
</blockquote>

## Affected Configuration

- Windows 10 - OS Build 10586+
- Intel Dual-Band Wireless AC 3160

## Error Codes

- DRIVER_IRQL_NOT_LESS_OR_EQUAL
- 0xdead039e
- 0xdead7495

## The Context

Initally, I had few BSOD with the `Netwb02.sys` (Intel's WiFi driver) during the Windows Insider builds, with `DRIVER_IRQL_NOT_LESS_OR_EQUAL`. That's a straight forward issue with the self-explanatory problem code - the driver is accessing improper memory addresses which ended up in higher IRQL. Obviously, Intel's WiFi Driver is the culprit there. However, I also noticed the system crashing ocassionally with error code `0xdead039e`, and also at times, with the `0xdead7495` errors.

Looking at all of these error stacks pointed to the same driver. The culprit was always the `Netwb02.sys`. It seems that Intel's driver is highly buggy. Initially, I attributed it to Intel's driver not yet up-to-date with the Insider builds, which is expected and perfectly reasonable. However as the issue started being disruptive with BSODs a few times a week, I went back to the stable retail build - 10586. But to no luck. Though, the frequency was seemingly reduced, the crashes still occured.

<style>
    .content-imageset {
        padding: 4px;
        height: 100%;
        width: 50%;
    }
</style>
<p style="display:flex; flex-flow: row wrap;">
<img src="https://farm8.staticflickr.com/7445/27679001366_fcc66ea16a_z_d.jpg" alt="[Screenshot 1]" class="content-imageset" />
<img src="https://farm8.staticflickr.com/7417/27679004356_37c27a5b95_z_d.jpg" alt="[Screenshot 2]" class="content-imageset" />
<img src="https://farm8.staticflickr.com/7420/27638287311_fccb64e627_z_d.jpg" alt="[Screenshot 3]" class="content-imageset" />
<img src="https://farm8.staticflickr.com/7396/27638294331_440c09d296_z_d.jpg" alt="[Screenshot 4]" class="content-imageset" />
</p>

## The Analysis

While the sheer number of times this crash happened, and the frustration due to the driver made me document this on my personal weblog, **this issue is blissfully straight forward, and a no-brainer to analyze**.

So, starting with `0xdead039e` error.

```
1: kd> lmvm Netwbw02
Browse full module list
start             end                 module name
fffff801`6d400000 fffff801`6d789000   Netwbw02   (no symbols)
    Loaded symbol image file: Netwbw02.sys
    Image path: \SystemRoot\System32\drivers\Netwbw02.sys
    Image name: Netwbw02.sys
    Browse all global symbols  functions  data
    Timestamp:        Tue Nov 03 20:00:10 2015 (5638C4F2)
    CheckSum:         00364A95
    ImageSize:        00389000
    Translations:     0000.04b0 0000.04e4 0409.04b0 0409.04e4
1: kd> k
 # Child-SP          RetAddr           Call Site
00 ffffd001`00e627a8 fffff801`6d460470 nt!KeBugCheckEx
01 ffffd001`00e627b0 fffff801`6d5f7475 Netwbw02+0x60470
02 ffffd001`00e627f0 fffff801`6d5f8fe0 Netwbw02+0x1f7475
03 ffffd001`00e62840 fffff801`6d5f55fa Netwbw02+0x1f8fe0
04 ffffd001`00e62870 fffff801`6d5f5e3c Netwbw02+0x1f55fa
05 ffffd001`00e628f0 fffff801`6d5f30b4 Netwbw02+0x1f5e3c
06 ffffd001`00e62980 fffff801`6d45c3de Netwbw02+0x1f30b4
07 ffffd001`00e629d0 fffff801`6800aa4e Netwbw02+0x5c3de
08 ffffd001`00e62a00 fffff801`6802105d ndis!ndisQueuedMiniportDpcWorkItem+0x24e
09 ffffd001`00e62b40 fffff802`f6c96125 ndis!ndisReceiveWorkerThread+0x21d
0a ffffd001`00e62c10 fffff802`f6dd4916 nt!PspSystemThreadStartup+0x41
0b ffffd001`00e62c60 00000000`00000000 nt!KiStartSystemThread+0x16
```

Moving on to the next: `0xdead7495`

```
Unknown bugcheck code (dead7495)
Unknown bugcheck description
Arguments:
Arg1: 00000000121e0009
Arg2: 000000000125027e
Arg3: 0000000011af0000
Arg4: 0000000000000000
```

```
0: kd> k
 # Child-SP          RetAddr           Call Site
00 fffff801`89802248 fffff801`24460470 nt!KeBugCheckEx
01 fffff801`89802250 00000000`dead7495 Netwbw02+0x60470
02 fffff801`89802258 00000000`121e0009 0xdead7495
03 fffff801`89802260 00000000`0125027e 0x121e0009
04 fffff801`89802268 00000000`11af0000 0x125027e
05 fffff801`89802270 00000000`00000000 0x11af0000
```

Now to the last `DRIVER_IRQL_NOT_LESS_OR_EQUAL` error:

```
1: kd> lmvm Netwbw02
Browse full module list
start             end                 module name
fffff801`59c00000 fffff801`59f89000   Netwbw02 T (no symbols)
    Loaded symbol image file: Netwbw02.sys
    Image path: \SystemRoot\System32\drivers\Netwbw02.sys
    Image name: Netwbw02.sys
    Browse all global symbols  functions  data
    Timestamp:        Tue Nov 03 20:00:10 2015 (5638C4F2)
    CheckSum:         00364A95
    ImageSize:        00389000
    Translations:     0000.04b0 0000.04e4 0409.04b0 0409.04e4
1: kd> k
 # Child-SP          RetAddr           Call Site
00 ffffd000`ac6b5b18 fffff803`281642e9 nt!KeBugCheckEx
01 ffffd000`ac6b5b20 fffff803`28162ac7 nt!KiBugCheckDispatch+0x69
02 ffffd000`ac6b5c60 fffff801`59c3b3ac nt!KiPageFault+0x247
03 ffffd000`ac6b5df0 ffffe000`feeb5010 Netwbw02+0x3b3ac
04 ffffd000`ac6b5df8 fffff801`59c4f80f 0xffffe000`feeb5010
05 ffffd000`ac6b5e00 00000000`00000000 Netwbw02+0x4f80f
```

Another variant of `DRIVER_IRQL_NOT_LESS_OR_EQUAL` error:

```
3: kd> k
 # Child-SP          RetAddr           Call Site
00 ffffd000`2843fb58 fffff803`085592e9 nt!KeBugCheckEx
01 ffffd000`2843fb60 fffff803`08557ac7 nt!KiBugCheckDispatch+0x69
02 ffffd000`2843fca0 fffff801`e956b3ac nt!KiPageFault+0x247
03 ffffd000`2843fe30 ffffe001`96caf010 Netwbw02+0x3b3ac
04 ffffd000`2843fe38 fffff801`e957f75c 0xffffe001`96caf010
05 ffffd000`2843fe40 ffffe001`96caf010 Netwbw02+0x4f75c
06 ffffd000`2843fe48 00000000`00000000 0xffffe001`96caf010
```


Clearly, its all caused by Intel's Netwbw02.sys. However, no common direct entry points, though a few addresses seem to be the same. I could dig in and explore the addresses. But it makes no sense, since this driver seems to be highly bugged. And it just isn't worth the trouble doing this without the symbols for the drivers, as clearly Intel has quite a lot of work to be done on this driver. Will just have to wait for Intel to fix this.

### Minidumps

As usual, I've shared the full dumps with Microsoft. Hopefully, they'll forward it to Intel. And again, as always all the minidumps for the inquistive minds:

**2016-Q1-Kernel-Netwbw02.sys** (OneDrive folder with all the dumps):<br/>
<a href="https://1drv.ms/f/s!Agt9I4vUjzpCg4d2HQVRGdmUMQM92w" target="_blank">https://1drv.ms/f/s!Agt9I4vUjzpCg4d2HQVRGdmUMQM92w</a>

They contain different dumps with different versions of the drivers, and Windows updates as and when it was released. Each of them seems to have mild variations in their stacks (Possible multiple issues).