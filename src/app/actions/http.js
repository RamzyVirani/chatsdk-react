import axios from "axios";
import USER_TYPES from "./user"
import {BASE_URL, ENDPOINTS} from "../constants";


// Action Types
const types = {
    "USER_LOGIN": "USER_LOGIN",
    "USER_LOGOUT": "USER_LOGOUT",
};
export default types;

export function requestSuccessAction(data, action) {
    return {
        type: action || 'HTTP_REQUEST_SUCCESSFUL',
        payload: data
    };
}

export function requestFailureAction(error = {}, statusText, action) {
    // throw Error(statusText);
    return {
        type: action || 'HTTP_REQUEST_FAILED',
        error: {error, message: statusText}
    };
}


export function curl_get(dispatch, url, query_params, failedType, callback, config = {}) {
    axios
        .get(url, {
            ...config,
            params: query_params
        })
        .then((response) => {
            let data = response.data;
            if (data.success) {
                callback(data)
            } else {
                dispatch(requestFailureAction(data.errors, data.message, failedType));
            }
        })
        .catch((error) => {
            let message = "",
                err = {};
            if (error.response) {
                if (error.response.status === 401) {
                    // Token maybe expired;
                    if (config.hasOwnProperty('headers') && config.headers.hasOwnProperty('Authorization')) {
                        // console.log("=====", config.headers.Authorization);
                        refreshToken(dispatch, (config) => {
                            curl_get(dispatch, url, query_params, failedType, callback, config);
                        }, config);
                    }
                    return;
                }

                if (error.response.data.hasOwnProperty('message')) {
                    message = error.response.data.message;
                    err = error.response.data;
                } else {
                    message = "Something Went Wrong!";
                }
            } else if (error.request) {
                message = error.message;
            } else {
                // console.log('Error', error.message);
                message = error.message;
            }
            dispatch(requestFailureAction(err, message, failedType));
        })
}

export function curl_post(dispatch, url, data, failedType, callback, config = {}) {
    axios.post(url, data, config)
        .then((response) => {
            let data = response.data;
            if (data.success) {
                callback(data);
            } else {
                dispatch(requestFailureAction(data.errors, data.message, failedType));
            }
        })
        .catch((error) => {
            let message = "",
                err = {};
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 401) {
                    // Token maybe expired;
                    if (config.hasOwnProperty('headers') && config.headers.hasOwnProperty('Authorization')) {
                        // console.log("=====", config.headers.Authorization);
                        refreshToken(dispatch, (config) => {
                            curl_post(dispatch, url, data, failedType, callback, config);
                        }, config);
                    }
                    return;
                }
                if (error.response.data.hasOwnProperty('message')) {
                    message = error.response.data.message;
                    err = error.response.data;
                } else {
                    message = "Something Went Wrong!";
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                message = error.message;
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
            }
            dispatch(requestFailureAction(err, message, failedType));
        })
}


function refreshToken(dispatch, callback, config) {
    dispatch({type: USER_TYPES.REFRESH_TOKEN_REQUEST});
    curl_post(dispatch, BASE_URL + ENDPOINTS.REFRESH_TOKEN, {},
        USER_TYPES.REFRESH_TOKEN_FAILED, (tokenData) => {
            // dispatch(requestSuccessAction(tokenData, USER_TYPES.REFRESH_TOKEN));

            let {user} = tokenData.data;

            let config = {
                headers: {'Authorization': "Bearer " + user.access_token}
            };
            callback(config)
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000)
        }, config);
}