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
                Welcome to Foohealli!
              </h1>
            </center>
            <h5 className="mt-3 mb-3">
              Foohealli is an application that seeks to improve communication
              between doctors, nutritionists and patients in order to achieve
              successful nutritional treatments.
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
            As <b className="foohealli-text">doctor</b> you can know the
            information about your patient, how it's treatment goes in terms of
            medicines and diet and you can also control it's medicines in real
            time.
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <center>
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x foohealli-text-light-green" />
                <i className="fas fa-users fa-stack-1x fa-inverse" />
              </span>
            </center>
            <br />
            As <b className="foohealli-text">patient</b>, using foohealli you
            can register your diet for that your doctor and nutritionist could
            see it in real time, understand how to help you, give you feedback
            and most accurate diagnoses and treatments. Thanks to this, you will
            be able to live calm, healthy and with less worries.
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <center>
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x text-info" />
                <i className="fas fa-diagnoses fa-stack-1x fa-inverse" />
              </span>
            </center>
            <br />
            As <b className="foohealli-text">nutritionist</b> you can know the
            information of your patient, see how it's diet goes in real time.
            You can know it's consumed food for different times of the day
            during the time before control and so you can do better diagnosis,
            help your patient and achieve the expected success.
          </div>
          <div className="col-12">
            <br />
          </div>
          <div className="col-12 text-center">
            <hr />
            <h6>
              Don't have an account?{' '}
              <span
                className="foohealli-text font-weight-bold pointer"
                onClick={() => this.props.history.push('/register')}
              >
                Register
              </span>
            </h6>
            <h6>
              Already have an account?{' '}
              <span
                className="foohealli-text-yellow font-weight-bold pointer"
                onClick={() =>
                  document.getElementById('botonParaIniciarSesion').click()
                }
              >
                Login
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
