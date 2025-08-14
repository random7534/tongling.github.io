/**
 * 游戏设置组件
 * 应用标识: f6e2feb1-ba8e-4903-8d92-c6dbec98bda1
 * 功能: 配置附身者信息并开始游戏
 */
import React, { useState } from 'react';

const GameSetup = ({ onStartGame }) => {
  const [config, setConfig] = useState({
    character_name: '',
    character_background: '',
    character_personality: '',
    character_achievements: ''
  });

  const [usePreset, setUsePreset] = useState(true);

  const presetCharacters = [
    {
      name: '李白',
      character_name: '李白',
      character_background: '唐代伟大的浪漫主义诗人，被誉为"诗仙"，一生游历四方，性格豪放不羁',
      character_personality: '豪放洒脱，热爱自由，喜欢饮酒作诗，性格直率真诚，有着浪漫主义情怀',
      character_achievements: '创作了《将进酒》《蜀道难》《静夜思》等千古名篇，对后世诗歌影响深远'
    },
    {
      name: '诸葛亮',
      character_name: '诸葛亮',
      character_background: '三国时期蜀汉丞相，杰出的政治家、军事家、文学家，被誉为"卧龙"',
      character_personality: '智慧超群，忠诚正直，谨慎细致，有着强烈的责任感和使命感',
      character_achievements: '辅佐刘备建立蜀汉，发明木牛流马，七擒孟获，六出祁山，鞠躬尽瘁死而后已'
    },
    {
      name: '武则天',
      character_name: '武则天',
      character_background: '中国历史上唯一的女皇帝，唐朝政治家，在位期间国力强盛',
      character_personality: '聪明果断，有政治手腕，敢于打破传统，意志坚强，善于用人',
      character_achievements: '建立武周王朝，推行科举制度，发展经济文化，开创了"贞观遗风"'
    },
    {
      name: '孔子',
      character_name: '孔子',
      character_background: '春秋时期思想家、教育家，儒家学派创始人，被尊为"至圣先师"',
      character_personality: '温文尔雅，博学谦逊，重视礼仪和道德修养，有教无类的教育理念',
      character_achievements: '创立儒家思想体系，编订《诗》《书》《礼》《易》《春秋》，影响中华文明数千年'
    }
  ];

  const handlePresetSelect = (preset) => {
    setConfig(preset);
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartGame = () => {
    if (!config.character_name.trim()) {
      alert('请选择预设角色或填写自定义角色信息！');
      return;
    }
    onStartGame(config);
  };

  return (
    <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          <i className="fas fa-cog text-spirit-gold mr-3"></i>
          游戏设置
        </h2>
        <p className="text-purple-200">选择或自定义一个神秘的附身者</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="flex bg-purple-800 rounded-lg p-1">
            <button
              onClick={() => setUsePreset(true)}
              className={`px-6 py-2 rounded-md transition-all ${
                usePreset 
                  ? 'bg-spirit-gold text-purple-900 font-semibold' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <i className="fas fa-star mr-2"></i>
              预设角色
            </button>
            <button
              onClick={() => setUsePreset(false)}
              className={`px-6 py-2 rounded-md transition-all ${
                !usePreset 
                  ? 'bg-spirit-gold text-purple-900 font-semibold' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <i className="fas fa-edit mr-2"></i>
              自定义
            </button>
          </div>
        </div>

        {usePreset ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presetCharacters.map((preset, index) => (
              <div
                key={index}
                onClick={() => handlePresetSelect(preset)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                  config.character_name === preset.character_name
                    ? 'border-spirit-gold bg-purple-800/50 animate-glow'
                    : 'border-purple-600 bg-purple-900/30 hover:border-purple-400'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {preset.name}
                </h3>
                <p className="text-purple-200 text-sm line-clamp-3">
                  {preset.character_background}
                </p>
                {config.character_name === preset.character_name && (
                  <div className="mt-3 flex items-center text-spirit-gold">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span className="text-sm font-semibold">已选择</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                <i className="fas fa-user mr-2 text-spirit-gold"></i>
                角色姓名
              </label>
              <input
                type="text"
                value={config.character_name}
                onChange={(e) => handleInputChange('character_name', e.target.value)}
                placeholder="输入角色的姓名..."
                className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-600 text-white placeholder-purple-300 focus:border-spirit-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                <i className="fas fa-book mr-2 text-spirit-gold"></i>
                角色背景
              </label>
              <textarea
                value={config.character_background}
                onChange={(e) => handleInputChange('character_background', e.target.value)}
                placeholder="描述角色的生平背景、时代背景等..."
                rows="3"
                className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-600 text-white placeholder-purple-300 focus:border-spirit-gold focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                <i className="fas fa-heart mr-2 text-spirit-gold"></i>
                性格特点
              </label>
              <textarea
                value={config.character_personality}
                onChange={(e) => handleInputChange('character_personality', e.target.value)}
                placeholder="描述角色的性格特征、行为习惯等..."
                rows="3"
                className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-600 text-white placeholder-purple-300 focus:border-spirit-gold focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                <i className="fas fa-trophy mr-2 text-spirit-gold"></i>
                主要成就
              </label>
              <textarea
                value={config.character_achievements}
                onChange={(e) => handleInputChange('character_achievements', e.target.value)}
                placeholder="描述角色的重要成就、贡献等..."
                rows="3"
                className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-600 text-white placeholder-purple-300 focus:border-spirit-gold focus:outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={handleStartGame}
          disabled={!config.character_name.trim()}
          className="px-8 py-4 bg-gradient-to-r from-spirit-gold to-yellow-500 text-purple-900 font-bold rounded-xl hover:from-yellow-400 hover:to-spirit-gold transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <i className="fas fa-play mr-2"></i>
          开始通灵之旅
        </button>
      </div>
    </div>
  );
};

export default GameSetup;
