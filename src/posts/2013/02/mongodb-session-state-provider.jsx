import { Article, CodeBlock, Link } from "../../../components/Article";

export const meta = {
    title: "MongoDB Session State Provider for ASP.NET",
    date: "2013-02-22T00:00:00.000Z",
    tags: ["dotnet", "mongodb"],
    description: "Session state provider for ASP.NET that uses MongoDB as the backend"
}

export default () => {
    return <Article {...meta}>    
        <table className="table table-sm table-borderless">
            <col/>
            <col width="100%" />    
            <tr>
                <th>GitHub</th>
                <td><a href="https://github.com/prasannavl/MongoSessionProvider">MongoSessionProvider</a></td>
            </tr>
            <tr>
                <th>Nuget</th>
                <td><a href="https://nuget.org/packages/PVL.MongoSessionProvider">PVL.MongoSessionProvider</a></td>
            </tr>
        </table>

        <p>I've been pretty impressed with the recent development of MongoDB, and it seems to me that their one biggest problem of data consistency has now been solved.</p>

        <p>And so, I decided to give it base one of our upcoming projects fully on MongoDB. But after some Googling I found out all the session providers out there are pretty outdated using deprecated libraries, or not suited for high-performance needs.</p>

        <p>So, here's a session provider for ASP.NET.</p>

        <h2>Installation</h2>

        <p className="note">
            PM> Install-Package PVL.MongoSessionProvider
        </p>

        <h2>Example session document</h2>

        <CodeBlock children={`
use SessionState;
db.Sessions.find().pretty();

{
    "_id": "i2guetwsm0mgaibb1gqmodfq",
    "App": "/",
    "Created": ISODate("2013-02-21T22:27:32.091Z"),
    "Expires": ISODate("2013-02-22T22:30:59.267Z"),
    "LockDate": ISODate("2013-02-21T22:29:54.481Z"),
    "LockId": 1,
    "Timeout": 20,
    "Locked": true,
    "Items": "AQAAAP////8EVGVzdAgAAAABBkFkcmlhbg==",
    "Flags": 0
}
        `} />

        <h2>Scheduled session cleanup command</h2>

        <CodeBlock children={`
db.Sessions.remove({"Expires" : {$lt : new Date() }})
        `} />

        <h2>Example web.config settings</h2>

        <CodeBlock children={`
<connectionStrings>
   <add name="SessionState" connectionString="mongodb://localhost"/>
</connectionStrings>
<system.web>
    <sessionState 
            mode="Custom"
            timeout="1440"
            cookieless="false"
            customProvider="MongoSessionStateProvider">
        <providers>
            <add name="MongoSessionStateProvider"
                type="PVL.MongoSessionProvider"
                connectionStringName="SessionState"
                writeExceptionsToEventLog="false"/>
        </providers>
    </sessionState>
</system.web>
        `} />

    </Article>
}
