import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter, Link } from 'react-router-dom';
import Login from './Login.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {    };
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md foohealli-navbar bg-light py-md-2">
          <div className="container">
            <Link to={'/'} style={{ textDecoration: 'none' }}>
                    Foohealli
            </Link>
            <button
              className="navbar-toggler custom-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div id="navbarNavDropdown" className="navbar-collapse collapse">
              <ul className="navbar-nav mx-auto" />
            </div>
          </div>
        </nav>
        <Login />
      </div>
    );
  }
}

export default withRouter(Navbar);
