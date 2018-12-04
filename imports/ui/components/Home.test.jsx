import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Home from './Home.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Home', () => {
  if (Meteor.isServer) return; //client-only
  describe('Home', () => {
    it('Should render the normal screen', () => {
      let home = mount(<Home.WrappedComponent />);

      chai.expect(home.find('h1')).to.have.length(1);
      chai.expect(home.find('h5')).to.have.length(1);
      chai.expect(home.find('h6')).to.have.length(2);
      chai.expect(home.find('img')).to.have.length(1);
      chai.expect(home.find('span')).to.have.length(5);
      chai.expect(home.find('i')).to.have.length(6);
    });
  });
});
