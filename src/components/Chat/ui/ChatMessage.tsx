import { UndoOutlined } from "@ant-design/icons";
import { Button } from "antd";
import clsx from "clsx";
import type { Message } from "ollama";
import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";

const StyledChatMessage = styled.div`
  max-width: 100%;
  margin-bottom: 10px;
  position: relative;

  display: flex;
  gap: 5px;

  .content {
    padding: 10px 14px;

    border-radius: 12px;
    word-wrap: break-word;
  }

  &.sent {
    align-self: flex-end;

    .content {
      background-color: #007bff;
      color: white;
    }
  }

  &.received {
    align-self: flex-start;
    .content {
      background-color: #e9ecef;
    }
  }
`;

export interface IProps {
  className?: string;
  message: Message;
  canUndo: boolean;
  onUndo?: () => void;
}

const ChatMessage = ({ className, message, onUndo, canUndo }: IProps) => {
  return (
    <StyledChatMessage
      className={clsx(
        className,
        `message`,
        `${message.role === "user" ? "sent" : "received"}`,
      )}
      onClick={() => {
        message.role === "user" && onUndo?.();
      }}
    >
      {canUndo && message.role === "user" && (
        <Button
          type="primary"
          shape="circle"
          size="small"
          ghost
          icon={<UndoOutlined />}
        />
      )}
      <div className="content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </StyledChatMessage>
  );
};

export default ChatMessage;
