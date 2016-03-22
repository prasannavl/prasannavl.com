# Automate your TV show downloads

<!--[options]
name: Automate your TV show downloads
date: 2011-12-29T00:00:00.000Z
url: 2011/12/automate-your-tv-show-downloads.html
tags: []
-->

So, I've become quite a TV show addict lately. I found myself checking websites for new episodes often, and if available, download and add it to my Torrents download list. The same exact process. Should write a short program to do that, I thought. But never happened.

And it all changed recently, as I had sat down for food waiting for my order. I had just discovered Scripting for Android a while back - I was able to write and run Python code off my phone. Pretty cool. And I happened to overhear a conversation about the latest episode of House. Hmmm.

And so I started typing out a script to check for TV shows. By the time lunch arrived, I had already written the part to search my phone for existing shows and retrieve the full list of shows from the internet. Pretty smooth. I was already quite excited about running python beautifully on Android.

And well, despite my temptations to code on my phone, touch is just not productive enough for coding. Not yet. And there, got back to my room and finished it.

[![](http://1.bp.blogspot.com/-gwunt2vVy_w/TvyOrBVkLWI/AAAAAAAAAG0/KNM9EXAGC34/s640/Untitled2.png)](http://1.bp.blogspot.com/-gwunt2vVy_w/TvyOrBVkLWI/AAAAAAAAAG0/KNM9EXAGC34/s1600/Untitled2.png)

[![](http://2.bp.blogspot.com/-zpOOo3K7Tws/TvyObRNE84I/AAAAAAAAAGs/thteWE5OkCE/s640/Untitled.png)](http://2.bp.blogspot.com/-zpOOo3K7Tws/TvyObRNE84I/AAAAAAAAAGs/thteWE5OkCE/s1600/Untitled.png)

So, thought I'll share it. Downlink link is at the end of this post. Download it. Put it in a folder where you normally download your shows. And open it. That's about it. If there's a newer episode of any of your shows, it automatically adds them to your Torrent Application.

By default, the program searches your Downloads and Videos folder and the folder where the program is in. If you know a bit of coding, you can modify it the way you want or just move the program itself the folder where you have your TV shows.

For example, all my shows are at D:\Downloads\Torrents\. So that's where my program searches. And that's where my uTorrent downloads by default.

Oh, and add a "-q" switch for it to be fully automatic. Add it to your Task Scheduler, silence all uTorrent prompts, and you never have to worry about even running this program again to download your TV shows. Heights of Laziness? Or is it effective use of technology? Your call.

Note: I am primary Windows user. So, naturally its more optimized for Windows. The code is on my GitHub. Feel free to make it your own. I was experimenting with python data structures, so excuse the mixed usage of lists and dictionaries. Code is straight forward, except may be for a few complex regular expressions.

**Download Link: ** [MediaFire - TVShowUpdater](http://www.mediafire.com/?2nxcg5vseol9996)