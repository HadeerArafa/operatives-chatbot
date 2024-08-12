import React from 'react'
import { useEffect } from 'react'
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
function Signout() {
  const router = useRouter()
  // const { data: session, status } = useSession()

  useEffect(() => {

      // signOut({ callbackUrl: `${window.location.origin}/auth` })
      localStorage.removeItem('session');
      router.replace("/auth")

  }, [])
  return (
    <div>
    </div>
  )
}

export default Signout
