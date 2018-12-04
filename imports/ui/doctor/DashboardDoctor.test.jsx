import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import DashboardDoctor from './DashboardDoctor.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('DashboardDoctor', () => {
  const pacientes = [
    {
      _id: '1234435',
      nombre: 'Paciente',
      identificacion: '12345',
      correo: 'correo@email.com',
      celular: '3334445555'
    }
  ];

  if (Meteor.isServer) return; //client-only
  describe('DashboardDoctor - One patient', () => {
    const dashboardDoctor = mount(
      <Router>
        <DashboardDoctor pacientes={pacientes} history={[]} />
      </Router>
    );

    dashboardDoctor.setState({
      doctor: true
    });

    it('Should render the patients', () => {
      dashboardDoctor.update();
      chai
        .expect(dashboardDoctor.find('#pacientes-doctor'))
        .to.have.length(1);
      chai.expect(dashboardDoctor.find('.list-group')).to.have.length(1);
      chai.expect(dashboardDoctor.text()).to.have.string('My patients');
    });
  });
});
