import Head from "next/head";
import WebSocket from "isomorphic-ws";
import {useState, useEffect} from "react";

export default function Edit() {
    const [messages, setMessages] = useState("");
    const [socket, setSocket] = useState(null);
    const [inputMessage, setInputMessage] = useState("")
    const [requestMessage, setRequestMessage] = useState("")
    let requestCode = ""
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/websocket'); // WebSocketサーバーのURLに接続します
        /*
                type WsPayload struct {
                    Pnu     string       `json:"pnu"`
                    Code    string       `json:"code"`
                    Mail    string       `json:"mail"`
                    Message string       `json:"message"`
                    Conn    WsConnection `json:"-"`
                }
                 */
        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            console.log((JSON.parse(event.data)))
            const message = JSON.parse(event.data).message;
            if (message.startsWith("CODE=")) {
                requestCode = setInputMessage(message.substring(5))
                console.log("Receive Connection Code", message)
            }

            setMessages(message)
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setSocket(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const sendMessage = () => {
        if (socket) {
            const message = {
                Pnu: "4",
                Code: inputMessage,
                Mail: "sample@example.com",
                Message: requestMessage,
            }
            console.log(JSON.stringify(message))
            socket.send(JSON.stringify(message))
        }
    };

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
            <Head>
                <title>Edit</title>
            </Head>
            <main className={"flex-col"}>


                <h1>WebSocket Client</h1>
                <input type={"text"} onChange={(e) => setInputMessage(e.target.value)}/>

                <div className={"mb-2 my-2"}>

                    <input type={"text"} defaultValue={"Client Hello"}
                           onChange={(e) => setRequestMessage(e.target.value)}/>
                </div>
                <button onClick={sendMessage}>Send Message</button>
                <div>
                    {messages && <p className={"mb-2"}>{messages}</p>}
                </div>
            </main>
        </div>
    );
}