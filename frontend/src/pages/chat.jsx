import React, { useState } from 'react';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      // Simulate multiple AI replies after user input
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Hey, I'm here for you! 😊 What's up?", sender: 'ai' },
        ]);
      }, 1000);

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Anything exciting happened today? 🤔", sender: 'ai' },
        ]);
      }, 2000);

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Tell me more, I'm all ears! 👂", sender: 'ai' },
        ]);
      }, 3000);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-Screen Video Background */}
      <video
        src="/183279-870457579_medium.mp4"
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Chat Container */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="flex flex-col w-[90%] max-w-md h-[80%] bg-white/20 backdrop-blur-md border border-white rounded-xl p-4 shadow-lg">
          <div className="text-center text-xl font-bold mb-2 text-white">
            Your AI Best Friend
          </div>

          <div className="flex-grow overflow-y-auto space-y-2 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-300 self-end text-black'
                    : 'bg-green-300 self-start text-black'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  className="flex-grow p-2 rounded-md outline-none placeholder-cyan-400"
  placeholder="Type your message..."
/>
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
