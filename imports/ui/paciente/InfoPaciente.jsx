import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class InfoPaciente extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      paciente: this.props.paciente,
      nombre: this.props.nombre,
      identificacion: this.props.identificacion,
      correo: this.props.correo,
      celular: this.props.celular,
      usuarioLogueado: this.props.usuarioLogueado,
      actualizar: false,
      nutricionista: this.props.nutricionista
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      paciente: nextProps.paciente,
      nombre: nextProps.nombre,
      identificacion: nextProps.identificacion,
      correo: nextProps.correo,
      celular: nextProps.celular,
      nutricionista: nextProps.nutricionista
    });
  }

  mostrarContactoUsuario() {
    return (
      <p>
        <b>Celular: </b>
        <a href={'tel:' + this.state.celular}>
          {this.state.celular}
          &nbsp;
        </a>
        <b>Correo: </b>
        <a href={'mailto:' + this.state.correo}>{this.state.correo}</a>
      </p>
    );
  }

  mostrarContenidoUsuario() {
    return (
      <Link
        to={
          (this.state.nutricionista
            ? '/nutricionista/detailPaciente/'
            : '/doctor/detailPaciente/') + this.state.identificacion
        }
        style={{ textDecoration: 'none' }}
        className="text-dark"
      >
        <li className="list-group-item">
          <div className="row">
            <div className="col-md-7 col-12">
              <p>
                <b>Paciente: </b>
                &nbsp;
                {this.state.nombre}
              </p>
            </div>
            <div className="col-md-5 col-12">
              <p>
                <b>Identificacion: </b>
                &nbsp;
                {this.state.identificacion}
              </p>
            </div>
            <div className="col-md-7 col-12">
              <p>
                <b>Correo: </b>
                <a href={'mailto:' + this.state.correo}>{this.state.correo}</a>
              </p>
            </div>
            <div className="col-md-5 col-12">
              <p>
                <b>Celular: </b>
                <a href={'tel:' + this.state.celular}>
                  {this.state.celular}
                  &nbsp;
                </a>
              </p>
            </div>
          </div>
        </li>
      </Link>
    );
  }

  render() {
    return this.mostrarContenidoUsuario();
  }
}

export default withRouter(InfoPaciente);
