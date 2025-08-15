/**
 * 游戏开始组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 游戏开始界面，不显示角色信息
 */
import React from 'react';

const GameStart = ({ onStartGame }) => {
  return (
    <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-spirit-gold to-yellow-500 rounded-full flex items-center justify-center animate-glow">
            <i className="fas fa-eye text-4xl text-purple-900"></i>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          准备开始通灵
        </h2>
        
        <p className="text-purple-200 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          有一个迷失的灵魂正在等待你的帮助。他们被神秘的亡灵附身，
          只有说出附身者的真实姓名，才能让灵魂获得解脱。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-600">
            <i className="fas fa-comments text-spirit-gold text-2xl mb-3"></i>
            <h3 className="text-white font-semibold mb-2">智慧对话</h3>
            <p className="text-purple-300 text-sm">通过巧妙的提问获取关键线索</p>
          </div>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-600">
            <i className="fas fa-search text-spirit-gold text-2xl mb-3"></i>
            <h3 className="text-white font-semibold mb-2">寻找线索</h3>
            <p className="text-purple-300 text-sm">从回答中发现附身者的身份信息</p>
          </div>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-600">
            <i className="fas fa-lightbulb text-spirit-gold text-2xl mb-3"></i>
            <h3 className="text-white font-semibold mb-2">揭示真相</h3>
            <p className="text-purple-300 text-sm">说出正确姓名，解救迷失灵魂</p>
          </div>
        </div>

        <div className="bg-purple-900/50 rounded-xl p-6 border border-purple-500 mb-8">
          <h3 className="text-white font-semibold mb-3 flex items-center justify-center">
            <i className="fas fa-info-circle text-spirit-gold mr-2"></i>
            游戏提示
          </h3>
          <div className="text-purple-200 text-sm space-y-2">
            <p>• 附身者可能是历史上的著名人物</p>
            <p>• 仔细聆听他们的话语风格和内容线索</p>
            <p>• 可以询问他们的生平、成就、时代背景等</p>
            <p>• 当你确定身份时，直接说出他们的姓名</p>
          </div>
        </div>
      </div>

      <button
        onClick={onStartGame}
        className="px-8 py-4 bg-gradient-to-r from-spirit-gold to-yellow-500 text-purple-900 font-bold rounded-xl hover:from-yellow-400 hover:to-spirit-gold transform hover:scale-105 transition-all text-lg"
      >
        <i className="fas fa-play mr-2"></i>
        开始通灵之旅
      </button>
    </div>
  );
};

export default GameStart;
