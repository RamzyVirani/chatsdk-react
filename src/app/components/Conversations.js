import React, {Component} from 'react';
import {connect} from "react-redux";
import Moment from "react-moment";
import cloneDeep from "lodash/cloneDeep"
import {sendMessage} from "../actions/thread"

class Conversations extends Component {

    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMessageOnEnter = this.sendMessageOnEnter.bind(this);
        this.setText = this.setText.bind(this);
        this.state = {
            text: ""
        };
    }

    sendMessageOnEnter(e) {
        if (e.keyCode == 13 && e.shiftKey == false) {
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

    render() {
        let thread = this.props.thread || null;
        if (!(thread && thread.details && thread.details.image)) {
            return ("Click on a thread to view conversation");
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
                        {/*<span className="heading-online">Online</span>*/}
                    </div>
                    <div className="col-sm-1 col-xs-1  heading-dot pull-right">
                        <i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="row message" id="conversation">
                    {/*TODO: We need to maintain a total_messages prop in threads object to maintain show or hide "Show Previous Message" button*/}
                    {/*<div className="row message-previous">*/}
                    {/*<div className="col-sm-12 previous">*/}
                    {/*<a id="ankitjain28" name="20">*/}
                    {/*Show Previous Message!*/}
                    {/*</a>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {thread.messages && Object.keys(thread.messages).map((message, id) => {
                        return this.renderSingleMessage(thread.messages[message], message);
                    })}


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

        return (<div className="row message-body" key={id}>
            <div className={["col-sm-12 " + container]}>
                <div className={text}>
                    <div className="message-text">
                        {message.json_v2 && message.json_v2.text}
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
        let thread = state.thread.threads[state.thread.open];
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
            id: state.thread.open,
            user: state.user,
            thread
        };
    },
    {sendMessage}
)(Conversations);
