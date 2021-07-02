import { useState } from "react";
import { useEffect } from "react";
import {io} from "socket.io-client"

export default function Homepage() {
    let [currentUser,setCurrentuser] = useState({});
    let [otherUser,setOtherUser] = useState([])

    let getAudio = async()=>{
        let stream = await navigator.mediaDevices.getUserMedia({audio: true});
            let audio = new Audio()
            audio.srcObject = stream
            audio.play()
    }
    useEffect(() => {
        let username = prompt("Username: ");
        console.log(username);
        const socket = io('ws://localhost:8111');
        socket.on("connect", () => {
            console.log("Connected!!");
            socket.send({username});
        })
        
        socket.on("message", (data) => {
            console.log(data);
            if(!Array.isArray(data)) setCurrentuser({...data,username:username});
            else {
                console.log("here?",data);
                setOtherUser([...data]);
            }
        })
    }, [])
    

    return(<div>
        <h1>{currentUser.username}</h1>
        <audio onPlay={getAudio}></audio>
        <h1>Other users: </h1>
        {otherUser.map(e=>
            {if(e.id!==currentUser.id)return<h2>{e.username}</h2>}
            )
        }
    </div>)
}