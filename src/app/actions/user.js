import {once, addEventListener} from "../firebase";
import {firebaseNodes, BASE_URL, ENDPOINTS} from "../constants";
import {createRecord} from "./firebase";
import {attachEventListenersToThreads} from "./thread";

const types = {
    GET_MY_PROFILE: "GET_MY_PROFILE",
    GET_MY_PROFILE_REQUEST: "GET_MY_PROFILE_REQUEST",
    GET_MY_PROFILE_FAILED: "GET_PROFILE_FAILED",

    PROFILE_UPDATE: "PROFILE_UPDATE",

    CREATE_MY_PROFILE: "CREATE_MY_PROFILE",
    CREATE_MY_PROFILE_REQUEST: "CREATE_MY_PROFILE_REQUEST",
    CREATE_MY_PROFILE_FAILED: "CREATE_MY_PROFILE_FAILED",
};

export default types;


export function getMyProfile(id, userFromWeb = null) {
    return (dispatch) => {
        dispatch({type: types.GET_MY_PROFILE_REQUEST, payload: {}});
        addEventListener(firebaseNodes.USERS + id, (user) => {
            if (user) {
                attachEventListenersToThreads(user.threads, id, dispatch);
                dispatch({type: types.GET_MY_PROFILE, payload: {user, id}});
            } else {
                let fromWeb = {
                    id: userFromWeb.id,
                    meta: userFromWeb.meta,
                };
                dispatch({type: types.GET_MY_PROFILE_FAILED, payload: {user: fromWeb, id}});
            }
        });
    }
}

export async function createMyProfile(profile, dispatch) {
    dispatch({type: types.CREATE_MY_PROFILE_REQUEST, payload: profile});
    await createRecord(firebaseNodes.USERS, profile, profile.id, () => {
        dispatch({type: types.CREATE_MY_PROFILE, payload: {profile, id: profile.id}});
    }, (error) => {
        dispatch({type: types.CREATE_MY_PROFILE_FAILED, payload: {error}});
    });
}