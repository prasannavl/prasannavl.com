import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
  title: "The old new thing - Reincarnation of my blog",
  date: "2016-02-10T06:39:32.640Z",
  tags: ["react", "javascript"],
  description: "Technological overview of the over-engineered blog built using React/TypeScript"  
}

export default () => {
  return <Article {...meta}>
    <p><b>GitHub: </b><a href="https://github.com/prasannavl/prasannavl.com">prasannavl.com</a></p>

    <p>My blog was never really alive. A few posts years ago, and that was about it. Off late, I've been working with web technologies again after a long time. The last I had worked with JavaScript - V8 was in its infancy, and JavaScript outside of <code>V8</code> wasn't exactly a great language, especially for someone like myself who lived in the dual ecosystem of C/C++, and .NET. But today a lot has changed, and even the sheer number of web technologies can be over-whelming. So, I decided build myself a website with the cutting edge web pieces of today. Technically, its really <em>a single web application</em>, complemented by server-side static site generation to provide all the goodness of a more traditional <em>website</em>.</p>

    <h2>Today's Web</h2>

    <p>The JavaScript ecosystem is now extremely powerful, sitting comfortably just a little below the likes of .NET and Java ecosystem - you can use high performance buffers, interface with lower level languages, excellent optimizations and a very neat internal representation where most JavaScript objects are simply C++ classes under the hood. CSSOM in browsers have become quite nifty as well, and combined with JavaScript have become a great way to define user experiences - the only one you can use globally across the web, desktops and mobiles with the same technology. This actually leads me to a bold consideration - personally, I've come to consider all the other dynamic languages like Ruby, Python to be quite obsolete (they might as well be), after the <code>nodejs</code> era. There's really nothing they can do that JavaScript can't do with <code>V8</code>, <code>SpiderMonkey</code> (or the next-gen <code>Servo</code>) or <code>Chakra</code>. And in most common scenarios, all of these engines are actually much faster and more efficient.</p>

    <p>And then comes <code>React</code>, a clever implementation of a virtual DOM from Facebook that mitigates the `bad design choices of old' - the aged DOM in browsers that unfortunately cannot have drastic changes due to compatibility with legacy software (the sad, but evident phase of the perpetual cycle for almost all successful software).</p>

    <p>React is quite fantastic, and to me, most importantly because it's just pure vanilla JavaScript. No new learning curve, no weird syntax or language elements to learn unnecessarily. So, I start getting myself re-acquainted in the JavaScript world for user experiences. I'm even moving desktop applications on to JavaScript and CSSOM, thanks to <a href="https://bitbucket.org/chromiumembedded/cef">CEF</a> (<code>Chromium Embedded Framework</code>), and Windows 10+ (which already let's you use <a href="https://github.com/Microsoft/ChakraCore">ChakraCore</a> - <code>the engine that powers Microsoft Edge</code>. Consequently, there's no need to pay the hefty 40+ MB dependency size that happens with CEF while distributing software) for using the Web's DOM everywhere.</p>

    <p>While VirtualDOM is fast enough for most scenarios, you can still use <code>Canvas</code> or <code>WebGL</code> where even such overhead is not acceptable - it's quickly becoming the most optimal technology for any user experience solution.</p>

    <p>However, even with all the goodness, I still don't like using any language that doesn't have static types for anything more than spot scripting. And I wouldn't hesitate to cross compile an equally expressive language like C# to JS, if there isn't a better way to statically type. <strong>Why?</strong> I write anywhere between 10 to 100 lines of code on any average day when I'm NOT targeting a particular project. So, the days I AM working on a particular project it's likely exponential. And nearly every reasonably experienced programmer knows the value of re-usability and maintainability when you write enormous volumes of software. To me, dynamic languages are simply no match for static typing in that aspect. This, of course, are just the benefits beyond the usual rationale that includes performance, code completion tooling and so on.</p>

    <p>Thankfully, Microsoft has already solved this problem quite beautifully - <code>Typescript</code>.<strong>Frankly, without it, I would generally be going out of my way to limit the amount of Javascript code I write</strong>. But thanks to <code>Anders Hejlsberg</code> and team, I no longer have to.</p>

    <h2>The Technology</h2>

    <p>Having the rationale for the core technology in place, here's a quick list of the technology I end up using for building myself a niche framework.</p>

    <ul>
      <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
      <li><a href="http://www.ecma-international.org/ecma-262/6.0/">JavaScript ES6</a>+</li>
      <li><a href="https://facebook.github.io/react/">React</a></li>
      <li><a href="http://reactivex.io/">ReactiveX</a> (<a href="https://github.com/ReactiveX/rxjs" >RxJS</a>)</li>
      <li><a href="https://webpack.github.io/">Webpack</a></li>
      <li><a href="https://daringfireball.net/projects/markdown/">Markdown</a> (for content)</li>
      <li><a href="http://yaml.org/">YAML</a> (for content front-matter)</li>
    </ul>

    <p>I started out with webpack, and quickly the complexity of the configurations grew out of control. And I wanted myself a nice little framework to use for mobile, desktop, and the web alike - which meant diving a lot more into the depths of webpack. And due to my obsessive nature, I like things to be auto-configured, and to generate high performance code by doing as much pre-processing as possible in webpack (targeted module system, dead code elimination, cross compilations, other optimizations like image and SVG optimizations as well). So, naturally I ended up starting with building an abstraction for webpack to pretty much all of it, while always having the ability to the directly edit raw configurations without abstractions getting in the way. Then came a content manager processing Markdown with YAML and generating static content.</p>

    <h2>The React Pattern</h2>

    <p>If you've used React, you'd have likely heard about <code>Redux</code>, <code>Alt</code> and the likes of it. You might have also heard about <code>CycleJs</code>, <code>Elm</code> (a whole new language) and likes if you look for something more experimental. Personally I love the concept of CycleJS though it may not be a direct fit today for many scenarios where you emphasize on performance a lot. Patterns like Redux and Alt are great on theory, or even for smaller applications, but somehow the overhead they cause is something that always bothers me, when I don't really need them. So I ended up building my own pattern based on RxJS. That way I take the overheads when I need it, and when I don't use them, it's just simple react with tiny lightweight translations like routing for example (which again I choose to write my own - it's just one simple class rather than building the app around high limiting libraries like ReactRouter which I think complicates things with unnecessary learning curves and adds pointless overheads. It is after all just a router, and React itself, with it's VDOM makes it super easy to handle routes yourself and you can do it all - direct comparisons, regexes, conditions, nesting and pretty much anything else to your heart's content). <strong>I've often found replacing routers in most scenarios with my secret ingredient (<code>if</code>, <code>switch</code>, and <code>for-loop</code> of course!) nicely abstracted away into an organically tailored routing context almost always leads to better results. Not only in terms of a stronger design pattern and more performant code, but also in half the time without an extra learning curve.</strong></p>
    
    <h3>TL;DR</h3>

    <p className="note">I've extensively used and decided against almost every well-known React pattern (or the so-called framework) libraries out there, at this time. Because, React itself leads you into good patterns for most tasks very naturally, and when it doesn't, a framework like <code>Rx</code> lends a helping hand very nicely with just vanilla Javascript. Most of these libraries just add more learning curve and overhead (assuming you've a strong background in design patterns).</p>

    <h2>The End Is Never Here</h2>

    <p>Well, when I started this, I thought of writing how all the parts come together and a quick brief on the different modules I had written. However, before I finished writing this, each module had already evolved to an extent where many of them could warrant an article of its own. So, for now, I'm leaving this with just a gist of the kind of modules that form this seemingly very simple looking website.</p>

    <ul>
      <li>Several smart factories chosing modules based on the platform.</li>
      <li>A DOM adapter that renders the app into the DOM when on the client.</li>
      <li>A head-less adapter that renders the app on the server directly on first request, which is taken over by the DOM adapter seamlessly.</li>
      <li>A client side content manager that caches data quite intelligently working on top of browser cache.</li>
      <li>A simple universal routing solution.</li>
      <li>A local content manger for managing drafts, pre-processing and publishing. (Markdown + YAML to JSON).</li>
      <li>A set of tools to handle full server-side rendering of the whole app into a fully pre-generated static site.</li>
      <li>A neat standard webpack pipeline that handles TypeScript, JavaScript ES6+, SASS, CSS, common image types, SVG and JSON with minification, compaction, and dead-code elimination where-ever applicable, both for server-side and client side runtimes.</li>
      <li>A build system which involves Travis, CloudFlare, and GitHub.</li>
    </ul>

    <p>And as always, all the code is on GitHub: <a href="https://github.com/prasannavl/prasannavl.com">https//github.com/prasannavl/prasannavl.com</a></p>
  </Article>
}