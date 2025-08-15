/**
 * 打字指示器组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 显示AI正在回复的动画效果
 */
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start message-bubble">
      <div className="flex items-end ml-3 order-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-700 border border-purple-500">
          <i className="fas fa-ghost text-spirit-gold text-sm"></i>
        </div>
      </div>
      
      <div className="max-w-xs md:max-w-md lg:max-w-lg order-1">
        <div className="p-4 rounded-2xl bg-purple-800/80 text-white border border-purple-600">
          <div className="flex items-center space-x-1">
            <span className="text-purple-300 mr-2">附身者正在回应</span>
            <div className="typing-indicator"></div>
            <div className="typing-indicator"></div>
            <div className="typing-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
