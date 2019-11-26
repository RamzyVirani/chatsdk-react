import {FirebaseDB, once, addEventListener, removeEventListener, create, createBulk} from "../firebase";
import {firebaseNodes} from "../constants";
import {USER_ACTIONS} from "./index"


export function createRecord(ref, data, key = null, success = null, failed = null) {
    if (key == null) {
        key = "/" + FirebaseDB.ref(ref).push().key;
    }
    return createBulk([ref + key], data, success, failed);
}

export function createBulkRecords(refs, data, key = null, success, failed) {
    if (key == null) {
        key = "/" + FirebaseDB.ref(refs[0]).push().key;
    }
    refs.map((ref) => {
        return ref + key;
    });
    return createBulk(refs, data, success, failed)
}

/*export function getProfile(id) {
    return async (dispatch) => {
        dispatch({type: types.GET_PROFILE_REQUEST, payload: {}});
        const result = await FirebaseDB.ref(firebaseNodes.USERS + id).on('value', (snapshot) => {
            let user = snapshot.val();
            dispatch({type: types.GET_PROFILE, payload: {user}});
        });
    }
}*/
