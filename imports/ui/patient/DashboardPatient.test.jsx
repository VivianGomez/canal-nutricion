import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import DashboardPatient from './DashboardPatient.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('DashboardPatient', () => {
  if (Meteor.isServer) return; //client-only
  describe('Dashboard patient', () => {
    const dashboardPatient = mount(
      <Router>
        <DashboardPatient history={[]} />
      </Router>
    );

    it('Should render the dashboard patient', () => {
      chai.expect(dashboardPatient.find('button')).to.have.length(1);
      chai.expect(dashboardPatient.find('h1')).to.have.length(1);
      chai.expect(dashboardPatient.find('img')).to.have.length(2);
      chai.expect(dashboardPatient.find('.card')).to.have.length(2);
      chai.expect(dashboardPatient.text()).to.have.string('Welcome!');
    });
  });
});
