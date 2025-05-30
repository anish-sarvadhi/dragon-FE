
import React from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ClearChatButton from './ClearChatButton';

const Chat: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">DC</span>
          </div>
          <div>
            <h1 className="md:text-xl text-base   font-semibold text-gray-800">Dragon Customer Support Assistant</h1>
            <p className="text-sm text-gray-500">Powered by Sarvadhi</p>
          </div>
        </div>
        <ClearChatButton />
      </div>
      {/* Chat Window */}
      <ChatWindow />

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
};

export default Chat;
