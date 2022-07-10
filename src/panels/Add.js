import React from 'react';
import logo from '../img/logo.png'
import bridge from '@vkontakte/vk-bridge';
import { getDatabase, set, ref, onValue } from "firebase/database";

class Add extends React.Component {
   
	constructor(props){
        super(props)
        
	}
    componentDidMount(){

    }
   
    add = () => {
        var data = {
            user : this.props.user,
            album : []
        }
        bridge.send("VKWebAppAddToProfile", {"ttl" : 0});
        set(ref(this.props.db, 'albums/' + this.props.user.id), data);
        this.props.openView('main')
    }
	render() {
	  return (
		<div className="main_container">
            <img className="logo" src={logo}/>
            <p className="name_title descr_add">Добавьте ссылку к себе на страницу, чтобы люди могли оставить вам автографы</p>
            <div onClick={this.add} className="center_hor add_btn sign_text_btn">Добавить</div>
        </div>
	  )
	}
  }
  export default Add;


