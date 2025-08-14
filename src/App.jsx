import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import GameHeader from './components/GameHeader';
import GameStart from './components/GameStart';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // 后台预设的随机角色池
  const hiddenCharacters = [
    {
      character_name: '李白',
      character_background: '唐代伟大的浪漫主义诗人，被誉为"诗仙"，一生游历四方，性格豪放不羁',
      character_personality: '豪放洒脱，热爱自由，喜欢饮酒作诗，性格直率真诚，有着浪漫主义情怀',
      character_achievements: '创作了《将进酒》《蜀道难》《静夜思》等千古名篇，对后世诗歌影响深远'
    },
    {
      character_name: '诸葛亮',
      character_background: '三国时期蜀汉丞相，杰出的政治家、军事家、文学家，被誉为"卧龙"',
      character_personality: '智慧超群，忠诚正直，谨慎细致，有着强烈的责任感和使命感',
      character_achievements: '辅佐刘备建立蜀汉，发明木牛流马，七擒孟获，六出祁山，鞠躬尽瘁死而后已'
    },
    {
      character_name: '武则天',
      character_background: '中国历史上唯一的女皇帝，唐朝政治家，在位期间国力强盛',
      character_personality: '聪明果断，有政治手腕，敢于打破传统，意志坚强，善于用人',
      character_achievements: '建立武周王朝，推行科举制度，发展经济文化，开创了"贞观遗风"'
    },
    {
      character_name: '孔子',
      character_background: '春秋时期思想家、教育家，儒家学派创始人，被尊为"至圣先师"',
      character_personality: '温文尔雅，博学谦逊，重视礼仪和道德修养，有教无类的教育理念',
      character_achievements: '创立儒家思想体系，编订《诗》《书》《礼》《易》《春秋》，影响中华文明数千年'
    },
    {
      character_name: '苏轼',
      character_background: '北宋文学家、书法家、画家，豪放派词人代表，官场几经沉浮',
      character_personality: '乐观豁达，才华横溢，热爱生活，面对挫折依然保持积极心态',
      character_achievements: '创作《水调歌头》《念奴娇·赤壁怀古》等名篇，在诗词书画方面都有很高成就'
    },
    {
      character_name: '岳飞',
      character_background: '南宋抗金名将，精忠报国的民族英雄，被誉为"武圣"',
      character_personality: '忠诚爱国，英勇善战，品格高尚，有强烈的民族责任感',
      character_achievements: '率领岳家军抗击金军，收复大片失地，留下"精忠报国"的千古佳话'
    }
  ];

  const [currentCharacter, setCurrentCharacter] = useState(null);

  const handleStartGame = () => {
    // 随机选择一个角色
    const randomIndex = Math.floor(Math.random() * hiddenCharacters.length);
    setCurrentCharacter(hiddenCharacters[randomIndex]);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setCurrentCharacter(null);
    setGameCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <GameHeader />
        
        {!gameStarted ? (
          <GameStart onStartGame={handleStartGame} />
        ) : (
          <ChatInterface 
            gameConfig={currentCharacter}
            onGameComplete={handleGameComplete}
            onRestart={handleRestart}
            gameCompleted={gameCompleted}
          />
        )}
      </div>
    </div>
  );
};

export default App;
