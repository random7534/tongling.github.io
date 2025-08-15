import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import GameHeader from './components/GameHeader';
import GameStart from './components/GameStart';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // 后台预设的随机角色池 - 50位中国古代名人
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
    },
    {
      character_name: '杜甫',
      character_background: '唐代现实主义诗人，被誉为"诗圣"，一生颠沛流离，关心民生疾苦',
      character_personality: '忧国忧民，严谨治学，品格高尚，有强烈的社会责任感',
      character_achievements: '创作《三吏》《三别》等现实主义名篇，被誉为"诗史"'
    },
    {
      character_name: '秦始皇',
      character_background: '中国历史上第一个皇帝，统一六国，建立秦朝，开创帝制',
      character_personality: '雄才大略，意志坚强，追求统一，有强烈的权力欲望',
      character_achievements: '统一文字、货币、度量衡，修建万里长城，建立中央集权制度'
    },
    {
      character_name: '老子',
      character_background: '春秋时期思想家，道家学派创始人，被尊为"太上老君"',
      character_personality: '淡泊名利，崇尚自然，追求无为而治，有着深邃的哲学思维',
      character_achievements: '著《道德经》，提出"道法自然"思想，影响中华文明和世界哲学'
    },
    {
      character_name: '庄子',
      character_background: '战国时期思想家，道家学派重要代表，追求精神自由',
      character_personality: '超脱世俗，想象丰富，幽默风趣，有着浪漫主义色彩',
      character_achievements: '著《庄子》，提出"逍遥游"思想，对后世文学哲学影响深远'
    },
    {
      character_name: '孟子',
      character_background: '战国时期思想家，儒家学派重要代表，被尊为"亚圣"',
      character_personality: '仁爱善良，坚持正义，雄辩滔滔，有着强烈的道德理想',
      character_achievements: '发展儒家思想，提出"民贵君轻"，著《孟子》传世'
    },
    {
      character_name: '司马迁',
      character_background: '西汉史学家、文学家，著《史记》，被誉为"史圣"',
      character_personality: '严谨治学，坚韧不拔，秉笔直书，有着史学家的使命感',
      character_achievements: '著《史记》，开创纪传体史书先河，被誉为"史家之绝唱"'
    },
    {
      character_name: '曹操',
      character_background: '东汉末年政治家、军事家、文学家，三国时期魏国奠基者',
      character_personality: '雄才大略，多疑善变，爱才如命，有着强烈的政治野心',
      character_achievements: '统一北方，奠定魏国基业，著有《观沧海》等诗篇'
    },
    {
      character_name: '刘备',
      character_background: '三国时期蜀汉开国皇帝，以仁德著称，礼贤下士',
      character_personality: '仁慈宽厚，坚韧不拔，善于用人，有着王者风范',
      character_achievements: '建立蜀汉政权，与诸葛亮君臣相得，演绎三顾茅庐佳话'
    },
    {
      character_name: '关羽',
      character_background: '三国时期蜀汉名将，被誉为"武圣"，忠义的化身',
      character_personality: '忠诚义气，勇猛善战，傲气十足，有着强烈的道德操守',
      character_achievements: '过五关斩六将，单刀赴会，被后世尊为"关公"'
    },
    {
      character_name: '唐太宗',
      character_background: '唐朝第二位皇帝，开创"贞观之治"，被誉为千古明君',
      character_personality: '英明果断，虚怀若谷，善于纳谏，有着开明的治国理念',
      character_achievements: '开创贞观之治，奠定唐朝盛世基础，被誉为"天可汗"'
    },
    {
      character_name: '王羲之',
      character_background: '东晋书法家，被誉为"书圣"，书法艺术的集大成者',
      character_personality: '淡泊名利，追求艺术，性情高雅，有着艺术家的气质',
      character_achievements: '创作《兰亭序》，被誉为"天下第一行书"，影响后世书法千年'
    },
    {
      character_name: '陶渊明',
      character_background: '东晋诗人，田园诗派鼻祖，不为五斗米折腰的典型',
      character_personality: '淡泊名利，热爱自然，追求自由，有着隐士的风骨',
      character_achievements: '创作《桃花源记》《归园田居》等名篇，开创田园诗风'
    },
    {
      character_name: '白居易',
      character_background: '唐代现实主义诗人，新乐府运动倡导者，关注民生',
      character_personality: '平易近人，关心民众，文风朴实，有着强烈的社会责任感',
      character_achievements: '创作《长恨歌》《琵琶行》等名篇，提倡"文章合为时而著"'
    },
    {
      character_name: '韩愈',
      character_background: '唐代文学家，古文运动倡导者，被誉为"文起八代之衰"',
      character_personality: '刚正不阿，学识渊博，文风雄健，有着文人的傲骨',
      character_achievements: '倡导古文运动，著《师说》等名篇，对后世文学影响深远'
    },
    {
      character_name: '柳宗元',
      character_background: '唐代文学家，古文运动重要人物，"唐宋八大家"之一',
      character_personality: '才华横溢，性格刚直，关心政治，有着改革家的理想',
      character_achievements: '创作《永州八记》《捕蛇者说》等名篇，推动古文运动'
    },
    {
      character_name: '范仲淹',
      character_background: '北宋政治家、文学家，"先天下之忧而忧"的典型',
      character_personality: '忧国忧民，刚正不阿，胸怀天下，有着强烈的使命感',
      character_achievements: '推行庆历新政，著《岳阳楼记》，体现"先忧后乐"精神'
    },
    {
      character_name: '欧阳修',
      character_background: '北宋文学家、史学家，"唐宋八大家"之一，文坛领袖',
      character_personality: '博学多才，提携后进，文风清新，有着文学家的风范',
      character_achievements: '主持修《新唐书》，创作《醉翁亭记》等名篇'
    },
    {
      character_name: '王安石',
      character_background: '北宋政治家、文学家，变法改革的倡导者',
      character_personality: '意志坚强，锐意改革，学识渊博，有着改革家的魄力',
      character_achievements: '推行王安石变法，著《泊船瓜洲》等诗篇'
    },
    {
      character_name: '司马光',
      character_background: '北宋史学家、政治家，主编《资治通鉴》',
      character_personality: '严谨治学，品格高尚，保守稳重，有着史学家的操守',
      character_achievements: '主编《资治通鉴》，为中国史学做出重大贡献'
    },
    {
      character_name: '辛弃疾',
      character_background: '南宋词人，豪放派代表，抗金复国的志士',
      character_personality: '豪放激昂，忧国忧民，武艺高强，有着英雄气概',
      character_achievements: '创作《永遇乐·京口北固亭怀古》等豪放词篇'
    },
    {
      character_name: '陆游',
      character_background: '南宋诗人，爱国主义诗人的典型，一生忧国忧民',
      character_personality: '爱国热忱，坚韧不拔，文思敏捷，有着诗人的情怀',
      character_achievements: '创作《示儿》《游山西村》等爱国诗篇，诗作九千余首'
    },
    {
      character_name: '朱熹',
      character_background: '南宋理学家，程朱理学集大成者，被尊为"朱子"',
      character_personality: '严谨治学，品德高尚，理性思辨，有着哲学家的深度',
      character_achievements: '集理学之大成，注释《四书》，影响后世教育千年'
    },
    {
      character_name: '文天祥',
      character_background: '南宋末年政治家、文学家，民族英雄，忠贞不屈',
      character_personality: '忠诚爱国，宁死不屈，品格高尚，有着烈士的精神',
      character_achievements: '抗元殉国，留下《正气歌》《过零丁洋》等千古绝唱'
    },
    {
      character_name: '成吉思汗',
      character_background: '蒙古帝国创建者，世界历史上杰出的军事家和政治家',
      character_personality: '雄才大略，勇猛善战，统一蒙古，有着征服者的野心',
      character_achievements: '统一蒙古各部，建立横跨欧亚的蒙古帝国'
    },
    {
      character_name: '忽必烈',
      character_background: '元朝开国皇帝，蒙古帝国第五代大汗，统一中国',
      character_personality: '雄才大略，善于治国，重视汉文化，有着统治者的智慧',
      character_achievements: '建立元朝，统一中国，促进中外文化交流'
    },
    {
      character_name: '关汉卿',
      character_background: '元代戏曲家，"元曲四大家"之首，被誉为"曲圣"',
      character_personality: '才华横溢，关心民众，敢于批判，有着戏曲家的情怀',
      character_achievements: '创作《窦娥冤》等经典剧目，推动元曲发展'
    },
    {
      character_name: '马致远',
      character_background: '元代戏曲家、散曲家，"元曲四大家"之一',
      character_personality: '淡泊名利，向往自然，文思敏捷，有着文人的雅致',
      character_achievements: '创作《天净沙·秋思》等经典散曲，被誉为"秋思之祖"'
    },
    {
      character_name: '朱元璋',
      character_background: '明朝开国皇帝，从乞丐到皇帝的传奇人物',
      character_personality: '意志坚强，多疑善变，勤政爱民，有着开国君主的魄力',
      character_achievements: '推翻元朝，建立明朝，恢复汉族政权'
    },
    {
      character_name: '郑和',
      character_background: '明代航海家，七下西洋的伟大探险家',
      character_personality: '勇敢无畏，善于外交，组织能力强，有着探险家的精神',
      character_achievements: '七下西洋，促进中外交流，展现明朝国威'
    },
    {
      character_name: '于谦',
      character_background: '明代政治家、军事家，"土木堡之变"后的救国英雄',
      character_personality: '忠诚爱国，刚正不阿，临危不惧，有着民族英雄的气概',
      character_achievements: '保卫北京，挽救明朝，留下《石灰吟》表明心志'
    },
    {
      character_name: '王阳明',
      character_background: '明代思想家、军事家，心学集大成者',
      character_personality: '博学深思，知行合一，品格高尚，有着哲学家的智慧',
      character_achievements: '创立心学，提出"知行合一"思想，影响后世深远'
    },
    {
      character_name: '海瑞',
      character_background: '明代政治家，以清廉刚正著称，被誉为"海青天"',
      character_personality: '刚正不阿，清廉自守，敢于直谏，有着清官的风骨',
      character_achievements: '为官清廉，敢于上疏批评皇帝，体现"海青天"精神'
    },
    {
      character_name: '李时珍',
      character_background: '明代医药学家，《本草纲目》作者，被誉为"药圣"',
      character_personality: '严谨治学，勤奋好学，关心民众健康，有着医者仁心',
      character_achievements: '著《本草纲目》，为中医药学做出重大贡献'
    },
    {
      character_name: '徐霞客',
      character_background: '明代地理学家、旅行家，中国古代最伟大的旅行家',
      character_personality: '勇于探索，不畏艰险，热爱自然，有着探险家的精神',
      character_achievements: '著《徐霞客游记》，为中国地理学做出重要贡献'
    },
    {
      character_name: '施耐庵',
      character_background: '元末明初小说家，《水浒传》作者',
      character_personality: '才华横溢，关心民众，善于刻画人物，有着小说家的想象力',
      character_achievements: '创作《水浒传》，塑造了众多英雄形象'
    },
    {
      character_name: '罗贯中',
      character_background: '元末明初小说家，《三国演义》作者',
      character_personality: '博学多才，善于叙事，熟悉历史，有着史学家的功底',
      character_achievements: '创作《三国演义》，成为中国古典小说的经典'
    },
    {
      character_name: '吴承恩',
      character_background: '明代小说家，《西游记》作者',
      character_personality: '想象丰富，幽默风趣，富有创造力，有着浪漫主义色彩',
      character_achievements: '创作《西游记》，塑造了孙悟空等经典形象'
    },
    {
      character_name: '曹雪芹',
      character_background: '清代小说家，《红楼梦》作者，中国古典小说巅峰之作的创造者',
      character_personality: '才华横溢，细腻敏感，深谙人情世故，有着文学家的洞察力',
      character_achievements: '创作《红楼梦》，被誉为中国古典小说的巅峰之作'
    },
    {
      character_name: '康熙',
      character_background: '清朝第四位皇帝，在位61年，开创"康乾盛世"',
      character_personality: '勤政爱民，博学多才，善于用人，有着明君的风范',
      character_achievements: '平定三藩，收复台湾，开创康乾盛世'
    },
    {
      character_name: '乾隆',
      character_background: '清朝第六位皇帝，"康乾盛世"的重要缔造者',
      character_personality: '文武双全，爱好文艺，自信满满，有着盛世君主的气度',
      character_achievements: '继续康乾盛世，编纂《四库全书》，文治武功并重'
    },
    {
      character_name: '纪晓岚',
      character_background: '清代文学家、官员，《四库全书》总纂官，以机智幽默著称',
      character_personality: '机智幽默，博学多才，善于应对，有着文人的风趣',
      character_achievements: '主持编纂《四库全书》，留下众多机智对联和故事'
    },
    {
      character_name: '林则徐',
      character_background: '清代政治家，虎门销烟的民族英雄，"开眼看世界第一人"',
      character_personality: '爱国忧民，刚正不阿，开明进步，有着民族英雄的气概',
      character_achievements: '虎门销烟，抵抗外侵，被誉为民族英雄'
    },
    {
      character_name: '曾国藩',
      character_background: '清代政治家、军事家、理学家，湘军创立者',
      character_personality: '严于律己，勤奋好学，善于用人，有着儒家君子的品格',
      character_achievements: '创建湘军，平定太平天国，推动洋务运动'
    },
    {
      character_name: '左宗棠',
      character_background: '清代政治家、军事家，收复新疆的民族英雄',
      character_personality: '意志坚强，爱国忧民，军事才能出众，有着军事家的魄力',
      character_achievements: '收复新疆，维护国家统一，推动西北开发'
    },
    {
      character_name: '李鸿章',
      character_background: '清代政治家、外交家，洋务运动重要人物',
      character_personality: '务实能干，善于外交，适应时势，有着政治家的灵活性',
      character_achievements: '推动洋务运动，创办近代工业，参与外交谈判'
    }
  ];

  const [currentCharacter, setCurrentCharacter] = useState(null);

  const handleStartGame = () => {
    // 从50位中国古代名人中随机选择一个角色
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
