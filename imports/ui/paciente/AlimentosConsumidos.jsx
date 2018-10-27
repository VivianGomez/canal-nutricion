import React, { Component } from 'react';
import { withRouter } from 'react-router';
import DatePicker from 'react-date-picker';

class DashboardPaciente extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      paciente: null,
      date: new Date(),
      alimentosConsumidos: []
    };

    this.cargarConsumidosFecha(this.state.date);

    this.handleChange = this.handleChange.bind(this);
  }

  cargarConsumidosFecha(fecha) {}

  handleChange(event) {
    this.setState({ date: event });
    console.log(event);
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
        <div className="col-12 text-left mt-5">
          <h2>Alimentos consumidos</h2>
          <DatePicker
            onChange={this.handleChange}
            value={this.state.date}
            maxDate={new Date()}
          />
        </div>
      </div>
    );
  }
}

DashboardPaciente = withRouter(DashboardPaciente);

export default DashboardPaciente;
