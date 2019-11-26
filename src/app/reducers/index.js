import {combineReducers} from 'redux-loop';
import {connectRouter} from 'connected-react-router'
import user from "./user";
import thread from "./thread";

const reducer = (history) => combineReducers({
    router: connectRouter(history),
    // ...add Other Reducer s Below
    user,
    thread
});

export default reducer;