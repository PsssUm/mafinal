import React from 'react';
import text from '../img/text.svg'
import image from '../img/image.svg'
import pen from '../img/pen.svg'
class TypePicker extends React.Component {
   
	constructor(props){
		super(props)
        
	}
    componentDidMount(){

    }
    onTypePicked = (type) => {
        this.props.onTypePicked(type)
        this.props.hidePicker()
    }
	render() {
	  return (
		    <div className={this.props.isShowTypePicker ? 'appeal_container_bg_shown' : 'appeal_container_bg_hiden sdk_appeal_header'}>
                <div onClick={this.props.hidePicker} className={this.props.isShowTypePicker ? 'animateAppealBgShow' : 'animateAppealBgHide sdk_appeal_header'}>

                </div>
                <div className={this.props.isShowTypePicker ? 'appeal_container_shown' : 'appeal_container_hide sdk_appeal_header'}>
                    <div className="picker_cont">
                        <p className="picker_title">Оставить автограф</p>
                        <div onClick={() => this.onTypePicked(0)} className="picker_item">
                            <img className="picker_img" src={text}/>
                            <p className="picker_text">Текстовый</p>
                        </div>

                        <div onClick={() => this.onTypePicked(1)}  className="picker_item">
                            <img className="picker_img" src={image}/>
                            <p className="picker_text">Картинка</p>
                        </div>

                        <div onClick={() => this.onTypePicked(2)}  className="picker_item">
                            <img className="picker_img" src={pen}/>
                            <p className="picker_text">Нарисовать</p>
                        </div>
                    </div>
                    
                </div>
            </div>
	  )
	}
  }
  export default TypePicker;


