import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Med extends Component {
  constructor(props) {
    super(props);

    this.state = {
      medicamento: this.props.medicamento
    };
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        medicamento: nextProps.medicamento,
      });
  }

  

  render() {
    return (
      <li key={this.state.medicamento._id} className="list-group-item">
        <div className="row">
          <div className="col-lg-9 col-md-8 col-12">
            <p>
              <i className="fas fa-tablets"></i>
              &nbsp;&nbsp;{this.state.medicamento.medicamento}
              <br />
              <b>Posologia: </b>
              {this.state.medicamento.posologia}
              <b>Frecuencia: </b>
              {this.state.medicamento.frecuencia}
              <b>Cantidad a tomar: </b>
              {this.state.medicamento.cantidad}
              <b>Via: </b>
              {this.state.medicamento.via}
            </p>
          </div>
        </div>
      </li>
    );
  }
}

export default Med;
