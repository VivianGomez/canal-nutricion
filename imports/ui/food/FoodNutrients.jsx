import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Food extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.idFood,
      value: this.props.match.params.value,
      food: null
    };
    this.getFoodNutrients();
  }

  getFoodNutrients() {
    Meteor.call(
      'patients.foodNutrients',
      {
        ndbno: this.state.id
      },
      (err, res) => {
        if (err) {
          alert('There is not a food with an id ' + this.state.id);
        } else {
          console.log(res);
          this.setState({
            food: res
          });
        }
      }
    );
  }

  render() {
    return (
      <div>
        {this.state.food ? (
          <div className="row">
            <div className="col-12 text-center">
              <div className="bg-foohealli text-light mt-4">
                <br />
                <h3 className="font-weight-bold">
                  <i className="fas fa-utensils" />
                  &nbsp;{this.state.food.name}&nbsp;
                </h3>
                <br />
              </div>
            </div>
            <div className="col-12">
              <ul className="list-group">
                <li className="list-group-item text-center">
                  <h4>
                    <i className="fas fa-weight" />
                    &nbsp;
                    {this.state.value} gr
                  </h4>
                </li>
                {this.state.food.nutrients.map(nutrient => {
                  return (
                    <li className="list-group-item" key={nutrient.nutrient_id}>
                      <b>{nutrient.name} </b>
                      <i className="fas fa-caret-right" />
                      &nbsp;
                      {(Number(nutrient.value) * this.state.value) / 100 +
                        ' ' +
                        nutrient.unit}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-12 text-center">
              <br />
              <button
                type="button"
                className="btn btn-lg btn-foohealli-yellow"
                onClick={() => window.history.back()}
              >
                <i className="fas fa-chevron-circle-left" />
                &nbsp; Back
              </button>
              <br />
            </div>
          </div>
        ) : (
          <div className="col-12 text-center">
            <div class="spinner">
              <div class="double-bounce1" />
              <div class="double-bounce2" />
            </div>
            <br />
            <button
              type="button"
              className="btn btn-lg btn-foohealli-yellow"
              onClick={() => window.history.back()}
            >
              <i className="fas fa-chevron-circle-left" />
              &nbsp; Back
            </button>
            <br />
          </div>
        )}
      </div>
    );
  }
}

export default Food;
