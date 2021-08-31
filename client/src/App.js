import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Sidebar from "./components/Dashboard/Sidebar";
import VerifyEmail from "./components/auth/VerifyEmail";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route
          exact
          path="/verify/:id/account-verification/:text"
          component={VerifyEmail}
        />
        <Route
          exact
          path="/reset-password/:emailID"
          component={ResetPassword}
        />
        <Sidebar />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
