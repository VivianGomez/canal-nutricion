import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Register from './authentication/Register.jsx';
import Login from './authentication/Login.jsx';
import Footer from './components/Footer.jsx';
import DashboardDoctor from './doctor/DashboardDoctor.jsx';
import DetailPatient from './patient/DetailPatient.jsx';
import DashboardNutritionist from './nutritionist/DashboardNutritionist.jsx';
import DashboardPatient from './patient/DashboardPatient.jsx';
import ConsumedFood from './patient/ConsumedFood.jsx';
import FoodNutrients from './food/FoodNutrients.jsx';
import DetailPatientNutritionist from './nutritionist/DetailPatientNutritionist.jsx';

class App extends Component {
  render() {
    return (
      <div className="h-100">
        <Navbar />
        <div id="mainContainer" className="container container-fluid">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/doctor/dashboard" component={DashboardDoctor} />
            <Route
              exact
              path="/nutritionist/dashboard"
              component={DashboardNutritionist}
            />
            <Route
              exact
              path="/doctor/patient/detail/:id"
              component={DetailPatient}
            />
            <Route
              exact
              path="/nutritionist/patient/detail/:id"
              component={DetailPatientNutritionist}
            />
            <Route
              exact
              path="/patient/dashboard"
              component={DashboardPatient}
            />
            <Route exact path="/patient/medicines" component={DetailPatient} />
            <Route
              exact
              path="/patient/consumedFood"
              component={ConsumedFood}
            />
            <Route
              path="/consumedFood/nutrients/:idFood/:value"
              component={FoodNutrients}
            />

            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />

            <Redirect from="*" to="/" />
          </Switch>
        </div>
        <br />
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
