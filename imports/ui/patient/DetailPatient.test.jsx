import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import DetailPatient from './DetailPatient.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('DetailPatient', () => {
  const paciente = {
    nombre: 'Paciente',
    identificacion: '12345',
    correo: 'correo@email.com',
    celular: '3334445555',
    fechaRegistro: '12/01/2018',
    medicamentos: []
  };
  const id = 12345;
  if (Meteor.isServer) return; //client-only
  describe('DetailPatient - Patient', () => {
    let detailPatient = mount(
      <Router>
        <DetailPatient
          paciente={paciente}
          match={{ params: { id: id } }}
          history={[]}
        />
      </Router>
    );

    it('Should render for a patient', () => {
      chai
        .expect(detailPatient.find('#medicamentosPaciente'))
        .to.have.length(1);
      chai.expect(detailPatient.find('.col-12')).to.have.length(3);
      chai.expect(detailPatient.find('.list-group')).to.have.length(1);
      chai.expect(detailPatient.text()).to.have.string('Assigned medicines');
      chai
        .expect(detailPatient.text())
        .to.have.string('There are no assigned medicines');
    });
  });
});
