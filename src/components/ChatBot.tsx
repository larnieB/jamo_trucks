import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can we help you with your truck purchase today?", sender: 'bot' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello there! How can I assist you with our trucks today?";
    }
    if (lowerCaseMessage.includes('financing') || lowerCaseMessage.includes('payment')) {
      return "We offer flexible financing options! You can learn more by visiting our 'Financing' page or by calling our sales team at +254 791 790744.";
    }
    if (lowerCaseMessage.includes('hours') || lowerCaseMessage.includes('open')) {
      return "Our business hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 3:00 PM.";
    }
    if (lowerCaseMessage.includes('location') || lowerCaseMessage.includes('address')) {
      return "You can find us in Nairobi and Mombasa. Our main showroom is located at 123 Industrial Area, Nairobi.";
    }
    if (['trucks', 'inventory', 'scania', 'volvo', 'mercedes', 'actros'].some(keyword => lowerCaseMessage.includes(keyword))) {
      return "It sounds like you're interested in our inventory! You can view all available trucks on our inventory page. What specific model are you looking for?";
    }
    if (lowerCaseMessage.includes('thanks') || lowerCaseMessage.includes('thank you')) {
        return "You're welcome! Is there anything else I can help you with?";
    }
    
    return "Thanks for your message! Our team has been notified. For immediate assistance, please call us at +254 791 790744.";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    
    const botResponseText = getBotResponse(inputValue);
    setInputValue('');

    // Simulated Bot Response
    setTimeout(() => {
      const botMsg: Message = { 
        id: Date.now() + 1, 
        text: botResponseText, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <>
      <div 
        style={chatbotIconStyle} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us"
      >
        <span style={{ fontSize: '24px' }}>💬</span>
      </div>

      {isOpen && (
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={chatHeaderStyle}>
            <strong>Jamoh Trucks Support</strong>
            <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>✕</button>
          </div>

          {/* Messages Area */}
          <div style={messageListStyle}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  ...messageContainerStyle,
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  ...bubbleStyle,
                  backgroundColor: msg.sender === 'user' ? '#F28C28' : '#e9e9eb',
                  color: msg.sender === 'user' ? 'white' : '#333',
                  borderRadius: msg.sender === 'user' ? '15px 15px 2px 15px' : '15px 15px 15px 2px',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={inputAreaStyle}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              style={inputFieldStyle}
            />
            <button type="submit" style={sendButtonStyle}>➤</button>
          </form>
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-10px);}
            60% {transform: translateY(-5px);}
          }
        `}
      </style>
    </>
  );
};

// --- STYLES ---

const chatbotIconStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  width: '60px',
  height: '60px',
  backgroundColor: '#F28C28',
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  zIndex: 9999,
  animation: 'bounce 2s infinite',
};

const chatWindowStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '100px',
  right: '30px',
  width: '320px',
  height: '450px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: '1px solid #ddd',
};

const chatHeaderStyle: React.CSSProperties = {
  backgroundColor: '#222',
  color: 'white',
  padding: '12px 15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const messageListStyle: React.CSSProperties = {
  flex: 1,
  padding: '15px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: '#f9f9f9',
};

const messageContainerStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
};

const bubbleStyle: React.CSSProperties = {
  maxWidth: '80%',
  padding: '8px 12px',
  fontSize: '14px',
  lineHeight: '1.4',
  wordWrap: 'break-word',
};

const inputAreaStyle: React.CSSProperties = {
  display: 'flex',
  padding: '10px',
  borderTop: '1px solid #eee',
  backgroundColor: 'white',
};

const inputFieldStyle: React.CSSProperties = {
  flex: 1,
  border: '1px solid #ddd',
  borderRadius: '20px',
  padding: '8px 15px',
  outline: 'none',
  fontSize: '14px',
};

const sendButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#F28C28',
  fontSize: '20px',
  marginLeft: '5px',
  cursor: 'pointer',
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontSize: '16px',
};

export default ChatBot;