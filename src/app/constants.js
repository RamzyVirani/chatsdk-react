export const BASE_URL = "http://localhost/blue_painting";
export const PAGINATION = {
    MESSAGES: 20
};
export const firebaseNodes = {
    DB: "JS/",
    USERS: "JS/users/",
    ONLINE: "JS/online/",

    THREADS: "JS/threads/",
    THREAD_USERS: "/users",
    THREAD_DETAILS: "/details",
    THREAD_LAST_MESSAGE: "/lastMessage",
    THREAD_MESSAGES: "/messages",
};

export const firebaseConfig = {
    apiKey: "AIzaSyAYQbgX5U11hYov5dRS-rSz_04a-s8MkhI",
    authDomain: "papp-8f829.firebaseapp.com",
    databaseURL: "https://papp-8f829.firebaseio.com",
    projectId: "papp-8f829",
    storageBucket: "papp-8f829.appspot.com",
    messagingSenderId: "555668206490",
    appId: "1:555668206490:web:edd8f371a45cdbcadb8023"
};
export const DATE_FORMAT_OPTIONS = {year: 'numeric', month: 'short', day: 'numeric'};


export const ENDPOINTS = {
    LOGIN: "/login",
    FORGOT: "/forget-password",
    VERIFY_CODE: "/verify-reset-code",
    RESET_PASSWORD: "/reset-password",
    USER_REGISTRATION: "/register",
    GET_USERS: "/users",
    GET_USER: "/users/",
    GET_GAMES: "/games",
    GET_GAME: "/games/",
    GET_GAME_WITH_TOKEN: "/games-with-token/",
    GET_BANNER: "/website-banners",
    GET_REVIEWS: "/reviews",
    GET_REVIEWS_WITHOUT_TOKEN: "/reviews-without-token",
    GET_TRAILERS: "/trailers",
    GET_NEWS: "/news",
    GET_TROPHIES: "/user/trophies",
    GET_FOLLOWERS: "/followers",
    Add_VOTE: "/votes",
    SOCIAL_LOGIN: "/social_login",
    ADD_STATUS: "/user-status-histories",
    CONTACT_US: "/contactus",
    GET_MATRICES: "/matrices",
    Add_REVIEW: "/reviews",
    GET_SETTINGS: "/settings",
    GET_PAGE: "/pages",
    SUBSCRIBE: "/subscribers",
    GET_PLATFORMS: "/platforms",
    GET_GENRES: "/genres",
    REFRESH_TOKEN: "/refresh",
    GET_LEADERBOARD: "/leader-boards",
    GET_LEADERBOARD_WITHOUT_TOKEN: "/leader-boards-without-token",
    UPDATE_PROFILE: "/profile",
    CHANGE_PASSWORD: "/change-password",
    GET_AUTH: "/get-auth",
};
