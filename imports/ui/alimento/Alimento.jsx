import React, { Component } from 'react';

class Alimento extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alimento: this.props.alimento
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      alimento: nextProps.alimento
    });
  }

  render() {
    let alimento = this.state.alimento;
    return <li className="list-group-item">{alimento.alimento}</li>;
  }
}

export default Alimento;
