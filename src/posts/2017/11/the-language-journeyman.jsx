import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
  title: "The Language Journeyman: Learning 20+ languages in the last 20 years",
  date: "2017-11-22T07:09:32.191Z",
  tags: ["general"],
  description: "Article on the timeline and usage of various languages in the past",
}

export default () => {
  return (
    <Article {...meta}>
      <p>As a kid, during my school days, apart from English, I learnt 3 other languages with frequent alternations due to change of school, Govt. policies (I think), etc - Tamil (my native language), Hindi, and French - all of them half-baked, and now my French completely forgotten. Fortunately, I learned from my mistakes - from this point on, I always learned every language in great detail, trying to get a high level view of every semantic nuance before using it, but alas, I can't use them to speak to people - only to machine, through electronics and computer keyboards.</p>
  
      <p className="note">
        <strong>Note:</strong> This focuses largely on a walk down my childhood computing lane, and is a reflection of hopefully authentic understanding I had then. So if you’re looking for technical details, you may want to wait for the last part of my article - in which I hope to focus on my learnings from being a language journeyman, that hopefully helps you in making in the right language choices for the future.
      </p>
  
      <h2>The First Decade</h2>
      <h3>Language 1: BASIC (Year: 199x)</h3>
  
      <p>My uncle had gifted me with an educational tool in the 90s that used to have quizzes of English, Math, and BASIC. While I barely remember anything about the language today, I do remember the green colored laptop like plastic box with a keyboard and tiny display.</p>
      
      <p>BASIC, was my first computer language - giving me the ability to send commands through an electronic circuit and see the little rectangular gray blocks lighting up on that tiny display, that would form letters! As a kid, I was in awe.</p>
      
      <h3>Language 2: LOGO (Year: 199x)</h3>
      
      <p>If I remember correctly, one of the heads of my school, out of his own enthusiasm for computers, had set up this fascinating computer lab in school, with a few boxes of CRT monitors beaming electrons right at you - to me, staring at them were the most glorious time of my school life. To see those little blocks on the computer screen reacting to numerous directions you write. Again, barely remember anything about this time that was filled with magic and wizardry - but I do remember loving it.</p>
  
      <h3>Language 3: C (Year: Late 199x - Early 200x)</h3>
  
      <p>The first computer I ever had was a Compaq Presario! Looked exactly like this below.</p>
  
      <img className="img-fluid" src={require("./data/compaq.jpg")} alt="How my trusty Presario looked"/>
  
      <p>Sporting the fantastic JBL speakers, a fancy looking CPU case, 10GB HDD and Intel Pentium 3 - it was top notch! Overtime, I had reinstalled Windows 98 a bunch of times (a recovery CD came along and I had to find out what it did), meddled with the BIOS, and once Ubuntu released in 2004, ordered the very first versions of it online that would ship CDs all the way from South Africa to suburban India for free</b> (though I had to jump through hoops to see an actual desktop on my PC). I did, however stick to the Microsoft Ecosystem for a long time until Ubuntu 17.10.</p>
  
      <p>My clean install obsession aside, meddling further led me to C, and started writing simple C programs that would do basic math and crash in funny ways, and at times, even take the whole OS down with it. </p>
  
      <p className="note">
      This is the first real language that I brought upon myself to learn. Not sure how this journey really began to this day. However, I ‘really’ learned C much later in life.
      </p>
  
      <h3>Language 4: HTML/CSS (Year: Early 200x)</h3>
  
      <p>I’m not sure if I even want to dedicate a section to HTML, but well, the <code>L</code> in HTML stands for Language, after-all. After being exposed to the web through the screeching modem sounds, I eventually started staying up all night (a trait I inherited proudly from my father who ran a clinic, and as such, was forced to stay up most of the night). But instead of saving lives - I’d go on to use <b>Google</b>, <b>AtlaVista</b> (heard of it?) and the likes, to learn all about computers, create a hundred email accounts (oh, yeah - not an exaggeration) to see which was the better one, and download massive, massive things like <b>RealPlayer</b>, and <b>MS SDKs</b> and <b>GNU source codes</b> - because <code>the internet was only free between 11pm to 4am in the morning</code> (And dial-up would use up the phone-line, and if I use it during the day, I’ll get yelled at from all directions). But I digress, this made me curious about the web, build basic websites, and learn HTML/CSS with just a little bit of JavaScript, and <code>had marquee carnival!</code> (You probably won’t get that metaphor unless you wrote web pages in the 90s or early 2000s)</p>
  
      <p className="note">
        As with C, I learnt the details of the DOM, CSSOM, and web rendering engine pipelines much later in life.
      </p>
  
      <h3>Language 5: Java  (Year: Early 200x)</h3>
  
      <p>Java, was a name that was all over computers at that time - even in suburban India. I would walk through the computer section in the biggest bookstore in the town, called <i>Eagle Book Centre</i> (It was nice to find out that it still exists), I’d see sections dedicated to just this thing called ‘Java’. And somehow, I convinced my grandfather that <b>I absolutely, positively needed to pick up the fattest book I had ever bought in my life</b>, and a very expensive one at that - Java something, with over 2000 pages. Everyone thought I was nuts!</p>
  
      <p>After I churned through it and finished in three or so weeks later, I don’t suppose I got everything in the book, but I did understand the fundamentals of Java, and <i>got familiar</i> with HTTP, sockets, servers, and some networking basics, but never really explored more than building some windows and toolboxes - and being unhappy with how Java applications looked so awful (AWT never looked native), I decided to look for something that looked nicer. Little did I know then, that you don’t have to completely switch languages for it - but in retrospect, I’m thankful I didn’t know, or I’d have stuck with Java.</p>
  
      <h3>Language 6-7: VB, Delphi (Year: Early 200x)</h3>
  
      <p>In the pursuit of better looking applications, next in line came <code>VB6</code> (the native one), and I ended up making a few windows and toolbars. <code>VB.NET</code> was introduced by Microsoft a little later, running on top of the .NET framework. But after a little research I found the big language of the day was <code>Delphi</code>. But it didn’t help that those days everything was commercial. <b>Unless I had a few thousand dollars up my sleeve, there was no way to get them</b>. So how does a kid in suburban South India get access to them? Thanks to a service engineer whom I had befriended. After learning about my computer adventures, he would give me access to all kinds of software including later Windows ME (sigh), Windows 2000, and Windows 2000 Server, each of which I was all too eager to get take for a spin on my trusty old Compaq Presario, and thus began my adventures of operating systems. And not long after, I was spinning up windows, and toolbars with Delphi for fun.</p>
  
      <p className="note">
        Access to essential software is a lot easier today - Microsoft for instance, has numerous MSDN subscriptions to help startups. Companies like JetBrains provides a vast amount of software for open source development. Although, there's an overwhelming amount of open source alternatives today - many even better than the commercial ones.
      </p>
  
      <h3>Language 8-9: Pascal, Fortran (Year: Early 200x)</h3>
  
      <p>My aunt who was a computer engineer, had come to India briefly, and knowing my interest gave me a book on either Pascal or Fortran. I actually don’t remember which one. But learning one also prompted me to learn the other though they don’t really have anything in common. I used Turbo Pascal, thanks to my newly found trusted friend. However, after C in Linux (try building GUIs in Windows with C as a kid) and Delphi on Windows, I don’t think I ever really enjoyed it. Fortran was nicer, but my experiments then didn’t revolve around numerics which Fortran would have been great at that time, but more on GUIs and interfacing with the OS. By the time I finished the hard and extremely difficult to read book, in just few weeks, <b>I lost it’s knowledge just as fast as I learnt it</b>, and as such my <i>religious</i> journey came to an end. Obviously, there was one phrase that stuck along, all these years.</p>
  
      <p className="note">GOD is REAL, unless declared Integer.</p>
  
      <hr/>
  
      <p><strong>Detour:</strong> Until this point, everything I had learnt were just used for toying around, poking into the depths of the system, and writing my own simple programs to automate a few things. Nothing more. I was obsessed with the internals of operating systems. Since Windows, unlike Linux was closed, it made learning and understanding every bit of detail, a discovery in it’s own right. Never would I forget the tools of Mark Russinovich, and SysInternals, which eventually become a part of Microsoft, and is the first thing I unpack into every install of the Windows OS till today.</p>
  
      <hr/>
  
      <h3>Language 10: C# (Year: 2004+)</h3>
  
      <p>Somewhere along my journey, VB led to VB.NET which in turn led to <b>the language that eventually became the one I’d love for years to come - C#.NET</b>. At some point later, I was obsessed with "The Lord of the Rings" movie, and being the computer savvy kid that I was - I knew exactly how to get it (ah, the pre-Netflix era). However, what I didn't expect was <b>my grand 10GB hard disk couldn’t store more than one at a time</b>. So, now, armed with my computing knowledge in all it’s glory I set on this journey to make it fit. Enter video encoding, and <code>Xvid</code>. I entered into this whole new world of image processing, and vectorization. I learnt about the then upcoming format H264 - The open source version being x264. But my trusty old Compaq couldn’t handle it. So, I had to only use Xvid. And since, even that would take my computer <strong>a whole night run a single pass of a movie</strong>, I needed better tools. Turns out, there was no tool out there that would actually survive a system shutdown, and/or hibernation - and all these tools were either too complicated to use, or lacked precise control over Xvid. </p>
  
      <p>And so I ended up interfacing with the operating system, and created an application in C# after being up all night for a few days, while still somehow going to school everyday half-dead - <strong>EasyXvid</strong> [<a href="https://yepdownload.com/easyxvid">Link 1</a>] [<a href="http://www.softpedia.com/get/Multimedia/Video/Encoders-Converter-DIVX-Related/EasyXviD.shtml">Link 2</a>]. Interestingly, I found it to be still alive, though I would assume it to be extremely outdated (both the UI and the libs - to the point I was surprised to even see it work - it does!). It was a little tool, that allowed you to put <em>pause</em> on a video encoding, so I could turn off my computer when I went to school, and <em>resume</em> the moment I got back with a very easy GUI and a lot of automation, all you have to do was just drop-in your video file, and EasyXvid calculated all the overwhelming numbers for you, while still having precise control over the advanced matrices and encoding elements.</p>
      <p>After I gained more proficiency in C#, the world became my playground - I felt like Voldemort - * Evil laugh * - I could create pretty much any kind of desktop application - or so I thought. And then, I went on a journey to create what I then called EasyAVC (which I never completed) - which used H264 encoding with a clean GUI that involved a lot of custom drawing that Windows or .NET Framework wouldn’t easily allow for. So, I had to dip into Win32, which meant learning C/C++, this time for real, with all it’s nitty gritty details.</p>
  
      <p className="note">
        <strong>I loved C#.</strong> More so because of "Intellisense" and the tooling around it by Microsoft. WinForms were great. I was just able to easily drag and drop items, and quickly code my C# app. No fuzzing with so many dependencies, or complex build orchestration systems. This was not the age of NuGet, and great internet. So, external libraries were a pain. But it was amazing that most things you need for applications of that age, were built into or at-least integrated beautifully with VS.NET (Oh yeah, the days when VS was in so many variants).
      </p>
  
      <h3>Language 11: C again, C++ (Year: 2006+)</h3>
  
      <p>So, as my journey into video encoding went deeper, I got lost into learning C++, as I had to use COM+ (Component Object Model), to access deeper Windows layers, which also led me to really do C and not toy with it. C, the language, as everyone knows is blissfully simple, but writing robust safe programs with it, is an art that takes immense discipline. However, the amount of learning I had to do overwhelmed me. I had eventually decided to stop EasyAVC, and I was nearing my high school exams, and already the diversions has made me go-to school sleep deprived on a regular basis. However, while I was proficient with C#, the marshalling layers, and interfacing with C still baffled the 16 year old me. Instead, I explored directly using C++ frameworks like WxWidgets, Qt, and GTK (C here). Now, the GTK and QT diversion took me into the depths of GNOME, KDE and Linux. I loved QT. Became quite proficient at it. But this is where my high school computing journey ends.</p>
  
      <p>This was the point when I really got my bearings together on C/C++, memory allocations, the numerous dark magic that go with the heap, stack, and better idea on Windows internals. Believe it or not, for a high school kid, this information was so hard to find freely on the internet those days. I had to put the pieces together little by little. </p>
  
        <p className="note">I keep coming back to C/C++, to this day. After-all, C ABIs are at the core of everything we use today. Even for cross-platform GUIs,  Qt is something I dabble with more than just a few times.</p>
  
      <hr/>
  
      <p><strong>Detour: College!</strong></p>
  
      <p>The first semester was mostly lost in acclimation. By the second semester, each of us had gotten our own laptops, and so, the many troubleshooting that came along with it. My room became the defacto computer shop in the hostel block, fixing up issues, and eventually improving my own efficiency by making my room the 24x7 stop shop for 25 minute guaranteed software fixes (yup, that was time it took for my Acronis OS image snapshots with hand-picked drivers and software to unroll on our slow mechanical HDDs) and did other inconspicuous things that involved network security and bandwidth limitations that I won’t get into ;) -- The languages here for tiny tasks were almost always C#, or C/C++. Just more networking, and troubleshooting - no new languages.</p>
  
      <hr/>
  
      <p className="note">
        That about sums up the first 8 or so years of my computing life. These were <b>fast-moving and involved hacking things up.</b> While my language background helps me in picking up new computing languages fast, the <b>majority of the next 12 years, however are rather slow - more focused on architecture, design, and maintainability</b>.
      </p>
  
      <p><strong>Up next:</strong></p>
  
      <ul>
      <li><strong>Language 12:</strong> ActionScript(Flash) (Year: 2007-08)</li>
      <li><strong>Language 13-14:</strong> PHP, JavaScript</li>
      <li><strong>Language 15-16:</strong> Python, Perl</li>
      <li><strong>Language 17:</strong> C# again (Breaking the CLR open), F#</li>
      <li><strong>Language 18-20:</strong> OCaml, Elm, Dart</li>
      <li><strong>Language 21:</strong> Vala (The bastard kid of C and C#)</li>
      <li><strong>Language 22-23:</strong> NodeJS + Javascript ES6+, TypeScript</li>
      <li><strong>Language 24:</strong> Go (Year: 2016+)</li>
      <li><strong>Language 25:</strong> Rust (Year: 2015+)</li>
      </ul>
      <ul>
      <li><strong>Familiar with:</strong> (Not enough to justify calling it as learnt): VBScript, Lua, Erlang, Scala, Swift, Matlab, Nim, Assembly</li>
      <li><strong>Daily heros left-out:</strong> Powershell, Bash, Awk</li>
      <li><strong>Significant languages that I never bothered to learn:</strong> Haskell, Ruby, D, Lisp, Clojure</li>
      </ul>
      <ul>
      <li><strong>Languages that I consider myself proficient in today:</strong> Rust, C#, Go, TypeScript (JS).</li>
      </ul>
  
      <p className="note"><strong>The Language that I think will take over the world:</strong> Rust.</p>
  
      <p>Hopefully, I'll add more on the next part of my language journey, and the technical as well as the business and logistical reasons why <code>Rust</code> will succeed in doing what no other languages have done in the past - <strong>Provide a truly universal general purpose langauge that unifies the world.</strong></p>
      </Article>);
  }