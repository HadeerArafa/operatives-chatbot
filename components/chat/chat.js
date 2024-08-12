import { useContext, useEffect, useRef, useState } from "react"
import { userContext, socketContext, chat_stateContext, msgsContext } from "../../utils/context"
import React from 'react'
import { ButtonsMsg, TextMsg, RepliedButton } from '../shapes'
import { IoSend } from 'react-icons/io5'
import { call_mediator2 } from '../../utils/mediator'
import { request_url } from "../../utils/config"
// import { SERVER_LINK } from '../utils/vars';
import Wrapper from "../../layout/wrapper";
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import styles from "./style.module.css"
import ImageUpload from "./upload_img"
import MsgText from "./msgs_types/text"
import ListMsg from "./msgs_types/list"
import QueryMsg from "./msgs_types/query"
import Recorder from "../voice_recorder/voice_recorder_btn"
import FAQMsg from './msgs_types/faq'
import { IoArrowBackOutline } from "react-icons/io5";


const SERVER_LINK = ""







async function wait() {
    await new Promise(resolve => setTimeout(resolve, 2000));
}



function Chat() {
    // const { data: session, status } = useSession()

    //+
    const [session, setSession] = useState(null)
    const [btn_send_disabeld, setbtn_send_disabeld] = useState(false)
    const [imageBase64, setImageBase64] = useState('');



    useEffect(() => {
        const get_session = JSON.parse(localStorage.getItem('session'))

        setSession({
            user: get_session
        })
    }, [])
    //+


    const myRef = useRef(null)
    const msgref = useRef(null)
    const router = useRouter()
    const msgs = [
        {
            "sent_by_customer": true,
            "title": "hi there how are you"
        },
        {
            "sent_by_customer": false,
            "title": "i am good how can i help you"
        }
    ]
    // useEffect(() => {
    //     myRef.current.scrollIntoView()
    // }, [msgs])

    const [msssg, setmssg] = useState([])
    const [key_2, setkey_2] = useState(0)
    // useEffect(()=>{

    // },[msssg])



    useEffect(() => {
        if (session === null) return;

        //         message_date
        // : 
        // "Sun, 28 Jan 2024 16:38:07 GMT"
        // sent_by_customer
        // : 
        // false
        // title
        // : 
        // "يا هلا ومسهلا ،،، معك ابومحمد مساعدك الشخصي من برنامجك كيوستوك, لادارة متاجرك الخاصة ، اتطلع الى خدمتك بافضل طريقة ممكنة."
        // type
        // : 
        // "string"

        const effect = async () => {
            const [res, states_code] = await call_mediator2(`${request_url}/messages/get_history?user_id=${session.user.user_id}`, 'GET')
            var msgs = res.messages

            setmssg(msgs)
        }
        effect()



    }, [session])


    const scrollTo = (myRef) => {
        if (myRef && myRef.current /* + other conditions */) {
            myRef.current.scrollIntoView({ behavior: 'smooth', block: "end" })
        }
    }
    useEffect(() => {
        setkey_2(key_2 + 1)
    }, [msssg])

    useEffect(() => {
        scrollTo(myRef)
    }, [key_2])

    const handleFAQClick = (faqTitle) => {
        send_message2(faqTitle); // Send the FAQ message when clicked
    };

    const show_messages = () => {
        return (msssg?.map((ele, i) => {
            console.log("ele",ele)
            if (ele?.type === "string") {
                return (<MsgText i={i} key={i} ele={ele} len={msssg.length} />)
            } else if (ele?.type === "list") {
                return (<ListMsg i={i} key={i} ele={ele} len={msssg.length} />)
            } 
            else if(ele?.type === "query" && ele?.title !=null){
                // return (<QueryMsg i={i} key={i} ele={ele} len={msssg.length} />)
            }
            else if(ele?.type === "faq"){
                // return (<FAQMsg i={i} key={i} ele={ele} len={msssg.length} />)

                return (
                    <div className="msg_container" key={i} style={{marginLeft:"2.5rem"}}>
                        {/* <img src="./images/qparts-logo.png" alt="Logo" /> */}
                        <div className={`${i + 1 === msssg.length ? "message-pop" : ""}`} style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                            <div className={`msg ${ele.title === '...' ? "typing-animation" : ""}`}>
                              
                           
            
                            {/* Group of buttons to display message dates */}
                            <div className="buttonGroup">
                                {ele?.message_date && ele.message_date.map((dateObj, index) => (
                                    <button key={index} className="dateButton" onClick={() => handleFAQClick(dateObj.question)}>
                                            <div key={i}>
                                                <p>{dateObj["question"]}</p> 
                                            </div>
                                      
                                    </button>
                                ))}
                            </div>
                            </div>
                        </div>
                    </div>
                );
            }


        }))

    }
    const send_message = async () => {
        if (btn_send_disabeld === true) {
            toast.error("please wait untill your last message processed !")
            return;
        }
        setbtn_send_disabeld(true)
        const customer_title = msgref.current.value
        msgref.current.value = ""
        const temp_customer_msg = {
            message_date: new Date().toString(),
            sent_by_customer: true,
            title: customer_title,
            type: "string"
        }
        const temp_bot_msg = {
            message_date: new Date().toString(),
            sent_by_customer: false,
            title: "...",
            type: "string"
        }
        const all_msgs = [...msssg, temp_customer_msg, temp_bot_msg]
        setmssg(all_msgs)



        call_mediator2(`${request_url}/messages/get_message`, "POST", {
            "type": "text",
            "title": customer_title,
            "user_id": session.user.user_id,
            "company_id": session.user.company_id,
        }).then(([data, res]) => {
            if (res === 200) {
                console.log("returned data",data)

                setmssg([...(all_msgs.slice(0, -3)), ...data.messages,, {
                    message_date: data.messages.pop().message_date,
                    sent_by_customer: false, title: data.query_msg, type: "query"
                },
                {message_date:data.most_freq_questions,send_by_customer:false,type:"faq" ,title: "Frequency Asked Question",}
            ])



            } else {
                toast.error(data.response)
            }
            setbtn_send_disabeld(false)
        }).catch(() => {
            toast.error("error in server")
            setbtn_send_disabeld(false)
        })

    }

    const send_message2 = async (fqa) => {
    
        const customer_title = fqa
        msgref.current.value = ""
        const temp_customer_msg = {
            message_date: new Date().toString(),
            sent_by_customer: true,
            title: customer_title,
            type: "string"
        }
        const temp_bot_msg = {
            message_date: new Date().toString(),
            sent_by_customer: false,
            title: "...",
            type: "string"
        }
        const all_msgs = [...msssg, temp_customer_msg, temp_bot_msg]
        setmssg(all_msgs)



        call_mediator2(`${request_url}/messages/get_message`, "POST", {
            "type": "text",
            "title": customer_title,
            "user_id": session.user.user_id,
            "company_id": session.user.company_id,
        }).then(([data, res]) => {
            if (res === 200) {
                console.log("returned data",data)

                setmssg([...(all_msgs.slice(0, -3)), ...data.messages,, {
                    message_date: data.messages.pop().message_date,
                    sent_by_customer: false, title: data.query_msg, type: "query"
                },
                {message_date:data.most_freq_questions,send_by_customer:false,type:"faq" ,title: "Frequency Asked Question",}
            ])



            } else {
                toast.error(data.response)
            }
            setbtn_send_disabeld(false)
        }).catch(() => {
            toast.error("error in server")
            setbtn_send_disabeld(false)
        })

    }


    const send_audio_to_server = async (blob) => {
        const base64String = await convertBlobToBase64(blob);

        call_mediator2(`${request_url}/audio/record`, "POST", {
            "data": base64String,
            "user_id": session.user.user_id
        })
            .then(data => {
            })
            .catch(error => {
                console.error('Error sending audio to API:', error);
            });
    };
    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    const TypingAnimation = () => {
        // Your typing animation component
        return (

            <div className="msg_container" key={0} >
                {/* <img src="./images/logo.png"></img> */}
                <img src="./images/logo.jpg"></img>
                <div style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                    <div className="msg">
                        <div className="typing-animation">
                            <span className="dots" dir='rtl' style={{ wordWrap: "break-word" }}>...</span>
                        </div>
                    </div>
                </div>
            </div>


        );
    };

    return (

        <div key={key_2} className='chat_container' style={{ position: "relative" }}>
            <div className="head-text " >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginRight: "30px" }}>
                     Opera
                    <p>(Online)</p>
                </div>
                <div>
                    <IoArrowBackOutline style={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={() => { router.replace("/home") }} />


                </div>

            </div>

            <div className="chat_body" style={{ display: "flex", flexDirection: "column", width: "100%", height: "85%", overflowY: "scroll", paddingTop: "10px" }}>
                <div ref={myRef}>
                    {
                        msssg?.length != 0 ?
                            show_messages()
                            : <TypingAnimation />
                    }
                </div>

                {/* <div ></div> */}
            </div>

            {/* <div className="chatbox__footer"> */}
            {/* <div style={btn_send_disabeld === true ? { display: "block" } : { display: "none" }}>please wait untill our bot responde</div> */}

            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", width: "100%", position: "relative" }}>
                {/* <ImageUpload imageBase64={imageBase64} setImageBase64={setImageBase64}/> */}
                {/* <button className="btn btn-warning"
                        onClick={() => { router.replace("/sheet") }}
                        style={{ height: "90%", marginTop: "6px" }}>
                        OCR
                    </button> */}
                {/* <Recorder call_back_event={send_audio_to_server}/> */}
                <input disabled={imageBase64 !== ""} className="chatbox__footer" type="text" ref={msgref}
                    placeholder='Write a message...'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (btn_send_disabeld === true) {
                                return;
                            }
                            send_message()
                        }
                    }}
                >
                </input>
                <i style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50px", height: "30px", cursor: "pointer" }}> <IoSend className="send_btn" onClick={() => {
                    if (btn_send_disabeld === true) {
                        return;
                    }
                    send_message()

                }}></IoSend></i>

            </div>




            {/* </div> */}
            {/* <div className="chatbox__footer__text">

                    <p style={{ marginRight: "5px" }}>Powered by </p>
                    <a href="http://electropi.ai/">Electro Pi</a>
                </div> */}
        </div>

    )
}

export default Chat
