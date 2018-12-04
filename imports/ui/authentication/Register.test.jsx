import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Register from './Register.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Register', () => {
  if (Meteor.isServer) return; //client-only
  describe('Register', () => {
    it('Should render the basic register', () => {
      const register = mount(<Register.WrappedComponent history={[]} />);

      chai.expect(register.find('label')).to.have.length(6);
      chai.expect(register.find('button')).to.have.length(1);
      chai.expect(register.find('input')).to.have.length(5);
      chai.expect(register.find('select')).to.have.length(1);
    });
  });
});
