import React from 'react'
import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import HideSourceIcon from '@mui/icons-material/HideSource';
function QueryMsg({ ele, i, len }) {
    const [show, set_show] = useState(false)
    if (show) {


        return (
            <div className="msg_container" key={i} >
                {/* <img src="./images/logo.png"></img> */}
                {/* <img src="./images/qparts-logo.png"></img> */}
                <div className={`${i + 1 == len ? "message-pop" : ""} `} style={{ display: "flex", flexDirection: "column", width: "90%", marginLeft: "2.5rem" }}>
                    <div className={`msg ${ele.title == '...' ? "typing-animation" : ""}`} >
                        <span className={`${ele.title == '...' && i + 1 == len ? "dots" : ""}`} dir='rtl' style={{ wordWrap: "break-word" }}>{ele.title}</span>
                        <br/>
                        <br/>
                        <button className='btn query_btn' onClick={()=>{set_show(false)}}><HideSourceIcon/></button>

                    </div>
                    <p style={{ marginLeft: "15px" }}>{new Date(ele.message_date).getHours()}:{new Date(ele.message_date).getMinutes()} {new Date(ele.message_date).getHours() > 12 ? "Pm" : "Am"}</p>

                </div>

            </div>
        )

    }else{
        return (
            <div className="msg_container" key={i} >
                <div className={`${i + 1 == len ? "message-pop" : ""} `} style={{ display: "flex", flexDirection: "column", width: "90%", marginLeft: "2.5rem" }}>
                    <div className={`msg ${ele.title == '...' ? "typing-animation" : ""}`} >
                    
                        <button className='btn query_btn' onClick={()=>{set_show(true)}}> <VisibilityIcon/></button>
                        <span className="material-icons" style={{ marginRight: "0.5rem" }}>
            </span>
                    </div>
                    

                </div>
            </div>
        )
    }

}

export default QueryMsg