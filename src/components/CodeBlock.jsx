import React from "react";
import Worker from "../modules/prism.worker";
import cx from "classnames";

class CodeBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
        }
        this.workerState = null;
        this.workerTask = null;
        this.worker = null;
    }

    highlight(props) {
        let { children, lang } = props;
        if (!lang) return;
        children = this.trimChildString(children);
        let task = this.workerTask = this.worker.highlight({
            code: children.toString(),
            lang,
        }).then(code => {
            if (task === this.workerTask) {
                this.setState({ code });
            }
        }).catch(err => console.log(err));
    }

    componentWillMount() {
        if (!window.highlightWorkerState) {
            window.highlightWorkerState = { worker: new Worker(), ref: 0 };
        }
        this.workerState = window.highlightWorkerState;
        this.workerState.ref++;
        this.worker = this.workerState.worker;
        this.highlight(this.props);
    }

    componentDidUpdate(nextProps) {
        if (this.props != nextProps)
            this.highlight(nextProps);
    }

    componentWillUnmount() {
        this.workerState.ref--;
        if (this.workerState.ref === 0) {
            this.worker.terminate();
            window.highlightWorkerState = null;
        }
        this.workerTask = null;
        this.workerState = null;
        this.worker = null;
    }

    trimChildString(str) {
        if (typeof str === "string" && str.startsWith("\n")) {
            return str.trim();
        }
        return str;
    }

    render() {
        let { children: code, lang, className, ...rest } = this.props;
        if (this.state.code) {
            code = this.state.code;
        } else {
            code = this.trimChildString(code);
        }
        // If it's just one line make sure an additional class is applied.
        let singleLine = code.indexOf("\n") === -1;
        let finalClassName = cx(className, { "single-line": singleLine });
        let classProps;
        if (finalClassName) classProps = { className: finalClassName }
        else classProps = {};
        return <pre {...rest} {...classProps}><code dangerouslySetInnerHTML={{ __html: code }} /></pre>;
    }
}

export default CodeBlock;