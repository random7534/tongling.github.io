/**
 * 难度选择组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 让玩家选择游戏难度等级
 */
import React from 'react';

const DifficultySelector = ({ onSelectDifficulty, selectedDifficulty }) => {
  const difficulties = [
    {
      id: 'elementary',
      name: '小学生',
      icon: 'fa-child',
      description: '熟悉的历史名人',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'from-green-400 to-emerald-400',
      examples: '如：李白、杜甫、诸葛亮等'
    },
    {
      id: 'adult',
      name: '成年人',
      icon: 'fa-user',
      description: '有一定知名度的人物',
      color: 'from-blue-500 to-indigo-500',
      hoverColor: 'from-blue-400 to-indigo-400',
      examples: '如：王安石、苏辙、柳永等'
    },
    {
      id: 'scholar',
      name: '老学究',
      icon: 'fa-user-graduate',
      description: '相对冷门的历史人物',
      color: 'from-purple-500 to-violet-500',
      hoverColor: 'from-purple-400 to-violet-400',
      examples: '如：厉鹗、查慎行、朱彝尊等'
    }
  ];

  return (
    <div className="glass-effect rounded-2xl p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          <i className="fas fa-graduation-cap text-spirit-gold mr-3"></i>
          选择挑战等级
        </h2>
        <p className="text-purple-200 text-lg">
          根据你的历史知识水平，选择合适的难度开始通灵之旅
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {difficulties.map((difficulty) => (
          <div
            key={difficulty.id}
            onClick={() => onSelectDifficulty(difficulty.id)}
            className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              selectedDifficulty === difficulty.id ? 'scale-105' : ''
            }`}
          >
            <div className={`
              p-6 rounded-xl border-2 transition-all duration-300
              ${selectedDifficulty === difficulty.id 
                ? 'border-spirit-gold bg-gradient-to-br from-spirit-gold/20 to-yellow-500/20' 
                : 'border-purple-600 bg-purple-800/30 hover:border-purple-400'
              }
            `}>
              <div className="text-center">
                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                  bg-gradient-to-r ${difficulty.color}
                `}>
                  <i className={`fas ${difficulty.icon} text-2xl text-white`}></i>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {difficulty.name}
                </h3>
                
                <p className="text-purple-200 text-sm mb-3">
                  {difficulty.description}
                </p>
                
                <div className="text-xs text-purple-300 bg-purple-900/50 rounded-lg p-2">
                  {difficulty.examples}
                </div>
              </div>
              
              {selectedDifficulty === difficulty.id && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-spirit-gold rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-purple-900 text-sm"></i>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-purple-900/50 rounded-xl p-4 border border-purple-500">
          <div className="text-purple-200 text-sm">
            <span className="text-spirit-gold">💡 提示：</span> 
            不同难度对应不同的历史人物，选择适合你的知识水平的等级，获得最佳游戏体验
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;