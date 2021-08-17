import { Redirect, Route, Switch } from "react-router";
import { NavLink } from "react-router-dom";
import "./App.css";
import { MulTable } from "./components/MulTable";
import { Quizz } from "./components/Quizz";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect to="/table" />
        </Route>
        <Route exact path="/table">
          <MulTable />
        </Route>
        <Route exact path="/quizz">
          <Quizz />
        </Route>
      </Switch>
      <div className="menu">
        <NavLink to="/table" activeClassName="activeLink">
          Table
        </NavLink>
        <NavLink to="/quizz" activeClassName="activeLink">
          Quizz
        </NavLink>
      </div>
    </div>
  );
}

export default App;
