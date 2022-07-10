import React from 'react';
import left from '../img/left.svg'
import undo from '../img/undo.svg'
import redo from '../img/redo.svg'
import check from '../img/check.svg'
import { Paintable, PaintableRef } from 'paintablejs/react';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { saveUserInDb } from '../utils/Utils';
import Loader from './Loader';

class CustomSign extends React.Component {
   
	constructor(props){
        super(props)
        this.state = {
            thickness : 5,
            color : '#FF3347',
            useEraser : false,
            active : true
        }
        this.paintableRef = React.createRef();
        this.changeColorClick = React.createRef();
	}
    componentDidMount(){
        if (document.getElementsByClassName('vkuiAppRoot').length > 0){
            document.getElementsByClassName('vkuiAppRoot')[0].style["overflow"] = 'hidden'
        }
    }
    save = (image) => {
        console.log("saved image = " + image)
        console.log("saved image = " + JSON.stringify(image))
        this.setState({savedImage : image})
        this.onImgLoaded(image)
          
    }
      
    onImgLoaded = (img) => {
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
            uploadString(mountainsRef, img, 'data_url').then((snapshot) => {
              getDownloadURL(ref(storage, time + '.jpg'))
                .then(this.onSuccessLoaded)
                .catch((error) => {
                    console.log('error = ' + error);
                });
            });
    }
    onSuccessLoaded = (url) => {
        console.log('Uploaded a blob or file! url = ' + url);
        const iAm = this.props.user
        var user = this.props.dbUser
        const newSign = {type : 2, text : "", url : url, name : (iAm.first_name + " " + iAm.last_name), user_id : iAm.id}
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
        this.close()
    }
    thicknessChanged = (e) => {
        this.setState({thickness : Number(e.target.value)})
    }
    colorChanged = (e) => {
        this.setState({color : e.target.value})
    }
    toggleSave = () => {
        this.setState({active : false})
        
    }
    undo = () => {
        this.paintableRef.current.undo()
    }
    redo = () => {
        this.paintableRef.current.redo()
    }
    changeColor = () => {
        this.changeColorClick.current.click();
    }
    close = () => {
        if (document.getElementsByClassName('vkuiAppRoot').length > 0){
            document.getElementsByClassName('vkuiAppRoot')[0].style["overflow"] = 'auto'
        }
        this.props.onTypePicked(-1)
    }
	render() {
	  return (
		<div className="text_sign_screen">
            <div style={{marginTop : '120px'}} className="nav_text_sign just_cont">
                <div onClick={this.close} className="back_cont">
                    <img src={left}/>
                </div>
                
                <div className="flex">
                    <div style={{marginTop : '-6px'}} className="edit_icon_cont">
                        {/* <div style={{backgroundColor : this.state.color}} className="input_color_round"/> */}
                        <input 
                        className="input_color"
                        type="color"
                        value={this.state.color}
                        onChange={this.colorChanged}/>
                    </div>
                    <div onClick={this.undo} className="edit_icon_cont">
                        <img className="edit_icon" src={undo}/>
                    </div>
                    <div onClick={this.redo} className="edit_icon_cont">
                        <img className="edit_icon" src={redo}/>
                    </div>
                    <div style={{marginRight : '12px'}} onClick={this.toggleSave} className="edit_icon_cont">
                        <img style={{height : '32px', width : '32px', margin : '12px 12px 0 12px'}}  src={check}/>
                    </div>
                    
                   
                    
                    {/* <input type="range"
                        defaultValue={5}
                        onChange={this.thicknessChanged}
                        min={1}
                        max={30}
                        step={1}/> */}
                </div>
            </div>   
            <div className="canvas_container">
                <Paintable
                    width={window.screen.width - 16}
                    height={window.screen.width}
                    active={this.state.active}
                    color={this.state.color}
                    thickness={this.state.thickness}
                    useEraser={this.state.useEraser}
                    ref={this.paintableRef}
                    image={localStorage.getItem('/') || undefined}
                    onSave={this.save}
                    onLongPress={() => console.log('long')}>
                    <div className="canvas-inner"></div>
                </Paintable>
            </div> 
            
            {/* <div onClick={this.toggleSave} className="center_hor sign_text_btn">Сохранить</div> */}
            <Loader />
        </div>
	  )
	}
  }
  export default CustomSign;


