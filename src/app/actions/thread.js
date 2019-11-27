import {addEventListener, once} from '../firebase'
import {USER_ACTIONS} from "./index"
import {firebaseNodes, PAGINATION} from "../constants"
import {createRecord} from "./firebase";

const types = {
    GET_THREADS: "GET_THREADS",
    GET_THREADS_REQUEST: "GET_THREADS_REQUEST",
    GET_THREADS_FAILED: "GET_THREADS_FAILED",

    GET_THREAD: "GET_THREAD",
    GET_THREAD_DETAILS: "GET_THREAD_DETAILS",
    GET_THREAD_USERS: "GET_THREAD_USERS",
    GET_THREAD_LAST_MESSAGE: "GET_THREAD_LAST_MESSAGE",

    GET_MESSAGE: "GET_MESSAGE",

    OPEN_THREAD: "OPEN_THREAD",

    SEND_MESSAGE: "SEND_MESSAGE",
    SEND_MESSAGE_REQUEST: "SEND_MESSAGE_REQUEST",
    SEND_MESSAGE_FAILED: "SEND_MESSAGE_FAILED",
};

export default types;

export function attachEventListenersToThreads(threads, myUserId, previous = null) {
    return (dispatch) => {
        for (let threadKey in threads) {
            once(firebaseNodes.THREADS + threadKey + firebaseNodes.THREAD_USERS, (users, thread_id) => {
                for (let userid in users) {
                    if (myUserId != userid) {
                        attachEventListenerToUserProfile(userid, dispatch);
                    }
                }
                dispatch({type: types.GET_THREAD_USERS, payload: {users: users, thread_id},})
            }, threadKey);

            once(firebaseNodes.THREADS + threadKey + firebaseNodes.THREAD_DETAILS, (thread, id) => {
                dispatch({type: types.GET_THREAD_DETAILS, payload: {details: thread, id},})
            }, threadKey)

            addEventListener(firebaseNodes.THREADS + threadKey + firebaseNodes.THREAD_LAST_MESSAGE, (thread, thread_id) => {
                dispatch({type: types.GET_THREAD_LAST_MESSAGE, payload: {lastMessage: thread, thread_id},})
            }, threadKey)

            addEventListener(firebaseNodes.THREADS + threadKey + firebaseNodes.THREAD_MESSAGES, (message, thread_id) => {
                dispatch({type: types.GET_MESSAGE, payload: {messages: message, thread_id},})
            }, threadKey, PAGINATION.MESSAGES, previous)
        }
    }
}

export function getPreviousMessages(threadKey, myUserId, previous = null) {
    
    return (dispatch) => {
        addEventListener(firebaseNodes.THREADS + threadKey + firebaseNodes.THREAD_MESSAGES, (message, thread_id) => {
            console.log(message, thread_id)
            // dispatch({type: types.GET_MESSAGE, payload: {messages: message, thread_id},})
        }, threadKey, PAGINATION.MESSAGES, previous)
    }

}

export function attachEventListenerToUserProfile(id, dispatch) {
    addEventListener(firebaseNodes.USERS + id, (user, id) => {
        dispatch({type: USER_ACTIONS.PROFILE_UPDATE, payload: {...user, id}});
    }, id)
}

export function sendMessage(messageObj, threadId, sender) {
    return async (dispatch) => {
        dispatch({type: types.SEND_MESSAGE_REQUEST, payload: messageObj});
        await createRecord(firebaseNodes.THREADS + threadId + firebaseNodes.THREAD_MESSAGES, messageObj, null, () => {
            let lastMsg = {
                date: messageObj.date,
                type: messageObj.type,
                "user-firebase-id": messageObj["user-firebase-id"],
                userName: sender
            };
            createRecord(firebaseNodes.THREADS + threadId, lastMsg, firebaseNodes.THREAD_LAST_MESSAGE);

            dispatch({type: types.SEND_MESSAGE, payload: {messageObj}});
        }, (error) => {
            dispatch({type: types.SEND_MESSAGE_FAILED, payload: {error}});
        });
    }
}

export function openThread(id) {
    return {type: types.OPEN_THREAD, payload: {id}}
}
