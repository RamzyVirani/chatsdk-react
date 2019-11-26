import React, {Component} from 'react';
import {connect} from "react-redux";
import Moment from "react-moment";
import {DATE_FORMAT_OPTIONS} from "../constants"


class ContactSingle extends Component {
    render() {
        let thread = this.props.thread || null;
        if (!(thread && thread.details && thread.details.image)) {
            return "";
        }

        return (<div className="row sideBar-body" onClick={() => this.props.onClick(this.props.id)}>
            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                <div className="avatar-icon">
                    <img src={thread.details.image}/>
                </div>
            </div>
            <div className="col-sm-9 col-xs-9 sideBar-main">
                <div className="row">
                    <div className="col-sm-8 col-xs-8 sideBar-name">
                        <span className="name-meta">{thread.details.name}</span>
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
        let thread = state.thread.threads[ownerProps.id];
        if (thread && thread.details && thread.users) {
            // If group then thread.details.name would not be empty;
            if (thread.details.name == "") {
                let otherId;
                for (let userid in thread.users) {
                    if (userid != state.user.id) {
                        otherId = userid;
                        break;
                    }
                }
                thread.details.name = state.user.users[otherId].meta.name;
                thread.details.image = state.user.users[otherId].meta.pictureURL;
            }
        }
        return {
            thread,
            user: state.user
        };
    },
    {}
)(ContactSingle);
