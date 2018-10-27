import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

export default class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      doctor: false,
      usuario: null,
      cargando: true
    };
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'doctor') {
          this.setState({
            doctor: true,
            usuario: res,
            cargando: false
          });
        } else {
          this.setState({
            usuario: res,
            cargando: false
          });
        }
      } else {
        this.setState({
          cargando: false
        });
      }
    });
  }


  mostrarOpciones() {
    let opciones = [];

    if (this.state.doctor) {
      opciones.push(
        <div
          key="elementoDashboardDoctor"
          className="col-md-6 col-12 text-center mt-5"
        >
          <Link
            to={'/dashboardDoctor'}
            style={{ textDecoration: 'none' }}
          >
            <h5 className="mt-2 text-dark">Ver Pacientes</h5>
          </Link>
        </div>
      );
    } else {
      opciones.push(
        <div>
        HOLA!
        </div>
      );
    }

    return opciones;
  }


  render() {
      return (
        <div>
          <div className="row">{this.mostrarOpciones()}</div>
        </div>
      );
  }
}


