import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router'

import {history} from "./app/store";

import Root from "./app/components/Root";

class App extends Component {

    render() {
        return (
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path={["/", "/conversation/:conversation"]} component={Root}/>
                </Switch>

            </ConnectedRouter>
        );
    }
}

export default App;
