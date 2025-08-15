/**
 * 游戏开始组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 游戏开始界面，不显示角色信息
 */
import React from 'react';

const GameStart = ({ onStartGame }) => {
  return (
    <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-spirit-gold to-yellow-500 rounded-full flex items-center justify-center animate-glow">
            <i className="fas fa-eye text-4xl text-purple-900"></i>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          准备开始通灵
        </h2>
        
        <p className="text-purple-200 text-lg max-w-xl mx-auto leading-relaxed mb-6">
          神秘的亡灵附身于此，通过对话找出真实身份，解救迷失的灵魂。
        </p>

        <div className="bg-purple-900/50 rounded-xl p-4 border border-purple-500 mb-6">
          <div className="text-purple-200 text-sm text-center">
            <span className="text-spirit-gold">💡 提示：</span> 附身者可能是历史名人，仔细聆听线索，说出正确姓名即可获胜
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
