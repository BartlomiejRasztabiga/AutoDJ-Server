import React, {Component} from 'react';
import SearchInput from 'react-search-input'
import {ToastContainer, toast} from 'react-toastify';
import $ from 'jquery';

class VotePanel extends Component {

    deviceId = 'ffbf660048ef714c8f7899778a03cce0a5d65d1e';

    votingServerURL = 'http://localhost:5280';

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            tracks: [],
            authToken: ''
        };

        this.onUpdate = this.onUpdate.bind(this);
        this.onTrackSubmit = this.onTrackSubmit.bind(this);
    }

    componentDidMount() {
        this.getSpotifyApiToken();
    }

    render() {
        return (
            <div>
                <ToastContainer/>
                <SearchInput className="search-input" onChange={this.onUpdate}/>
                {this.state.tracks.map(track => {
                    return (
                        <div className="track" key={track.id} onClick={this.onTrackSubmit.bind(this, track.uri)}>
                            <div>{track.artists[0].name} - {track.name}</div>
                        </div>
                    )
                })}
            </div>
        );
    }



    onUpdate(term) {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.spotify.com/v1/search?q=" + encodeURI(term) + "&type=track",
            "method": "GET",
            "headers": {
                "accept": "application/json",
                "authorization": this.state.authToken
            }
        };

        let that = this;

        $.ajax(settings).done(function (response) {
            console.log(response);
            that.setState({
                searchTerm: term,
                tracks: response.tracks.items
            })
        });
    }

    onTrackSubmit(uri) {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.spotify.com/v1/me/player/play?device_id=" + this.deviceId,
            "method": "PUT",
            "headers": {
                "accept": "application/json",
                "authorization": this.state.authToken,
                "content-type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify({
                "uris": [uri]
            })
        };

        let that = this;

        $.ajax(settings).done(function (response) {
            console.log(response);
            toast("Played a song on " + that.deviceId)
        });
    }

    getSpotifyApiToken() {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.votingServerURL + "/token",
            "method": "GET"
        };

        let that = this;

        $.ajax(settings).done(function (response) {
            that.setState({
                authToken: "Bearer " + response.access_token
            });
        });
    }
}

export default VotePanel;