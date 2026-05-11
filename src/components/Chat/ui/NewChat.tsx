import { useState, useRef, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  List,
  Avatar,
  Space,
  Typography,
  Card,
  Spin,
} from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "./NewChat.css";
import ModelsSelect from "../../../components/ModelsSelect";

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Пример ответов ИИ агента
  const mockAIResponses = [
    "Привет! Я ваш ИИ агент. Чем могу помочь?",
    "Это интересный вопрос! Давайте разберемся вместе.",
    "Я понимаю вашу точку зрения. Могу предложить альтернативный подход.",
    "Отличная идея! Давайте рассмотрим ее подробнее.",
    "Понял вас. Сейчас подготовлю более детальный ответ.",
    "Спасибо за ваш вопрос. Давайте проанализируем ситуацию.",
  ];

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Симуляция ответа ИИ агента
  const getAIResponse = (userMessage) => {
    const randomIndex = Math.floor(Math.random() * mockAIResponses.length);
    return mockAIResponses[randomIndex];
  };

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Симуляция задержки ответа ИИ
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // Обработка нажатия Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Форматирование времени
  const formatTime = (date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout className="chat-layout">
      <ModelsSelect onSelect={console.log} />
      {/* <Header className="chat-header">
        <Space>
          <RobotOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={3} style={{ color: "white", margin: 0 }}>
            ИИ Ассистент
          </Title>
        </Space>
      </Header> */}

      <Content className="chat-content">
        <Card className="messages-container">
          <List
            dataSource={messages}
            renderItem={(message) => (
              <List.Item className={`message-item ${message.sender}`}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={
                        message.sender === "user" ? (
                          <UserOutlined />
                        ) : (
                          <RobotOutlined />
                        )
                      }
                      style={{
                        backgroundColor:
                          message.sender === "user" ? "#1890ff" : "#52c41a",
                      }}
                    />
                  }
                  title={
                    <Space>
                      <Text strong>
                        {message.sender === "user" ? "Вы" : "ИИ Агент"}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatTime(message.timestamp)}
                      </Text>
                    </Space>
                  }
                  description={
                    <div className={`message-bubble ${message.sender}`}>
                      {message.text}
                    </div>
                  }
                />
              </List.Item>
            )}
          />

          {isLoading && (
            <div className="loading-indicator">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
              <Text type="secondary" style={{ marginLeft: 10 }}>
                ИИ агент думает...
              </Text>
            </div>
          )}

          <div ref={messagesEndRef} />
        </Card>
      </Content>

      <Footer className="chat-footer">
        <Space direction="vertical" style={{ width: "100%" }}>
          <TextArea
            placeholder="Введите ваше сообщение..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ resize: "none" }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            block
          >
            Отправить
          </Button>
        </Space>
      </Footer>
    </Layout>
  );
};

export default Chat;
