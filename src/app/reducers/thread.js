import {THREAD_ACTIONS, USER_ACTIONS} from "../actions"
import {loop, Cmd} from "redux-loop";
import {createThread} from "../actions/thread";
import cloneDeep from "lodash/cloneDeep"
import merge from "lodash/merge"

const initial = {
    open: null,
    threads: {}
};
export default function thread(state = initial, action) {
    switch (action.type) {
        case THREAD_ACTIONS.GET_THREAD_DETAILS: {
            let newState = cloneDeep(state);
            newState.threads = findAndMerge(newState.threads, action.payload.id, "details", action.payload.details);
            return newState;
        }

        case THREAD_ACTIONS.SHOULD_CREATE_THREAD: {
            // Firebase does not have my profile yet. I have to create my profile.
            return loop(
                cloneDeep(state),
                Cmd.run(createThread, {args: [action.payload.threadData, action.payload.currentUser, action.payload.otherUserId, Cmd.dispatch]})
            );
        }

        case THREAD_ACTIONS.GET_THREAD_USERS: {
            let newState = cloneDeep(state);
            newState.threads = findAndMerge(cloneDeep(state).threads, action.payload.thread_id, "users", action.payload.users);
            return newState;
        }
        case THREAD_ACTIONS.GET_THREAD_LAST_MESSAGE: {
            let newState = cloneDeep(state);
            newState.threads = findAndMerge(cloneDeep(state).threads, action.payload.thread_id, "lastMessage", action.payload.lastMessage);
            return newState;
        }

        case THREAD_ACTIONS.GET_MESSAGE: {
            let newState = cloneDeep(state), thread_id = action.payload.thread_id, threads = newState.threads;
            if (threads.hasOwnProperty(thread_id)) {
                let thread = threads[thread_id];
                thread.messages = merge(thread.messages, action.payload.messages);
                threads[thread_id] = thread;
            }
            newState.threads = threads;
            return newState;
        }

        case THREAD_ACTIONS.OPEN_THREAD: {
            let newState = cloneDeep(state);
            newState.open = action.payload.id;
            return newState;
        }
        default:
            return state;
    }
}

function findAndMerge(threads, thread_id, key, data) {
    let thread = {};
    if (threads.hasOwnProperty(thread_id)) {
        thread = threads[thread_id];
    }
    thread[key] = data;
    threads[thread_id] = thread;
    return threads;
}