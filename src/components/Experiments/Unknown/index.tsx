import React from "react";
import { StatelessBase } from "../../Base";
import createStyled from "../../../modules/core/createStyled";
import { createErrorCodeMap } from "./ErrorCodeMap";

let svg = require("!raw!./bot.svg") as any;
let style = require("./bot.scss") as any;

interface RobotProps extends React.Props<any> {
    title?: string;
    documentTitle?: string;
    svgText?: string;
    error?: string;
    messageElement?: JSX.Element;
    extraMessageElement?: JSX.Element;
}

interface RobotContent {
    title: string;
    documentTitle: string;
    svgText: string;
    messageElement: JSX.Element;
    extraMessageElement: JSX.Element;
}

export class Robot extends StatelessBase<RobotProps> {
    getContent() {
        let { error, svgText, title, messageElement, extraMessageElement, documentTitle } = this.props;
        if (error) {
            if (error === "000") {
                return createContent(this.props, "Construction Zone", "o-o", getConstructionMessageElement);
            } else {
                return createContent(this.props, createErrorCodeMap().get(error), error, getErrorMessageElement);
            }
        }
        return createContent(this.props);
    }

    componentDidMount() {
        getBrokeBot().run(false);
    }

    componentDidUpdate() {
        getBrokeBot().run(false);
    }

    render() {
        let content = this.getContent();
        this.context.services.title.set(content.documentTitle);
        let contextualSvg = svg.replace(/(<text id="robotTextNode".*?>)(<\/text>)/, "$1" + content.svgText + "$2");
        return <div className={style.root}>
            <div className="top-half">
                <div dangerouslySetInnerHTML={{ __html: contextualSvg }}/>
            </div>
            <div className="bottom-half">
                <h2>{content.title && content.title.toLocaleLowerCase()}</h2>
                {content.messageElement}
                {content.extraMessageElement}
            </div>
        </div>;
    }
}

export default createStyled(Robot, style);

function getConstructionMessageElement() {
    return (<p>
        Hello there. This area is still under construction.
        <br/>Please check back later.</p>);
}

function getErrorMessageElement() {
    return (<div>
            <p>
            This is not the page you're looking for. <br/>
            If you have a bad feeling about this, let the force guide you.<sup>*</sup><br/>
            </p>
            <p className="note">[*] : Look to the sidebar on the left.</p>
            </div>);
}

export function createContent(props: RobotProps,
                defaultTitle?: string,
                defaultSvgText?: string,
                defaultMessageElementFactory?: () => JSX.Element) {
    let { svgText, title, messageElement, extraMessageElement, documentTitle } = props;
    if (svgText == null) {
        svgText = defaultSvgText;
    }
    if (title == null) {
        title = defaultTitle;
    }
    if (messageElement === undefined) {
        messageElement = defaultMessageElementFactory && defaultMessageElementFactory();
    }
    if (documentTitle == null) {
        documentTitle = title;
    }
    return {
        title,
        documentTitle,
        svgText,
        messageElement,
        extraMessageElement,
    };
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
        if (__DOM__) {
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
            let textNode = document.querySelector("#robotTextNode");
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

            TweenMax.from(textNode, 2, {
                opacity: 0
            });

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
}