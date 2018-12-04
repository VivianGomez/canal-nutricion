import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });
if (Meteor.isServer) return; //client-only

if (Meteor.isClient) {
  import ConsumedFoodForm from './ConsumedFoodForm.jsx';

  describe('ConsumedFoodForm', () => {
    describe('ConsumedFoodForm', () => {
      const consumedFoodForm = mount(<ConsumedFoodForm />);
      it('Should render consumed food form', () => {
        chai.expect(consumedFoodForm.find('.modal')).to.have.length(1);
        chai.expect(consumedFoodForm.find('button')).to.have.length(3);
        chai.expect(consumedFoodForm.find('h5')).to.have.length(1);
        chai.expect(consumedFoodForm.find('label')).to.have.length(4);
        chai.expect(consumedFoodForm.find('input')).to.have.length(6);
        chai.expect(consumedFoodForm.find('select')).to.have.length(1);
      });
    });
  });
}
