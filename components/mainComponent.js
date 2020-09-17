import React, { Component } from "react";
import Projects from "./projectsComponent";
import { PROJECTSLIST } from "../shared/projects";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsList: PROJECTSLIST,
    };
  }

  render() {
    return (
      <Projects projectsList={this.state.projectsList} />
    );
  }
}

export default Main;
