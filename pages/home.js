import Home from '../components/home';
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { call_mediator2 } from '../utils/mediator';
import { request_url , url } from '../utils/config';


export default function Home_page() {
    const router = useRouter()
    const [session, setsession] = useState(null)

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('session')) === null) {
            router.replace("/auth")
        } else {
            setsession(JSON.parse(localStorage.getItem('session')))
        }

    }, [])


    useEffect(() => {
        if(session ===  null){
            return;
        }
        const effect = async () => {
            const [data, res] = await call_mediator2(`${request_url}/messages/update_api_key?user_id=${session.user_id}`,
                "GET",{}
            )
        }
        // effect();

    }, [session])


    if (session !== null) {
        return (
            <Home />
        )
    }

}
