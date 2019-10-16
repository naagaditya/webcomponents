import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from "./components/home/index";
import React from "react";
import Sidebar from "./components/sidebar";

const About = () => <div>about</div>
const AboutMe = () => <div>about me</div>

const AppRouter = () => {
  return (
    <Router>
      <div>
        <div>
          <Sidebar/>
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about/me" component={AboutMe} />
          <Route path="/about" component={About} />
        </Switch>
      </div>
    </Router>
  );
}

export default AppRouter;

