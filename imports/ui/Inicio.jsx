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
      logueado: false,
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
            logueado: true,
            cargando: false
          });
        } else {
          this.setState({
            usuario: res,
            logueado: true,
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
        </div>
      );
    }

    return opciones;
  }


verInicio() {
    if (!this.state.logueado) {
      <h3 id="transbox" className="text-options">Para comenzar inicia sesión</h3>
    } else{
      return (
        <h3 id="transbox" className="text-options">Elige una opción</h3>
      );
    }
  }

  render() {
      return (
        <div >
            <header id="homeR">
              <div className="container-fluid">
                <center>
                  <h1 >¡Bienvenido a Foohealli!</h1>
                  {this.verInicio()}
                </center>
                <img
                    src="fondo.jpg"
                    className="img-fluid"
                    alt="banner foohealli"
                  />
              </div>
            </header>
            <div className="row">{this.mostrarOpciones()}</div>
        </div>
      );
  }
}


