import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Food from './Food.jsx';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Food', () => {
  const alimento = {
    alimento: 'Burger',
    idAlimento: 123,
    porcionConsumidaGramos: 124,
    categoria: 'Fast food'
  };
  const nutricionista = true;
  const identificacion = '12345678';

  if (Meteor.isServer) return; //client-only
  describe('Food - Nutritionist', () => {
    const food = shallow(
      <Food.WrappedComponent
        alimento={alimento}
        nutricionista={nutricionista}
        identificacion={identificacion}
      />
    );
    it('Should render for nutritionist view', () => {
      chai.expect(food.find('.list-group-item')).to.have.length(1);
      chai.expect(food.find('.col-md-8')).to.have.length(1);
      chai.expect(food.find('.col-md-4')).to.have.length(1);
      chai.expect(food.find('button')).to.have.length(1);
      chai.expect(food.find('.fa-info-circle')).to.have.length(1);
      chai.expect(food.find('.fa-trash-alt')).to.have.length(0);
    });
    it('Should contain the food information', () => {
      chai
        .expect(food.find('.col-md-8').text())
        .to.have.string(alimento.alimento && alimento.porcionConsumidaGramos);
      chai
        .expect(food.find('.col-md-4').text())
        .to.have.string(alimento.categoria);
    });
  });

  describe('Food - Patient', () => {
    const food = shallow(
      <Food.WrappedComponent
        alimento={alimento}
        nutricionista={!nutricionista}
        identificacion={identificacion}
      />
    );
    it('Should render for patient view', () => {
      chai.expect(food.find('.list-group-item')).to.have.length(1);
      chai.expect(food.find('.col-md-8')).to.have.length(1);
      chai.expect(food.find('.col-md-4')).to.have.length(1);
      chai.expect(food.find('button')).to.have.length(2);
      chai.expect(food.find('.fa-info-circle')).to.have.length(1);
      chai.expect(food.find('.fa-trash-alt')).to.have.length(1);
    });
    it('Should contain the food information', () => {
      chai.expect(food.find('.list-group-item')).to.have.length(1);
      chai
        .expect(food.find('.col-md-8').text())
        .to.have.string(alimento.alimento && alimento.porcionConsumidaGramos);
      chai
        .expect(food.find('.col-md-4').text())
        .to.have.string(alimento.categoria);
    });
  });
});
