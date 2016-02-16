import React from "react";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  
  render() {
      return this.props.children;
  }
}