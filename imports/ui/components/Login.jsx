import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identificacion: '',
      clave: '',
      error: [],
      rol: 'paciente'
    };

    this.correoInput = React.createRef();
    this.claveInput = React.createRef();
    this.rolInput = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.rol === 'paciente') {
      Meteor.call(
        'pacientes.validarPaciente',
        {
          correo: this.correoInput.current.value,
          clave: this.claveInput.current.value
        },
        (err, res) => {
          if (err) {
            alert(err.error);
          } else {
            localStorage.setItem('foohealliStuff', res);
            window.location.reload();
          }
        }
      );
    } else if (this.state.rol === 'doctor') {
      Meteor.call(
        'doctores.validarDoctor',
        {
          correo: this.correoInput.current.value,
          clave: this.claveInput.current.value
        },
        (err, res) => {
          if (err) {
            alert(err.error);
          } else {
            localStorage.setItem('foohealliStuff', res);
            window.location.reload();
          }
        }
      );
    }
  }

  cargarBotonRol() {
    if (this.state.rol === 'paciente') {
      return (
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => this.cambiarRolIngreso('doctor')}
        >
          <i className="fas fa-user-md" />
          &nbsp;Soy doctor
        </button>
      );
    } else if (this.state.rol === 'doctor') {
      return (
        <button
          type="button"
          class="btn btn-success"
          onClick={() => this.cambiarRolIngreso('paciente')}
        >
          <i className="fas fa-user" />
          &nbsp;Soy paciente
        </button>
      );
    }
  }

  cambiarRolIngreso(rol) {
    this.setState({
      rol: rol
    });
  }

  irARegistro() {
    document.getElementById('botonParaIniciarSesion').click();
    this.props.history.push('/registro');
  }

  render() {
    return (
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-sm"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header bg-dark text-light">
              <h5 className="modal-title" id="exampleModalLabel">
                ¡Bienvenido de vuelta!
              </h5>
              <button
                type="button"
                id="cerrarLoginModal"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span className="text-light" aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                  <label htmlFor="loginInputCorreo">
                    <b>Correo electrónico</b>
                  </label>
                  <input
                    type="mail"
                    className="form-control"
                    id="loginInputCorreo"
                    ref={this.correoInput}
                    minLength="4"
                    maxLength="35"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginInputClave">
                    <b>Contraseña</b>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginInputClave"
                    ref={this.claveInput}
                    minLength="8"
                    maxLength="35"
                    autoComplete="foo"
                    required
                  />
                </div>
                <center>
                  <button type="submit" className="btn btn-foohealli">
                    Iniciar sesión
                  </button>
                </center>
                <br />
              </form>
              <p className="text-center">
                ¿No tienes cuenta en Foohealli?
                <br />
                <span
                  className="text-uniandes font-weight-bold pointer"
                  onClick={this.irARegistro.bind(this)}
                >
                  Regístrate
                </span>
              </p>
              <hr />
              <div className="text-center">{this.cargarBotonRol()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Login);
