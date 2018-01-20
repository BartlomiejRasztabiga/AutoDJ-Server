import React, {Component} from 'react';

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import VotePanel from './votePanel/VotePanel'

import './App.css';


class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/voting">Voting</Link></li>
                    </ul>

                    <hr/>

                    <Route path="/voting" component={VotePanel}/>
                </div>
            </Router>
        )
    };
}

export default App;
