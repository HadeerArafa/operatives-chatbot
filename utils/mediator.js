import { url } from "./config"

export async function call_mediator2 (root , method="GET",body={}){
    var response = await fetch(`${url}/api/mediator`,{
        method: "POST",
        body:JSON.stringify({
            "root" : root,
            "method":method,
            "body":body
        }) ,
    })
    var data =await response.json()

    return [data,response.status]
}