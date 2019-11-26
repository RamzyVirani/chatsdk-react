import {DATE_FORMAT_OPTIONS} from "./constants";

export function getDateFromCreatedAt(date) {
    return (new Date(date)).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)
}

export function scrollToElement(ref) {
    if (ref != null) {
        window.scroll({left: 0, top: ref.offsetTop, behavior: "smooth"});
    }
}