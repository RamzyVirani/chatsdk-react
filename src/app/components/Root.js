import React, {Component} from 'react';
import {connect} from 'react-redux';
import Contacts from "./Contacts";
import Conversations from "./Conversations";
import {getMyProfile, getAuth} from "../actions/user"

class Root extends Component {
    componentWillMount() {
        // fromWeb will be true when we will set the state from php.
        // if (this.props.user.fromWeb) {
        this.props.getAuth();
        console.log('user:', this.props.user.id)
        this.props.getMyProfile(this.props.user.id, this.props.user);

        // }
    }

    render() {
        return (
            <div className="container app">
                <div className="row app-one">
                    <Contacts/>
                    <Conversations/>
                </div>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            user: state.user,
        };
    },
    {getMyProfile, getAuth}
)(Root);
