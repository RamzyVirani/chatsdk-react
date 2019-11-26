import {USER_ACTIONS} from "../actions"
import {loop, Cmd} from "redux-loop";
import {createMyProfile} from "../actions/user";

export default function user(state = {}, action) {
    switch (action.type) {
        case USER_ACTIONS.CREATE_MY_PROFILE:
        case USER_ACTIONS.GET_MY_PROFILE: {
            let user = action.payload.user;
            return {
                ...state,
                fromWeb: false,
                id: action.payload.id,
                ...user
            };
        }
        case USER_ACTIONS.GET_MY_PROFILE_FAILED: {
            // Firebase does not have my profile yet. I have to create my profile.
            return loop(
                state,
                Cmd.run(createMyProfile, {args: [action.payload.user, Cmd.dispatch]})
            );
        }

        case USER_ACTIONS.PROFILE_UPDATE: {
            let newState = {...state};
            if (!newState.hasOwnProperty("users")) {
                newState["users"] = {};
            }
            newState["users"][action.payload.id] = action.payload;
            return newState;
        }

        default:
            return state;
    }
}