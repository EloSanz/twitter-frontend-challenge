import React from "react";
import { useGetMe } from "../../redux/hooks";
import { useGetChats } from "../../service/queryHooks";
import { ChatDTO } from "../../service";
import { useNavigate } from "react-router-dom";

function ChatBox() {
  const sender = useGetMe(); // Obtener el ID del usuario
  const chats = useGetChats(sender.id); // Obtener los chats del usuario
  const navigate = useNavigate();

  const handleChatClick = (chat: ChatDTO) => {
    navigate(`/chat/${chat.id}`, { state: { chat } });
  };

  return (
    <div>
      <h1>Messages</h1>
      
      {chats.isLoading && <p>Loading...</p>}
      {chats.isError && <p>Error loading chats</p>}
      {chats.isSuccess && (
        <div>
          <ul>
            {chats.data.map((chat: ChatDTO) => (
              <div 
                onClick={() => handleChatClick(chat)} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', margin: '5px 0' }}>
                {chat.users.find(user => user.id !== sender.id)?.username}
              </div>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
}

export default ChatBox;
