import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

class Sidebar extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <div>
      <ul>
        <li><Link to="/">home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/about/me">About me</Link></li>
      </ul>
    </div>
  }
}

export default Sidebar
