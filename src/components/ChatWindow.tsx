import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Copy, Check } from "lucide-react";
import { RootState } from "../store/store";
import { Message } from "../store/chatSlice";


const ChatWindow: React.FC = () => {
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // const formatMessage = (text: string) => {
  //   // Simple formatting for code blocks and line breaks
  //   return text.split("\n").map((line, index) => (
  //     <React.Fragment key={index}>
  //       {line}
  //       {index < text.split("\n").length - 1 && <br />}
  //     </React.Fragment>
  //   ));
  // };

  const formatMessage = (text) => {
    const formattedText = text
      .split("\n")
      .map((line) =>
        line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      )
      .join("<br>");
  
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };
  

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-gray-50/50 to-white/50 chat-window">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center text-gray-500 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                Start a conversation
              </h3>
              <p className="text-gray-500">
                Send a message to begin chatting with the AI!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`group max-w-[80%] md:max-w-2xl px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 transform ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md ml-auto"
                    : "bg-white text-gray-800 rounded-bl-md border border-gray-100 hover:border-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {formatMessage(message.text)}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p
                    className={`text-xs opacity-70 group-hover:opacity-100 transition-opacity ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>

                  {message.sender === "bot" && (
                    <button
                      onClick={() => handleCopy(message.text, message.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-md hover:bg-gray-100 active:scale-95"
                      title="Copy message"
                    >
                      {copiedId === message.id ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy
                          size={14}
                          className="text-gray-500 hover:text-gray-700"
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
