import React from "react";
import axios, {HttpStatusCode} from "axios";

class Followers extends React.Component{
    state = {
        activeTab: 'signIn',
        login: '',
        password: '',
        error:'',
        success:''
    };

    handleTabChange = (tab) => {
        this.setState({
            activeTab: tab,
            error: '',
            success:''
        });
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleBtnClick = () => {
        let errorMessage;
        if(this.state.login.trim() === "" || this.state.password.trim() === ""){
            errorMessage = "Login or Password cannot be blank";
            this.setState({
                error:errorMessage
            })
        }else{
            axios.post("http://localhost:8080/"+this.state.activeTab,{
                login: this.state.login,
                password: this.state.password
            }).then(r => {
                if(this.state.activeTab === "signUp"){
                    this.setState({
                        success:"Registered successfully! You can sign in now!"
                    })
                }else{
                    this.props.addUser(r.data.token,r.data.login,r.data.avatar, r.data.id);
                }
            }).catch(err => {
                errorMessage = "Unknown Error, Try Again Later"
                if(err.response.status === HttpStatusCode.Unauthorized){
                    errorMessage = "Invalid Login Or Password"
                }else if(err.response.status === HttpStatusCode.NotAcceptable){
                    errorMessage = "Username Already Exists"
                }
            }).finally(() =>{
                this.setState({
                    error:errorMessage
                })
            })
        }
    }

    render(){
        const { activeTab } = this.state;
        return(<div className={"login-div"}>
            <div className="navbar">
                <div className={`nav-item ${activeTab === 'signIn' ? 'active' : ''}`}
                     onClick={() => this.handleTabChange('signIn')}>
                    Sign In
                </div>
                <div className={`nav-item ${activeTab === 'signUp' ? 'active' : ''}`}
                     onClick={() => this.handleTabChange('signUp')}>
                    Sign Up
                </div>
            </div>
            <input name="login" className={"login-input"} type="text" placeholder={"login"} onChange={this.handleInputChange}/>
            <br/>
            <input name="password" className={"login-input"} type="password" placeholder={"password"} onChange={this.handleInputChange}/>
            <button onClick={this.handleBtnClick} className={"login-btn"}>{this.state.activeTab === "signIn"? "Sign In" : "Sign Up"}</button>
            {this.state.error && <p style={{color:'red'}} className="error">{this.state.error}</p>}
            {this.state.success && <p style={{color:'green'}} className="error">{this.state.success}</p>}
        </div>)
    }
}

export default Followers;