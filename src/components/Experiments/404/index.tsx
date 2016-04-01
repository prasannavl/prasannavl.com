import React from "react";
import createStyled from "../../../modules/core/createStyled";

let svg = require("!raw!./bot.svg") as any;
let style = require("./bot.scss") as any;

export class Robot extends React.Component<any, any> {
    componentDidMount() {
        getBrokeBot().run(false);
    }

    render() {
        return <div className={style.root}>
            <div dangerouslySetInnerHTML={{ __html: svg }}></div>
        </div>;
    }
}

export default createStyled(Robot, style);

function createCodeMap() {
    let codeMap = new Map();
    codeMap.set("500", "Internal server error");
    codeMap.set("501", "Not implemented");
    codeMap.set("502", "Bad gateway");
    codeMap.set("503", "Service unavailable");
    codeMap.set("504", "Gateway timeout");
    codeMap.set("505", "HTTP version not supported");
    codeMap.set("400", "Bad Request");
    codeMap.set("401", "Authorization required");
    codeMap.set("403", "Forbidden");
    codeMap.set("404", "Page Not Found");
    codeMap.set("405", "Method not allowed");
    codeMap.set("406", "Not acceptable (encoding)");
    codeMap.set("407", "Proxy authentication required");
    codeMap.set("408", "Request timed out");
    codeMap.set("409", "Conflicting request");
    codeMap.set("410", "Gone");
    codeMap.set("411", "Content length required");
    codeMap.set("412", "Precognition failed");
    codeMap.set("413", "Request entity too long");
    codeMap.set("414", "Request URI too long");
    codeMap.set("415", "Unsupported media type");
    return codeMap;
}

function getBrokeBot() {
    let clawTweenTime = 1;
    let rightClawRepeatDelay = 1;
    let leftClawRepeatDelay = 1.7;
    let bodySwayTime = 1;
    let bodySwayAmount = 5;
    let blinkRepeatTime = 2.2;
    let eyesMoveRepeatTime = 0.9;
    let bodyTO = "50px 92px";
    let eyesY = -2;

    return { run };

    function run(isHeadless: boolean) {
        if (!isHeadless) {
            eyesY = 0;
            bodyTO = "43px 160px";
        }
        animateBrokebot(isHeadless);
    }

    function animateBrokebot(isHeadless: boolean) {
        let rightInnerClawNode = document.querySelector("#rightInnerClaw");
        let rightOuterClawNode = document.querySelector("#rightOuterClaw");
        let leftInnerClawNode = document.querySelector("#leftInnerClaw");
        let leftOuterClawNode = document.querySelector("#leftOuterClaw");
        let upperBodyNode = document.querySelector("#upperBody");
        let eyesMoveNode = document.querySelector("#eyesMove");
        let eyesBlinkNode = document.querySelector("#eyesBlink");
        let leftArmNode = document.querySelector("#leftArm");
        let rightArmNode = document.querySelector("#rightLowerArm");
        let robotHeadNode = document.querySelector("#robotHead");

        setTimeout(function () {
            TweenMax.from(rightInnerClawNode, clawTweenTime, {
                rotation: 45,
                transformOrigin: "11px 15px",
                repeat: -1,
                repeatDelay: rightClawRepeatDelay
            });
            TweenMax.from(rightOuterClawNode, clawTweenTime, {
                rotation: -45,
                transformOrigin: "15px 15px",
                repeat: -1,
                repeatDelay: rightClawRepeatDelay
            });
        }, rightClawRepeatDelay * 1000);

        setTimeout(function () {
            TweenMax.from(leftInnerClawNode, clawTweenTime, {
                rotation: -45,
                transformOrigin: "15px 15px",
                repeat: -1,
                repeatDelay: leftClawRepeatDelay
            });
            TweenMax.from(leftOuterClawNode, clawTweenTime, {
                rotation: 45,
                transformOrigin: "11px 15px",
                repeat: -1,
                repeatDelay: leftClawRepeatDelay
            });
        }, leftClawRepeatDelay * 1000);

        // TweenMax.from(textNode, 2, {
        //     opacity: 0
        // });

        TweenMax.to(upperBodyNode, bodySwayTime, {
            rotationZ: -bodySwayAmount,
            transformOrigin: bodyTO,
            yoyo: true,
            repeat: -1,
            ease: Quad.easeInOut
        });

        TweenMax.to(leftArmNode, bodySwayTime, {
            delay: 0.3,
            rotationZ: bodySwayAmount,
            transformOrigin: "15px -11px",
            yoyo: true,
            repeat: -1,
            ease: Quad.easeInOut
        });

        TweenMax.to(rightArmNode, bodySwayTime, {
            delay: 0.5,
            rotationZ: bodySwayAmount,
            transformOrigin: "15px 0px",
            yoyo: true,
            repeat: -1,
            ease: Quad.easeInOut
        });

        TweenMax.to(eyesMoveNode, 0.05, {
            delay: eyesMoveRepeatTime,
            x: -2,
            y: eyesY,
            repeatDelay: eyesMoveRepeatTime,
            repeat: -1,
            yoyo: true
        });

        TweenMax.from(eyesBlinkNode, 0.3, {
            scaleY: 0.2,
            repeatDelay: blinkRepeatTime,
            repeat: -1,
            transformOrigin: "0px 6px"
        });

        if (!isHeadless) {
            TweenMax.from(robotHeadNode, bodySwayTime, {
                delay: bodySwayTime,
                rotationZ: bodySwayAmount * 1.5,
                transformOrigin: "65px 77px",
                yoyo: true,
                repeat: -1,
                ease: Quad.easeInOut
            });
        }
    }
}