import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Medicine from './Medicine.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Medicine', () => {
  const medicine = {
    medicamento: 'Dolex',
    posologia: '1 pill',
    frecuencia: 'Each 12 hours',
    cantidad: 13,
    via: 'Oral',
    fechaInicio: '02/12/2018',
    estado: 'Activo'
  };
  const id = '12345678';
  const doctor = true;

  if (Meteor.isServer) return; //client-only
  describe('Medicine - Patient', () => {
    const medicineD = shallow(
      <Medicine
        history={[]}
        medicamento={medicine}
        identificacionP={id}
        usuario={null}
        doctor={!doctor}
      />
    );
    it('Should render for patient view', () => {
      chai.expect(medicineD.find('.list-group-item')).to.have.length(1);
      chai.expect(medicineD.find('.row')).to.have.length(1);
      chai.expect(medicineD.find('.fa-tablets')).to.have.length(1);
      chai.expect(medicineD.find('button')).to.have.length(0);
    });
    it('Should contain the medicine information', () => {
      chai
        .expect(medicineD.text())
        .to.have.string(
          medicine.medicamento &&
            medicine.posologia &&
            medicine.frecuencia &&
            medicine.frecuencia &&
            medicine.cantidad &&
            medicine.via &&
            medicine.fechaInicio &&
            medicine.estado
        );
    });
  });

  describe('Medicine - Doctor', () => {
    const medicineD = shallow(
      <Medicine
        history={[]}
        medicamento={medicine}
        identificacionP={id}
        usuario={null}
        doctor={doctor}
      />
    );
    it('Should render for doctor view', () => {
      chai.expect(medicineD.find('.list-group-item')).to.have.length(1);
      chai.expect(medicineD.find('.row')).to.have.length(1);
      chai.expect(medicineD.find('.fa-tablets')).to.have.length(1);
      chai.expect(medicineD.find('button')).to.have.length(2);
    });
    it('Should contain the medicine information', () => {
      chai
        .expect(medicineD.text())
        .to.have.string(
          medicine.medicamento &&
            medicine.posologia &&
            medicine.frecuencia &&
            medicine.frecuencia &&
            medicine.cantidad &&
            medicine.via &&
            medicine.fechaInicio &&
            medicine.estado
        );
    });
  });
});
