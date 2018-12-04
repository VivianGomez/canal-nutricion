import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Footer from './Footer.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Footer', () => {
  if (Meteor.isServer) return; //client-only
  describe('Footer', () => {
    it('Should render the basic footer', () => {
      let footer = mount(<Footer />);

      chai.expect(footer.find('footer')).to.have.length(1);
      chai.expect(footer.find('div')).to.have.length(4);
      chai.expect(footer.find('p')).to.have.length(1);
    });
  });
});
