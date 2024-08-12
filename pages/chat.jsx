import React from 'react'
import Chat from '../components/chat/chat.js';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router.js';
import { useEffect } from 'react';
import { useState } from 'react';
// export const getServerSideProps = async (ctx) => {
//   const session = await getSession({ req: ctx.req })
//   if (!session) {
//       return {
//           redirect: {
//               destination: '/auth',
//               permanent: false,
//           }
//       }
//   }
//   return {
//       props:{

//       }
//   }

// }

function Chat_page() {
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
      <Chat />
    )
  }
  
}

export default Chat_page
