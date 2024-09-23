import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { ChatDTO, MessageDTO } from "../../service";
import { useGetMe } from "../../redux/hooks";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm"; 

const token = localStorage.getItem("token")?.split(" ")[1];

const socket = io("/", {
  extraHeaders: {
    token: token ? token : "",
  },
});

function Chat() {
  const location = useLocation();
  const chat: ChatDTO = location.state?.chat;

  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const senderId = useGetMe().id;

  const handleSendMessage = (message: string) => {
    if (!chatId) return;
    socket.emit("sendMessage", { receiverId: chatId, message });
  };

  const receiveMessage = (message: MessageDTO) => {
    setMessages((state) => [...state, message]);
  };

  useEffect(() => {
    if (!chatId) return;

    socket.emit("joinRoom", { roomId: chatId });

    socket.on("message", receiveMessage);
    socket.on("previousMessages", (previousMessages: MessageDTO[]) => {
      setMessages(previousMessages);
    });

    return () => {
      socket.off("message", receiveMessage);
      socket.off("previousMessages");
    };
  }, [chatId]);

  /// 

  return (
    <div>
      <MessageList messages={messages} senderId={senderId} /> 
      <MessageForm onSubmit={handleSendMessage} />
    </div>
  );
}

export default Chat;
