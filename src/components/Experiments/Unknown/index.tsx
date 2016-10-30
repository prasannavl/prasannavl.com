import React from "react";
import { StatelessBase } from "../../Base";
import createStyled from "../../../modules/core/createStyled";
import { createErrorCodeMap } from "./ErrorCodeMap";
import { IHeadlessRendererState } from "../../modules/core/RendererState";

let svg = require("!raw!./bot.svg") as any;
let style = require("./bot.scss") as any;

interface RobotProps extends React.Props<any> {
    title?: string;
    documentTitle?: string;
    svgText?: string;
    error?: string;
    messageElement?: JSX.Element;
    extraMessageElement?: JSX.Element;
    className?: string;
}

interface RobotContent {
    title: string;
    documentTitle: string;
    svgText: string;
    messageElement: JSX.Element;
    extraMessageElement: JSX.Element;
    className: string;
}

export class Robot extends StatelessBase<RobotProps> {
    private _animation: TimelineMax;

    getContent() {
        let { error, svgText, title, messageElement, extraMessageElement, documentTitle } = this.props;
        if (error) {
            if (error === "-1") {
                return createContent(this.props, "Construction Zone", "o-o", getConstructionMessageElement);
            } else if (error === "0") {
                return createContent(this.props, "Network Offline", "0x0", getOfflineMessageElement);
            } else {
                return createContent(this.props, createErrorCodeMap().get(error), error, getErrorMessageElement);
            }
        }
        return createContent(this.props);
    }

    startAnimation() {
        this.killAnimation();
        this._animation = getBrokeBot().createAnimation(false);
        this._animation.play();
    }

    killAnimation() {
        if (this._animation) {
            this._animation.kill();
            this._animation = null;
        }
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentWillUpdate(nextProps: any, nextState: any) {
        this.killAnimation();
    }

    componentDidUpdate() {
        this.startAnimation();
    }

    componentWillUnmount() {
        this.killAnimation();
    }

    render() {
        if (!__DOM__) {
            const rendererState = this.context.services
                .rendererStateProvider() as IHeadlessRendererState;
            rendererState.staticViewCode = this.props.error;
        }
        let content = this.getContent();
        this.context.services.title.set(content.documentTitle);
        let svgContainerProps: any;
        if (content.className != null) svgContainerProps = { className: content.className };
        let svgWithText = svg.replace(/(<text id="robotTextNode".*?>)(<\/text>)/, "$1" + content.svgText + "$2");
        return <div className={style.root}>
            <div className="top-half">
                <div {...svgContainerProps} dangerouslySetInnerHTML={{ __html: svgWithText }}/>
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
    return (<div><p>
         Hi. I haven't been able to make time for this yet.<br/>
         Please feel free to drop me an email in the meantime.</p></div>);
}

function getOfflineMessageElement() {
    return (<div>
            <p>
            Please make sure your internet is working. <br/>
            If you think this is a mistake, try refreshing the page.<br/>
            </p>
            <p className="note">May the force guide you.</p>
            </div>);
}

function getErrorMessageElement() {
    return (<div>
            <p>
            This is not the page you're looking for. <br/>
            If you think this is a mistake, try refreshing the page.<br/>
            </p>
            <p className="note">May the force guide you.</p>
            </div>);
}

export function createContent(props: RobotProps,
                defaultTitle?: string,
                defaultSvgText?: string,
                defaultMessageElementFactory?: () => JSX.Element) {
    let { svgText, title, messageElement, extraMessageElement, documentTitle, className } = props;
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
        className
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

    return { createAnimation };

    function createAnimation(isHeadless: boolean) {
        if (!isHeadless) {
            eyesY = 0;
            bodyTO = "43px 160px";
        }
        return createTimeline(isHeadless);
    }

    function createTimeline(isHeadless: boolean) {
        let rightInnerClawNode = document.querySelector("#rightInnerClaw");
        let rightOuterClawNode = document.querySelector("#rightOuterClaw");
        let leftInnerClawNode = document.querySelector("#leftInnerClaw");
        let leftOuterClawNode = document.querySelector("#leftOuterClaw");
        let upperBodyNode = document.querySelector("#upperBody");
        let leftArmNode = document.querySelector("#leftArm");

        let eyesMoveNode = document.querySelector("#eyesMove");
        let eyesBlinkNode = document.querySelector("#eyesBlink");
        let rightArmNode = document.querySelector("#rightLowerArm");
        let robotHeadNode = document.querySelector("#robotHead");
        let textNode = document.querySelector("#robotTextNode");

        let t = new TimelineMax({ paused: true });

        t.from(textNode, 2, {
            opacity: 0
        });

        t.from(rightInnerClawNode, clawTweenTime, {
            rotation: 45,
            transformOrigin: "11px 15px",
            repeat: -1,
            repeatDelay: rightClawRepeatDelay
        }, rightClawRepeatDelay);

        t.from(rightOuterClawNode, clawTweenTime, {
            rotation: -45,
            transformOrigin: "15px 15px",
            repeat: -1,
            repeatDelay: rightClawRepeatDelay
        }, rightClawRepeatDelay);

        t.from(leftInnerClawNode, clawTweenTime, {
            rotation: -45,
            transformOrigin: "15px 15px",
            repeat: -1,
            repeatDelay: leftClawRepeatDelay
        }, leftClawRepeatDelay);

        t.from(leftOuterClawNode, clawTweenTime, {
            rotation: 45,
            transformOrigin: "11px 15px",
            repeat: -1,
            repeatDelay: leftClawRepeatDelay
        }, leftClawRepeatDelay);

        t.to(upperBodyNode, bodySwayTime, {
            rotationZ: -bodySwayAmount,
            transformOrigin: bodyTO,
            yoyo: true,
            repeat: -1,
            ease: Quad.easeInOut
        }, 0);

        t.to(leftArmNode, bodySwayTime, {
            delay: 0.3,
            rotationZ: bodySwayAmount,
            transformOrigin: "15px -11px",
            yoyo: true,
            repeat: -1,
            ease: Quad.easeInOut
        }, 0);

        t.to(rightArmNode, bodySwayTime, {
            delay: 0.5,
            rotationZ: bodySwayAmount,
            transformOrigin: "15px 0px",
            yoyo: true,
            repeat: -1,
            ease: Quad.easeInOut
        }, 0);

        t.to(eyesMoveNode, 0.05, {
            delay: eyesMoveRepeatTime,
            x: -2,
            y: eyesY,
            repeatDelay: eyesMoveRepeatTime,
            repeat: -1,
            yoyo: true
        }, 0);

        t.from(eyesBlinkNode, 0.3, {
            scaleY: 0.2,
            repeatDelay: blinkRepeatTime,
            repeat: -1,
            transformOrigin: "0px 6px"
        }, 0);

        if (!isHeadless) {
            t.from(robotHeadNode, bodySwayTime, {
                delay: bodySwayTime,
                rotationZ: bodySwayAmount * 1.5,
                transformOrigin: "65px 77px",
                yoyo: true,
                repeat: -1,
                ease: Quad.easeInOut
            }, 0);
        }

        return t;
    }
}