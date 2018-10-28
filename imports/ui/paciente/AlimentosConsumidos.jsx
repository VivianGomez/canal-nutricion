import React, { Component } from 'react';
import { withRouter } from 'react-router';
import DatePicker from 'react-date-picker';

class DashboardPaciente extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      paciente: null,
      fecha: new Date(),
      alimentosConsumidos: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  cargarConsumidosFecha() {
    Meteor.call(
      'pacientes.alimentosConsumidosFecha',
      {
        identificacion: this.state.paciente.identificacion,
        fecha: this.state.fecha.toString()
      },
      (err, res) => {
        if (err) {
          alert(err.error);
        } else if (res) {
          console.log(res);
          this.setState({
            alimentosConsumidos: res
          });
        }
      }
    );
  }

  componentDidMount() {
    Meteor.call(
      'usuarios.decodificar',
      this.state.token,
      (err, res) => {
        if (err) {
          alert(err.error);
        } else if (res) {
          if (res.rol === 'paciente') {
            this.setState({
              paciente: res
            });
          } else {
            this.props.history.push('/');
          }
        }
      },
      this.cargarConsumidosFecha()
    );
  }

  handleChange(event) {
    console.log(event);
    console.log(event === this.state.fecha);
    if (this.state.fecha !== event) {
      console.log('Yes');
      this.setState({ fecha: event }, this.cargarConsumidosFecha());
    }
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err);
        this.props.history.push('/');
      } else if (res) {
        if (res.rol === 'paciente') {
          this.setState({
            paciente: res
          });
        } else {
          this.props.history.push('/');
        }
      }
    });
  }

  render() {
    return (
      <div className="row vertical-align">
        <div className="col-12 text-center mt-4 mb-3">
          <h3 className="foohealli-text-yellow">Tu consumo de alimentos</h3>
        </div>
        <div className="col-8">
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
        <div className="col-4 text-right">
          <button
            id="botonAgregarConsumo"
            type="button"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
            className="btn btn-foohealli"
          >
            <i className="fas fa-plus fa-lg" />
          </button>
        </div>
      </div>
    );
  }
}

DashboardPaciente = withRouter(DashboardPaciente);

export default DashboardPaciente;
