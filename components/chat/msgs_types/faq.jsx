import React from 'react';
import styles from './styles.module.css';

function FAQMsg({ ele, i, len }) {


    const send_message = async (faqMessage) => {
       
        
        const temp_customer_msg = {
            message_date: new Date().toString(),
            sent_by_customer: true,
            title: faqMessage,
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
        
        try {
            const [data, res] = await call_mediator2(`${request_url}/messages/get_message`, "POST", {
                "type": "text",
                "title": customer_title,
                "user_id": session.user.user_id,
                "company_id": session.user.company_id,
            });
            
            if (res === 200) {
                console.log("Returned data", data);
                
                setmssg([...(all_msgs.slice(0, -3)), ...data.messages, {
                    message_date: data.query_msg.message_date,
                    sent_by_customer: false,
                    title: data.query_msg.title,
                    type: "query"
                },
                {
                    message_date: data.most_freq_questions,
                    sent_by_customer: false,
                    type: "faq",
                    title: "Frequently Asked Questions"
                }]);
            } else {
                toast.error(data.response);
            }
        } catch {
            toast.error("Error in server");
        }
        
        setbtn_send_disabeld(false);
    };

    const handleFAQClick = (faqTitle) => {
        send_message(faqTitle); // Send the FAQ message when clicked
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getHours()}:${d.getMinutes()} ${d.getHours() > 12 ? 'PM' : 'AM'}`;
    };

    return (
        <div className="msg_container" key={i} style={{marginLeft:"2.5rem"}}>
            {/* <img src="./images/qparts-logo.png" alt="Logo" /> */}
            <div className={`${i + 1 === len ? "message-pop" : ""}`} style={{ display: "flex", flexDirection: "column", width: "90%" }}>
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

export default FAQMsg;
