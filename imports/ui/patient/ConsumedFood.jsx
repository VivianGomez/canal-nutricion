import React, { Component } from 'react';
import { withRouter } from 'react-router';
import DatePicker from 'react-date-picker';
import Food from '../food/Food.jsx';

class ConsumedFood extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      paciente: null,
      fecha: new Date(),
      alimentosConsumidos: [],
      nutricionista: this.props.nutricionista
    };

    this.handleChange = this.handleChange.bind(this);
  }

  cargarConsumidosFecha(fecha) {
    if (this.state.paciente) {
      Meteor.call(
        'patients.alimentosConsumidosFecha',
        {
          identificacion: this.state.paciente.identificacion,
          fecha: fecha
        },
        (err, res) => {
          if (err) {
            alert(err.error);
          } else if (res) {
            this.setState({
              alimentosConsumidos: res
            });
          }
        }
      );
    }
  }

  handleChange(event) {
    this.setState({ fecha: event }, this.cargarConsumidosFecha(event));
  }

  renderAlimentos(alimentos) {
    let desayuno = [];
    let almuerzo = [];
    let cena = [];
    let onces = [];

    alimentos.map(alimento => {
      let alimentoListo = (
        <Food
          key={alimento.idAlimento}
          alimento={alimento}
          nutricionista={this.state.nutricionista}
          identificacion={this.state.paciente.identificacion}
        />
      );
      switch (alimento.tipoComida) {
        case 'desayuno':
          desayuno.push(alimentoListo);
          break;
        case 'almuerzo':
          almuerzo.push(alimentoListo);
          break;
        case 'cena':
          cena.push(alimentoListo);
          break;
        case 'onces':
          onces.push(alimentoListo);
          break;
      }
    });

    return (
      <div>
        {desayuno.length > 0 ? this.listaAlimento('Breakfast', desayuno) : ''}
        {almuerzo.length > 0 ? this.listaAlimento('Lunch', almuerzo) : ''}
        {cena.length > 0 ? this.listaAlimento('Dinner', cena) : ''}
        {onces.length > 0 ? this.listaAlimento('Snacks', onces) : ''}
      </div>
    );
  }

  listaAlimento(tipo, alimentos) {
    return (
      <div>
        <h5 className="text-center">{tipo}</h5>
        <ul className="list-group">{alimentos}</ul>
        <hr />
      </div>
    );
  }

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
    if (this.state.nutricionista) {
      this.setState(
        {
          paciente: this.props.paciente
        },
        () => {
          this.cargarConsumidosFecha(new Date());
        }
      );
    } else {
      Meteor.call('users.decodificar', this.state.token, (err, res) => {
        if (err) {
          alert(err);
          this.props.history.push('/');
        } else if (res) {
          if (res.rol === 'paciente') {
            this.setState(
              {
                paciente: res
              },
              () => {
                this.cargarConsumidosFecha(new Date());
              }
            );
          } else {
            this.props.history.push('/');
          }
        }
      });
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 text-center">
          {this.state.nutricionista ? (
            <center>
              <h2 className="foohealli-text-yellow font-weight-bold">
                <i className="fas fa-apple-alt foohealli-text-yellow" />
                &nbsp;Consumed food&nbsp;
              </h2>
            </center>
          ) : (
            <div className="bg-foohealli text-light mt-4">
              <br />
              <h2 className="text-center font-weight-bold">
                <i className="fas fa-apple-alt" />
                &nbsp;Consumed food&nbsp;
              </h2>
              <br />
            </div>
          )}
          <hr />
        </div>
        <div className="col-md-10 col-8 vertical-align-custom">
          <DatePicker
            onChange={this.handleChange}
            value={this.state.fecha}
            minDate={
              this.state.paciente
                ? new Date(this.state.paciente.fechaRegistro)
                : new Date()
            }
            maxDate={new Date()}
          />
        </div>
        <div className="col-md-2 col-4 vertical-align-custom">
          <button
            id="botonActualizarConsumo"
            type="button"
            className="btn btn-info mr-1 float-right"
            onClick={() => this.cargarConsumidosFecha(this.state.fecha)}
          >
            <i className="fas fa-sync-alt fa-lg" />
          </button>
          {this.state.nutricionista ? (
            ''
          ) : (
            <button
              id="botonAgregarConsumo"
              type="button"
              data-toggle="modal"
              data-target=".bd-example-modal-lg"
              className="btn btn-foohealli ml-1 float-right"
            >
              <i className="fas fa-plus fa-lg" />
            </button>
          )}
        </div>
        <div className="col-12">
          <hr />
        </div>
        <div className="col-12">
          {this.state.alimentosConsumidos.length === 0 &&
          this.state.paciente &&
          this.state.paciente.identificacion ? (
            <li className="list-group-item">
              There is no consumed food on this day.
            </li>
          ) : (
            ''
          )}
          {this.state.alimentosConsumidos.length > 0 &&
          this.state.paciente &&
          this.state.paciente.identificacion
            ? this.renderAlimentos(this.state.alimentosConsumidos)
            : ''}
        </div>
        {!this.state.nutricionista ? (
          <div className="col-12 text-center">
            <br />
            <button
              type="button"
              className="btn btn-foohealli-yellow"
              onClick={() => window.history.back()}
            >
              <i className="fas fa-chevron-circle-left" />
              &nbsp; Back
            </button>
            <br />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

ConsumedFood = withRouter(ConsumedFood);

export default ConsumedFood;
