import React from "react";
import _ from "lodash";

export interface LoremProps extends React.Props<any> {
    count?: number;
}

function getRestProps(prop: LoremProps) {
    return _.omit(prop, "count");
}

export class LoremSegment extends React.Component<LoremProps, any> {
    render() {
        const rest = getRestProps(this.props);
        const lorem = (key: any) =>
            <div key={key}>
                <p>Incididunt nostrud quis enim qui.Magna labore mollit tempor voluptate elit aute tempor cupidatat cillum eiusmod dolore.Minim culpa nulla ipsum tempor ipsum incididunt Lorem esse sit incididunt.Ipsum id ut tempor est dolor.Excepteur dolore veniam anim laboris sunt ipsum ut nostrud irure proident aliqua minim.</p>
                <p>Occaecat sit quis sit amet pariatur nisi ad eu irure velit nisi pariatur occaecat.Magna aliqua ut irure dolore cillum pariatur laborum minim ipsum.Fugiat exercitation et esse nulla aute fugiat aliqua veniam.Aute dolore occaecat sit velit quis labore ullamco.Eiusmod cillum eiusmod culpa officia aute aliqua.Laboris culpa ut in et.Officia id esse ipsum aute et.</p>
                <p>Voluptate magna magna eiusmod proident elit excepteur consequat excepteur aliquip.</p>
            </div>;
        return (<div {...rest}>{_.range(this.props.count || 1).map(x => lorem(x)) }</div>);
    }
}

export class LoremLine extends React.Component<LoremProps, any> {

    render() {
        const rest = getRestProps(this.props);
        const lorem = (key: any) =>
            <span key={key}>
                Voluptate magna magna eiusmod proident elit excepteur consequat excepteur aliquip.
            </span>;
        return (<div {...rest}>{_.range(this.props.count || 1).map(x => lorem(x)) }</div>);
    }
}

export class LoremParagraph extends React.Component<LoremProps, any> {

    render() {
        const rest = getRestProps(this.props);
        const lorem = (key: any) =>
            <p key={key}>Occaecat sit quis sit amet pariatur nisi ad eu irure velit nisi pariatur occaecat.Magna aliqua ut irure dolore cillum pariatur laborum minim ipsum.Fugiat exercitation et esse nulla aute fugiat aliqua veniam.Aute dolore occaecat sit velit quis labore ullamco.Eiusmod cillum eiusmod culpa officia aute aliqua.Laboris culpa ut in et.Officia id esse ipsum aute et.</p>;
        return (<div {...rest}>{_.range(this.props.count || 1).map(x => lorem(x)) }</div>);
    }
}

export default LoremSegment;