import React from "react";

export class GoogleAds {
    static renderMediaAd1() {
        return (
            <ins className="adsbygoogle ads-text"
                style={{ display: "block"  }}
                data-ad-client="ca-pub-1693387204520380"
                data-ad-slot="8634084491"
                data-ad-format="auto"></ins>
        );
    }

    static renderMediaAd2() {
        return (
            <ins className="adsbygoogle"
                style={{ display: "inline-block", width: "728px", height: "90px" }}
                data-ad-client="ca-pub-1693387204520380"
                data-ad-slot="1110817699"></ins>
        );
    }

    static renderTextAd1() {
        return (<ins className="adsbygoogle ads-text"
            style={{ display: "block" }}
            data-ad-client="ca-pub-1693387204520380" data-ad-slot="5530147693" data-ad-format="link">
        </ins>);
    }
}