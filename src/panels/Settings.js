import React from 'react';
import left from '../img/left.svg'
import check from '../img/check.svg'
import { saveUserInDb, declension } from '../utils/Utils';
import bridge from '@vkontakte/vk-bridge';

class Settings extends React.Component {
   
	constructor(props){
        super(props)
        const user = this.props.dbUser

        this.state = {
            isShowSignSettings : false,
            isShowAlbumSettings : false,
            isShowSetFriendsSign : (user.can_sign_list != undefined && user.can_sign_list.length > 0),
            isShowSetFriendsWatch : (user.can_watch_list != undefined && user.can_watch_list.length > 0)
        }
    }
    componentDidUpdate(prevProps){
        if (this.props != prevProps){
            const user = this.props.dbUser
            this.setState({isShowSetFriendsSign : (user.can_sign_list != undefined && user.can_sign_list.length > 0),
                isShowSetFriendsWatch : (user.can_watch_list != undefined && user.can_watch_list.length > 0)})
        }
    }
    componentDidMount(){
        bridge.subscribe(this.onBridgeResult);
    }
    toggleSigns = () => {
        if (this.state.isShowSignSettings){
            this.setState({isShowSignSettings : !this.state.isShowSignSettings})
        } else if (this.state.isShowAlbumSettings){
            this.setState({isShowAlbumSettings : !this.state.isShowAlbumSettings})
        }
    }
    showSignSettings = () => {
        this.setState({isShowSignSettings : true})
    }
    toggleAlbum = () => {
        this.setState({isShowAlbumSettings : !this.state.isShowAlbumSettings})
    }
    signSetAll = () => {
        this.setState({isShowSetFriendsSign : false})
        const user = this.props.dbUser
        if (user.can_sign_list != undefined && user.can_sign_list.length > 0){
            user.can_sign_list = []
            saveUserInDb(this.props.db, user)
        }
    }
    signWatchAll = () => {
        this.setState({isShowSetFriendsWatch : false})
        const user = this.props.dbUser
        if (user.can_watch_list != undefined && user.can_watch_list.length > 0){
            user.can_watch_list = []
            saveUserInDb(this.props.db, user)
        }
    }
    signSetFriends = () => {
        this.setState({isShowSetFriendsSign : true})
    }
    signSetWatch = () => {
        this.setState({isShowSetFriendsWatch : true})
    }
    close = () => {
        this.setState({isShowAlbumSettings : false, isShowSignSettings : false, isShowSetFriendsSign : false})
        this.props.toggleSettings()
    }
    chooseFriends = () => {
        bridge.send("VKWebAppGetFriends", {"multi" : true});
        
    }
    onBridgeResult = (e) => {
        if (e.detail.type == "VKWebAppGetFriendsResult"){
            console.log("friends = " + JSON.stringify(e.detail.data))
            if (e.detail.data == undefined || e.detail.data.users == undefined || e.detail.data.users.length == 0){
                return
            }
            const user = this.props.dbUser
            if (this.state.isShowSignSettings && this.state.isShowSetFriendsSign){
                if (user.can_sign_list == undefined || user.can_sign_list.length == 0){
                    user.can_sign_list = []
                }
                e.detail.data.users.forEach(friend => {
                    if (!user.can_sign_list.includes(friend.id)){
                        user.can_sign_list.push(friend.id)
                    }
                });
            } else if (this.state.isShowAlbumSettings && this.state.isShowSetFriendsWatch){
                if (user.can_watch_list == undefined || user.can_watch_list.length == 0){
                    user.can_watch_list = []
                }
                e.detail.data.users.forEach(friend => {
                    if (!user.can_watch_list.includes(friend.id)){
                        user.can_watch_list.push(friend.id)
                    }
                });
            }
            saveUserInDb(this.props.db, user)
            this.toggleSigns()
        }
    }
	render() {
        const user = this.props.dbUser
        const can_sign_list = user.can_sign_list
        const can_watch_list = user.can_watch_list
        return (
                <div className={this.props.isShowSettings ? 'appeal_container_bg_shown' : 'appeal_container_bg_hiden sdk_appeal_header'}>
                    <div onClick={this.close} className={this.props.isShowSettings ? 'animateAppealBgShow' : 'animateAppealBgHide sdk_appeal_header'}>

                    </div>
                    <div className={this.props.isShowSettings ? 'appeal_container_shown' : 'appeal_container_hide sdk_appeal_header'}>
                        {(!this.state.isShowSignSettings && !this.state.isShowAlbumSettings) && <div className="picker_cont">
                            <p className="picker_title">Настройки приватности</p>
                            <div onClick={this.showSignSettings} className="just_cont">
                                <p className="settings_text">Кто может оставлять автографы</p>
                                <p className="settings_text blue">{(can_sign_list != undefined && can_sign_list.length > 0) ? can_sign_list.length + " " + declension(can_sign_list.length, "друг", "друга", "друзей") : "Все"}</p>
                            </div>

                            <div onClick={this.toggleAlbum} className="just_cont">
                                <p className="settings_text">Кто может смотреть альбом</p>
                                <p className="settings_text blue">{(can_watch_list != undefined && can_watch_list.length > 0) ? can_watch_list.length + " " + declension(can_watch_list.length, "друг", "друга", "друзей") : "Все"}</p>
                            </div>
                        </div>}

                        {this.state.isShowSignSettings && 
                            <div className="picker_cont">
                                <div className="flex">
                                    <div style={{marginLeft : '-12px'}} onClick={this.toggleSigns} className="back_cont">
                                        <img src={left}/>
                                    </div>
                                    <p className="sign_title">Кто может оставлять автографы</p>
                                </div>
                                <div onClick={this.signSetAll} className="just_cont">
                                    <p className="settings_text">Все</p>
                                    {((can_sign_list == undefined || can_sign_list.length == 0) && !this.state.isShowSetFriendsSign) && <img src={check}/>}
                                </div>
                                <div onClick={this.signSetFriends} className="just_cont">
                                    <p className="settings_text">Только друзья</p>
                                    {((can_sign_list != undefined && can_sign_list.length > 0) || this.state.isShowSetFriendsSign) && <img src={check}/>}
                                </div>
                                {this.state.isShowSetFriendsSign && 
                                    <div onClick={this.chooseFriends} className="pick_friends_btn">Выбрать близких друзей</div>
                                }
                            </div>
                        }

                        {this.state.isShowAlbumSettings && 
                            <div className="picker_cont">
                                <div className="flex">
                                    <div style={{marginLeft : '-12px'}} onClick={this.toggleSigns} className="back_cont">
                                        <img src={left}/>
                                    </div>
                                    <p className="sign_title">Кто может смотреть альбом</p>
                                </div>
                                <div onClick={this.signWatchAll} className="just_cont">
                                    <p className="settings_text">Все</p>
                                    {((can_watch_list == undefined || can_watch_list.length == 0) && !this.state.isShowSetFriendsWatch) && <img src={check}/>}
                                </div>
                                <div onClick={this.signSetWatch} className="just_cont">
                                    <p className="settings_text">Только друзья</p>
                                    {((can_watch_list != undefined && can_watch_list.length > 0) || this.state.isShowSetFriendsWatch) && <img src={check}/>}
                                </div>
                                {this.state.isShowSetFriendsWatch && 
                                    <div onClick={this.chooseFriends} className="pick_friends_btn">Выбрать близких друзей</div>
                                }
                            </div>
                        }

                    </div>
                </div>
        )
	}
  }
  export default Settings;


