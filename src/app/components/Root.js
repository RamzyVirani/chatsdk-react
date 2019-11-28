import React, {Component} from 'react';
import {connect} from 'react-redux';
import Contacts from "./Contacts";
import Conversations from "./Conversations";
import {getMyProfile} from "../actions/user";
import {createThread, attachEventListenerToThreadsRef, getOrCreateThreadsOtherParticipant} from "../actions/thread";
import cloneDeep from "lodash/cloneDeep";

class Root extends Component {


    componentWillMount() {

        let user_id = this.props.user.id;
        let thread = {
            "details": {
                "creation-date": new Date().getTime(),
                "creator-entity-id": this.props.user.id,
                "name": "",
                "type": 0,
                "type_v4": 2
            },
            "users": {
                "2": "member",
                "146": "owner"
            }
        }
        // Hardcode create admin thread if not found.

        // if (this.props.user.fromWeb) {
        // fromWeb will be true when we will set the state from php.
        this.props.getMyProfile(this.props.user.id, this.props.user);
        // }
        if (this.props.user.id != 2 && this.props.user.hasOwnProperty('threads')) {
            this.props.getOrCreateThreadsOtherParticipant(this.props.user.threads, thread, 2, this.props.user)
        }
        if (this.props.user.id != 2) {
            // this.props.createThread(thread, this.props.user, 2);
        }


        this.props.attachEventListenerToThreadsRef();
    }

    render() {
        return (
            <div className="container app">
                <div className="row app-one">
                    <Contacts/>
                    <Conversations/>
                </div>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            user: state.user,
            thread: state.thread,
        };
    },
    {
        getMyProfile,
        createThread,
        attachEventListenerToThreadsRef,
        getOrCreateThreadsOtherParticipant
    }
)(Root);
