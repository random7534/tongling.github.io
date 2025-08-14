/**
 * 游戏头部组件
 * 应用标识: f6e2feb1-ba8e-4903-8d92-c6dbec98bda1
 * 功能: 显示通灵寻踪游戏的标题和介绍
 */
import React from 'react';

const GameHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <i className="fas fa-ghost text-4xl text-spirit-gold mr-3 animate-float"></i>
        <h1 className="text-4xl md:text-5xl font-bold spirit-text">
          通灵寻踪
        </h1>
        <i className="fas fa-crystal-ball text-4xl text-spirit-gold ml-3 animate-float"></i>
      </div>
      
      <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        欢迎来到神秘的通灵世界！你是一位拥有特殊能力的通灵者，
        需要通过对话找出附身者的真实身份，帮助迷失的灵魂获得解脱。
      </p>
      
      <div className="flex justify-center mt-6 space-x-6 text-purple-300">
        <div className="flex items-center">
          <i className="fas fa-eye text-spirit-gold mr-2"></i>
          <span>洞察线索</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-comments text-spirit-gold mr-2"></i>
          <span>智慧对话</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-lightbulb text-spirit-gold mr-2"></i>
          <span>揭示真相</span>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
