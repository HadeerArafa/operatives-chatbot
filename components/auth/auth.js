import React , {useState} from 'react'
import Login from './login'
import Signup from './signup'
import styles from './styles.module.css'

function Auth() {
  const [login,setlogin] = useState(true)
  return (
    <div className={styles.auth}>
      <div className={styles.header} style={{marginBottom:"20px"}}>
        <div className={styles.bot_image}>
          <img src='./images/bot.png'></img>
         
        </div>
        
        {login? <h1 className='gradient-custom-3'>Login</h1> : <h1 className='gradient-custom-3'>Signup</h1>}
      </div>
        
        {login?<Login  login = {login} setlogin={setlogin}/>
        :
        <Signup login = {login} setlogin={setlogin}/>}
    </div>
  )
}

export default Auth