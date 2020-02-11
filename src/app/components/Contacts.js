import React, {Component} from 'react';
import {connect} from "react-redux";
import {attachEventListenersToThreads, openThread} from "../actions/thread"
import ContactSingle from "./ContactSingle";
import {isEmptyStatement} from "@babel/types";


class Contacts extends Component {
    /*componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.props.user != nextProps.user && nextProps.user.hasOwnProperty('threads') && this.props.user.threads != nextProps.user.threads) {
            console.log("THIS WILL UPDATE");
            attachEventListenersToThreads(nextProps.user.threads, this.props.user.id)
        }
    }*/

    constructor(props) {
        super(props);
        this.state = {
            unreadCount: 0
        }
        this.onClickContactSingle = this.onClickContactSingle.bind(this);
    }

    componentWillMount() {
        /*   if (this.props.user.hasOwnProperty('threads')) {
               this.props.attachEventListenersToThreads(this.props.user.threads, this.props.user.id)
           }*/
    }

    onClickContactSingle(threadId) {
        this.props.openThread(threadId);
    }

    render() {
        if (this.props.open_thread !== null && !this.props.open) {
            this.props.openThread(this.props.open_thread);
        }
        let user = this.props.user || null;
        let threads = this.props.threads || null;
        let name = null;
        let image = null;
        if (user != null) {
            name = user.meta && user.meta.name;
            image = user.meta && user.meta.pictureURL;
        }
        return (
            <div className="col-4 col-md-5 col-lg-5 col-xl-4">
                <div className="side-clientinfo">
                    <div className="msg-section">
                        <h3>Messages</h3>
                        <div className="edit-cta"><a data-toggle="modal" data-target="#exampleModalCenter"><i
                            className="far fa-edit"></i></a></div>
                        <div className="searchform">
                            <form>
                                <div className="form-div">
                                    <input type="text" name="" placeholder="Message"/>
                                    <button type="submit"><i className="fas fa-search"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="userdirectory">
                        <ul className="users-list">
                            {threads && Object.keys(threads).map(threadId => {
                                return (
                                    <ContactSingle key={threadId} id={threadId} onClick={this.onClickContactSingle}/>
                                );
                            })}

                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(
    state => {
        let threads = state.thread.threads || null;
        let firstThread = null;
        if (threads !== null) {
            {
                Object.keys(threads).map((thread, key) => {
                    /* if (Object.keys(threads)[key] !== undefined && threads[Object.keys(threads)[key]].hasOwnProperty('messages') && Object.entries(threads[Object.keys(threads)[key]].messages).length > 0) {


                         return false;
                     }*/
                    firstThread = Object.keys(threads)[key];
                })
            }

            /*if (Object.keys(threads)[0] !== undefined && threads[Object.keys(threads)[0]].hasOwnProperty('messages')) {

                firstThread = Object.keys(threads)[0];
            }*/
        }
        return {
            user: state.user,
            threads: state.thread.threads,
            open_thread: firstThread,
            open: state.thread.open == null ? false : true
        };
    },
    {attachEventListenersToThreads, openThread}
)(Contacts);
