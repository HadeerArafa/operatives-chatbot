import React from 'react'
import Chat from '../components/chat/chat.js';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router.js';
import { useEffect } from 'react';
import { useState } from 'react';

export const getServerSideProps = async (ctx) => {

  const { state } = ctx.query;

  var final_state = state

  if ( final_state !== "pdf" ){
    final_state = "messages"
  }

  return {
    props: {
      state: final_state , // Pass the state parameter, or null if not present
    },
  };

}

function Chat_page({ state }) {


  const router = useRouter()
  const [session, setsession] = useState(null)

  useEffect(() => {

    if (JSON.parse(localStorage.getItem('session')) === null) {
      router.replace("/auth")
    } else {
      setsession(JSON.parse(localStorage.getItem('session')))
    }

  }, [])
  if (session !== null) {
    return (
      <Chat state={state}/>
    )
  }

}

export default Chat_page
