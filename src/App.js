import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, Root, Panel } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './styles/styles.css'
import Main from './panels/Main';

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, onValue } from "firebase/database";
import { getUrlParameter } from './utils/Utils';
import Add from './panels/Add';
import CustomSign from './panels/CustomSign';

const firebaseConfig = {
	apiKey: "AIzaSyCI91wZXP2eaX-PDZ7vcUQITTDrKjksPBQ",
	authDomain: "vk-mini-apps-3d40e.firebaseapp.com",
	projectId: "vk-mini-apps-3d40e",
	storageBucket: "vk-mini-apps-3d40e.appspot.com",
	messagingSenderId: "313555575143",
	appId: "1:313555575143:web:64979e52b58521bf25cfc2",
	databaseURL:'https://vk-mini-apps-3d40e-default-rtdb.europe-west1.firebasedatabase.app/',
	measurementId: "G-8VWSLCYJHK"
  };

class App extends React.Component {
   
	constructor(){
		super()
		this.state = {
			activeView : 'main',
			db : {},
			log : "",
			isMyAlbum : false,
			user : {},
			isNewUser : false,
			dbUser : {},
			isBlockedSign : false,
			isBLockedWatch : false
		}
		
	}
	componentDidMount(){
		const app = initializeApp(firebaseConfig);
		this.database = getDatabase(app);
		this.setState({db : this.database})
		bridge.send("VKWebAppInit");
		bridge.send("VKWebAppGetUserInfo");
		bridge.subscribe(this.onBridgeResult);
		var vk_profile_id = getUrlParameter("vk_profile_id")
		console.log("vk_profile_id 1 = " + vk_profile_id)
		
		this.vk_profile_id = vk_profile_id
		console.log("vk_profile_id 2 = " + this.vk_profile_id)
	}
	onBridgeResult = (e) => {
        switch (e.detail.type) {
            
            case "VKWebAppInitResult":
				//this.setState({log : JSON.stringify(e)})
				//bridge.send("VKWebAppAddToProfile", {"ttl" : 0});
            break;
            case "VKWebAppAddToProfileResult":
				//this.setState({log : JSON.stringify(e)})
            break;
            case "VKWebAppShowStoryBoxFailed":
				console.log("failed story - " + JSON.stringify(e.detail.data))
            break;
            case "VKWebAppGetUserInfoResult":
				//this.setState({log : JSON.stringify(e.detail.data)})
				console.log("vk_profile_id 3 = " + this.vk_profile_id)
				console.log("myid 3 = " + e.detail.data.id)
				

				if (this.vk_profile_id == undefined || this.vk_profile_id == "" || this.vk_profile_id == "undefined"){
					this.vk_profile_id = e.detail.data.id
				}
				
				if (this.vk_profile_id == e.detail.data.id){
					this.setState({isMyAlbum : true})
				}
				this.setState({user : e.detail.data})
				this.checkUserInDb(e.detail.data)
				this.myId = e.detail.data.id
			break;
			
            default: 
            break;
        }
	}
	getDbUser = (user) => {
		const checkIsUserIngame = ref(this.state.db, 'albums/' + this.vk_profile_id);
		onValue(checkIsUserIngame, this.onFound);
	}
	checkUserInDb = (user) => {
		const checkIsUserIngame = ref(this.state.db, 'albums/' + user.id);
		onValue(checkIsUserIngame, this.onUserFoundInDB);
	}
	onUserFoundInDB = (snapshot) => {
		var data = snapshot.val();
		console.log("vk_profile_id = " + this.vk_profile_id)
		console.log("vk_profile_id 2 = " + getUrlParameter("vk_profile_id"))
        console.log("onUserFoundInDB = " + JSON.stringify(data))
        if ((data == null || data == undefined) && (getUrlParameter("vk_profile_id") == null || getUrlParameter("vk_profile_id") == undefined)){
			this.setState({isNewUser : true, activeView : 'add'})
			console.log("isNewUser = true")
            return
		}
		this.getDbUser()
		
		
	}
	onFound = (snapshot) => {
		var data = snapshot.val();
		if (data != null && data != undefined && data.user != undefined){
			console.log("onFound")
			if (this.myId != data.user.id){
				if (data.can_sign_list != undefined && data.can_sign_list.length > 0){
					this.setState({isBlockedSign : !data.can_sign_list.includes(this.myId)})
				}
	
				if (data.can_watch_list != undefined && data.can_watch_list.length > 0){
					this.setState({isBLockedWatch : !data.can_watch_list.includes(this.myId)})
				}
			}
			
			if (data.album != undefined && data.album.length > 1){
				data.album.reverse()
			}
			this.setState({dbUser : data})
		} else {
			console.log("onFound not id = " + this.vk_profile_id)
		}
	}
	openView = (view) => {
		if (view == 'main'){
			bridge.send("VKWebAppGetUserInfo");
		}
		this.setState({activeView : view})
	}
	render() {
	  return (
		<AdaptivityProvider>
			<AppRoot>
				
					<Root activeView={this.state.activeView}>
						<View id="main" activePanel="main_panel">
							<Panel id="main_panel">
								{/* <CustomSign/> */}
								<Main isBLockedWatch={this.state.isBLockedWatch} isBlockedSign={this.state.isBlockedSign} user={this.state.user} dbUser={this.state.dbUser} isMyAlbum={this.state.isMyAlbum} log={this.state.log} db={this.state.db} openView={this.openView}/>
							</Panel>
						</View>
						
						<View id="add" activePanel="add_panel">
							<Panel id="add_panel">
								<Add isNewUser={this.state.isNewUser} isMyAlbum={this.state.isMyAlbum} user={this.state.user} db={this.state.db} openView={this.openView}/>
							</Panel>
						</View>
					</Root>
					
					
			</AppRoot>
			
		</AdaptivityProvider>
	  )
	}
  }
  export default App;
  
  ReactDOM.render(
	<App/>
  ,
  document.getElementById('root')
  );