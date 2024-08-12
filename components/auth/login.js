import React, { useRef } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import InputForms from './input-form'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from './styles.module.css'
import { request_url } from '../../utils/config';
import { call_mediator2 } from '../../utils/mediator';

function Login({ login, setlogin }) {
  const router = useRouter()
  const refemail = useRef(null);
  const refpassword = useRef(null);
  const refcompanyId = useRef(null);


  const signingIn = async () => {
    // const res = await signIn("credentials", {
    //   email: refemail.current.value,
    //   password: refpassword.current.value,
    //   callbackUrl: `/`,
    //   redirect: false

    // })

    //+

    try {


      // const [data, res] = await call_mediator2(`${request_url}/auth/signin`,
      //   "POST",
      //   {
      //     "email": refemail.current.value,
      //     "password": refpassword.current.value
      //   }
      // )
      // TODE : remove the fake data
      let res = 200 ;
      let data = {data:{"name":"hadeer","email":"hadeer@gmail.com","user_id":"1"}}

      if (res === 401) {
        toast.error("البريد الالكترونى او كلمة المرور غير صحيحة")
      } else if (res === 400) {
        toast.error("حدث خطأ ما ! ")
      } else if (res === 200) {

        const session = data.data
  
        localStorage.setItem('session', JSON.stringify(session));
        router.replace('/home');

      }
    } catch {
      toast.error("حدث خطأ ما ! يرجي اعادة المحاولة مرة اخري فيما بعد")
    }


  }

  return (
    <div className={styles.login_container}>

      <InputForms labels={["email", "password"]} inputrefs={[refemail, refpassword, refcompanyId]} />
      <div className={styles.submit_btn}>
        <button className=" btn-block fa-lg gradient-custom-2 mb-3" onClick={signingIn}>Login</button>
      </div>
      <div className='register_here' >
        <p className="register mb-5 pb-lg-2" >Don`t have an account?&nbsp;&nbsp;&nbsp;
          <a style={{ cursor: "pointer" }} className=" fa-lg mb-3" onClick={() => { setlogin(false) }} >
            Register here
          </a>
        </p>
      </div>
    </div>

  )
}

export default Login