import Login from "../components/auth/login"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getSession } from 'next-auth/react';
import { useRouter } from "next/router";

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession({ req: ctx.req })
//   if (session) {
//     return {
//       redirect: {
//         destination: '/chat',
//         permanent: false,
//       }
//     }
//   } else {
//     return {
//       redirect: {
//         destination: '/auth',
//         permanent: false,
//       }
//     }
//   }
//   return {
//     props: {

//     }
//   }

// }


export default function Home() {
  //const { data: session, status } = useSession()
  const router =useRouter()

  useEffect(() => {
    
    const data =JSON.parse(localStorage.getItem('session'))
    if ( data === null){
      router.replace("/auth")
    }else{
      router.replace("/home")
    }
  }, [])

  return (
    <div className="vw-100 vh-100 bg-dark" style={{ color: "white" }}>
      
    </div>
  )
}
