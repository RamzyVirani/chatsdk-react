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
            <li className={this.props.id == this.props.open ? "active" : null}
                onClick={() => this.props.onClick(this.props.id)}>
                <h4 className={this.props.user.online.hasOwnProperty(usersKey) && this.props.user.online[usersKey].status == 1 ? "title-user active" : "title-user"}>{thread.details.name}</h4>
                <div className="time-user">{thread.lastMessage &&
                <Moment fromNow withTitle format="DD-MM-YYYY"
                        titleFormat="DD-MM-YYYY HH:mm">{thread.lastMessage.date}</Moment>}</div>
                <p className="status-user">{text}</p>
                {this.unread_count.length > 0 ? <div className="msg-user">{this.unread_count.length}</div> : null}
            </li>
        );

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
