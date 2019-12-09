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
            // this.el.scrollIntoView({behavior: 'smooth'});
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
            <div className="col-sm-8 conversation">
                <div className="row heading">
                    <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar">
                        <div className="heading-avatar-icon">
                            <img src={thread.details.image}/>
                        </div>
                    </div>
                    <div className="col-sm-8 col-xs-7 heading-name">
                        <a className="heading-name-meta">{thread.details.name}</a>
                        {/*<span className="heading-online">Last seen at
                            <Moment fromNow withTitle format="HH:mm"
                                    titleFormat="YYYY-MM-DD HH:mm">{}</Moment>
                        </span>*/}
                        {this.props.user.online.hasOwnProperty(usersKey) && this.props.user.online[usersKey].status == 1 ?
                            <span className="heading-online">Online</span> :
                            this.props.user.online.hasOwnProperty(usersKey) ?
                                <span className="heading-online">{"Last seen at "}
                                    <Moment startOf="hour" fromNow>{this.props.user.online[usersKey].time}</Moment>
                        </span> : null}

                    </div>
                    <div className="col-sm-1 col-xs-1  heading-dot pull-right">
                        <i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="row message" id="conversation">
                    {/*TODO: We need to maintain a total_messages prop in threads object to maintain show or hide "Show Previous Message" button*/}
                    {/*{Object.entries(thread.messages).length > 19 ?
                        <div className="row message-previous">
                            <div className="col-sm-12 previous">
                                <a id="ankitjain28" name="20" onClick={this.getPreviousMessages}>
                                    Show Previous Message!
                                </a>
                            </div>
                        </div> : null
                    }*/}

                    {thread.messages && Object.keys(thread.messages).map((message, id) => {
                        // console('mesasge', thread.messages[message]);
                        return this.renderSingleMessage(thread.messages[message], message);
                    })}

                    <span id="messages-bottom" ref={el => {
                        this.el = el;
                    }}/>
                </div>
                <div className="row reply">
                    {/*<div className="col-sm-1 col-xs-1 reply-emojis">
                        <i className="fa fa-smile-o fa-2x"></i>
                    </div>*/}
                    <div className="col-sm-11 col-xs-11 reply-main">
                        <textarea className="form-control" rows="1" id="comment"
                                  onChange={this.setText} onKeyDown={this.sendMessageOnEnter}
                                  value={this.state.text}></textarea>
                    </div>
                    {/*<div className="col-sm-1 col-xs-1 reply-recording">
                        <i className="fa fa-microphone fa-2x" aria-hidden="true"></i>
                    </div>*/}
                    <div className="col-sm-1 col-xs-1 reply-send" onClick={this.sendMessage}>
                        <i className="fa fa-send fa-2x" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        );
    }

    renderSingleMessage(message, id) {
        let container = "message-main-receiver";
        let text = "receiver";

        if (message["user-firebase-id"] == this.props.user.id) {
            container = "message-main-sender";
            text = "sender";
        }
        let status = this.checkMessageStatus(message.read, this.props.user.id);

        return (
            <div className="row message-body" key={id}>
                <div className={["col-sm-12 " + container]}>
                    <div className={text}>
                        <div className="message-text">
                            {message.json_v2 && message.json_v2.text}
                        </div>
                        <div className={"message-status " + status}>
                            {status ? <i className="fa fa-check seen"></i> :
                                <i className="fa fa-check"></i>}

                        </div>

                        <span className="message-time pull-right">
                        <Moment fromNow withTitle format="HH:mm"
                                titleFormat="YYYY-MM-DD HH:mm">{message.date}</Moment>
                    </span>
                    </div>
                </div>
            </div>);
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
