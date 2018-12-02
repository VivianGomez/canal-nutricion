import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter, Link } from 'react-router-dom';
import Login from '../authentication/Login.jsx';
import ConsumedFoodForm from '../patient/ConsumedFoodForm.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      nombre: null,
      usuario: null,
      doctor: false
    };
  }

  componentDidMount() {
    Meteor.call('users.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'doctor') {
          this.setState({
            nombre: res.nombre,
            doctor: true,
            usuario: res
          });
        } else {
          this.setState({
            nombre: res.nombre,
            usuario: res
          });
        }
      } else {
        this.props.history.push('/');
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('foohealliStuff');
    this.setState({
      token: null,
      nombre: null
    });
    window.location.reload();
  }

  renderFuncionesNavbar() {
    let funciones = [];

    if (this.state.usuario && this.state.usuario.rol === 'paciente') {
      funciones.push(
        <li key="dashboardPaciente" className="nav-item">
          <a
            id="botonDashboardPaciente"
            className="nav-link pointer"
            onClick={() => this.props.history.push('/paciente/dashboard')}
          >
            Dashboard
          </a>
        </li>
      );
      funciones.push(
        <li key="alimentosConsumidosPaciente" className="nav-item">
          <a
            id="botonAlimentosConsumidosPaciente"
            className="nav-link pointer"
            onClick={() =>
              this.props.history.push('/paciente/alimentosConsumidos')
            }
          >
            Alimentos consumidos
          </a>
        </li>
      );
      funciones.push(
        <li key="medicamentosAsignadosPaciente" className="nav-item">
          <a
            id="botonMedicamentosAsignadosPaciente"
            className="nav-link pointer"
            onClick={() => this.props.history.push('/paciente/medicamentos')}
          >
            Medicamentos asignados
          </a>
        </li>
      );
    } else if (this.state.usuario && this.state.usuario.rol === 'doctor') {
      funciones.push(
        <li key="botonDashboardDoctor" className="nav-item">
          <a
            id="botonDashboardDoctor"
            className="nav-link pointer"
            onClick={() => this.props.history.push('/doctor/dashboard')}
          >
            Mis Pacientes
          </a>
        </li>
      );
    } else if (
      this.state.usuario &&
      this.state.usuario.rol === 'nutricionista'
    ) {
      funciones.push(
        <li key="botonDashboardNutricionista" className="nav-item">
          <a
            id="botonDashboardNutricionista"
            className="nav-link pointer"
            onClick={() => this.props.history.push('/nutricionista/dashboard')}
          >
            Mis Pacientes
          </a>
        </li>
      );
    }
    return funciones;
  }

  renderOpcionesNavbar() {
    const lista = [];
    if (this.state.token) {
      return (
        <li className="nav-item dropdown pointer">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.state.nombre}
          </a>
          <div
            className="dropdown-menu foohealli-text"
            aria-labelledby="navbarDropdown"
          >
            <a
              className="dropdown-item pointer foohealli-text"
              onClick={() => this.cerrarSesion()}
            >
              Cerrar sesión
            </a>
          </div>
        </li>
      );
    } else {
      lista.push(
        <li key="loginModalKey" className="nav-item navbar-right">
          <a
            id="botonParaIniciarSesion"
            className="nav-link pointer"
            data-toggle="modal"
            data-target="#loginModal"
          >
            Iniciar sesión
          </a>
        </li>
      );
      lista.push(
        <li key="elementoRegistro" className="nav-item">
          <a
            id="botonParaRegistrarse"
            className="nav-link pointer"
            onClick={() => this.props.history.push('/register')}
          >
            Registrarse
          </a>
        </li>
      );
      return lista;
    }
  }

  render() {
    return (
      <div>
        {this.state.usuario && this.state.usuario.rol === 'paciente' ? (
          <ConsumedFoodForm paciente={this.state.usuario} />
        ) : (
          ''
        )}
        <nav className="navbar navbar-expand-md text-white navbar-inverse bg-foohealli py-md-2">
          <div className="container">
            <Link to={'/'} style={{ textDecoration: 'none' }}>
              <div className="navbar-brand">
                <img
                  src="/foohealli500x500.png"
                  className="d-inline-block align-top"
                  alt="Logo Foohealli"
                  width="80px"
                />
              </div>
            </Link>
            <button
              className="navbar-toggler custom-toggler text-white"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon vertical-align-custom">
                <i className="text-white fas fa-bars fa-lg" />
              </span>
            </button>
            <div
              id="navbarNavDropdown"
              className="navbar-collapse collapse bg-foohealli text-white"
            >
              <ul className="navbar-nav mx-auto bg-foohealli text-white">
                {this.renderFuncionesNavbar()}
              </ul>
              <ul className="navbar-nav bg-foohealli text-white">
                {this.renderOpcionesNavbar()}
              </ul>
            </div>
          </div>
        </nav>
        <Login />
      </div>
    );
  }
}

export default withRouter(Navbar);
