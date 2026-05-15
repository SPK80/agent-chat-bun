import {
  useState,
  useRef,
  useEffect,
  type KeyboardEventHandler,
  Fragment,
  useMemo,
} from "react";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import { type Message } from "ollama";
import { Button, Input, notification } from "antd";
import { CloseOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import ModelsSelect from "../../../components/ModelsSelect";
import { useOllamaChat } from "../hooks/useOllamaChat";
import { TypingIndicator } from "../../../components/TypingIndicator";
import ChatMessage from "./ChatMessage";

interface IProps {
  id: string;
}

export const Chat = ({ id }: IProps) => {
  const [{ warning }, contextHolder] = notification.useNotification();
  const [model, setModel] = useState("");

  const { messages, setMessages, response, post, abort } = useOllamaChat({
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
      e.preventDefault();
      send();
    }
  };

  const lastUserMessageIndex = useMemo(() => {
    let index = messages.length - 1;
    while (index > 0 && messages[index]?.role !== "user") {
      index -= 1;
    }
    return index;
  }, [messages]);

  const undo = () => {
    const content = messages[lastUserMessageIndex]?.content;

    if (content) {
      setInputValue(content);
      setMessages(messages.slice(0, lastUserMessageIndex));
    }
  };

  return (
    <>
      {contextHolder}
      <div className="chat-header">
        <ModelsSelect onSelect={setModel} />
        <span className="title">Чат</span>
        <Button
          onClick={clearChat}
          icon={<DeleteOutlined />}
          disabled={!messages.length || waiting}
        />
      </div>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <Fragment key={index}>
              <ChatMessage
                message={msg}
                onUndo={undo}
                canUndo={!waiting && index === lastUserMessageIndex}
              />
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
          <Input.TextArea
            value={inputValue}
            onKeyUp={handleKeyUp}
            onChange={(e) => setInputValue(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 10 }}
            placeholder="Напишите сообщение..."
          />
          {waiting && response?.length ? (
            <Button
              onClick={abort}
              type="primary"
              shape="circle"
              style={{ padding: "2px 0 0 0" }}
              icon={<CloseOutlined />}
            />
          ) : (
            <Button
              onClick={send}
              type="primary"
              shape="circle"
              style={{ padding: "2px 0 0 2px" }}
              icon={<SendOutlined />}
              disabled={waiting}
            />
          )}
        </div>
      </div>
    </>
  );
};
