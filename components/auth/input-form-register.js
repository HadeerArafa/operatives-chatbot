import React from 'react'
import styles from './styles.module.css'

function InputForms({ labels, inputrefs }) {
  return (
    <div className="login_container " >
      <div className="row d-flex align-items-flex-start justify-content-center">
        <div className="form_container col-md-7 col-lg-5 col-xl-5 offset-xl-1" >
          <form>

            <div className="form-outline mb-4">
              <label className="form-label" for="form1Example13">Name</label>
              <input style={{ backgroundColor: "white !important" }} type="text" id="form1Example13" className={styles.form_input} ref={inputrefs[0]} />

            </div>


            <div className="form-outline mb-4">
              <label className="form-label" for="form1Example13">Email</label>
              <input style={{ backgroundColor: "white !important" }} type="text" id="form1Example13" className={styles.form_input} ref={inputrefs[1]} />

            </div>

            <div className="form-outline mb-4">
              <label className="form-label" for="form1Example23">Password</label>
              <input style={{ backgroundColor: "white !important" }} type="password" id="form1Example23" className={styles.form_input} ref={inputrefs[2]} />

            </div>

            <div className="form-outline mb-4">
              <label className="form-label" for="form1Example23">Api Key</label>
              <input style={{ backgroundColor: "white !important" }} type="text" id="form1Example23" className={styles.form_input} ref={inputrefs[3]} />

            </div>

            <div className="form-outline mb-4">
              <label className="form-label" for="form1Example23">company id</label>
              <input style={{ backgroundColor: "white !important" }} type="text" id="form1Example23" className={styles.form_input} ref={inputrefs[4]} />

            </div>


          </form>



        </div>

      </div>


    </div>


  )
}

export default InputForms