'use client'

import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export default function ChatMain() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${url}/chatHub`, {
        withCredentials: true,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR");

        newConnection.on("ReceiveMessage", (user, message) => {
          setMessages(prev => [...prev, `${user}: ${message}`]);
        });
         newConnection.on("Send", (message) => {
          console.log("Received message:", message);
          setMessages(prev => [...prev, `${message}`]);
        });
      })
      .catch(err => console.error("SignalR error", err));

    return () => {
      newConnection.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (!connection) return;
    await connection.invoke("SendMessage", "User123", input);
    setInput('');
  };
  const addToGroup = async () => {
    if (!connection) return;
    await connection.invoke("AddToGroup", "Group1");
    setInput('');
  };
  const removeFromGroup = async () => {
    if (!connection) return;
    await connection.invoke("RemoveFromGroup", "Group1");
    setInput('');
  };
  return (
    <div>
      <div className="border p-2 h-40 overflow-y-scroll">
        {messages.map((msg, idx) => <p key={idx}>{msg}</p>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button> 
    </div>
  );
}
