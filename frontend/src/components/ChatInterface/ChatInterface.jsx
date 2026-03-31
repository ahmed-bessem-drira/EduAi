import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { generateContent } from '../../services/api';
import styles from './ChatInterface.module.css';

const ChatInterface = ({ courseContent, language = 'fr' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const contextPrompt = `
Context: You are chatting with a student about a course that was analyzed. The course content is:
${courseContent ? courseContent.substring(0, 2000) + '...' : 'No course content available'}

Student's question: ${inputMessage}

Please provide a helpful response related to the course content. Be educational and encouraging.
Language: ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

      const response = await generateContent(contextPrompt, language);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.resume?.introduction || "I'm here to help you understand the course material better. What would you like to know?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!courseContent) return null;

  return (
    <>
      <button
        className={styles.chatToggle}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        <MessageCircle className={styles.chatIcon} />
      </button>

      <div className={`${styles.chatInterface} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderContent}>
            <Bot className={styles.chatHeaderIcon} />
            <div className={styles.chatHeaderText}>
              <h3>AI Assistant</h3>
              <span>Ask about your course</span>
            </div>
          </div>
          <button
            className={styles.chatClose}
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <X />
          </button>
        </div>

        <div className={styles.chatMessages}>
          {messages.length === 0 ? (
            <div className={styles.welcomeMessage}>
              <Bot className={styles.welcomeIcon} />
              <p>
                {language === 'fr' 
                  ? 'Bonjour! Je suis votre assistant IA. Posez-moi des questions sur votre cours!' 
                  : language === 'ar'
                  ? 'مرحبا! أنا مساعدك الذكي. اسألني عن دورتك!'
                  : 'Hello! I\'m your AI assistant. Ask me questions about your course!'}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}
              >
                <div className={styles.messageAvatar}>
                  {message.sender === 'user' ? <User /> : <Bot />}
                </div>
                <div className={styles.messageContent}>
                  <p>{message.text}</p>
                  <span className={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <div className={styles.messageAvatar}>
                <Bot />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatInput}>
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === 'fr' 
                ? 'Posez votre question ici...' 
                : language === 'ar'
                ? 'اطرح سؤالك هنا...'
                : 'Ask your question here...'
            }
            className={styles.inputTextarea}
            rows={1}
            disabled={isLoading}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            <Send className={styles.sendIcon} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
