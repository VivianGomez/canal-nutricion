import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import DashboardNutritionist from './DashboardNutritionist.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('DashboardNutritionist', () => {
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
  describe('DashboardNutritionist', () => {
    const dashboardNutritionist = mount(
      <Router>
        <DashboardNutritionist pacientes={pacientes} history={[]} />
      </Router>
    );

    dashboardNutritionist.setState({
      nutricionista: true
    });

    it('Should render the patients', () => {
      dashboardNutritionist.update();
      chai
        .expect(dashboardNutritionist.find('#pacientes-nutricionista'))
        .to.have.length(1);
      chai.expect(dashboardNutritionist.find('.col-12')).to.have.length(3);
      chai.expect(dashboardNutritionist.find('.list-group')).to.have.length(1);
      chai.expect(dashboardNutritionist.find('h3')).to.have.length(1);
      chai.expect(dashboardNutritionist.text()).to.have.string('My patients');
    });
  });
});
