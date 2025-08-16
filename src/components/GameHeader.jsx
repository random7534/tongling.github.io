/**
 * 游戏头部组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 显示通灵寻踪游戏的标题和介绍
 */
import React, { useState } from 'react';

const GameHeader = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  return (
    <div className="relative">
      {/* 联系官方按钮 */}
      <button
        onClick={handleContactClick}
        className="absolute top-0 right-0 bg-spirit-gold hover:bg-yellow-400 text-purple-900 font-medium py-1 px-2 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center space-x-1"
      >
        <i className="fas fa-phone text-xs"></i>
        <span className="text-xs">联系官方</span>
      </button>

      {/* 原有的游戏头部内容 */}
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
            <span>AI对话</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-lightbulb text-spirit-gold mr-2"></i>
            <span>揭示真相</span>
          </div>
        </div>
      </div>

      {/* 联系官方弹窗 */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            
            {/* 弹窗内容 */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">关注官方公众号</h3>
              <p className="text-gray-600 mb-4">扫描二维码关注我们，获取更多游戏资讯和帮助</p>
              
              {/* 公众号二维码图片 */}
              <div className="flex justify-center mb-4">
                <img
                  src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/creation_agent/01f164c9690741b0b4aeb7c6e4130e99~tplv-a9rns2rl98-web-preview-watermark.png?rcl=20250817012325D65064690299F0447281&rk3s=8e244e95&rrcfp=5057214b&x-expires=2070725025&x-signature=eV5Bw2X%2Fmsjij2anjv620thpUcc%3D"
                  alt="官方公众号二维码"
                  className="max-w-full h-auto rounded-lg shadow-md"
                  style={{ maxHeight: '300px' }}
                />
              </div>
              
              <p className="text-sm text-gray-500">使用微信扫一扫功能扫描二维码</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHeader;