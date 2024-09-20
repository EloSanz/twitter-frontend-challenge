import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import io from "socket.io-client";
import { MessageDTO } from "../../service";

const token = localStorage.getItem("token")?.split(" ")[1]; // Extraer solo el token

const socket = io("/", {
  extraHeaders: {
    token: token ? token : "",
  },
});

function Chat() {
  const { chatId } = useParams<{ chatId: string }>();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || !message) return;

    socket.emit("sendMessage", { receiverId: chatId, content: message });
    setMessages([...messages, message]);
    setMessage("");
  };
  const receiveMessage = (message: MessageDTO) => {
    setMessages((state) => [...state, message.content]);
  };

  useEffect(() => {
    socket.emit("joinRoom", { roomId: chatId });

    socket.on("message", receiveMessage);
    socket.on("previousMessages", (previousMessages: MessageDTO[]) => {
      setMessages(previousMessages.map((message) => message.content));
      console.log(
        previousMessages.map((message) => console.log(message.content))
      );
    });
  }, [chatId]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="write your message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
      <li>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </li>
    </div>
  );
}

export default Chat;
