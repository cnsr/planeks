import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './appview.css';
import Navbar from 'react-bootstrap/Navbar';

import SchemesListView from '../schemes/SchemesListView';
import SchemesCreateReadView from '../schemes/SchemesCreateReadView';
import DataSet from '../datasets/DataSet';

interface AppViewProps {
    username: string,
    jwt: null|string
    callback: () => void
}

const AppView: React.FC<AppViewProps> = (props) => {

    const performLogout = () => {
        localStorage.removeItem("schemaUsername");
        localStorage.removeItem("schemaJWT");
        props.callback();
    }

    return <div id='app-view'>
        {/* header */}
        <div id='header-container'>
            <Navbar bg='light' fixed='top'>
                <Navbar.Brand>FakeCSV</Navbar.Brand>
                <a href='/'>View schemas</a>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text id='username-field'>
                        Hello, <b>{props.username}</b>
                    </Navbar.Text>
                    <Navbar.Text onClick={performLogout} id='header-logout'>
                        Logout
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        </div>
        {/* app container */}
        <div id='app-container'>
            <Router>
                <Switch>
                    <Route exact path='/'><SchemesListView /></Route>
                    <Route exact path='/schemes/:id' component={SchemesCreateReadView} />
                    <Route exact path='/schemes/add' component={SchemesCreateReadView}/>
                    <Route exact path='/schemes/:id/datasets' component={DataSet}/>
                </Switch>
            </Router>
        </div>
    </div>
}

export default AppView;