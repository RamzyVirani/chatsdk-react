import {DATE_FORMAT_OPTIONS} from "./constants";

export function getDateFromCreatedAt(date) {
    return (new Date(date)).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)
}

export function scrollToElement(ref) {
    if (ref != null) {
        window.scroll({left: 0, top: ref.offsetTop, behavior: "smooth"});
    }
}

export function setThreadDetails(thread, users, myUserId) {
    if (thread && thread.details && thread.users) {
        // If group then thread.details.name would not be empty;
        if (thread.details.name == "") {
            let otherId = getOtherUser(thread, myUserId);
            if (users && users.hasOwnProperty(otherId)) {
                thread.details.name = users[otherId].meta.name;
                thread.details.image = users[otherId].meta.pictureURL;
            }
        }
    }
    return thread;
}

export function getOtherUser(thread, myUserId) {
    let otherId = 0;
    for (let userid in thread.users) {
        if (userid != myUserId) {
            otherId = userid;
            break;
        }
    }
    return otherId;
}