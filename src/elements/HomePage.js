import React from "react";
import img from "../images/notfound.png"

class HomePage extends React.Component {
    state = {
        postText: '',
        feed: null,
        imageChange: false,
        error: '',
        imageText: ''
    };

    componentDidMount() {
        this.handleFeed()
    }

    handleFeed = () => {
        this.props.handleFeed().then(r => {
            this.setState({
                feed: r.data
            })
        })
    }

    handleInputChange = (e) => {
        this.setState({postText: e.target.value});
    };

    handleImageInputChange = (e) => {
        this.setState({imageText: e.target.value});
    };

    handlePost = () => {
        if (this.state.postText.length === 0 || this.state.postText.length > 500) {
            this.setState({
                error: "Post can't be blank or above 500 characters"
            })
            return
        }
        this.props.handlePublish(this.state.postText).then(r => {
            this.setState({
                postText: '',
                error: ''
            }, () => {
                this.handleFeed();
            })
        })
    }

    handleImageClick = () => {
        this.setState({
            imageChange: !this.state.imageChange
        })
    }

    handleImageChange = () => {
        this.props.handleImageChange(this.state.imageText).then(() => {
            const url = this.state.imageText;
            this.props.changeImage(url);
            this.setState({
                imageText: '',
                imageChange: false
            })
        })
    }

    static formattedDateTime = new Intl.DateTimeFormat('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })

    render() {
        return (<div>
            <div className="container">
                <div className="profile">
                    <img onClick={this.handleImageClick} onError={(event) => {
                        event.target.src = img;
                    }} className="profile-image" src={this.props.user.avatar ? this.props.user.avatar : ''}
                         alt="Profile"/>
                    <div style={{display: this.state.imageChange ? "block" : "none"}}>
                        <input onChange={this.handleImageInputChange}
                               className={"modern-input-field"}
                               placeholder={"Paste image url to change"}
                               type="text"/>
                        <button onClick={this.handleImageChange} className={"blue-button"}>Change Avatar</button>
                    </div>
                    <div className="profile-name">{this.props.user.name}</div>
                </div>
                <div className="post-input">
                    <input className={"modern-input-field"}
                           type="text"
                           placeholder="What's on your mind?"
                           value={this.state.postText}
                           onChange={this.handleInputChange}
                    />
                    <button className={"blue-button"} onClick={this.handlePost}>Post</button>
                    {this.state.error && <p style={{color: "red"}}>{this.state.error}</p>}
                </div>
            </div>
            <div id={"post-container"}>
                {this.state.feed && this.state.feed.map((data, index) => {
                    return <div key={index} className="post">
                        <div className="post-header">
                            <div className="post-name">{data['name']}</div>
                            <div
                                className="post-date"> {HomePage.formattedDateTime.format(new Date(data['publishDate']))}</div>
                        </div>
                        <div className="post-text">{data['text']}</div>
                    </div>
                })}
            </div>
        </div>)
    }
}

export default HomePage;