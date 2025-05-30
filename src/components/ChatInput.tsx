
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send } from 'lucide-react';
import { AppDispatch, RootState } from '../store/store';
import { sendMessage } from '../store/chatSlice';

const ChatInput: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.chat);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      dispatch(sendMessage(inputText.trim()));
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0  backdrop-blur-sm p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-2 border border-blue-400 ring-4 ring-blue-50 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-3 py-3 resize-none focus:outline-none placeholder:text-gray-500 text-gray-900 min-h-[48px] max-h-[220px] leading-6"
              rows={1}
              disabled={isLoading}
              style={{ overflow: 'visible' }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 transform ${
                inputText.trim() && !isLoading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={20} className={isLoading ? 'animate-pulse' : ''} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
