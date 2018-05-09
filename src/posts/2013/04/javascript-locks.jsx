import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "Javascript Locks",
    date: "2013-04-27T00:00:00.000Z",
    tags: ["javascript"],
    description: "Priority based work queues that emulate locking mechanism in JavaScript"
}

export default () => {
    return <Article {...meta}>
        <p className="note-red"><strong>Note:</strong> This article is here <em>only for historical reasons</em>. <strong>Do not ever do this</strong>, unless you know what you're doing. Also note that this is more of a task library than just for locking - this was a way to solve a particular problem I was facing. That being said, this is almost always a wrong approach for any problem in today's javascript ecosystem. :)</p>

        <p>Things break. Codes break. Javascript - they don't just break, they break everything along with it. Being the simplest language has its downsides. But one of the common reasons that happen is people tend to forget that everything in JS is asynchronous.</p>

        <p>You probably would get away with it, if you're writing simple applications. But when complexity increases, it almost becomes impossible to solve certain problems with the async design pattern, not without a locking mechanism. Especially, in a javascript environment due to its full async nature making timing absolutely unreliable and unpredictable. While locking is common in a multi-thread environment, Js in most common environments will run on a single-thread and due to only simple tasks being performed with it, the old days never saw a need for locking. But for today's complex applications, you just need performant and reliable locking. There's no way around it.</p>

        <p>And that's exactly what the below tiny (&lt;2kb) library provides.</p>

        <p>
            <b>GitHub: </b><a href="https://github.com/prasannavl/JsLocks"><s>https://github.com/prasannavl/JsLocks</s></a> [No longer available] <br />

            <b>Download: </b><a href="https://raw.github.com/prasannavl/JsLocks/master/JsLocks.min.js"><s>JsLocks.min.js</s></a> [No longer available]
        </p>

        <h2>API</h2>

        <CodeBlock children={`
Locker.Lock(lockName, callbackFunction, [priority=0]);
Locker.LockManual(lockName, callbackFunction, [priority=0]);
Locker.Release(lockName);

Locker.DiscardQueue(lockName);

Locker.LockManualIfInstant(lockName, callbackFunction, [priority=0]);
Locker.LockIfInstant(lockName, callbackFunction, [priority=0]);
        `} />

        <h2>Basic usage</h2>

        <CodeBlock children={`
function getALife() {
        Locker.Lock("thebiglock", function() {
        DoSomeWork();
        FetchNewAjaxContentAndReplaceMyMainContent();
    });
};
        `} />

        <p>You could see how the above just cannot work without locking. Without this locking, executing getALife even twice in a row, basically ruins your life. Since you have no idea when you'll get the ajax request back. You have no way of knowing if they will work in order. Instead, your requests will get mangled up, and you have no way to load items in parallel without messing up the order. While this is a simple example, its uses go much further.</p>

        <p>The above is a auto-release lock. If you want manual control over the locks, just use the ManualLock and Release functions. It'd be incredibly useful to nest it deep down in the async callback hierarchy. Say, to couple it with jQuery animate's call back.</p>

        <CodeBlock children={`
Locker.LockManual("thebiglock", function() {
    DoSomeWork();
    $("MyLife").animate( "fast", function() {
        FetchNewAjaxContentAndReplaceMyMainContent();
        Locker.Release("thebiglock");
    });
});
        `} />

        <p>Now this makes it work exactly as you'd except. And you can call the Locker.Release from anywhere, even from an external call or not even at all (of course, in which case your tasks are going to keep getting piled up until you do.)</p>

        <p>And last but not the least - Priorities.</p>

        <CodeBlock children={`
Locker.Lock("thebiglock", function() {
    DoSomeWork();
    FetchNewAjaxContentAndReplaceMyMainContent();
}, 20);
        `} />

        <p>The default priority of jobs is 10.  Higher the value, higher the priority.</p>
        <h2>Priority values example</h2>

        <CodeBlock children={`
var test = function(no) {
    var priority = Math.ceil(Math.random() * 10);
    Locker.Lock("t1", function () { 
            console.log("Task no: " + no + ", Priority: " + priority);
    }, priority);
};


for (var i=0; i<10; i++)
{ 
    test(i);
}
        `} />

        <h2>Output</h2>

        <samp>
            <CodeBlock children={`
Task no: 0, Priority: 8
Task no: 1, Priority: 8
Task no: 4, Priority: 7
Task no: 6, Priority: 7
Task no: 9, Priority: 7
Task no: 8, Priority: 5
Task no: 2, Priority: 3
Task no: 5, Priority: 3
Task no: 7, Priority: 1
Task no: 3, Priority: 1
        `} /></samp>

        <p>As you'd expect, the locking mechanism makes it a reliable tasking system. Extend, modify and utilize it at will. Have fun!</p>

    </Article>
}