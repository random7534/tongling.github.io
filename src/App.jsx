import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import GameHeader from './components/GameHeader';
import GameStart from './components/GameStart';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // 后台预设的随机角色池 - 50位相对不常见但有历史关联的中国古代人物
  const hiddenCharacters = [
    {
      character_name: '曹丕',
      character_background: '三国时期魏国开国皇帝，曹操长子，文学家，建安文学代表人物',
      character_personality: '聪明多疑，文学才华出众，政治手腕高超，有着帝王的威严',
      character_achievements: '建立魏朝，推行九品中正制，著有《典论·论文》，开创文学批评先河'
    },
    {
      character_name: '苏辙',
      character_background: '北宋文学家，苏轼之弟，"唐宋八大家"之一，与父兄并称"三苏"',
      character_personality: '性格沉稳，文风朴实，思维缜密，有着学者的严谨',
      character_achievements: '与兄长苏轼齐名，著有《栾城集》，在散文创作上独树一帜'
    },
    {
      character_name: '司马昭',
      character_background: '三国时期魏国权臣，司马懿次子，西晋王朝奠基者',
      character_personality: '野心勃勃，城府深沉，善于权谋，有着政治家的狡黠',
      character_achievements: '掌控魏国朝政，为儿子司马炎建立西晋奠定基础，"司马昭之心路人皆知"'
    },
    {
      character_name: '王献之',
      character_background: '东晋书法家，王羲之第七子，与父并称"二王"',
      character_personality: '才华横溢，性格张扬，追求创新，有着艺术家的个性',
      character_achievements: '创立"破体"书法，代表作《中秋帖》，在书法史上与父齐名'
    },
    {
      character_name: '李贺',
      character_background: '唐代诗人，被称为"诗鬼"，以奇诡浪漫的诗风著称',
      character_personality: '性格孤僻，想象奇特，才华早现，有着诗人的敏感',
      character_achievements: '创作《雁门太守行》《李凭箜篌引》等奇诡之作，开创独特诗风'
    },
    {
      character_name: '颜真卿',
      character_background: '唐代书法家、政治家，楷书四大家之一，忠臣典范',
      character_personality: '刚正不阿，忠诚爱国，书法雄浑，有着文人的气节',
      character_achievements: '创立"颜体"楷书，代表作《祭侄文稿》，被誉为"天下第二行书"'
    },
    {
      character_name: '柳永',
      character_background: '北宋词人，婉约派代表，第一个专力写词的文人',
      character_personality: '风流倜傥，多愁善感，善解人意，有着词人的浪漫',
      character_achievements: '创作《雨霖铃》《八声甘州》等名篇，开创慢词先河'
    },
    {
      character_name: '晏殊',
      character_background: '北宋词人、政治家，晏几道之父，"宰相词人"',
      character_personality: '温文尔雅，才华出众，政治敏锐，有着贵族的气质',
      character_achievements: '创作《浣溪沙》等经典词作，培养了欧阳修等文学大家'
    },
    {
      character_name: '晏几道',
      character_background: '北宋词人，晏殊之子，婉约派重要代表，"小山词"作者',
      character_personality: '性格孤傲，情感丰富，不慕荣利，有着词人的清高',
      character_achievements: '创作《临江仙》《鹧鸪天》等名篇，词风清丽婉约'
    },
    {
      character_name: '秦观',
      character_background: '北宋词人，"苏门四学士"之一，婉约派代表人物',
      character_personality: '多愁善感，才华横溢，性格内向，有着文人的忧郁',
      character_achievements: '创作《鹊桥仙》《淮海词》等名作，被誉为"婉约之宗"'
    },
    {
      character_name: '黄庭坚',
      character_background: '北宋诗人、书法家，"苏门四学士"之一，江西诗派开山祖师',
      character_personality: '学识渊博，性格耿直，追求创新，有着学者的执着',
      character_achievements: '创立"江西诗派"，书法自成一体，与苏轼并称"苏黄"'
    },
    {
      character_name: '米芾',
      character_background: '北宋书法家、画家，"宋四家"之一，以"米颠"著称',
      character_personality: '性格怪异，洁癖严重，艺术天赋极高，有着艺术家的癫狂',
      character_achievements: '创立"米体"书法，擅长山水画，收藏鉴赏能力超群'
    },
    {
      character_name: '蔡襄',
      character_background: '北宋书法家、政治家，"宋四家"之一，茶学专家',
      character_personality: '品格高尚，学识广博，书法精湛，有着君子的风范',
      character_achievements: '书法承上启下，著有《茶录》，主持建造洛阳桥'
    },
    {
      character_name: '李清照',
      character_background: '南宋女词人，"千古第一才女"，婉约派代表',
      character_personality: '才华横溢，性格坚强，情感丰富，有着女性的细腻',
      character_achievements: '创作《声声慢》《如梦令》等名篇，开创女性词风'
    },
    {
      character_name: '姜夔',
      character_background: '南宋词人、音乐家，格律派鼻祖，"白石道人"',
      character_personality: '清高孤傲，音律精通，追求完美，有着艺术家的执着',
      character_achievements: '创作《扬州慢》等名篇，精通音律，自度曲谱传世'
    },
    {
      character_name: '周邦彦',
      character_background: '北宋词人，格律派集大成者，"词中老杜"',
      character_personality: '严谨细致，追求完美，学识渊博，有着匠人的精神',
      character_achievements: '完善词的格律，创作《兰陵王》等名篇，影响后世词坛'
    },
    {
      character_name: '元好问',
      character_background: '金代文学家，"金代文学第一人"，文学批评家',
      character_personality: '学识渊博，品格高尚，忧国忧民，有着文人的担当',
      character_achievements: '著《论诗绝句》，保存金代文献，开创文学批评新风'
    },
    {
      character_name: '赵孟頫',
      character_background: '元代书法家、画家，"元四家"之一，宋朝皇室后裔',
      character_personality: '才华全面，适应能力强，追求艺术，有着贵族的修养',
      character_achievements: '书法集各家之长，绘画开创新风，被誉为"文人画"典范'
    },
    {
      character_name: '白朴',
      character_background: '元代戏曲家，"元曲四大家"之一，《梧桐雨》作者',
      character_personality: '才华横溢，性格内向，不慕荣利，有着文人的清高',
      character_achievements: '创作《墙头马上》《梧桐雨》等经典剧目'
    },
    {
      character_name: '郑光祖',
      character_background: '元代戏曲家，"元曲四大家"之一，《倩女离魂》作者',
      character_personality: '情感丰富，善于刻画，文思敏捷，有着戏曲家的敏感',
      character_achievements: '创作《倩女离魂》等爱情剧，擅长描写儿女情长'
    },
    {
      character_name: '王实甫',
      character_background: '元代戏曲家，《西厢记》作者，元杂剧的集大成者',
      character_personality: '才华横溢，善于创新，情感细腻，有着剧作家的天赋',
      character_achievements: '创作《西厢记》，被誉为"天下夺魁"，影响后世戏曲'
    },
    {
      character_name: '汤显祖',
      character_background: '明代戏曲家，"临川四梦"作者，中国戏曲史上的巨匠',
      character_personality: '浪漫主义，情感丰富，追求理想，有着文学家的情怀',
      character_achievements: '创作《牡丹亭》等"临川四梦"，开创浪漫主义戏曲'
    },
    {
      character_name: '冯梦龙',
      character_background: '明代文学家，"三言"编者，通俗文学的推广者',
      character_personality: '平易近人，关心民众，文学眼光独到，有着编辑家的慧眼',
      character_achievements: '编辑"三言"，推广通俗文学，保存大量民间故事'
    },
    {
      character_name: '凌濛初',
      character_background: '明代文学家，"二拍"作者，与冯梦龙并称',
      character_personality: '才思敏捷，善于叙事，关注现实，有着小说家的洞察力',
      character_achievements: '创作"二拍"，与"三言"并称"三言二拍"'
    },
    {
      character_name: '蒲松龄',
      character_background: '清代小说家，《聊斋志异》作者，"世界短篇小说之王"',
      character_personality: '想象丰富，同情弱者，文笔优美，有着小说家的同情心',
      character_achievements: '创作《聊斋志异》，开创文言短篇小说新境界'
    },
    {
      character_name: '吴敬梓',
      character_background: '清代小说家，《儒林外史》作者，讽刺小说大师',
      character_personality: '幽默讽刺，洞察人性，批判精神强，有着讽刺家的锐利',
      character_achievements: '创作《儒林外史》，开创讽刺小说先河'
    },
    {
      character_name: '袁枚',
      character_background: '清代诗人、文学家，"性灵派"代表，美食家',
      character_personality: '性情豪放，追求自由，热爱生活，有着文人的洒脱',
      character_achievements: '倡导"性灵说"，著《随园诗话》《随园食单》'
    },
    {
      character_name: '龚自珍',
      character_background: '清代思想家、文学家，近代启蒙思想先驱',
      character_personality: '思想激进，忧国忧民，才华横溢，有着改革家的锐气',
      character_achievements: '创作《己亥杂诗》，提出"更法"思想，影响维新运动'
    },
    {
      character_name: '魏源',
      character_background: '清代思想家、史学家，"师夷长技以制夷"提出者',
      character_personality: '开明进步，学识渊博，忧患意识强，有着思想家的远见',
      character_achievements: '著《海国图志》，提出向西方学习，开启洋务思潮'
    },
    {
      character_name: '严复',
      character_background: '清末思想家、翻译家，"信达雅"翻译标准提出者',
      character_personality: '学贯中西，思想深邃，治学严谨，有着学者的风范',
      character_achievements: '翻译《天演论》等西学名著，传播进化论思想'
    },
    {
      character_name: '梁启超',
      character_background: '近代思想家、政治家、教育家，维新运动领袖',
      character_personality: '思想活跃，文笔犀利，爱国热忱，有着启蒙者的激情',
      character_achievements: '推动戊戌变法，创办《时务报》，影响近代中国'
    },
    {
      character_name: '谭嗣同',
      character_background: '近代思想家、政治家，戊戌六君子之一，维新志士',
      character_personality: '思想激进，勇于牺牲，品格高尚，有着烈士的精神',
      character_achievements: '参与戊戌变法，著《仁学》，为变法流血牺牲'
    },
    {
      character_name: '康有为',
      character_background: '近代思想家、政治家，维新运动领袖，"南海先生"',
      character_personality: '学识渊博，思想超前，组织能力强，有着改革家的魄力',
      character_achievements: '发起公车上书，推动戊戌变法，著《大同书》'
    },
    {
      character_name: '章太炎',
      character_background: '近代思想家、史学家，国学大师，革命家',
      character_personality: '学问渊博，性格刚烈，民族意识强，有着学者的傲骨',
      character_achievements: '参与辛亥革命，整理国学，培养大批学者'
    },
    {
      character_name: '王国维',
      character_background: '近代学者、文学家，国学大师，"人间词话"作者',
      character_personality: '治学严谨，学贯中西，性格内向，有着学者的执着',
      character_achievements: '著《人间词话》，开创词学批评新境界，精通甲骨文'
    },
    {
      character_name: '辜鸿铭',
      character_background: '近代学者、翻译家，精通多国语言的"文化怪杰"',
      character_personality: '学贯中西，性格怪异，文化保守，有着文人的执拗',
      character_achievements: '翻译《论语》《中庸》等经典，向西方介绍中国文化'
    },
    {
      character_name: '黄遵宪',
      character_background: '近代诗人、外交家，"诗界革命"倡导者',
      character_personality: '开明进步，才华横溢，外交经验丰富，有着诗人的敏感',
      character_achievements: '创作《人境庐诗草》，推动诗歌革新，记录时代变迁'
    },
    {
      character_name: '丘逢甲',
      character_background: '近代诗人、教育家，台湾抗日志士',
      character_personality: '爱国热忱，文学才华出众，教育理念先进，有着志士的气节',
      character_achievements: '领导台湾抗日，创办新式学校，诗作反映民族情怀'
    },
    {
      character_name: '夏完淳',
      character_background: '明末少年英雄，抗清志士，17岁就义',
      character_personality: '少年老成，忠贞不屈，文学天赋极高，有着少年的纯真',
      character_achievements: '年少抗清，诗文并茂，体现民族气节和少年英雄气概'
    },
    {
      character_name: '顾炎武',
      character_background: '明末清初思想家、史学家，"天下兴亡，匹夫有责"提出者',
      character_personality: '学识渊博，品格高尚，忧国忧民，有着学者的担当',
      character_achievements: '著《日知录》，提出经世致用思想，影响后世学风'
    },
    {
      character_name: '黄宗羲',
      character_background: '明末清初思想家、史学家，"中国思想启蒙之父"',
      character_personality: '思想深邃，批判精神强，学问渊博，有着思想家的锐利',
      character_achievements: '著《明夷待访录》，批判君主专制，开启民主思想'
    },
    {
      character_name: '王夫之',
      character_background: '明末清初思想家、哲学家，"船山先生"',
      character_personality: '思辨能力强，学问深厚，隐居治学，有着哲学家的深度',
      character_achievements: '著《读通鉴论》等，发展唯物主义思想，影响后世哲学'
    },
    {
      character_name: '侯方域',
      character_background: '明末清初文学家，"明末四公子"之一，与李香君的爱情故事',
      character_personality: '风流倜傥，才华横溢，重情重义，有着文人的浪漫',
      character_achievements: '文学才华出众，与李香君的爱情被传为佳话'
    },
    {
      character_name: '钱谦益',
      character_background: '明末清初文学家，"虞山诗派"领袖，柳如是之夫',
      character_personality: '学识渊博，但品格复杂，文学成就高，有着文人的矛盾',
      character_achievements: '主盟文坛数十年，与柳如是的爱情传为佳话'
    },
    {
      character_name: '吴伟业',
      character_background: '明末清初诗人，"梅村体"创始人，"江左三大家"之一',
      character_personality: '才华横溢，内心矛盾，诗风独特，有着遗民的复杂心态',
      character_achievements: '创立"梅村体"，代表作《圆圆曲》，反映时代变迁'
    },
    {
      character_name: '朱彝尊',
      character_background: '清代词人、学者，"浙西词派"领袖，考据学家',
      character_personality: '学问渊博，治学严谨，词风清雅，有着学者的风范',
      character_achievements: '开创"浙西词派"，精于考据，著《词综》等'
    },
    {
      character_name: '纳兰性德',
      character_background: '清代词人，"满清第一词人"，康熙朝重臣之子',
      character_personality: '多愁善感，才华横溢，性格忧郁，有着贵公子的气质',
      character_achievements: '创作《饮水词》，词风清丽哀婉，被誉为"清代第一词人"'
    },
    {
      character_name: '王士祯',
      character_background: '清代诗人、文学家，"神韵说"倡导者，"一代诗宗"',
      character_personality: '风雅温润，追求意境，学识渊博，有着诗人的雅致',
      character_achievements: '倡导"神韵说"，主盟诗坛，著《带经堂诗话》'
    },
    {
      character_name: '查慎行',
      character_background: '清代诗人，"查初白"，浙西诗派代表',
      character_personality: '性格温和，诗风清淡，学问深厚，有着江南文人的秀雅',
      character_achievements: '诗风清新自然，与朱彝尊并称"朱查"，影响清代诗坛'
    },
    {
      character_name: '厉鹗',
      character_background: '清代诗人、词人，"樊榭山人"，浙西词派重要人物',
      character_personality: '清高孤傲，学问精深，不慕荣利，有着隐士的风骨',
      character_achievements: '词学造诣深厚，著《宋诗纪事》，精于文献整理'
    }
  ];

  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [lastCharacterName, setLastCharacterName] = useState(null);

  const handleStartGame = () => {
    // 从50位中国古代名人中随机选择一个角色，确保不与上一次重复
    let availableCharacters = hiddenCharacters;
    
    // 如果有上一次的角色，则从可选列表中排除
    if (lastCharacterName) {
      availableCharacters = hiddenCharacters.filter(
        character => character.character_name !== lastCharacterName
      );
    }
    
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const selectedCharacter = availableCharacters[randomIndex];
    
    setCurrentCharacter(selectedCharacter);
    setLastCharacterName(selectedCharacter.character_name);
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
    // 注意：不清除lastCharacterName，保持防重复机制
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
