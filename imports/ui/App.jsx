import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Inicio from './Inicio.jsx';
import Registro from './components/Registro.jsx';
import Login from './components/Login.jsx';
import Footer from './components/Footer.jsx';
import DashboardDoctor from './doctor/DashboardDoctor.jsx';
import DetailPaciente from './paciente/DetailPaciente.jsx';


class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div id="mainContainer" className="container container-fluid">
          <Switch>
            <Route exact path="/" component={Inicio} />
            <Route
              exact
              path="/doctor/dashboardDoctor"
              component={DashboardDoctor}
            />

            <Route
              exact
              path="/doctor/DetailPaciente/:identificacion"
              component={DetailPaciente}
            />

            <Route exact path="/registro" component={Registro} />
            <Route exact path="/login" component={Login} />

            <Redirect from="*" to="/" />
          </Switch>
        </div>
        <br />
        <Footer />
      </div>
    );
  }
}

export default App;