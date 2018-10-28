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
    this.setState({ fecha: event }, this.cargarConsumidosFecha());
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
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
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 text-left mt-5">
          <h2>Alimentos consumidos</h2>
          <DatePicker
            onChange={this.handleChange}
            value={this.state.fecha}
            maxDate={new Date()}
          />
        </div>
      </div>
    );
  }
}

DashboardPaciente = withRouter(DashboardPaciente);

export default DashboardPaciente;
