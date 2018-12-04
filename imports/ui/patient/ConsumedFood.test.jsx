import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });
if (Meteor.isServer) return; //client-only

if (Meteor.isClient) {
  import ConsumedFood from './ConsumedFood.jsx';

  describe('ConsumedFood', () => {
    describe('ConsumedFood', () => {
      const consumedFood = mount(
        <Router>
          <ConsumedFood />
        </Router>
      );
      it('Should render consumed food', () => {
        chai.expect(consumedFood.find('.row')).to.have.length(1);
        chai.expect(consumedFood.find('button')).to.have.length(5);
        chai.expect(consumedFood.find('h2')).to.have.length(1);
        chai
          .expect(consumedFood.find('#botonActualizarConsumo'))
          .to.have.length(1);
        chai
          .expect(consumedFood.find('#botonAgregarConsumo'))
          .to.have.length(1);
      });
    });
  });
}
