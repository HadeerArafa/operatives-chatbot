import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext, socketContext, chat_stateContext, msgsContext } from "../../utils/context";
import { ButtonsMsg, TextMsg, RepliedButton } from '../shapes';
import { IoSend, IoArrowBackOutline } from 'react-icons/io5';
import { call_mediator2 } from '../../utils/mediator';
import { request_url } from "../../utils/config";
import Wrapper from "../../layout/wrapper";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import ImageUpload from "./upload_img";
import MsgText from "./msgs_types/text";
import ListMsg from "./msgs_types/list";
import QueryMsg from "./msgs_types/query";
import Recorder from "../voice_recorder/voice_recorder_btn";
import FAQMsg from './msgs_types/faq';

const SERVER_LINK = "";

async function wait() {
    await new Promise(resolve => setTimeout(resolve, 2000));
}

function Chat() {
    const [session, setSession] = useState(null);
    const [btn_send_disabeld, setbtn_send_disabeld] = useState(false);
    const [imageBase64, setImageBase64] = useState('');

    const myRef = useRef(null);
    const msgref = useRef(null);
    const router = useRouter();
    const [msssg, setmssg] = useState([]);

    useEffect(() => {
        const get_session = JSON.parse(localStorage.getItem('session'));
        setSession({
            user: get_session
        });
    }, []);

    useEffect(() => {
        if (session === null) return;

        const effect = async () => {
            const [res, states_code] = await call_mediator2(`${request_url}/messages/get_history?user_id=${session.user.user_id}`, 'GET');
            var msgs = res.messages;
            setmssg(msgs);
        }
        effect();
    }, [session]);

    useEffect(() => {
        // Scroll to the bottom whenever the messages change
        if (myRef.current) {
            myRef.current.scrollIntoView({ behavior: 'smooth', block: "end" });
        }
    }, [msssg]);

    const handleFAQClick = (faqTitle, fqa_id) => {
        send_message2(faqTitle, fqa_id); // Send the FAQ message when clicked
    };

    const show_messages = () => {
        return (msssg?.map((ele, i) => {
            console.log("ele", ele);
            if (ele?.type === "string") {
                return (<MsgText i={i} key={i} ele={ele} len={msssg.length} />);
            } else if (ele?.type === "list") {
                return (<ListMsg i={i} key={i} ele={ele} len={msssg.length} />);
            } else if (ele?.type === "faq") {
                return (
                    <div className="msg_container" key={i} style={{ marginLeft: "2.5rem" }}>
                        <div className={`${i + 1 === msssg.length ? "message-pop" : ""}`} style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                            <div className={`msg ${ele.title === '...' ? "typing-animation" : ""}`}>
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
        }));
    }

    const send_message = async () => {
        if (btn_send_disabeld === true) {
            toast.error("please wait until your last message is processed!");
            return;
        }
        setbtn_send_disabeld(true);
        const customer_title = msgref.current.value;
        msgref.current.value = "";
        const temp_customer_msg = {
            message_date: new Date().toString(),
            sent_by_customer: true,
            title: customer_title,
            type: "string"
        };
        const temp_bot_msg = {
            message_date: new Date().toString(),
            sent_by_customer: false,
            title: "...",
            type: "string"
        };
        const all_msgs = [...msssg, temp_customer_msg, temp_bot_msg];
        setmssg(all_msgs);

        call_mediator2(`${request_url}/messages/get_message`, "POST", {
            "type": "text",
            "title": customer_title,
            "user_id": session.user.user_id,
            "company_id": session.user.company_id,
        }).then(([data, res]) => {
            if (res === 200) {
                setmssg([...(all_msgs.slice(0, -3)), ...data.messages, {
                    message_date: data.messages.pop().message_date,
                    sent_by_customer: false,
                    title: data.query_msg,
                    type: "query"
                },
                {
                    message_date: data.most_freq_questions,
                    send_by_customer: false,
                    type: "faq",
                    title: "Frequency Asked Question"
                }]);
            } else {
                toast.error(data.response);
            }
            setbtn_send_disabeld(false);
        }).catch(() => {
            toast.error("error in server");
            setbtn_send_disabeld(false);
        });
    }

    const send_message2 = async (fqa, fqa_id) => {
        const customer_title = fqa;
        msgref.current.value = "";
        const temp_customer_msg = {
            message_date: new Date().toString(),
            sent_by_customer: true,
            title: customer_title,
            type: "string"
        };
        const temp_bot_msg = {
            message_date: new Date().toString(),
            sent_by_customer: false,
            title: "...",
            type: "string"
        };
        const all_msgs = [...msssg, temp_customer_msg, temp_bot_msg];
        setmssg(all_msgs);

        call_mediator2(`${request_url}/messages/get_similar_qeustion_answer`, "POST", {
            "type": "text",
            "title": customer_title,
            "user_id": session.user.user_id,
            "question_id": fqa_id
        }).then(([data, res]) => {
            if (res === 200) {
                setmssg([...(all_msgs.slice(0, -3)), ...data.messages, {
                    message_date: data.messages.pop().message_date,
                    sent_by_customer: false,
                    title: data.query_msg,
                    type: "query"
                },
                {
                    message_date: data.most_freq_questions,
                    send_by_customer: false,
                    type: "faq",
                    title: "Frequency Asked Question"
                }]);
            } else {
                toast.error(data.response);
            }
            setbtn_send_disabeld(false);
        }).catch(() => {
            toast.error("error in server");
            setbtn_send_disabeld(false);
        });
    }

    const send_audio_to_server = async (blob) => {
        const base64String = await convertBlobToBase64(blob);
        call_mediator2(`${request_url}/audio/record`, "POST", {
            "data": base64String,
            "user_id": session.user.user_id
        }).then(data => {
        }).catch(error => {
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
        return (
            <div className="msg_container" key={0} >
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
        <div key={msssg.length} className='chat_container' style={{ position: "relative" }}>
            <div className="head-text">
                <div style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                    <IoArrowBackOutline size="40" className={styles.icons} style={{ marginBottom: "5px" }} onClick={() => router.back()} />
                    <h1>chat</h1>
                </div>
            </div>
            <div className="body" ref={myRef} key={msssg.length}>
                {show_messages()}
                <div ref={myRef}></div>
            </div>
            <div className="send">
                <textarea ref={msgref} placeholder="Enter your text here" />
                <IoSend size="30" className={styles.icons} onClick={send_message} />
                <Recorder send_audio_to_server={send_audio_to_server} />
                <ImageUpload />
            </div>
        </div>
    );
}

export default Chat;
