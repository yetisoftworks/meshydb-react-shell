import React from 'react' 
import { Navbar, Nav } from 'react-bootstrap';


class Navigation extends React.Component
{
    constructor(props)
    {
        super(props); 
    }
    
    render()
    {
        return ( 
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
        );
    }
 } 

 export default Navigation;
