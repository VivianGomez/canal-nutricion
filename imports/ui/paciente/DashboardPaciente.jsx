import React, { Component } from 'react';
import { withRouter } from 'react-router';

class DashboardPaciente extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      paciente: null
    };
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'paciente') {
          this.setState({
            paciente: res
          });
        } else {
          this.props.history.push('/');
        }
      }
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 mt-5" />
        <div className="col-md-2" />
        <div className="col-md-4 mb-3">
          <div class="card">
            <img
              class="card-img-top pointer img-paciente"
              src="../paciente/logoAlimentosConsumidos.jpeg"
              alt="Card image cap"
            />
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div class="card">
            <img
              class="card-img-top pointer img-paciente"
              src="../paciente/logoMedicamentos.jpeg"
              alt="Card image cap"
            />
          </div>
        </div>
      </div>
    );
  }
}

DashboardPaciente = withRouter(DashboardPaciente);

export default DashboardPaciente;
