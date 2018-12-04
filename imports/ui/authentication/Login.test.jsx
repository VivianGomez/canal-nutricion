import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Login from './Login.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Login', () => {
  if (Meteor.isServer) return; //client-only
  describe('Login', () => {
    it('Should render the basic login - Patient', () => {
      let login = mount(<Login.WrappedComponent history={[]} />);
      chai.expect(login.text()).to.have.string('Welcome back!');
      chai
        .expect(login.text())
        .to.have.string('Email' && 'Password' && 'Register');
      chai.expect(login.find('label')).to.have.length(2);
      chai.expect(login.find('button')).to.have.length(4);
      chai.assert.equal(login.state('rol'), 'Patient');
      chai.expect(login.find('.fa-user-md')).to.have.length(1);
      chai.expect(login.find('.fa-diagnoses')).to.have.length(1);
    });

    it('Should render for a Doctor to login', () => {
      let login = mount(<Login.WrappedComponent history={[]} />);
      login.setState({
        rol: 'Doctor'
      });

      login.update();
      chai.assert.equal(login.state('rol'), 'Doctor');
      chai.expect(login.find('.fa-user')).to.have.length(1);
      chai.expect(login.find('.fa-diagnoses')).to.have.length(1);
    });

    it('Should render for a Nutritionist to login', () => {
      let login = mount(<Login.WrappedComponent history={[]} />);

      login.setState({
        rol: 'Nutritionist'
      });

      login.update();
      chai.assert.equal(login.state('rol'), 'Nutritionist');
      chai.expect(login.find('.fa-user')).to.have.length(1);
      chai.expect(login.find('.fa-user-md')).to.have.length(1);
    });
  });
});
