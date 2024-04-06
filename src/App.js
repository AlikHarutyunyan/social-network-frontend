import './App.css';
import React from "react";
import {BrowserRouter, Route, Routes, NavLink} from "react-router-dom";
import HomePage from "./elements/HomePage";
import Followers from "./elements/Followers";
import axios from "axios";
import LoginPage from "./elements/LoginPage";
import Search from "./elements/Search";
import Following from "./elements/Following";

class App extends React.Component {
    state = {
        user: {
            token: null, name: null, avatar: null, userId: null, following: ["alik"]
        }
    }
    serverUrl = "http://localhost:8080";

    componentDidMount() {
        document.title = "Social Media App";
    }

    existsInFollowing = (name) => {
        return (name === this.state.user.name || this.state.user.following.includes(name));
    }

    createHeaders = () => {
        return {
            headers: {
                'Authorization':
                `${this.state.user.token}`
            }
        }
    }

    handleImageChange = (url) => {
        return axios.post(this.serverUrl + "/updateImage", {
            imageUrl: url, id: this.state.user.userId
        }, this.createHeaders()).catch(err => {
            console.error(err)
        })
    }

    handleFeed = () => {
        return this.getFollowings("Followes").then(r => {
            return axios.post(this.serverUrl + "/feed", {
                names: [...r.data, this.state.user.name]
            },  this.createHeaders()).catch(err => {
                console.error(err)
            })
        })
    }

    handlePublish = (text) => {
        return axios.post(this.serverUrl+"/publish", {
            text: text, userId: this.state.user.userId
        },  this.createHeaders()).catch(err => {
            console.error(err)
        })
    }

    addUser = (token, name, avatar, userId) => {
        this.setState({
            user: {
                token: token, name: name, avatar: avatar, userId: userId
            }
        }, () => {
            this.getFollowings("Followes").then(r => {
                this.setState(prevState => ({
                    user: {
                        ...prevState.user, following: r.data
                    }
                }))
            })
        })
    }

    getFollowings = (keyword) => {
        return axios.get(this.serverUrl + "/getUser" + keyword + "/" + this.state.user.userId,  this.createHeaders()).catch(err => {
            console.error(err);
        })
    }

    handleFollow = (name) => {
        axios.post(this.serverUrl + "/follow", {
            followerId: this.state.user.userId, followeName: name
        },  this.createHeaders()).then(r => {
            this.setState(prevState => ({
                user: {
                    ...prevState.user, following: [...prevState.user.following, name]
                }
            }));
        }).catch(err => {
            console.error(err)
        })
    }

    changeImage = (img) => {
        this.setState(prevState => ({
            user: {
                ...prevState.user, avatar: img
            }
        }))
    }

    handleSearch = (name) => {
        return axios.post(this.serverUrl + "/search?name=" + name, null,  this.createHeaders()).catch(err => {
            console.error(err);
        })
    }


    render() {
        return (this.state.user.token != null ? (<BrowserRouter>
                    <div className={"navbar"}>
                        <NavLink className="nav-item" to={"/"}>Home</NavLink>
                        <NavLink className="nav-item" to={"/followers"}>Followers</NavLink>
                        <NavLink className="nav-item" to={"/following"}>Following</NavLink>
                        <NavLink className="nav-item" to={"/search"}>Search</NavLink>
                    </div>
                    <Routes>
                        <Route path="/followers" element={<Followers getConnections={this.getFollowings}/>}/>
                        <Route path="/following" element={<Following getConnections={this.getFollowings}/>}/>
                        <Route path="/search" element={<Search handleFollow={this.handleFollow}
                                                               existsInFollowing={this.existsInFollowing}
                                                               handleSearch={this.handleSearch}/>}/>
                        <Route path="/"
                               element={<HomePage changeImage={this.changeImage}
                                                  handleImageChange={this.handleImageChange}
                                                  handleFeed={this.handleFeed} handlePublish={this.handlePublish}
                                                  user={this.state.user}/>}/>
                    </Routes>
                </BrowserRouter>) : <div>
                <div>
                    <LoginPage addUser={this.addUser}/>
                </div>
            </div>);
    }

}

export default App;
