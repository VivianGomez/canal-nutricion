import React from 'react';
import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import FoodNutrients from './FoodNutrients';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import waitUntil from 'async-wait-until';

configure({ adapter: new Adapter() });

describe('FoodNutrients', () => {
  const id = '21157';
  const value = 200;
  const food = {
    name: 'SUBWAY, meatball marinara sub on white bread (no toppings)',
    nutrients: [
      {
        nutrient_id: 123,
        name: 'Water',
        value: 100,
        unit: 'gr'
      }
    ]
  };

  if (Meteor.isServer) return; //client-only
  describe('FoodNutrients - Not food', () => {
    const foodNutrients = shallow(
      <FoodNutrients match={{ params: { idFood: id, value: value } }} />
    );

    foodNutrients.setState({
      food: null
    });

    it('Should not render if there is a food', () => {
      chai.expect(foodNutrients.find('.fa-utensils')).to.have.length(0);
      chai
        .expect(foodNutrients.find('.fa-chevron-circle-left'))
        .to.have.length(1);
    });

    it('Should not contain food information', () => {
      chai.expect(foodNutrients.text()).to.have.string('Back');
    });
  });

  describe('FoodNutrients - Food', () => {
    const foodNutrients = shallow(
      <FoodNutrients match={{ params: { idFood: id, value: value } }} />
    );

    foodNutrients.setState({
      food: food
    });

    it('Should render if there is a food', () => {
      chai.expect(foodNutrients.find('.fa-utensils')).to.have.length(1);
      chai
        .expect(foodNutrients.find('.fa-chevron-circle-left'))
        .to.have.length(1);
      chai.expect(foodNutrients.text()).to.have.string('Back');
    });

    it('Should contain food information', () => {
      chai.expect(foodNutrients.text()).to.have.string(food.name && value);
    });

    it('Should contain nutrient information', () => {
      chai
        .expect(foodNutrients.text())
        .to.have.string(
          food.nutrients[0].name &&
            food.nutrients[0].unit &&
            (Number(food.nutrients[0].value) * value) / 100
        );
    });
  });
});
