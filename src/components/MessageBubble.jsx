/**
 * 消息气泡组件
 * 应用标识: f6e2feb1-ba8e-4903-8d92-c6dbec98bda1
 * 功能: 显示用户和AI的聊天消息
 */
import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';
  const isError = message.isError;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-bubble`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-spirit-gold to-yellow-500 text-purple-900'
              : isError
              ? 'bg-red-600/80 text-white'
              : 'bg-purple-800/80 text-white border border-purple-600'
          } ${message.isStreaming ? 'animate-pulse' : ''}`}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          <div className={`text-xs mt-2 ${
            isUser ? 'text-purple-700' : 'text-purple-300'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
      
      <div className={`flex items-end ${isUser ? 'order-1 mr-3' : 'order-2 ml-3'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-r from-spirit-gold to-yellow-500' 
            : 'bg-purple-700 border border-purple-500'
        }`}>
          <i className={`fas ${
            isUser ? 'fa-user text-purple-900' : 'fa-ghost text-spirit-gold'
          } text-sm`}></i>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
