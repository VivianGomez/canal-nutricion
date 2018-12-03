import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';

class Register extends Component {
  constructor(props) {
    super(props);

    if (localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.nombreInput = React.createRef();

    this.rolInput = React.createRef();

    this.identificacionInput = React.createRef();

    this.correoInput = React.createRef();

    this.celularInput = React.createRef();

    this.claveInput = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();

    let correo = this.correoInput.current.value;
    let clave = this.claveInput.current.value;
    let rol = this.rolInput.current.value;

    Meteor.call(
      'users.insert',
      {
        nombre: this.nombreInput.current.value,
        identificacion: this.identificacionInput.current.value,
        correo: correo,
        celular: this.celularInput.current.value,
        clave: clave,
        rol: rol
      },
      (err, res) => {
        if (err) {
          alert(err.error);
        } else if (res) {
          if (rol === 'paciente') {
            Meteor.call(
              'patients.validarPaciente',
              { correo, clave },
              (err, res) => {
                if (err) {
                  alert(err);
                } else {
                  localStorage.setItem('foohealliStuff', res);
                  this.props.history.push('/patient/dashboard');
                  window.location.reload();
                }
              }
            );
          } else if (rol === 'doctor') {
            Meteor.call(
              'doctors.validarDoctor',
              { correo, clave },
              (err, res) => {
                if (err) {
                  alert(err.error);
                } else {
                  localStorage.setItem('foohealliStuff', res);
                  window.location.reload();
                }
              }
            );
          } else if (rol === 'nutricionista') {
            Meteor.call(
              'nutritionists.validarNutricionista',
              { correo, clave },
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
      }
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 mt-3 no-gutters">
          <div className="bg-foohealli text-light">
            <br />
            <h3 className="text-center font-weight-bold">
              &nbsp;Welcome to Foohealli&nbsp;
            </h3>
            <div className="container">
              <h5 className="text-center">
                We invite you to register for being able of using the platform
                services.
              </h5>
            </div>
            <br />
          </div>
          <hr />
        </div>
        <div className="col-12">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="form-group">
              <label htmlFor="registroInputRol">
                <b>Which is your role?</b>
              </label>
              <select
                className="form-control"
                id="registroInputRol"
                ref={this.rolInput}
              >
                <option value="paciente">I'm a motivated Patient</option>
                <option value="doctor">I'm an excellent Doctor</option>
                <option value="nutricionista">
                  I'm an excellent Nutritionist
                </option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="registroInputNombre">
                <b>Name</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="registroInputNombre"
                ref={this.nombreInput}
                minLength="4"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="registroInputIdentificacion">
                <b>Id number</b>
              </label>
              <input
                type="number"
                className="form-control"
                id="registroInputIdentificacion"
                ref={this.identificacionInput}
                min="0"
                minLength="5"
                maxLength="15"
                pattern="\d+"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="registroInputCelular">
                <b>Phone</b>
              </label>
              <input
                type="number"
                className="form-control"
                id="registroInputCelular"
                ref={this.celularInput}
                min="0"
                minLength="5"
                maxLength="20"
                pattern="\d+"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registroInputFoohealliCorreo">
                <b>Email</b>
              </label>
              <input
                type="mail"
                className="form-control"
                id="registroInputFoohealliCorreo"
                ref={this.correoInput}
                minLength="4"
                maxLength="50"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="registroInputFoohealliClave">
                <b>Password</b>
              </label>
              <input
                type="password"
                className="form-control"
                id="registroInputFoohealliClave"
                ref={this.claveInput}
                minLength="8"
                maxLength="35"
                autoComplete="foo"
                required
              />
            </div>
            <center>
              <button type="submit" className="btn btn-foohealli mr-1">
                Let's begin!
              </button>
            </center>
          </form>
        </div>
      </div>
    );
  }
}
export default withRouter(Register);
