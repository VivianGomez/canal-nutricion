import React, { Component } from 'react';
import { withRouter } from 'react-router';
import DatePicker from 'react-date-picker';
import Alimento from '../alimento/Alimento.jsx';

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

  cargarConsumidosFecha(fecha) {
    Meteor.call(
      'pacientes.alimentosConsumidosFecha',
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

  handleChange(event) {
    this.setState({ fecha: event }, this.cargarConsumidosFecha(event));
  }

  renderAlimentos(alimentos) {
    return alimentos.map(alimento => (
      <Alimento key={alimento.idAlimento} alimento={alimento} />
    ));
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
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

  render() {
    return (
      <div className="row">
        <div className="col-12 text-center mt-4">
          <div className="bg-foohealli text-light">
            <br />
            <h2 className="text-center font-weight-bold">
              <i className="fas fa-apple-alt" />
              &nbsp;Alimentos consumidos&nbsp;
            </h2>
            <br />
          </div>
          <hr />
        </div>
        <div className="col-9 vertical-align-custom">
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
        <div className="col-3 text-center vertical-align-custom">
          <button
            id="botonAgregarConsumo"
            type="button"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
            className="btn btn-foohealli mr-auto"
          >
            <i className="fas fa-plus fa-lg" />
          </button>
        </div>
        <div className="col-12">
          <hr />
        </div>
        <div className="col-12">
          {this.state.alimentosConsumidos.length === 0 ? (
            <p>No hay reportes de tu consumo para este día.</p>
          ) : (
            <ul className="list-group">
              {this.renderAlimentos(this.state.alimentosConsumidos)}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

DashboardPaciente = withRouter(DashboardPaciente);

export default DashboardPaciente;
