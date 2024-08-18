import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useEffect } from 'react';
import { call_mediator2 } from '../../utils/mediator';
import { request_url } from '../../utils/config';
import { toast } from 'react-toastify';
import styles from './style.module.css';
import Select from "react-dropdown-select";

const ImageUpload = ({ session, setrows, setbill_id }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [value_option, setvalue_option] = useState("general")
    const [send, setsend] = useState(true)
    const [image_name, setimage_name] = useState("");

    useEffect(() => {
    }, [value_option])
    useEffect(()=>{
    },[image_name])
    const send_message = async () => {
        if (!send) { toast.info("you already sent it please wait"); return; }
        setsend(false)
        const [data, res] = await call_mediator2(`${request_url}/ocr/detect_${value_option}`, "POST", {

            "title": selectedImage,
            "user_id": session.user.user_id,
            "img_path":image_name
        })

        if (res === 200) {
            setrows(data.bill_table)
            setbill_id(data.bill_id)
            toast.success("ocr loaded succefully !")
            setsend(true)
        } else {
            // var default_data = []
            // for (var i = 0; i < 100; i++) {
            //     default_data.push({
            //         "col1": "mo3", "col2": "so3", "col3": "sss"
            //         , "col4": "sadsa", "col5": "sadsa"
            //         , "col6": "sadsa"
            //         , "col7": "sadsa"
            //         , "col8": "sadsa"
            //     })
            // }
            // setrows(default_data)
            toast.error(data.response)
            setsend(true)
        }

    }

    const save_img_to_backend = async (file, user_id) => {
        let form_data = new FormData()
        form_data.append('file', file)
        form_data.append('user_id', user_id)

        try {
            const response = await fetch('/api/send_img', {
                method: 'POST',
                body: form_data,
            });

            const data = await response.json();

            setimage_name(data.img_path)

            // Return true indicating success
            return true;
        } catch (error) {
            console.error('Error uploading file:', error);

            // Return false indicating failure
            return false;
        }
    }
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];


        if (!save_img_to_backend(file, session.user.user_id)) {
            toast.error("error in uploading image")
            return
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    const options = [
        {
            value: "elbashayer",
            label: "الخليفي"
        },
        {
            value: "toyota",
            label: "دارس"
        },
        {
            value: "general",
            label: "عام"
        }
    ];

    <Select options={options} onChange={(values) => setvalue_option(values)} />
    return (
        <div className={styles.upload} >
            {!selectedImage ?
                < div style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "center" }}>
                    {/* <div >
                        <Select style={{ marginTop: "20px" }} options={options} onChange={(e) => setvalue_option(e[0]["value"])} />

                    </div> */}
                    <div {...getRootProps()} className={styles.dropzoneStyles}>
                        <input {...getInputProps()} />
                        <p style={{ color: 'black', fontWeight: "bold" }}>Drag & drop your pdf here, or click to select one</p>


                    </div>

                </div>
                : ""}
            {selectedImage && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "95%", cursor: "pointer" }}>

                    <div className={styles.uploaded_img_container} >
                        <div {...getRootProps()} style={{ zIndex: "2", height: "100%", width: "100%" }}>
                            <input {...getInputProps()} />
                            <img src={selectedImage} alt="Uploaded Image" width={"100%"} height={"100%"} />

                        </div>
                    </div>

                    <button style={{
                        backgroundColor: "#BE4E44",
                        border: "1px solid #fff",
                        padding: "10px 20px",
                        fontSize: "16px",
                        color: "#fff",
                        textDecoration: "none",
                        marginTop: "10px",
                        // width:"200px" 

                    }}
                        onClick={(e) => { e.stopPropagation(); send_message() }}>
                        <p style={{ padding: "0px", margin: "0px" }}>
                            Upload
                        </p>
                    </button>


                </div>
            )}
        </div>
    );
};


export default ImageUpload;
