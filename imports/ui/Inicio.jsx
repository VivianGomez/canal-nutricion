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
        <div  className="row">
          <div id="descripcion" className="col-12">
            <center>
            <h1 className="foohealli-text-yellow mt-3 mb-3">
                ¡Bienvenido a Foohealli!
            </h1>
            </center>
            <span>Foohealli es una applicación que busca que mejorar la comunicanicación entre médicos, nutricionistas  y  pacientes
                  con el fin de lograr tratamientos nutricionales exitosos. 
            </span>
            <center>
           <div className="s-400-px mx-auto text-center rounded-circle d-flex">
            <img
              className="mt-2 mb-2 text-center mx-auto justify-content-center align-self-center pointer"
              src="./foohealli500x500.png"
              alt="logo foohealli"
              width="400px"
            />
           </div>
            </center>
          </div>
        </div>
        <div className="row">
         <div className="col-md-4 col-sm-12">
         <center>
         <span class="fa-stack fa-4x">
           <i class="fas fa-circle fa-stack-2x foohealli-text-light-green"></i>
           <i class="fas fa-user-md fa-stack-1x fa-inverse"></i>
         </span>
         </center>
         <br/>
          Como <b className="foohealli-text">médico</b> puedes conocer la información de tu paciente, como va su tratamiento en términos de medicamentos y dieta.
          Puedes controlar sus medicamentos en tiempo real y facilitarle dicho tratamiento.
         </div>
         <div className="col-md-4 col-sm-12">
         <center>
         <span class="fa-stack fa-4x">
           <i class="fas fa-circle fa-stack-2x foohealli-text-light-green"></i>
           <i class="fas fa-users fa-stack-1x fa-inverse"></i>
         </span>
         </center>
         <br/>
          Como <b className="foohealli-text">nutricionista</b> puedes conocer la información de tu paciente, ver como va su dieta en tiempo real. Conocerás sus alimentos consumidos para
          las diferentes comidas del día durante el tiempo antes del control y así podrás hacer un mejor diagnóstico, ayudar a tu paciente y lograr el éxito esperado.
          </div>
         <div className="col-md-4 col-sm-12">
         <center>
         <span class="fa-stack fa-4x">
           <i class="fas fa-circle fa-stack-2x foohealli-text-light-green"></i>
           <i class="fas fa-diagnoses fa-stack-1x fa-inverse"></i>
         </span>
         </center>
         <br/>
          ¿Cansado de llegar a los controles con tus médicos y nutricionistas y no entender porqué emperoraste en tu enfermedad o problema médico?
          Como <b className="foohealli-text">paciente</b>, usando foohealli podrás registrar como llevas el tratamiento recomendado, ellos podrán verlo en tiempo real 
          y entender como ayudarte además de darte una retroalimentación, diagnósticos y tratamientos más acertados. Así lograrás vivir tranquilo, saludable y con menos preocupaciones.
         </div>
      </div> 
    </div> 
    );
  }
}
