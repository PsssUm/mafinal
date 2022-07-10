import React from 'react';
import left from '../img/left.svg'
import { getDatabase, set, ref, onValue } from "firebase/database";

class TextSign extends React.Component {
   
	constructor(props){
        super(props)
        this.state = {
            text : ""
        }
        this.handleChange = this.handleChange.bind(this)
	}
    componentDidMount(){

    }
    handleChange(event){
        if (event){
            var value = event.target.value
            this.setState({text : value})
        }
    }
    saveSign = () => {
        const iAm = this.props.user
        var user = this.props.dbUser
        const newSign = {type : 0, text : this.state.text, name : (iAm.first_name + " " + iAm.last_name), user_id : iAm.id}
        if (user.album == undefined || user.album.length == 0){
            user.album = [newSign]
        } else {
            if (user.album != undefined && user.album.length > 1){
                user.album.reverse()
            }
            user.album.push(newSign)
        }
        console.log("saveSign user = " + JSON.stringify(user))
        set(ref(this.props.db, 'albums/' + user.user.id), user);
        this.props.onTypePicked(-1)
    }
	render() {
	  return (
		<div className="text_sign_screen">
            <div className="nav_text_sign">
                <div onClick={() => this.props.onTypePicked(-1)} className="back_cont">
                    <img src={left}/>
                </div>
                <p className="sign_title">Оставить автограф</p>
                
            </div>    
            <textarea className="sign_textarea" placeholder="Ваш текст" onChange={this.handleChange} value={this.state.text}/>
            <div onClick={this.saveSign} className="center_hor sign_text_btn">Оставить</div>
        </div>
	  )
	}
  }
  export default TextSign;


