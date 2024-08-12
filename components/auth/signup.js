import React ,{useEffect, useRef}from 'react'
import InputForms from './input-form-register'
import { toast } from 'react-toastify';
import {call_mediator2} from "../../utils/mediator"
import { request_url } from '../../utils/config';
import styles from './styles.module.css'

function Signup({login, setlogin}) {
  const refuser = useRef(null);
  const refemail = useRef(null);
  const refpassword = useRef(null);
  const refapi = useRef(null);
  

  // useEffect(()=>{
  //   const exec = async ()=>{
  //     const [data,res] = await call_mediator2(`${request_url}/auth/test`,'POST',{})
  //   }
  //   exec()

  // },[])

  const sign_up=async ()=>{
    // toast.success("account added , please login!")
    if (refuser.current.value==="" || refemail.current.value==="" ||refpassword.current.value==="" ||refapi.current.value==="" ){
      toast.error("please fill all fields")
      return;
    }
    const [data,res] = await call_mediator2(`${request_url}/auth/signup`,"POST",{
      "name":refuser.current.value,
      "email":refemail.current.value,
      "password":refpassword.current.value,
      "api_key":refapi.current.value
    })
    if (res ===200)
    {
      toast.success("account added succesfully , please login!")
      setlogin(true)
    }else if(res===406){

  toast.warn("Email Already Exist, Register with new email ")
    }

  }


  
  return (
    <div className={styles.login_container}>
      <InputForms labels={["name","email","password","api key"]} inputrefs={[refuser,refemail,refpassword,refapi]}/>
      <div className={styles.submit_btn}>
              <button className="btn-block fa-lg gradient-custom-2 mb-3" onClick={sign_up}>Signup</button>
            </div>

            <div className='register_here' >
          <p className="register mb-5 pb-lg-2" >Already have an account?&nbsp;&nbsp;&nbsp;  
            <a style={{cursor:"pointer" }} className=" fa-lg mb-3" onClick={() => {setlogin(true) }} >
              Login Now
            </a>
            </p>
          </div>


    </div>
  )
}

export default Signup