import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });
if (Meteor.isServer) return; //client-only

if (Meteor.isClient) {
  import DetailPatientNutritionist from './DetailPatientNutritionist.jsx';

  describe('DetailPatientNutritionist', () => {

    const paciente = {
      nombre: 'Paciente',
      identificacion: '12345',
      correo: 'correo@email.com',
      celular: '3334445555',
      fechaRegistro: '12/01/2018',
      medicamentos: []
    };
    const id = 12345;

    describe('DetailPatientNutritionist', () => {
      let detailPatient = mount(
        <Router>
        <DetailPatientNutritionist
        paciente={paciente}
        match={{ params: { id: id } }}
        history={[]}
        />
        </Router>
        );      
      it('Should render for a patient of an nutritionist', () => {
        chai
        .expect(detailPatient.find('#medicamentosPaciente'))
        .to.have.length(1);
        chai.expect(detailPatient.find('.col-12')).to.have.length(6);
        chai.expect(detailPatient.find('.nav-pills')).to.have.length(1);
        chai.expect(detailPatient.find('.nav-item')).to.have.length(3);
        chai.expect(detailPatient.text()).to.have.string('Consumed food');
        chai.expect(detailPatient.text()).to.have.string('Assigned medicine');
        chai.expect(detailPatient.text()).to.have.string('Daily report');
        chai.expect(detailPatient.find('.list-group')).to.have.length(1);
        chai
        .expect(detailPatient.text())
        .to.have.string('There are no assigned medicines');
         chai.expect(detailPatient.find('.tab-content')).to.have.length(1);
         chai.expect(detailPatient.find('.tab-pane')).to.have.length(3);
      });
    });
  });
}


