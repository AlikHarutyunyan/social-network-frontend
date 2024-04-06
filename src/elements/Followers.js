import React from "react";

class Followers extends React.Component {
    state = {
        followers: []
    }

    componentDidMount() {
        this.props.getConnections("Followers").then(r => {
            this.setState({
                followers: r.data
            })
        });
    }

    render() {
        return (
            <div>
                <div className={"container"}>
                    {this.state.followers.map((name, index) => (
                        <div className="follower" key={index}>
                            <div className="follower-name">{name}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Followers;