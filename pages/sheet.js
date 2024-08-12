
import MainSheet from '../components/sheet'
import React, { useEffect, useState }  from 'react'
import { useRouter } from 'next/router.js';



function Sheet() {
  const router = useRouter()
  const [session,setsession] = useState(null)

  useEffect(() => {
    
    if (JSON.parse(localStorage.getItem('session')) === null) {
      router.replace("/auth")
    } else{
      setsession(JSON.parse(localStorage.getItem('session')))
    }
    
  }, [])
  if(session !== null){
    return (
      <MainSheet />
    )
  }
  
}

export default Sheet
