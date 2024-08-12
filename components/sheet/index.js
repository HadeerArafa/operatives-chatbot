
import React, { useState, useEffect } from 'react'
import Papa from 'papaparse';
import styles from './style.module.css';
import { call_mediator2 } from '../../utils/mediator';
import { request_url } from '../../utils/config';
import { toast } from 'react-toastify';
import ImageUpload from './upload_ocr';
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import CustomTable from './Table';


function Index() {

  const [rows, setrows] = useState([]);
  const [bill_id, setbill_id] = useState("");
  const [cols, setcols] = useState([])
  const [key_inpt, set_key_inpt] = useState(0)
  const [key_, set_key_] = useState(0)
  const [session, setSession] = useState(null)
  const [send, setsend] = useState(true)
  const router = useRouter()


  useEffect(() => {
    if (localStorage.getItem('sheet_data')) {
      const data = localStorage.getItem('sheet_data');
      setrows(data)
    } else {

    }
    const get_session = JSON.parse(localStorage.getItem('session'))
    setSession({
      user: get_session
    })

  }, [])
  useEffect(() => {
    if (rows?.length === 0) return;
    set_key_(key_+1)
    setcols(Object.keys(rows[0]))
    setsend(true)
  }, [rows])


  // const show_cols = () => {
  //     return (

  //         <TableRow>
  //           return{
  //             cols.map((col_name) => {
  //                 <TableCell component="th" scope="row">
  //                 {col_name}
  //               </TableCell>
  //             })

  //           }       
  //         </TableRow>

  //     )
  //     // return [
  //     //     <th style={{ textAlign: "center" }}></th>
  //     //     ,
  //     //     cols.map((col_name) => {
  //     //         return (
  //     //             <th className={styles.cell} style={{ textAlign: "center" }}>{col_name}</th>
  //     //         )
  //     //     })
  //     // ]
  // }

  const update = (row_i, col_key, val) => {
    var new_rows = [...rows]
    new_rows[row_i][col_key] = val
    setrows(new_rows)
  }
  const handleChnage = async (e , index_row, col_key ) => {
    update(index_row, col_key, e.target.value)

  };
  const render_cell = (index_row, col_key, val) => {
    return (
      <td className={styles.cell} style={{ padding: "0px" }}>
        <input

          key={key_inpt}
          style={{ border: "0px", paddingLeft: "5px" }}
          type='text'
          defaultValue={val}
          disabled={col_key === "item_id"}
          onChange={(e) => { handleChnage(index_row, col_key, e) }}
        />
      </td>
    )
  }
  const render_row = (index_row, row) => {
    return (
      <tr key={index_row}>
        <td className={styles.cell} style={{ padding: "5px" }}>
          <div> {index_row + 1}</div>
        </td>
        {
          Object.entries(row).map(([col_key, val]) => {
            return (
              render_cell(index_row, col_key, val)
            )
          })
        }

      </tr>
    )
  }
  const show_rows = () => {
    return rows?.map((row, i) => {
      return render_row(i, row)

    })
  }
  const exportToCSV = async () => {

    if(!send){toast.info("you already saved it!");return};
    const csvData = Papa.unparse(rows);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const [data, res] = await call_mediator2(`${request_url}/ocr/get_updated_bill_details`, "POST", {
      "rows": rows,
      "user_id": session.user.user_id,
      "company_id": session.user.company_id,
      "bill_id": bill_id
    })
    if (res === 200) {
      toast.success(data.response)
      setsend(false)
    } else {
      toast.error(data.response)
    }


  };

  const [editableData, setEditableData] = useState(rows);

  const handleCellChange = (e, rowIndex, key) => {
    const updatedData = editableData.map((row, i) => {
      if (i === rowIndex) {
        return {
          ...row,
          [key]: e.target.value // Update the value of the specific cell being edited
        };
      }
      return row;
    });
    setEditableData(updatedData);
  };
  return (
    <div className={styles.ocr_container}>
      <div className="head-text">
      <div style={{display:"flex" , flexDirection:"column" , alignItems:"center" , width:"100%" , marginRight:"30px"}}>
           Opera
          <p>(Online)</p>
        </div>
        <div>
          <IoArrowBackOutline style={{ width: "24px", height: "24px" , cursor:"pointer" }} onClick={() => { router.replace("/home") }} />


        </div>

      </div>

     <div className={styles.ocr_body_container}>
      <ImageUpload session={session} setrows={setrows} setbill_id={setbill_id} />

      <div className='ocr_table' style={{ width: "100vw" }}>

        <div >
          {/* <table className={styles.table}>
                        <thead>
                            <tr></tr>
                        </thead>
                        <tbody>
                            {show_rows()}
                        </tbody>
                    </table> */}
          {/* <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
      <TableRow>

      {cols.map((col_name) => (
           <>
              <TableCell component="th" scope="row">
                {col_name}
              </TableCell>
              </>
          ))}
        
            </TableRow>

      </TableHead>
        <TableBody>
            
          {rows.map((row,i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {Object.keys(row).map(key => (
          <TableCell component="th" scope="row" key={key}>
          {row[key]}
        </TableCell>
        ))}

            </TableRow>
          ))}
        </TableBody>
       
      </Table>
    </TableContainer> */}

            <CustomTable cols={cols} rows={rows} handleChange={handleChnage} key_={key_}/>

        </div>

        {rows.length > 0 ?
          <div className='mt-3' style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <button className='btn btn-success' onClick={() => { exportToCSV() }}>Save and download</button>

          </div>
          : ""}
      </div>
      </div>
    </div>
  )
}

export default Index