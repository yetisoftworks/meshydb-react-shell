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
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">
          <img src="https://cdn.meshydb.com/images/logo-blue-no-text.png" width="30" height="30" className="d-inline-block align-top" alt="" />&nbsp;
          MeshyDB React Sample
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
          <Route exact path="/">
            <Home />
          </Route>
      </Switch>
    </Router>
  );
}

export default App;
