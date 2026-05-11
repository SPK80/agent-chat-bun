import {
  useState,
  useRef,
  useEffect,
  type KeyboardEventHandler,
  Fragment,
} from "react";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import type { Message } from "ollama";
import { Button, Input, notification } from "antd";
import { UpOutlined, DeleteOutlined } from "@ant-design/icons";
import ModelsSelect from "../../../components/ModelsSelect";
import { useOllamaChat } from "../hooks/useOllamaChat";
import { TypingIndicator } from "../../../components/TypingIndicator";

interface IProps {
  id: string;
}

export const Chat = ({ id }: IProps) => {
  const [{ warning }, contextHolder] = notification.useNotification();
  const [model, setModel] = useState("");

  const { messages, setMessages, response, post } = useOllamaChat({
    model,
    initialMessages: JSON.parse(
      localStorage.getItem(`chat#${id}`) ?? "[]",
    ) as Message[],
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    localStorage.setItem(`chat#${id}`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: isFirstRender.current ? "instant" : "smooth",
    });

    isFirstRender.current = false;
  }, [messages, response]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [waiting, setWaiting] = useState(false);

  const send = async () => {
    if (!model) {
      warning({ title: "выбери модель" });
      return;
    }
    try {
      setWaiting(true);
      if (inputValue.trim() === "") return;
      setInputValue("");
      await post(inputValue);
    } catch (e) {
      console.error(e);
    } finally {
      setWaiting(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem(`chat#${id}`);
    setMessages([]);
  };

  const handleKeyUp: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      send();
    }
  };

  return (
    <div className="chat-container">
      {contextHolder}
      <div className="chat-header">
        Чат
        <Button
          className="clear-button"
          onClick={clearChat}
          icon={<DeleteOutlined />}
          disabled={!messages.length || waiting}
        />
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <Fragment key={index}>
            <div
              className={`message ${msg.role === "user" ? "sent" : "received"}`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            {index === messages.length - 1 &&
              msg.role === "user" &&
              waiting && (
                <div className="message received">
                  {response?.length ? (
                    <ReactMarkdown>{response}</ReactMarkdown>
                  ) : (
                    <TypingIndicator />
                  )}
                </div>
              )}
          </Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <ModelsSelect onSelect={setModel} />
        <Input.TextArea
          value={inputValue}
          onKeyUp={handleKeyUp}
          onChange={(e) => setInputValue(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 10 }}
          placeholder="Напишите сообщение..."
        />
        <Button
          onClick={send}
          type="primary"
          shape="circle"
          style={{ padding: 0 }}
          icon={<UpOutlined />}
        />
      </div>
    </div>
  );
};
