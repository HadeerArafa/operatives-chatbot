import React, { useEffect, useState } from 'react';

const ImageUpload = ({imageBase64, setImageBase64}) => {
    
    useEffect(()=>{
    },[imageBase64])
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageBase64(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        if (imageBase64 === "") {
            document.getElementById('fileInput').click();
        } else {
            setImageBase64("")
        }

    };

    return (
        <div style={{ position: "relative", height: "70px", display: "flex", alignItems: "center", paddingTop: "7px", marginRight: "3px" }}>
            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleImageUpload} />

            <button style={{ height: "50px" }} className={imageBase64===""?'btn btn-primary':'btn btn-danger'} onClick={handleButtonClick}>
                
                {
                    imageBase64===""?"Imgae":"delete"
                }

            </button>
            {imageBase64 &&
                <img src={imageBase64} alt="Uploaded" style={{
                    height: "100px", width: '100px', position: "absolute",
                    top: "-100px",
                    border: "2px solid #ccc",
                    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)"
                }} />}
        </div>
    );
};

export default ImageUpload;
