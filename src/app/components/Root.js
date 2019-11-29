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
        let customer_thread_admin = {
            "details": {
                "creation-date": new Date().getTime(),
                "creator-entity-id": this.props.user.id,
                "name": "",
                "type": 0,
                "type_v4": 2
            },
            "users": {
                "2": "member",
                [user_id]: "owner"
            }
        }
        let painter = null;
        let project_manager = null;
        let customer_thread_manager = null;
        let customer_thread_painter = null;
        if (this.props.painter) {
            painter = this.props.painter;
            customer_thread_painter = {
                "details": {
                    "creation-date": new Date().getTime(),
                    "creator-entity-id": painter.id,
                    "name": "",
                    "type": 0,
                    "type_v4": 2
                },
                "users": {
                    [user_id]: "owner",
                    [painter.id]: "member"
                }
            }
        }
        if (this.props.project_manager) {
            project_manager = this.props.project_manager;
            customer_thread_manager = {
                "details": {
                    "creation-date": new Date().getTime(),
                    "creator-entity-id": project_manager.id,
                    "name": "",
                    "type": 0,
                    "type_v4": 2
                },
                "users": {
                    [user_id]: "owner",
                    [project_manager.id]: "member"
                }
            }
        }
        // Hardcode create admin thread if not found.

        // if (this.props.user.fromWeb) {
        // fromWeb will be true when we will set the state from php.
        this.props.getMyProfile(this.props.user.id, this.props.user);
        // }
        if (this.props.user.id != 2 && this.props.user.hasOwnProperty('threads')) {
            this.props.getOrCreateThreadsOtherParticipant(this.props.user.threads, customer_thread_admin, 2, this.props.user)
        }
        if (customer_thread_painter != null && this.props.user.hasOwnProperty('threads')) {
            this.props.getOrCreateThreadsOtherParticipant(this.props.user.threads, customer_thread_painter, painter.id, this.props.user, painter)
        }
        if (customer_thread_manager != null && this.props.user.hasOwnProperty('threads')) {
            this.props.getOrCreateThreadsOtherParticipant(this.props.user.threads, customer_thread_manager, project_manager.id, this.props.user, project_manager)
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
            painter: state.painter || null,
            project_manager: state.project_manager || null,
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
