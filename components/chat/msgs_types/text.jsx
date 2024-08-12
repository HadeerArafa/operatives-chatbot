import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';

function MsgText({ele , i , len}) {

    if (ele.sent_by_customer === true) {
        return (
            <div className="msg_container_user" key={i} >
                 <div className={`msg ${i+1==len?"message-pop":""}`} >
                    <span dir='rtl' style={{ wordWrap: "break-word" }}>{ele.title}</span>

                </div>
            </div>
        )
    } else {
        return (
            <div className="msg_container" key={i} >
                {/* <img src="./images/logo.png"></img> */}
                <img src="./images/logo.jpg "></img>
                <div className={`${i+1==len?"message-pop":""} `} style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                    <div style={{display:"flex", alignItems:"center"}}>
                    <div className={`msg ${ele.title=='...'?"typing-animation":""}`} >
                        <span  className={`${ele.title=='...' && i+1==len?"dots":""}`} dir='rtl' style={{ wordWrap: "break-word" }}>{ele.title} </span>
                    </div>
                    <VisibilityIcon style={{marginLeft:"20px" , cursor:"pointer"}}/>

                    </div>
                    <p style={{ marginLeft: "15px" }}>{new Date(ele.message_date).getHours()}:{new Date(ele.message_date).getMinutes()} {new Date(ele.message_date).getHours() > 12 ? "Pm" : "Am"}</p>

                </div>
                
            </div>
        )
    }
}

export default MsgText