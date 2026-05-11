import "./TypingIndicator.css";

export interface IProps {
  className?: string;
}

export const TypingIndicator = ({ className = "" }: IProps) => {
  return (
    <div className={"typing-indicator " + className}>
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
};
