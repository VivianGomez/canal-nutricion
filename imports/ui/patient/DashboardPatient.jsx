import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class DashboardPatient extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      paciente: null
    };
  }

  componentDidMount() {
    Meteor.call('users.decodificar', this.state.token, (err, res) => {
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
        <div className="col-12 text-center mt-4 mb-3">
          <h1 className="foohealli-text-yellow">¡Bienvenido!</h1>
        </div>
        <div className="col-12 mb-3 text-center">
          <button
            id="botonAgregarConsumo"
            type="button"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
            className="btn btn-foohealli"
          >
            <i className="fas fa-apple-alt" />
            &nbsp;Registrar una comida
          </button>
        </div>
        <div className="col-md-2" />
        <div className="col-md-4 mb-3">
          <Link
            to={'/paciente/alimentosConsumidos'}
            style={{ textDecoration: 'none' }}
          >
            <div className="card">
              <img
                className="card-img-top pointer img-paciente"
                src="../patient/logoAlimentosConsumidos.jpeg"
                alt="Card image cap"
              />
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link
            to={'/paciente/medicamentos'}
            style={{ textDecoration: 'none' }}
          >
            <div className="card">
              <img
                className="card-img-top pointer img-paciente"
                src="../patient/logoMedicamentos.jpeg"
                alt="Card image cap"
              />
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

DashboardPatient = withRouter(DashboardPatient);

export default DashboardPatient;
