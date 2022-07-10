import React from 'react';
import logo from '../img/logo.png'
import add from '../img/add.png'
import empty from '../img/empty.png'
import settings from '../img/settings.svg'
import TypePicker from './TypePicker';
import TextSign from './TextSign';
import AlbumItem from './AlbumItem';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { saveImageSign, saveUserInDb } from '../utils/Utils';
import Settings from './Settings';
import CustomSign from './CustomSign';

var img = new Image; 
var fr = new FileReader;
var pickedFile = {}

class Main extends React.Component {
   
	constructor(props){
		super(props)
        this.state = {
            isShowTypePicker : false,
            isShowSettings : false,
            type : -1,
            isLoading : false
        }
        //this.paintableRef = useRef<PaintableRef>(null);
        this.fileUpload = React.createRef();
        this.pickImage = this.pickImage.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
	}
    componentDidMount(){

    }
    showTypePicker = () => {
        this.setState({isShowTypePicker : true})
    }
    hidePicker = () => {
        this.setState({isShowTypePicker : false})
    }
    onTypePicked = (type) => {
        this.setState({type : type})
        if (type == 1){
            this.pickImage()
        }
    }
    fileChangedHandler(event) {
        if(event && event.target.files && event.target.files.length > 0){
            console.log("uploadFile file 1 = " + event.target.files[0])
            this.uplFile(event.target.files[0])
        }
       
    }
    pickImage() {
        this.fileUpload.current.click();
    }
    uplFile = (file) => {
        console.log("uploadFile file = " + file)
        pickedFile = file
        fr.onload = this.onLoadedFileReader
        fr.readAsDataURL(file);
    }
    onImgLoaded = () => {
        //img
        const storage = getStorage();

        // Create a reference to 'mountains.jpg'
        const d = new Date();
        let time = d.getTime();
        const mountainsRef = ref(storage, time + '.jpg');

        // Create a reference to 'images/mountains.jpg'
        const mountainImagesRef = ref(storage, 'images/' + time + '.jpg');

        // While the file names are the same, the references point to different files
        mountainsRef.name === mountainImagesRef.name;           // true
        mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 
        this.setState({isLoading : true})
        uploadBytes(mountainsRef, pickedFile).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            this.setState({isLoading : false})
            getDownloadURL(ref(storage, time + '.jpg'))
            .then(this.onSuccessLoaded)
            .catch((error) => {
                console.log('error = ' + error);
            });
        });
        
    }
    onSuccessLoaded = (url) => {
        console.log('Uploaded a blob or file! url = ' + url);
        this.saveSign(url)
    } 
    onLoadedFileReader = () => {
        img.onload = this.onImgLoaded
        img.src = fr.result;
    }
    saveSign = (url) => {
        const iAm = this.props.user
        var user = this.props.dbUser
        const newSign = {type : 1, text : "", url : url, name : (iAm.first_name + " " + iAm.last_name), user_id : iAm.id}
        if (user.album == undefined || user.album.length == 0){
            user.album = [newSign]
        } else {
            if (user.album != undefined && user.album.length > 1){
                user.album.reverse()
            }
            user.album.push(newSign)
        }
        console.log("saveSign user = " + JSON.stringify(user))
        saveUserInDb(this.props.db, user)
    }
    toggleSettings = () => {
        this.setState({isShowSettings : !this.state.isShowSettings})
    }
	render() {
        const user = this.props.dbUser
        if (this.state.type == -1 || this.state.type == 1){
            return (
                <div className="main_container">
                   <img className="logo" src={logo}/>
                   <div className="relative">
                        {(this.props.dbUser != undefined && this.props.dbUser.user != undefined) && <p className="name_title">{this.props.dbUser.user.first_name + " " + this.props.dbUser.user.last_name}</p>}
                        {this.props.isMyAlbum && <div onClick={this.toggleSettings} className="settings_icon">
                            <img src={settings}/>
                        </div>}
                   </div>
                   {(!this.props.isBlockedSign && !this.props.isMyAlbum) && <img onClick={this.showTypePicker} className="add_img" src={add}/>}
                   {!this.props.isBLockedWatch && <div className="album_container">
                        {(user.album != undefined && user.album.length > 0) && user.album.map((item, index) => (
                            <AlbumItem isMyAlbum={this.props.isMyAlbum} item={item} index={index} key={index}/>
                        ))}
                        {(user.album == undefined || user.album.length == 0) && <img className="empty_img" src={empty}/>}
                   </div>}
                   {this.props.isBLockedWatch && <img className="empty_img" src={empty}/>}

                   <input id="fileInput" className="custom-file-input hover" type="file" accept="image/*" onChange={this.fileChangedHandler} style={{ display: "none" }} ref={this.fileUpload}/>
                    
                   <Settings db={this.props.db} user={this.props.user} dbUser={this.props.dbUser} isShowSettings={this.state.isShowSettings} toggleSettings={this.toggleSettings}/>
                   <TypePicker onTypePicked={this.onTypePicked} isShowTypePicker={this.state.isShowTypePicker} hidePicker={this.hidePicker}/>
                </div>
              )
        } else if (this.state.type == 0){
            return (<TextSign db={this.props.db} user={this.props.user} dbUser={this.props.dbUser} onTypePicked={this.onTypePicked}/>)
        } else if (this.state.type == 2){
            return (
                <CustomSign onTypePicked={this.onTypePicked} db={this.props.db} user={this.props.user} dbUser={this.props.dbUser}/>
              )
        }
	  
	}
  }
  export default Main;
