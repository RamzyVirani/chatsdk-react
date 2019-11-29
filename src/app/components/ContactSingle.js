import React, {Component} from 'react';
import {connect} from "react-redux";
import Moment from "react-moment";
import {DATE_FORMAT_OPTIONS} from "../constants"
import {setThreadDetails} from "../helpers";


class ContactSingle extends Component {
    render() {
        let text = null;
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
        return (
            <div className={this.props.id == this.props.open ? "row sideBar-body active" : "row sideBar-body"}
                 onClick={() => this.props.onClick(this.props.id)}>
                <div className="col-sm-3 col-xs-3 sideBar-avatar">
                    <div className="avatar-icon">
                        <img src={thread.details.image}/>
                    </div>
                </div>
                <div className="col-sm-9 col-xs-9 sideBar-main">
                    <div className="row">
                        <div className="col-sm-8 col-xs-8 sideBar-name">
                            <span className="name-meta">{thread.details.name}</span>
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
