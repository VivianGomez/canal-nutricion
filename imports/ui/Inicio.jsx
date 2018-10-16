import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';

class Inicio extends Component {
  constructor(props) {
    super(props);

    this.state = {    };
  }

  render() {
    return (
      <div>
        Inicio
      </div>
    );
  }
}
export default withRouter(Inicio);

