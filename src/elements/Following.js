import React from "react";

class Following extends React.Component {
    state = {
        followings: []
    }

    componentDidMount() {
        this.props.getConnections("Followes").then(r => {
            this.setState({
                followings: r.data
            })
        });
    }

    render() {
        return (
            <div>
                <div className={"container"}>
                    {this.state.followings.map((name, index) => (
                        <div className="follower" key={index}>
                            <div className="follower-name">{name}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Following;