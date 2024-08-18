import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import HideSourceIcon from '@mui/icons-material/HideSource';
import { useState } from 'react'

function MsgHtml({ ele, i, len  ,logo_name}) {
    const [show, set_show] = useState(false)

    if (ele.sent_by_customer === true) {
        return (
            <div className="msg_container_user" key={i} >
                <div className={`msg ${i + 1 == len ? "message-pop" : ""}`} >
                    <span dir='rtl' style={{ wordWrap: "break-word" }}>
                        <div dangerouslySetInnerHTML={{ __html: ele.title }}></div>
                    </span>


                </div>
            </div>
        )
    } else {
        return (
            <div className="msg_container" key={i} >
                {/* <img src="./images/logo.png"></img> */}
                <img src={`./images/${logo_name}`}></img>
                <div className={`${i + 1 == len ? "message-pop" : ""} `} style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div className={`msg ${ele.title == '...' ? "typing-animation" : ""}`} >
                            <span className={`${ele.title == '...' && i + 1 == len ? "dots" : ""}`} dir='ltr' style={{ wordWrap: "break-word" }}>
                                <div dangerouslySetInnerHTML={{ __html: ele.title }}></div>
                            </span>
                        </div>
                        {
                            ele.sql_query == "None" ? "" :

                                !show ?
                                    <button className='btn query_btn' onClick={() => { set_show(true) }}>
                                        <VisibilityIcon style={{ marginLeft: "20px", cursor: "pointer" }} />
                                    </button>
                                    :
                                    <button className='btn query_btn' onClick={() => { set_show(false) }}>
                                        <HideSourceIcon style={{ marginLeft: "20px", cursor: "pointer" }} />
                                    </button>
                        }


                    </div>
                    {
                        show && ele.sql_query != null &&
                        <div style={{ marginTop: "25px" }} className={`msg ${ele.title == '...' ? "typing-animation" : ""}`} >
                            <p>{ele.sql_query}</p>

                        </div>
                    }
                    <p style={{ marginLeft: "15px" }}>{new Date(ele.message_date).getHours()}:{new Date(ele.message_date).getMinutes()} {new Date(ele.message_date).getHours() > 12 ? "Pm" : "Am"}</p>

                </div>

            </div>
        )
    }
}

export default MsgHtml