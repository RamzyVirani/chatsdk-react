import React, {Component} from 'react';
import {connect} from "react-redux";
import {attachEventListenersToThreads, openThread} from "../actions/thread"
import ContactSingle from "./ContactSingle";


class Contacts extends Component {
    /*componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.props.user != nextProps.user && nextProps.user.hasOwnProperty('threads') && this.props.user.threads != nextProps.user.threads) {
            console.log("THIS WILL UPDATE");
            attachEventListenersToThreads(nextProps.user.threads, this.props.user.id)
        }
    }*/

    constructor(props) {
        super(props);
        this.onClickContactSingle = this.onClickContactSingle.bind(this);
    }

    componentWillMount() {
        if (this.props.user.hasOwnProperty('threads')) {
            this.props.attachEventListenersToThreads(this.props.user.threads, this.props.user.id)
        }
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
        let name = null, image = null;
        if (user) {
            name = user.meta && user.meta.name;
            image = user.meta && user.meta.pictureURL;
        }
        return (
            <div className="col-sm-4 side">
                <div className="side-one">
                    <div className="row heading">
                        <div className="col-sm-12 col-xs-12 heading-avatar">
                            <div className="heading-avatar-icon">
                                <img src={image ? image : "http://shurl.esy.es/y"}/>
                                {" " + name}
                            </div>
                        </div>
                    </div>
                    <div className="row sideBar">
                        {threads && Object.keys(threads).map(threadId => {
                            return (<ContactSingle key={threadId} id={threadId} onClick={this.onClickContactSingle}/>);
                        })}
                    </div>
                </div>
                {/*<div className="side-two">
                    <div className="row newMessage-heading">
                        <div className="row newMessage-main">
                            <div className="col-sm-2 col-xs-2 newMessage-back">
                                <i className="fa fa-arrow-left" aria-hidden="true"></i>
                            </div>
                            <div className="col-sm-10 col-xs-10 newMessage-title">
                                New Chat
                            </div>
                        </div>
                    </div>
                    <div className="row composeBox">
                        <div className="col-sm-12 composeBox-inner">
                            <div className="form-group has-feedback">
                                <input id="composeText" type="text" className="form-control" name="searchText"
                                       placeholder="Search People"/>
                                <span className="glyphicon glyphicon-search form-control-feedback"></span>
                            </div>
                        </div>
                    </div>
                    <div className="row compose-sideBar">
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row sideBar-body">
                            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                                <div className="avatar-icon">
                                    <img src="http://shurl.esy.es/y"/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main">
                                <div className="row">
                                    <div className="col-sm-8 col-xs-8 sideBar-name">
                    <span className="name-meta">Ankit Jain
                  </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span className="time-meta pull-right">18:18
                  </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>*/}
            </div>
        );
    }
}


export default connect(
    state => {
        let threads = state.thread.threads || null;
        let firstThread = null;
        if (threads !== null) {
            firstThread = Object.keys(threads)[0] !== undefined ? Object.keys(threads)[0] : null;
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
