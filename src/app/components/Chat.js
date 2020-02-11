import React, {Component} from 'react';

class Chat extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
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
                                    <li className="notice">
                                        <h4 className="title-user active">Thomas Arkinson</h4>
                                        <div className="time-user">7:50 PM</div>
                                        <p className="status-user">I am ready</p>
                                        <div className="msg-user">2</div>
                                    </li>
                                    <li className="active">
                                        <h4 className="title-user">Thomas Arkinson</h4>
                                        <div className="time-user">7:50 PM</div>
                                        <p className="status-user">I am ready</p>
                                        {/*  {{--<div class="msg-user">2</div>--}}*/}
                                    </li>
                                    <li>
                                        <h4 className="title-user">Thomas Arkinson</h4>
                                        <div className="time-user">7:50 PM</div>
                                        <p className="status-user">I am ready</p>
                                        {/*        {{--<div class="msg-user">2</div>--}}*/}
                                    </li>
                                    <li>
                                        <h4 className="title-user">Thomas Arkinson</h4>
                                        <div className="time-user">7:50 PM</div>
                                        <p className="status-user">I am ready</p>
                                        {/*{{--<div class="msg-user">2</div>--}}*/}
                                    </li>
                                    <li>
                                        <h4 className="title-user">Thomas Arkinson</h4>
                                        <div className="time-user">7:50 PM</div>
                                        <p className="status-user">I am ready</p>
                                        {/*  {{--<div class="msg-user">2</div>--*/}}}
                                    </li>
                                    <li className="notice">
                                        <h4 className="title-user active">Thomas Arkinson</h4>
                                        <div className="time-user">7:50 PM</div>
                                        <p className="status-user">I am ready</p>
                                        <div className="msg-user">2</div>
                                    </li>
                                    <li>
                                        <h4 className="title-user">Thomas Arkinson</h4>
                                        <div className="time-user">7:50 PM</div>
                                        <p className="status-user">I am ready</p>
                                        {/*<div class="msg-user">2</div>*/}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-7 col-lg-7 col-xl-8">
                        <div className="user-messages">
                            <div className="header-top">
                                <h2>Gerald Dean</h2>
                                <div className="arrows-right">
                                    <i className="fas fa-ellipsis-h"></i>
                                </div>
                            </div>
                            <div className="body-message">
                                <div className="user-content">
                                    <p className="user-msg">How are you?</p>
                                    <span className="user-timess">6:50 PM</span>
                                </div>
                                <div className="admin-content">
                                    <div className="admin-msg">I am fine. thanks!</div>
                                    <span className="admin-timess">7:00 PM</span>
                                </div>
                                <div className="admin-content">
                                    <div className="admin-msg">This is dummy copy. It is not meant to be read. It has
                                        been placed here solely to demonstrate the look and feel.
                                    </div>
                                    <span className="admin-timess">7:05 PM</span>
                                </div>
                                <div className="user-content">
                                    <p className="user-msg">This is dummy copy. It is not meant to be read. It has
                                        been placed here solely to demonstrate the look and feel.</p>
                                    <span className="user-timess">6:50 PM</span>
                                </div>
                                <div className="admin-content">
                                    <div className="admin-msg">This is dummy copy. It is not meant to be read.
                                    </div>
                                    <span className="admin-timess">7:05 PM</span>
                                </div>
                                <div className="user-content">
                                    <p className="user-msg">This is dummy copy.</p>
                                    <span className="user-timess">6:50 PM</span>
                                </div>
                                <div className="user-content">
                                    <p className="user-msg">Thank You</p>
                                    <span className="user-timess">6:50 PM</span>
                                </div>

                            </div>
                            <div className="msg-box">
                                <div className="form-sec">
                                    <form action="">
                                        <input className="comments-section" type="text" name=""
                                               placeholder="Type a message here" required/>
                                        <button type="submit"><img
                                            src={window.location.origin + "/assets/images/arrow-submit.png"}/>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Chat;