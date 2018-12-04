import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });
if (Meteor.isServer) return; //client-only

if (Meteor.isClient) {
  import DailyReport from './DailyReport.jsx';

  describe('DailyReport', () => {
    describe('DailyReport', () => {
      const dailyReport = mount(
        <Router>
          <DailyReport />
        </Router>
      );
      it('Should render daily report', () => {
        chai.expect(dailyReport.text()).to.have.string('Daily report');
        chai
          .expect(dailyReport.text())
          .to.have.string('There are no consume reports on this day.');
        chai.expect(dailyReport.find('h4')).to.have.length(1);
        chai.expect(dailyReport.find('.col-12')).to.have.length(3);
        chai
          .expect(dailyReport.find('.vertical-align-custom'))
          .to.have.length(1);
      });
    });
  });
}
