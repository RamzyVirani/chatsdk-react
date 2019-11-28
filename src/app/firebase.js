import firebase from 'firebase';
import {firebaseConfig, PAGINATION} from './constants';


firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({
    timestampsInSnapshots: true
});

export const Firebase = firebase;
export const FirebaseDB = firebase.database();
let listeners = [];

export async function addEventListener(ref, callback, key = null, paginate = null, previous = null) {
    if (listeners.indexOf(ref) > -1) {
        return;
    }
    listeners.push(ref);
    let newRef = FirebaseDB.ref(ref);
    // if (previous) {
    //     newRef.limitToFirst(previous);
    // }
    if (paginate !== null) {
        newRef.limitToLast(paginate);
    }
    return await newRef.on('value', (snap) => {
        callback(snap.val(), key);
    })
}

export function removeEventListener(ref) {
    FirebaseDB.ref(ref).off();
}

export async function once(ref, callback, key = null) {
    return await FirebaseDB.ref(ref).once('value', (snap) => {
        callback(snap.val(), key);
    })
}
/*

export async function existsByKey(ref, child, value, callback, error) {
    return await FirebaseDB.ref(ref).orderByChild(child).orderByKey().equalTo(value).once('value', (snap) => {
        console.log("=====>", snap.val(), snap.exists());

        if (snap.exists()) {
            callback(snap.val());
        } else {
            // error(snap);
        }
    });
}

export async function existsByChild(ref, child, value, callback, error) {
    return await FirebaseDB.ref(ref).orderByChild(child).equalTo(value).once('value', (snap) => {
        if (snap.exists()) {
            callback(snap.val());
        } else {
            error(snap)
        }
    });
}
*/

export function create(ref, data, success = null, failed = null) {
    return FirebaseDB.ref(ref).set(data, function (error) {
        if (error) {
            // The write failed...
            if (failed != null) {
                failed(error);
            }
        } else {
            // Data saved successfully!
            if (success != null) {
                success();
            }
        }
    });
}

export function createBulk(refs, data, success = null, failed = null, key = null) {
    let updates = {};
    refs.forEach((ref) => {
        updates[ref] = data;
    });
    return FirebaseDB.ref().update(updates, function (error) {
        if (error) {
            // The write failed...
            if (failed != null) {
                failed(error);
            }
        } else {
            // Data saved successfully!
            if (success != null) {
                success(key);
            }
        }
    });
}