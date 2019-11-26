export const loadState = () => {
    try {
        const serialized = localStorage.getItem("state");
        if (serialized === null) {
            return undefined;
        }
        return JSON.parse(serialized);
    } catch (e) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serialized = JSON.stringify(getStateToSave(state));
        localStorage.setItem("state", serialized);
    } catch (e) {
        // LOG
    }
};

const getStateToSave = (state) => {
    // Return all the values we want to save at local storage;
    return {
        // Save the user details and access objects as well as email.
        user: state.user
    }
};
