import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({ adapter: new Adapter() });
if (Meteor.isServer) return; //client-only

if (Meteor.isClient) {
  import Navbar from './Navbar.jsx';

  describe('Navbar', () => {
    describe('Navbar', () => {
      it('Should render navbar', () => {
        let navbar = shallow(<Navbar />);
      });
    });
  });
}
