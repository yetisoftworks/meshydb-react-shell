import React from 'react';
import { MeshyClient } from "@meshydb/sdk";
import Navigation from './Navigation';

class Home extends React.Component 
{
    constructor(props) 
    {
        super(props);

        this.state = {
          configured: null
        };

        //this code checks to see if the account information entered on App.js is valid
        const uuidv1 = require('uuid/v1');
        var checkUserName = uuidv1();
        MeshyClient.checkUserExist(checkUserName).then(_ => {
            this.setState({'configured': true});
        }).catch(e=>{
            this.setState({'configured': false});
        });
    }

    render() 
    {
        return (
            <div>
                <Navigation />
                <div className="jumbotron p-4">
                    {this.state.configured === false && 
                    <p className="alert alert-danger" role="alert">
                            <h1>This starter app requires a FREE MeshyDB account.</h1>
                            Please create an account at <a href="https://meshydb.com" rel="noopener noreferrer" target="_blank">meshydb.com</a> and replace the values for <code>const account</code> and <code>const publicKey</code> on <code>App.js</code>.<br /><br />
                            For details on how to get these values from your existing account please see our <a href="https://docs.meshydb.com/en/latest/intro/getting_started_nodejs.html#nodejs" rel="noopener noreferrer" target="_blank">documentation</a>
                    </p>
                    }
                    <h1 className="display-4">Welcome to the MeshyDB React App</h1>
                    <p className="lead">
                        This application is intended to demonstrate the MeshyDB API using the React framework. 
                        To download a copy of this application or to checkout other sample projects please checkout our <a href="https://github.com/yetisoftworks/MeshyDB.Samples" target="_blank" rel="noopener noreferrer">github</a>. 
                        To learn more about MeshyDB please checkout our <a href="https://meshydb.com" target="_blank" rel="noopener noreferrer">website</a>.
                    </p>
                    <hr className="my-4" />
                </div>
            </div>
        );
    }
}

export default Home;
