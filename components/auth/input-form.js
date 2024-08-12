import React from 'react'
import styles from './styles.module.css'
function InputForms({ labels, inputrefs }) {
  return (
    // <div className='d-flex flex-row'>
    //     <div className='d-flex flex-column'>
    //         {
    //             labels?.map((label) => {
    //                 return <h3 className='mb-2 p-0'>{label}</h3>
    //             })
    //         }
    //     </div>

    //     <div className='d-flex flex-column' style={{marginLeft:"10px"}}>
    //         {
    //             inputrefs?.map((inputref) => {
    //                 return (
    //                     <input className='mt-2' style={{width:"30vw"}} type='text' ref={inputref}/>
    //                 )
    //             })
    //         }
    //     </div>


    // </div>

    <div className="login_container " >
      <div className="row d-flex align-items-flex-start justify-content-center">
        <div className="form_container col-md-7 col-lg-5 col-xl-5 offset-xl-1" >
          <form>
            <div className="form-outline mb-4">
              <label className="form-label" for="form1Example13">Email</label>
              <input style={{ backgroundColor: "white !important" }} type="text" id="form1Example13" className={styles.form_input} ref={inputrefs[0]} />

            </div>

            <div className="form-outline mb-4">
              <label className="form-label" for="form1Example23">Password</label>
              <input style={{ backgroundColor: "white !important" }} type="password" id="form1Example23" className={styles.form_input} ref={inputrefs[1]} />

            </div>

            {/* <div className="form-outline mb-4">
              <label className="form-label" for="form1Example23">company_id</label>
              <input style={{ backgroundColor: "white !important" }} type="text" id="form1Example23" className={styles.form_input} ref={inputrefs[2]} />

            </div> */}

          </form>



        </div>

      </div>


    </div>


  )
}

export default InputForms