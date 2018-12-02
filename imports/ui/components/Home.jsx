import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      cargando: true
    };
  }

  componentDidMount() {
    Meteor.call('users.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'doctor') {
          this.props.history.push('/doctor/dashboard');
        } else if (res.rol === 'nutricionista') {
          this.props.history.push('/nutricionista/dashboard');
        } else if (res.rol === 'paciente') {
          this.props.history.push('/paciente/dashboard');
        }
      } else {
        this.setState({
          cargando: false
        });
      }
    });
  }

  render() {
    return (
      <div id="fondo" className="container">
        <div className="row mb-3">
          <div id="descripcion" className="col-12 text-center mt-3">
            <center>
              <div className="s-400-px mx-auto text-center rounded-circle d-flex">
                <img
                  className="mt-2 mb-2 text-center mx-auto justify-content-center align-self-center pointer imagen-inicio"
                  src="./foohealli500x500.png"
                  alt="logo foohealli"
                />
              </div>
            </center>
            <center>
              <h1 className="foohealli-text-yellow mt-3 mb-3">
                ¡Bienvenido a Foohealli!
              </h1>
            </center>
            <h5 className="mt-3 mb-3">
              Foohealli es una aplicación que busca mejorar la comunicanicación
              entre médicos, nutricionistas y pacientes con el fin de lograr
              tratamientos nutricionales exitosos.
            </h5>
          </div>
        </div>
        <div className="row text-center mt-5">
          <div className="col-md-4 col-sm-12 mb-3">
            <center>
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x text-primary" />
                <i className="fas fa-user-md fa-stack-1x fa-inverse" />
              </span>
            </center>
            <br />
            Como <b className="foohealli-text">médico</b> puedes conocer la
            información de tu paciente, como va su tratamiento en términos de
            medicamentos y dieta. Puedes controlar sus medicamentos en tiempo
            real y facilitarle dicho tratamiento.
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <center>
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x foohealli-text-light-green" />
                <i className="fas fa-users fa-stack-1x fa-inverse" />
              </span>
            </center>
            <br />
            Como <b className="foohealli-text">paciente</b>, usando foohealli
            podrás registrar como llevas el tratamiento recomendado por tu
            médico y nutricionista, quienes podrán verlo en tiempo real y
            entender como ayudarte además de darte una retroalimentación,
            diagnósticos y tratamientos más acertados. Así lograrás vivir
            tranquilo, saludable y con menos preocupaciones.
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <center>
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x text-info" />
                <i className="fas fa-diagnoses fa-stack-1x fa-inverse" />
              </span>
            </center>
            <br />
            Como <b className="foohealli-text">nutricionista</b> puedes conocer
            la información de tu paciente, ver como va su dieta en tiempo real.
            Conocerás sus alimentos consumidos para las diferentes comidas del
            día durante el tiempo antes del control y así podrás hacer un mejor
            diagnóstico, ayudar a tu paciente y lograr el éxito esperado.
          </div>
          <div className="col-12">
            <br />
          </div>
          <div className="col-12 text-center">
            <hr />
            <h6>
              ¿No tienes una cuenta?{' '}
              <span
                className="foohealli-text font-weight-bold pointer"
                onClick={() => this.props.history.push('/register')}
              >
                Regístrate
              </span>
            </h6>
            <h6>
              ¿Ya haces parte de Foohealli?{' '}
              <span
                className="foohealli-text-yellow font-weight-bold pointer"
                onClick={() =>
                  document.getElementById('botonParaIniciarSesion').click()
                }
              >
                Inicia sesión
              </span>
            </h6>
          </div>
          <div className="col-12">
            <br />
          </div>
        </div>
      </div>
    );
  }
}

Home = withRouter(Home);

export default Home;
