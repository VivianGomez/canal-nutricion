import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import InformationPatient from './InformationPatient.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('InformationPatient', () => {
  const paciente = {
    nombre: 'Paciente',
    identificacion: '12345',
    correo: 'correo@email.com',
    celular: '3334445555',
    fechaRegistro: '12/01/2018',
    medicamentos: []
  };

  if (Meteor.isServer) return; //client-only
  describe('InformationPatient - One patient', () => {
    const informationPatient = mount(
      <Router>
        <InformationPatient
          paciente={paciente}
          nombre={paciente.nombre}
          identificacion={paciente.identificacion}
          correo={paciente.correo}
          celular={paciente.celular}
          history={[]}
        />
      </Router>
    );

    it('Should show information', () => {
      chai
        .expect(informationPatient.find('.list-group-item'))
        .to.have.length(1);
      chai.expect(informationPatient.find('p')).to.have.length(4);
      chai.expect(informationPatient.text()).to.have.string(paciente.nombre);
      chai
        .expect(informationPatient.text())
        .to.have.string(paciente.identificacion);
      chai.expect(informationPatient.text()).to.have.string(paciente.correo);
      chai.expect(informationPatient.text()).to.have.string(paciente.celular);
    });
  });
});
