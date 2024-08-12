import React from 'react'
import Auth from '../components/auth/auth'
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { useEffect } from 'react';
// export const getServerSideProps = async (ctx) => {
//   const session = await getSession({ req: ctx.req })
//   if (session) {
//       return {
//           redirect: {
//               destination: '/chat',
//               permanent: false,
//           }
//       }
//   }
//   return {
//       props:{

//       }
//   }

// }

function Auth_page() {
  const router = useRouter()

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('session')) !== null) {
      router.replace("/chat")
    } 
  }, [])
  return (
    <Auth />
  )
}

export default Auth_page