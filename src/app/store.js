// Redux
import {applyMiddleware, createStore, compose} from 'redux';
// Reducers
import createRootReducer from "./reducers";
// Middlewares
import {routerMiddleware} from 'connected-react-router'
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {install} from 'redux-loop';
//
import {createBrowserHistory} from "history";
// Storage
import {loadState, saveState} from "./storage";

import {Firebase, FirebaseDB} from "./firebase";

export const history = createBrowserHistory();

const enhancer = compose(
    applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ...other middlewares
        thunk
        , logger
    ),
    install(),
);

// Get the Initial State from Local Storage
const initialState = loadState();

const store = createStore(
    createRootReducer(history), // root reducer with router state
    initialState,
    enhancer
);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;