import React from "react";

class Search extends React.Component {
    state = {
        searchTerm: '',
        searchResults: []
    }

    handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        this.setState({ searchTerm }, () => {
            this.handleSearching(searchTerm);
        });
    };

    handleSearching = (searchTerm) => {
        if(searchTerm.length === 0){
            this.setState({
                searchResults:[]
            })
        }else{
            this.props.handleSearch(searchTerm)
                .then(response => {
                    this.setState({ searchResults: response.data });
                })
        }
    }


    render() {
        return (
            <div>
                <div className={"container"}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                        className="search-input"
                    />
                    <div className="search-results">
                        {this.state.searchResults.map((result, index) => (
                            <div key={index} className="search-result">
                                {result}
                                {!this.props.existsInFollowing(result) && <button onClick={() => this.props.handleFollow(result)} className="follow-button">Follow</button>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Search;
