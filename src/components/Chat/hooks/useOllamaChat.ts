import { useState } from "react";
import ollama, { type Message } from "ollama";

export const useOllamaChat = ({
  model,
  initialMessages = [],
}: {
  model: string;
  initialMessages?: Message[];
}) => {
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const post = async (value: string) => {
    const newMessages = [
      ...messages,
      {
        content: value,
        role: "user",
      },
    ];

    setMessages(newMessages);
    setResponse("");

    const stream = await ollama.chat({
      model,
      messages: newMessages,
      stream: true,
    });

    let content = response;
    for await (const part of stream) {
      setResponse((prev) => {
        content = prev + part.message.content;
        return content;
      });

      if (part.done) {
        setMessages((pred) => [...pred, { ...part.message, content }]);
      }
    }
  };

  return { response, messages, setMessages, post };
};
