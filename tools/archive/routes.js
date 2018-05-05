import React from 'react';
import ReactRouter, { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from "./App";
import preRenderData from "./prerender-data";

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
        <li>
          <Link to="/app">App</Link>
        </li>
      </ul>

      <hr />
      <Route exact path="/" component={Home} />
      <Route exact path="/app" component={App} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match } = nextProps;
    const postId = match.params.topicId.length;
    if (postId !== prevState.currentId)
      return { value: null };
    return null;
  }

  fetch() {
    const { match } = this.props;
    const postId = match.params.topicId.length;
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setData({ value: JSON.stringify(json), currentId: postId });
      });
  }

  setData(data) {
    if (preRenderData.dataSinkEnabled) {
      preRenderData.set("topic", data);
    }
    this.setState(data);
  }

  componentDidMount() {
    if (preRenderData.dataSourceEnabled) {
      this.setData(preRenderData.get("topic"));
    } else {
      this.fetch();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value === null) {
      this.fetch();
    }
  }

  render() {
    return this.state.value ? (
      <div>
        <h3>{this.props.match.params.topicId}</h3>
        <div>
          {this.state.value}
        </div>
      </div>
    ) : (<div>Loading...</div>);
  }
}

export default BasicExample;