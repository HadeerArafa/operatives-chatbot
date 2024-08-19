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
import MsgHtml from "./msgs_types/html"
import QueryMsg from "./msgs_types/query"
import Recorder from "../voice_recorder/voice_recorder_btn"
import FAQMsg from './msgs_types/faq'
import { IoArrowBackOutline } from "react-icons/io5";




async function wait() {
    await new Promise(resolve => setTimeout(resolve, 2000));
}



function Chat({ state }) {

    const logo_name = state==="pdf"?"logo_oracle.jpg":"logo_oper.jpg"
    const [session, setSession] = useState(null)
    const [btn_send_disabeld, setbtn_send_disabeld] = useState(false)
    const [imageBase64, setImageBase64] = useState('');
    


    useEffect(() => {
        const get_session = JSON.parse(localStorage.getItem('session'))

        setSession({
            user: get_session
        })
    }, [])



    const myRef = useRef(null)
    const msgref = useRef(null)
    const router = useRouter()
    const [msssg, setmssg] = useState([])
    const [first_enter, setfirst_enter] = useState(true)

    const [key_ui , set_key_ui] = useState(0)

    useEffect(() => {
        if (session === null) return;



        ////////////////////////////////// EXAMPLE OF MESSAGE
        // {
        //     message_date:"Sun, 28 Jan 2024 16:38:07 GMT",
        //     sent_by_customer:false,
        //     title:"يا هلا ومسهلا ،،، معك ابومحمد مساعدك الشخصي من برنامجك كيوستوك, لادارة متاجرك الخاصة ، اتطلع الى خدمتك بافضل طريقة ممكنة.",
        //     type:"string"
        // }



        const effect = async () => {
            const [res, states_code] = await call_mediator2(`${request_url}/${state}/get_history?user_id=${session.user.user_id}`, 'GET')
            var msgs = res.messages
            setmssg(msgs)
            set_key_ui(key_ui+1)
        }
        effect()



    }, [session])

    useEffect(() => {

        if (msssg?.length === 0) return;

        if (first_enter) {

            myRef.current.scrollIntoView({ behavior: 'auto', block: "end" });
            setfirst_enter(false)

        } else {

            if (myRef.current) {

                myRef.current.scrollIntoView({ behavior: 'smooth', block: "end" });

            }

        }


    }, [msssg]);

    const handleFAQClick = (faqTitle, fqa_id) => {
        send_message2(faqTitle, fqa_id); // Send the FAQ message when clicked
    };

    const TypingAnimation = () => {
        // Your typing animation component
        return (

            <div className="msg_container" key={0} >
                {/* <img src="./images/logo.png"></img> */}

                <img src={`./images/${logo_name}`}></img>

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

    const show_messages = () => {
        console.log("--------------------------------------------------")
        console.log(msssg)
        if (msssg?.length === 0) {
            return TypingAnimation()
        }
        return (msssg?.map((ele, i) => {
            console.log("ele", ele)
            if (ele?.type === "string") {
                return (<MsgText i={i} key={i} ele={ele} len={msssg.length}  logo_name={logo_name}/>)
            } else if (ele?.type === "list") {
                return (<ListMsg i={i} key={i} ele={ele} len={msssg.length} logo_name={logo_name} />)
            }
            else if (ele?.type === "query" && ele?.title != null) {
                // return (<QueryMsg i={i} key={i} ele={ele} len={msssg.length} />)
            }
            else if (ele?.type === "faq") {
                // return (<FAQMsg i={i} key={i} ele={ele} len={msssg.length} />)

                return (
                    <div className="msg_container" key={i} style={{ marginLeft: "2.5rem" }}>
                        {/* <img src="./images/qparts-logo.png" alt="Logo" /> */}
                        <div className={`${i + 1 === msssg.length ? "message-pop" : ""}`} style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                            <div className={`msg ${ele.title === '...' ? "typing-animation" : ""}`}>



                                {/* Group of buttons to display message dates */}
                                <div className="buttonGroup">
                                    {ele?.message_date && ele.message_date.map((dateObj, index) => (
                                        <button key={index} className="dateButton" onClick={() => handleFAQClick(dateObj.question, dateObj.question_id)}>
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
            else if (ele?.type === "html") {

                return (<MsgHtml i={i} key={i} ele={ele} len={msssg.length} logo_name={logo_name}/>)

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



        call_mediator2(`${request_url}/${state}/get_message`, "POST", {
            "type": "text",
            "title": customer_title,
            "user_id": session.user.user_id,
            "company_id": session.user.company_id,
        }).then(([data, res]) => {
            if (res === 200) {
                console.log("returned data", data)

                if (state === "pdf"){ // -2 for pdf , -3 fornormal messages ( why , i dont know !)
                    var temp_msgs = all_msgs.slice(0, -2)
                }else{
                    var temp_msgs = all_msgs.slice(0, -3)
                }
                
                setmssg([...temp_msgs, ...data.messages, , {
                    message_date: data.messages.pop().message_date,
                    sent_by_customer: false, title: data.query_msg, type: "query"
                },
                { message_date: data.most_freq_questions, send_by_customer: false, type: "faq", title: "Frequency Asked Question", }
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

    const send_message2 = async (fqa, fqa_id) => {

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



        call_mediator2(`${request_url}/${state}/get_similar_qeustion_answer`, "POST", {
            "type": "text",
            "title": customer_title,
            "user_id": session.user.user_id,
            "question_id": fqa_id

        }).then(([data, res]) => {
            if (res === 200) {
                console.log("returned data", data)

                setmssg([...(all_msgs.slice(0, -3)), ...data.messages, , {
                    message_date: data.messages.pop().message_date,
                    sent_by_customer: false, title: data.query_msg, type: "query"
                },
                { message_date: data.most_freq_questions, send_by_customer: false, type: "faq", title: "Frequency Asked Question", }
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

    return (

        <div className='chat_container' style={{ position: "relative" }}>
            <div className="head-text " >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginRight: "30px" }}>
                    Opera {state==="pdf"? "Payables":""}
                    <p>(Online)</p>
                </div>
                <div>
                    <IoArrowBackOutline style={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={() => { router.replace("/home") }} />


                </div>

            </div>

            <div className="chat_body" style={{ display: "flex", flexDirection: "column", width: "100%", height: "85%", overflowY: "scroll", paddingTop: "10px" }}>
                <div key={key_ui} ref={myRef}>
                    {
                        show_messages()
                    }
                    <div ref={myRef}></div>
                </div>

            </div>

            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", width: "100%", position: "relative" }}>

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
        </div>

    )
}

export default Chat
