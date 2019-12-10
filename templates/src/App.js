import React from 'react';
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { MeshyClient } from "@meshydb/sdk";

const account = '<!-- your account name -->';
const publicKey = '<!-- your public key -->';

function App() 
{
  MeshyClient.initialize(account, publicKey);

  return (
    <Router>
      <Switch>
          <Route exact path="/">
            <Home />
          </Route>
      </Switch>
    </Router>
  );
}

export default App;
