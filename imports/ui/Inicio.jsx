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
      nutricionista: false,
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
        } else if (res.rol === 'nutricionista') {
          this.setState({
            nutricionista: true,
            usuario: res,
            logueado: true,
            cargando: false
          });
        }

        else {
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
            to={'/doctor/dashboardDoctor'}
            style={{ textDecoration: 'none' }}
          >
            <h5 className="mt-2 text-dark">Ver Pacientes</h5>
          </Link>
        </div>
      );
    }else if (this.state.nutricionista) {
      opciones.push(
        <div
          key="elementoDashboardNutricionista"
          className="col-md-6 col-12 text-center mt-5"
        >
          <Link
            to={'/nutricionista/dashboardNutricionista'}
            style={{ textDecoration: 'none' }}
          >
            <h5 className="mt-2 text-dark">Ver Pacientes</h5>
          </Link>
        </div>
      );
    } else {
      opciones.push(<div />);
    }

    return opciones;
  }

  verInicio() {
    if (!this.state.logueado) {
      <h3 id="transbox" className="text-options">
        Para comenzar inicia sesión
      </h3>;
    } else {
      return (
        <h3 id="transbox" className="text-options">
          Elige una opción
        </h3>
      );
    }
  }

  render() {
    return (
      <div id="fondo" class="container">
        <div  class="navbar-header">
          <div id="descripcion">
            <h1 className="foohealli-text-yellow mt-3 mb-3">
                ¡Bienvenido a Foohealli!
          </h1>
            <span>Foohealli es una applicación que busca que mejorar la comunicanicación entre médicos, nutricionistas  y  pacientes
                  con el fin de lograr tratamientos nitricionales exitosos. 
            </span>
            <center>

            </center>
           </div>
        </div>
      </div> 
    );
  }
}
