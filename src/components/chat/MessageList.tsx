// MessageList.tsx
import React, { useEffect, useRef, useState } from "react";
import { MessageDTO } from "../../service";
import {
  MessageListContainer,
  MessageWrapper,
  MessageBubble,
} from "./StyledComponents";
import Loader from "../loader/Loader";

function MessageList({
  messages,
  senderId,
}: {
  messages: MessageDTO[];
  senderId: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  return (
    <MessageListContainer>
      {loading ? (
        <Loader />
      ) : messages.length === 0 ? (
        <>
          <MessageBubble
            isSender={false}
            style={{ textAlign: "start", fontStyle: "italic" }}
          >
            No messages
          </MessageBubble>
          <MessageBubble
            isSender={true}
            style={{ textAlign: "end", fontStyle: "italic", marginTop: "10px" }}
          >
            Make the first step ;)
          </MessageBubble>
        </>
      ) : (
        messages.map((message, index) => (
          <MessageWrapper key={index} isSender={message.senderId === senderId}>
            <MessageBubble isSender={message.senderId === senderId}>
              {message.content}
            </MessageBubble>
          </MessageWrapper>
        ))
      )}
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
}

export default MessageList;
