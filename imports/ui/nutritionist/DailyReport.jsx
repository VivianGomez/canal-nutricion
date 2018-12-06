import React, { Component } from 'react';
import { withRouter } from 'react-router';
import DatePicker from 'react-date-picker';
import Food from '../food/Food.jsx';

class DailyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consumedFood: null,
      report: null,
      fecha: new Date(),
      nutrients: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  cargarConsumidosFecha(fecha) {
    this.setState(
      {
        consumedFood: [],
        nutrients: []
      },
      () => {
        if (this.props.patient) {
          Meteor.call(
            'patients.alimentosConsumidosFecha',
            {
              identificacion: this.props.patient.identificacion,
              fecha: fecha
            },
            (err, res) => {
              if (err) {
                alert(err.error);
              } else if (res) {
                this.setState(
                  {
                    consumedFood: res
                  },
                  this.calcularValores(res)
                );
              }
            }
          );
        }
      }
    );
  }

  calcularValores(consumedFood) {
    let nutrients = [];
    let addedNutrients = [];
    if (consumedFood) {
      consumedFood.map(consumed => {
        Meteor.call(
          'patients.foodNutrients',
          {
            ndbno: consumed.idAlimento
          },
          (err, res) => {
            if (err) {
              alert('There is not a food with an id ' + consumed.idAlimento);
            } else {
              let foodNutrients = res.nutrients;
              foodNutrients.map(nutrient => {
                if (addedNutrients.includes(nutrient.nutrient_id)) {
                  let nutrientPos = addedNutrients.indexOf(
                    nutrient.nutrient_id
                  );
                  nutrients[nutrientPos].value =
                    nutrients[nutrientPos].value +
                    (Number(nutrient.value) *
                      Number(consumed.porcionConsumidaGramos)) /
                      100;
                } else {
                  let newNutrient = {
                    id: nutrient.nutrient_id,
                    name: nutrient.name,
                    unit: nutrient.unit,
                    value:
                      (Number(nutrient.value) *
                        Number(consumed.porcionConsumidaGramos)) /
                      100
                  };
                  nutrients.push(newNutrient);
                  addedNutrients.push(nutrient.nutrient_id);
                }
              });

              this.setState({
                nutrients: nutrients
              });
            }
          }
        );
      });
    }
  }

  handleChange(event) {
    this.setState({ fecha: event }, this.cargarConsumidosFecha(event));
  }

  //Este metodo es inseguro y será eliminado en el futuro. pueden usar getDerivatedStateFromProps 
  //o aprovechar mejor withTracker
  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        paciente: nextProps.paciente
      },
      () => {
        this.cargarConsumidosFecha(new Date());
      }
    );
  }

  componentDidMount() {
    if (this.props.patient) {
      this.cargarConsumidosFecha(new Date());
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12 text-center">
            <center>
              <h2 className="foohealli-text-yellow font-weight-bold">
                <i className="fas fa-chart-line foohealli-text-yellow" />
                &nbsp;Daily report&nbsp;
              </h2>
            </center>
            <hr />
            <div className="col-12 vertical-align-custom">
              <DatePicker
                onChange={this.handleChange}
                value={this.state.fecha}
                minDate={
                  this.props.patient
                    ? new Date(this.props.patient.fechaRegistro)
                    : new Date()
                }
                maxDate={new Date()}
              />
            </div>
          </div>
          {this.state.nutrients.length > 0 ? (
            <div className="col-12">
              <hr />
              <ul className="list-group">
                <li className="list-group-item text-center">
                  <h4>
                    <i className="fas fa-utensils" />
                    &nbsp;{this.state.consumedFood.length} foods
                  </h4>
                </li>
                {this.state.nutrients.map(nutrient => {
                  return (
                    <li key={nutrient.id} className="list-group-item">
                      <b>{nutrient.name}</b>{' '}
                      <i className="fas fa-caret-right" />
                      &nbsp;
                      {nutrient.value.toFixed(2) + ' ' + nutrient.unit}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="col-12 text-center">
              <h4>There are no consume reports on this day.</h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}

DailyReport = withRouter(DailyReport);

export default DailyReport;
