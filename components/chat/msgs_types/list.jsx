import React from 'react'
import styles from './styles.module.css'
import VisibilityIcon from '@mui/icons-material/Visibility';




function ListMsg({ ele, i,len }) {
    const create_table = (ele) => {
        return (


            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        {
                            Object.keys(ele?.title[0]).map((key,index)=>(
                                <th key={index} className={styles.th}>
                                    {key}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {ele?.title?.map((row_data, index) => (
                        <tr key={index}>
                            {
                                Object.values(row_data)?.map((row_data, index_col) => {
                                    return (
                                        <td key={index_col} className={styles.td}>{row_data}</td>
                                    )
                                })
                            }

                        </tr>
                    ))}

                </tbody>

            </table>
        )
    }

    if (ele.sent_by_customer === true) {
        return (
            <div className="msg_container_user" key={i} >
                 <div className={`msg ${i+1==len?"message-pop":""}`} >
                    {
                        create_table(ele)
                    }
                    {/* <span style={{ wordWrap: "break-word" }}>{ele.title}</span> */}

                </div>
            </div>
        )
    } else {
        return (
            <div className="msg_container" key={i} >
                {/* <img src="./images/logo.png"></img> */}
                <img src="./images/logo.jpg"></img>
                <div className={`${i+1==len?"message-pop":""}`} style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                <div style={{display:"flex", alignItems:"center"}}>
                <div className={`msg ${ele.title=='...'?"typing-animation":""}`} >
                        {ele.title=='...'?
                                <span  className={`${ele.title=='...' && i+1==len?"dots":""}`} dir='rtl' style={{ wordWrap: "break-word" }}>{ele.title}</span>
                                :
                                create_table(ele)
                        }
                        {/* <span style={{ wordWrap: "break-word" }}>{ele.title}</span> */}
                    </div>
                    <VisibilityIcon style={{marginLeft:"20px" , cursor:"pointer"}}/>

                    </div>
                    <p style={{ marginLeft: "15px" }}>{new Date(ele.message_date).getHours()}:{new Date(ele.message_date).getMinutes()} {new Date(ele.message_date).getHours() > 12 ? "Pm" : "Am"}</p>

                </div>
            </div>
        )
    }
}

export default ListMsg