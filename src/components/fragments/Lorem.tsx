import * as React from "react";
import * as _ from "lodash";

interface LoremProps extends React.Props<any> {
    count: number;
}

function getRestProps(prop: LoremProps) {
    return _.omit(prop, "count");
}

export default class LoremSegment extends React.Component<LoremProps, any> {

    render() {
        const rest = getRestProps(this.props);
        const lorem = (
            <div>
                <p>Incididunt nostrud quis enim qui.Magna labore mollit tempor voluptate elit aute tempor cupidatat cillum eiusmod dolore.Minim culpa nulla ipsum tempor ipsum incididunt Lorem esse sit incididunt.Ipsum id ut tempor est dolor.Excepteur dolore veniam anim laboris sunt ipsum ut nostrud irure proident aliqua minim.</p>
                <p>Occaecat sit quis sit amet pariatur nisi ad eu irure velit nisi pariatur occaecat.Magna aliqua ut irure dolore cillum pariatur laborum minim ipsum.Fugiat exercitation et esse nulla aute fugiat aliqua veniam.Aute dolore occaecat sit velit quis labore ullamco.Eiusmod cillum eiusmod culpa officia aute aliqua.Laboris culpa ut in et.Officia id esse ipsum aute et.</p>
                <p>Voluptate magna magna eiusmod proident elit excepteur consequat excepteur aliquip.</p>
            </div>);
        return (<div {...rest}>{_.range(this.props.count).map(x => lorem) }</div>);
    }
}

export class LoremLine extends React.Component<LoremProps, any> {

    render() {
        const rest = getRestProps(this.props);
        const lorem = (
            <span>
                Voluptate magna magna eiusmod proident elit excepteur consequat excepteur aliquip.
            </span>);
        return (<div {...rest}>{_.range(this.props.count).map(x => lorem) }</div>);
    }
}

export class LoremParagraph extends React.Component<LoremProps, any> {

    render() {
        const rest = getRestProps(this.props);
        const lorem = (
            <p>Occaecat sit quis sit amet pariatur nisi ad eu irure velit nisi pariatur occaecat.Magna aliqua ut irure dolore cillum pariatur laborum minim ipsum.Fugiat exercitation et esse nulla aute fugiat aliqua veniam.Aute dolore occaecat sit velit quis labore ullamco.Eiusmod cillum eiusmod culpa officia aute aliqua.Laboris culpa ut in et.Officia id esse ipsum aute et.</p>
            );
        return (<div {...rest}>{_.range(this.props.count).map(x => lorem) }</div>);
    }
}
