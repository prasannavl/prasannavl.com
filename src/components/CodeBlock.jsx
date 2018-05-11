import React from "react";
import Worker from "../modules/prism.worker";

class CodeBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
        }
        this.workerState = null;
        this.workerInstanceId = null;
        this.worker = null;
    }

    highlight(props) {
        let { children, lang } = props;
        if (lang) {
            children = this.trimChildString(children);
            this.worker.highlight({
                code: children.toString(),
                lang,
            }).then(code => this.setState({ code }))
                .catch(err => console.log(err));
        }
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
        let { children: code, lang, ...rest } = this.props;
        if (this.state.code) {
            code = this.state.code;
        } else {
            code = trimChildString(code);
        }
        return <pre {...rest}><code dangerouslySetInnerHTML={{ __html: code }}/></pre>;
    }
}

export default CodeBlock;