import {addEventListener, once, existsByKey, updateOnce} from '../firebase'
import {USER_ACTIONS} from "./index"
import {firebaseNodes, PAGINATION} from "../constants"
import {createRecord, createKey} from "./firebase";


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

    CREATE_THREAD: "CREATE_THREAD",
    CREATE_THREAD_REQUEST: "CREATE_THREAD_REQUEST",
    CREATE_THREAD_FAILED: "CREATE_THREAD_FAILED",

    SHOULD_CREATE_THREAD: "SHOULD_CREATE_THREAD",

    SHOULD_CREATE_USER: "SHOULD_CREATE_USER"
};

export default types;

export function attachEventListenerToThreadsRef() {
    return (dispatch) => {
    }
}

export function getOrCreateThreadsOtherParticipant(threads, threadData, otherUserId, currentUser, otherUser) {
    return async (dispatch) => {
        let create = true;
        await once(firebaseNodes.USERS + otherUserId, async (user) => {
            if (user) {
                let threads_data = Object.keys(user.threads);
                for (let i = 0; i < threads_data.length; i++) {
                    await once(firebaseNodes.THREADS + threads_data[i] + firebaseNodes.THREAD_USERS, (users, thread_id) => {
                        if (users != null && users.hasOwnProperty(currentUser.id)) {
                            create = false;
                        }
                    });
                }
                if (create) {
                    dispatch({type: types.SHOULD_CREATE_THREAD, payload: {threadData, otherUserId, currentUser}});
                }
            } else {
                let fromWeb = {
                    id: otherUserId,
                    meta: otherUser.meta,
                };
                dispatch({type: types.SHOULD_CREATE_USER, payload: {user: fromWeb, otherUserId}});
            }
        });
    }
}

export function attachEventListenersToThreads(threads, myUserId, dispatch) {
    // return (dispatch) => {

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
        }, threadKey, PAGINATION.MESSAGES)

    }
    addEventListener(firebaseNodes.ONLINE, (online_users) => {
        dispatch({type: USER_ACTIONS.GET_ONLINE_USERS, payload: online_users})
    })
    // }
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

export function readMessage(threadId, user) {
    return (dispatch) => {
        updateOnce(firebaseNodes.THREADS + threadId + firebaseNodes.THREAD_MESSAGES, (messages) => {
            // Mark All read messages of current thread
        }, user.id)
    }

}

export async function createThread(thread, user, otherUserId, dispatch) {

    dispatch({type: types.CREATE_THREAD_REQUEST, payload: thread});
    await createRecord(firebaseNodes.THREADS, thread, null, async (key) => {
        let thread = {invitedBy: user.id};
        await createRecord(firebaseNodes.USERS + user.id + firebaseNodes.USER_THREADS, thread, key, async (key) => {
            // Successfully created a thread in user profile.
            await createRecord(firebaseNodes.USERS + otherUserId + firebaseNodes.USER_THREADS, thread, key, async (key) => {
                // Successfully created a thread in other user profile.
            });
        });
        // dispatch({type: types.CREATE_THREAD, payload: {thread}});
    }, (error) => {
        // dispatch({type: types.CREATE_THREAD_FAILED, payload: {error}});
    });
}

/*export async function createThreadKey() {
    // let key = await createKey(firebaseNodes.THREADS);
    console.log('key:');
    // return 'fdgfdg';

}*/

export function openThread(id) {
    return {type: types.OPEN_THREAD, payload: {id}}
}
