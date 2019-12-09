import React, {Component} from 'react';
import {connect} from "react-redux";
import Moment from "react-moment";
import {DATE_FORMAT_OPTIONS} from "../constants"
import {setThreadDetails} from "../helpers";


class ContactSingle extends Component {
    constructor(props) {
        super(props);
        let thread = this.props.thread || null;
        this.checkUnreadMesage = this.checkUnreadMesage.bind(this);
        this.checkOnline = this.checkOnline.bind(this);
        this.unread_count = [];
    }

    checkUnreadMesage(type) {
        let message = this.props.thread.messages[type];
        return message.read[this.props.user.id] && message.read[this.props.user.id].status == 0;
    }

    checkOnline(user_id) {
        return user_id != this.props.user.id;
    }

    render() {
        let text = null;
        let usersKey = null;
        let thread = this.props.thread || null;
        if (!(thread && thread.details && thread.details.image)) {
            return "";
        }
        if (thread !== null) {
            let message = thread.messages && Object.keys(thread.messages).map((message, id) => {
                text = thread.messages[message].json_v2.text
                return false;
            })
        }
        if (thread.messages) {
            this.unread_count = Object.keys(thread.messages).filter(this.checkUnreadMesage);
        }
        if (thread.users) {
            usersKey = Object.keys(thread.users).find(this.checkOnline);
        }
        return (
            <div className={this.props.id == this.props.open ? "row sideBar-body active" : "row sideBar-body"}
                 onClick={() => this.props.onClick(this.props.id)}>
                <div className="col-sm-3 col-xs-3 sideBar-avatar">
                    <div className="avatar-icon">
                        <img src={thread.details.image}/>
                        {this.props.user.online.hasOwnProperty(usersKey) && this.props.user.online[usersKey].status == 1 ?
                            <span className="show-online"></span> : null}
                    </div>
                </div>
                <div className="col-sm-9 col-xs-9 sideBar-main">
                    <div className="row">
                        <div className="col-sm-8 col-xs-8 sideBar-name">
                            <span className="name-meta">{thread.details.name}</span>
                            {this.unread_count.length > 0 ?
                                <span className="count-meta">({this.unread_count.length})</span> : null}
                            <p className="text-meta">{text}</p>
                        </div>
                        <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                        <span className="time-meta pull-right">
                            {thread.lastMessage &&
                            <Moment fromNow withTitle format="YYYY-MM-DD"
                                    titleFormat="YYYY-MM-DD HH:mm">{thread.lastMessage.date}</Moment>}
                        </span>
                        </div>
                    </div>
                </div>
            </div>);

    }
}

export default connect(
    (state, ownerProps) => {
        let thread = setThreadDetails(state.thread.threads[ownerProps.id], state.user.users, state.user.id);
        return {
            thread,
            user: state.user,
            open: state.thread.open,
        };
    },
    {}
)(ContactSingle);
