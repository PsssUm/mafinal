import React from 'react';
import share from '../img/share.svg'
import share_img from '../img/share_img.png'
import bridge from '@vkontakte/vk-bridge';

class AlbumItem extends React.Component {
   
	constructor(props){
        super(props)
        
	}
    componentDidMount(){

    }
    share = () => {
        bridge.send("VKWebAppShowStoryBox", { "background_type" : "image", "url" : this.props.item.url }); 
        
    }

    
    createSticker = (url) => {
        const sticker = {"sticker_type" : "renderable", 
            "sticker" : { "content_type" : "image", 
            "url" : url, 
            "clickable_zones" : [
                {"action_type" : "link", 
                    "action" :  { 
                    "link": "https://vk.com/8213105", 
                    "tooltip_text_key": "tooltip_open_default" }
                }
            ]}
        }
        return sticker
    }
	render() {
	  return (
		<div className="album_item">
            {this.props.item.type == 0 && <div className="just_cont">
                <p className="item_text">{this.props.item.text}</p>
                {/* {this.props.isMyAlbum && <img onClick={this.share} className="share" src={share}/>} */}
                
            </div>}
            {(this.props.item.type == 1 || this.props.item.type == 2) && 
                <div className="relative"> 
                    {/* {this.props.item.type == 2 && <div className="img_white_bg"/>} */}
                    <img style={this.props.item.type == 2 ? {backgroundColor : 'white'} : {}} className="item_img" src={this.props.item.url}/>
                    {this.props.isMyAlbum && <img onClick={this.share} className="share_img" src={share_img}/>}
                </div>
            }
            <div className="line"/>
            <p className="item_desc">{this.props.item.name}</p>
        </div>
	  )
	}
  }
  export default AlbumItem;


