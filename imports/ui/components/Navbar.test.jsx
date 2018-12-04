import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });
if (Meteor.isServer) return; //client-only

if (Meteor.isClient) {
  import Navbar from './Navbar.jsx';

  describe('Navbar', () => {
    describe('Navbar', () => {
      const navbar = mount(
        <Router>
          <Navbar />
        </Router>
      );
      it('Should render navbar', () => {
        chai.expect(navbar.find('nav')).to.have.length(1);
        chai.expect(navbar.find('.navbar')).to.have.length(1);
        chai.expect(navbar.find('.navbar-brand')).to.have.length(1);
        chai.expect(navbar.find('.navbar-toggler-icon')).to.have.length(1);
        chai.expect(navbar.find('#navbarNavDropdown')).to.have.length(1);
        chai.expect(navbar.find('#botonParaIniciarSesion')).to.have.length(1);
        chai.expect(navbar.find('#botonParaRegistrarse')).to.have.length(1);
      });
    });
  });
}
