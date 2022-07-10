import React from 'react';

class Loader extends React.Component {
    constructor(props){
        super(props)

    }
    
    render(){
      
            return (
                <div style={this.props.style ? this.props.style : {}} className="account-content-loader loader-insta progress_bgstyle progress_bgstyle_earn top_56">
                    <div className="top_0">
                        <div className="lds-ring_insta loader-earn-container">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            ); 
        
        
    }
}
export default Loader;
