import React, { useState, useEffect } from 'react';
import { GoHome } from "react-icons/go";
import { IoChatboxOutline } from "react-icons/io5";
import { TbScanEye } from "react-icons/tb";
import { useRouter } from "next/router"
import { PiSignOutLight } from "react-icons/pi";


function Home() {
    const router = useRouter()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        // Remove event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);


      useEffect(() => {
        // Define different image sources based on window width
        if (windowWidth < 700) {
          setImageSrc('./images/home2.webp');
        } else {
          setImageSrc('./images/chatbot.png');
        }
      }, [windowWidth]);

    return (
        <>
            <div className="head-text ">
                <div style={{display:"flex" , flexDirection:"column" , alignItems:"center" , width:"100%" }}>
                     Opera
                    <p>(Online)</p>
                </div>


            </div>

            <div>
            
                <img src={imageSrc} style={{ width: "100vw", height: "80vh", opacity: "85" }}></img>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", position: "absolute", bottom: "0px", border: "1px solid lightgray" }}>

                {/* HOME Button */}
                <button className="btn" onClick={() => { router.replace("/home") }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <GoHome style={{ width: "24px", height: "24px",  }} />
                        <span style={{ marginLeft: "8px" }}>Home</span>
                    </div>
                </button>

                 {/* Chatbot Button */}
                <button className="btn" onClick={() => { router.replace("/chat") }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <IoChatboxOutline style={{ width: "24px", height: "24px",  }} />
                        <span style={{ marginLeft: "8px" }}>Chat</span>
                    </div>
                </button>

               
                {/* OCR Button */}
                <button className="btn" onClick={() => { router.replace("/chat?state=pdf") }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {/* <TbScanEye style={{ width: "24px", height: "24px",  }} /> */}
                        <img style={{marginLeft:"7px"}} src={`./images/logo_oracle.jpg`} width="30px" height="30px"></img>
                        <span style={{ marginLeft: "8px" }}>PDF</span>
                    </div>
                </button>

                <button className="btn" onClick={() => { router.replace("/signout") }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <PiSignOutLight style={{ width: "24px", height: "24px",  }} />
                        <span style={{ marginLeft: "8px" }}>Logout</span>
                    </div>
                </button>

            </div>

        </>






    )
}
export default Home