import React, {Component} from 'react';
import {connect} from "react-redux";
import Moment from "react-moment";
import cloneDeep from "lodash/cloneDeep"
import {sendMessage, getPreviousMessages, readMessage} from "../actions/thread"
import {getOtherUser, setThreadDetails} from "../helpers";

class Conversations extends Component {

    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMessageOnEnter = this.sendMessageOnEnter.bind(this);
        this.setText = this.setText.bind(this);
        this.checkOnline = this.checkOnline.bind(this);
        this.checkMessageStatus = this.checkMessageStatus.bind(this);
        this.state = {
            text: "",
        };
        this.getPreviousMessages = this.getPreviousMessages.bind(this);
    }

    checkMessageStatus(read, currentId) {
        let status = false;
        Object.keys(read).map(function (user_id) {
            if (user_id != currentId && read[user_id].status == 1) {
                status = true;
            }
        });
        return status;
    }

    scrollToBottom() {
        if (!!this.el) {
            var target = document.getElementById("messages-bottom");
            if (target !== 'undefined') {
                target.parentNode.scrollTop = target.offsetTop;
            }
        }
    }

    componentDidMount() {
        this.scrollToBottom();
        this.props.readMessage(this.props.id, this.props.user);
    }

    componentDidUpdate() {
        this.scrollToBottom();
        this.props.readMessage(this.props.id, this.props.user);
    }

    getPreviousMessages(e) {
        e.preventDefault();
        this.props.getPreviousMessages(this.props.open, this.props.user.id, Object.keys(this.props.thread.messages).length)
    }

    sendMessageOnEnter(e) {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.sendMessage();
            return;
        }
    }

    setText(e) {
        this.setState({
            text: e.target.value
        })
    }

    sendMessage() {
        let text = this.state.text;
        let readStatus = {status: 0};
        let msg = {
            date: new Date().getTime(),
            json_v2: {
                text
            },
            read: {},
            type: 0,
            "user-firebase-id": this.props.user.id
        };
        Object.keys(this.props.thread.users).forEach((userId) => {
            if (userId != this.props.user.id) {
                msg.read[userId] = cloneDeep(readStatus);
            }
        });
        this.props.sendMessage(msg, this.props.id, this.props.user.meta.name)
        this.setState({
            text: ""
        })
    }

    checkOnline(user_id) {
        return user_id != this.props.user.id;
    }

    render() {
        let thread = this.props.thread || null;
        let usersKey = null;
        let member = null;
        if (thread !== null && thread.hasOwnProperty("users")) {
            let memberId = getOtherUser(thread, this.props.user.id);
            if (this.props.users && this.props.users.hasOwnProperty(memberId)) {
                member = this.props.users[memberId];
            }
        }
        if (!(thread && thread.details && thread.details.image && member)) {
            return ("Loading Conversation....");
        }
        if (thread.users) {
            usersKey = Object.keys(thread.users).find(this.checkOnline);
        }
        return (
            <div className="col-12 col-md-7 col-lg-7 col-xl-8">
                <div className="user-messages">
                    <div className="header-top">
                        {/*                        {this.props.user.online.hasOwnProperty(usersKey) && this.props.user.online[usersKey].status == 1 ?
                            <span className="heading-online">Online</span> :
                            this.props.user.online.hasOwnProperty(usersKey) ?
                                <span className="heading-online">{"Last seen at "}
                                    <Moment startOf="hour" fromNow>{this.props.user.online[usersKey].time}</Moment>
                          </span> : null}*/}
                        <h2 className={this.props.user.online.hasOwnProperty(usersKey) && this.props.user.online[usersKey].status == 1 ? "active" : null}>{thread.details.name}</h2>
                        <div className="arrows-right">
                            <i className="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                    <div className="body-message">
                        {thread.messages && Object.keys(thread.messages).map((message, id) => {
                            return this.renderSingleMessage(thread.messages[message], message);
                        })}
                        <span id="messages-bottom" ref={el => {
                            this.el = el;
                        }}/>
                    </div>
                    <div className="msg-box">
                        <div className="form-sec">
                            <form action="">
                                <input className="comments-section" type="text" name=""
                                       placeholder="Type a message here" onChange={this.setText}
                                       onKeyDown={this.sendMessageOnEnter}
                                       value={this.state.text} required/>
                                <button type="button" onClick={this.sendMessage}><img
                                    src={window.location.origin + "/assets/images/arrow-submit.png"}/>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderSingleMessage(message, id) {
        let container = "user-content";
        let text = "user-msg";
        let times = "user-timess";

        if (message["user-firebase-id"] == this.props.user.id) {
            container = "admin-content";
            text = "admin-msg";
            times = "admin-timess";
        }
        let status = this.checkMessageStatus(message.read, this.props.user.id);

        return (
            <div className={container} key={id}>
                <p className={text}>{message.json_v2 && message.json_v2.text}</p>
                {/*<div className={"message-status " + status}>
                    {status ? <i className="fa fa-check seen"></i> :
                        <i className="fa fa-check"></i>}

                </div>*/}
                <span className={times}>
                <Moment fromNow withTitle format="HH:mm" titleFormat="YYYY-MM-DD HH:mm">{message.date}</Moment>
            </span>
            </div>
        )
            ;
    }
}

export default connect(
    (state, ownerProps) => {
        let thread = setThreadDetails(state.thread.threads[state.thread.open], state.user.users, state.user.id);
        return {
            id: state.thread.open,
            user: state.user,
            users: state.user.users,
            open: state.thread.open,
            thread
        };
    },
    {sendMessage, getPreviousMessages, readMessage}
)(Conversations);
