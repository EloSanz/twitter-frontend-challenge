// StyledComponents.ts
import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;   
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;

export const Input = styled.input`
  flex: 1; 
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

export const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff; 
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
export const MessageListContainer = styled.ul`
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
  margin: 0;
  list-style: none;
  flex-grow: 1;
`;

export const MessageWrapper = styled.div<{ isSender: boolean }>`
  display: flex;
  justify-content: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};
  margin: 10px 0;
`;

export const MessageBubble = styled.div<{ isSender: boolean }>`
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ isSender }) => (isSender ? "#DCF8C6" : "#FFF")};
  text-align: ${({ isSender }) => (isSender ? "right" : "left")};
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word; /* Permitir el ajuste de palabras largas */
  overflow-wrap: break-word; /* Permitir el ajuste de palabras largas */
`;