/**
 * 游戏开始组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 游戏开始界面，不显示角色信息
 */
import React from 'react';

const GameStart = ({ onStartGame, selectedDifficulty, onBack }) => {
  const getDifficultyInfo = () => {
    const difficultyMap = {
      elementary: { name: '小学生', icon: 'fa-child', color: 'from-green-500 to-emerald-500' },
      adult: { name: '成年人', icon: 'fa-user', color: 'from-blue-500 to-indigo-500' },
      scholar: { name: '老学究', icon: 'fa-user-graduate', color: 'from-purple-500 to-violet-500' }
    };
    return difficultyMap[selectedDifficulty] || difficultyMap.adult;
  };
  
  const difficultyInfo = getDifficultyInfo();
  return (
    <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-spirit-gold to-yellow-500 rounded-full flex items-center justify-center animate-glow">
            <i className="fas fa-eye text-4xl text-purple-900"></i>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${difficultyInfo.color} mr-3`}>
            <i className={`fas ${difficultyInfo.icon} text-white text-lg`}></i>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {difficultyInfo.name}级别 - 准备开始通灵
          </h2>
        </div>
        
        <p className="text-purple-200 text-lg max-w-xl mx-auto leading-relaxed mb-6">
          神秘的亡灵附身于此，通过对话找出真实身份，解救迷失的灵魂。
        </p>

        <div className="bg-purple-900/50 rounded-xl p-4 border border-purple-500 mb-6">
          <div className="text-purple-200 text-sm text-center">
            <span className="text-spirit-gold">💡 提示：</span> 你选择了{difficultyInfo.name}难度，附身者将是对应级别的历史名人，仔细聆听线索，说出正确姓名即可获胜
          </div>
        </div>
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-600 transform hover:scale-105 transition-all"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          重新选择难度
        </button>
        
        <button
          onClick={onStartGame}
          className="px-8 py-4 bg-gradient-to-r from-spirit-gold to-yellow-500 text-purple-900 font-bold rounded-xl hover:from-yellow-400 hover:to-spirit-gold transform hover:scale-105 transition-all text-lg"
        >
          <i className="fas fa-play mr-2"></i>
          开始通灵之旅
        </button>
      </div>
    </div>
  );
};

export default GameStart;
