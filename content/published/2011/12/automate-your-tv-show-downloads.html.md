# Automate your TV show downloads

<!--[options]
name: Automate your TV show downloads
date: 2011-12-29T00:00:00.000Z
url: 2011/12/automate-your-tv-show-downloads.html
tags:
 - Tech
 - Automation
 - Python
-->

So, TV shows. I found myself checking websites for new episodes often, and if available, download and add it to my download list. The same exact process. Should write a short program to do that, I thought. But never happened.

And it all changed recently, as I had sat down for food waiting for my order. I had just discovered `Scripting for Android` a while back - I was able to write and run Python code off my phone. Pretty cool. And I happened to overhear a conversation about the latest episode of House. Hmm.

And so I started typing out a script to check for TV shows. By the time lunch arrived, I had already written the part to search my phone for existing shows and retrieve the full list of shows from the internet. Pretty smooth. I was already quite excited about running python beautifully on Android.

And well, despite my temptations to code on my phone, touch is just not productive enough for coding. Not yet. And there, got back to my room and finished it.

<!--summary-end-->

<img src="https://c2.staticflickr.com/8/7357/27434701750_f7d676ff37_o.png" alt="[Screenshot 1]"/><br/>
<img src="https://c2.staticflickr.com/8/7302/27102444213_118bfb4be7_o.png" alt="[Screenshot 2]"/>

So, thought I'll share it. Download link is at the end of this post. Put it in a folder where you normally have your shows. And open it. That's about it. If there's a newer episode of any of your shows, it automatically adds them to your download client (shh.. Torrent client).

By default, the program searches your `Downloads` and `Videos` folder and the folder where the program is in. You could also just edit the script, or simply move the program itself to the folder where you have your TV shows.

For example, say all my shows are at `D:\Videos\TV Shows\`. So that's where my program searches. And that's my download client's location as well.

Oh, and add a `-q` switch for it to be fully automatic. Add it to your Task Scheduler, silence all download client prompts if any, and you never have to worry about even running this program again to download your TV shows. Heights of Laziness? Or is it effective use of technology? Your call.

Note: I am primary Windows user. So, naturally its more optimized for Windows. The code is on my GitHub. Feel free to make it your own. I was experimenting with python data structures, so excuse the mixed usage of lists and dictionaries. Code is straight forward, except may be for a few complex regular expressions.

**Download Link: ** <a href="http://www.mediafire.com/?2nxcg5vseol9996" target="_blank">MediaFire - TVShowUpdater</a>