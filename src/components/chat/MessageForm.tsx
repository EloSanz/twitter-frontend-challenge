// MessageForm.tsx
import React, { useState } from "react";
import { FormContainer, Input, Button } from "./StyledComponents"; // Asegúrate de que la ruta sea correcta

interface MessageFormProps {
  onSubmit: (message: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        value={message}
        placeholder="Write your message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit">Send</Button>
    </FormContainer>
  );
};

export default MessageForm;
