/**
 * 聊天界面组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 实现与AI附身者的对话交互，直接使用dify API进行历史人物猜测
 */
import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

// 自定义dify客户端
class DifyClient {
  constructor(config) {
    this.apiKey = config.headers.Authorization;
    this.baseUrl = config.baseUrl;
  }

  async sendMessageStream(params, callbacks) {
    const url = `${this.baseUrl}/chat-messages`;
    
    const requestBody = {
      inputs: params.inputs || {},
      query: params.query,
      response_mode: params.response_mode || 'streaming',
      user: params.user || 'anonymous',
      ...(params.conversation_id && { conversation_id: params.conversation_id })
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.event === 'message') {
                callbacks.onMessage && callbacks.onMessage({ answer: data.answer });
              } else if (data.event === 'message_end') {
                callbacks.onMessageEnd && callbacks.onMessageEnd({
                  conversation_id: data.conversation_id
                });
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Dify API error:', error);
      callbacks.onError && callbacks.onError({ message: error.message });
    }
  }
}

const ChatInterface = ({ gameConfig, onGameComplete, onRestart, gameCompleted }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatClient, setChatClient] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 初始化dify聊天客户端
    const client = new DifyClient({
      headers: {
        Authorization: 'app-HcQlclUU29f9d8OsW2KRVAGm',
      },
      baseUrl: 'http://43.139.185.136/v1',
    });
    setChatClient(client);

    // 重置会话状态
    setConversationId(null);
    setIsFirstMessage(true);
    console.log('开始新游戏，角色:', gameConfig.character_name);
    console.log('Dify连接配置 - API Key: app-HcQlclUU29f9d8OsW2KRVAGm, Base URL: http://43.139.185.136/v1');

    // 添加初始消息
    const initialMessage = {
      id: Date.now(),
      type: 'ai',
      content: '在这片被时光尘封的记忆里，一道身影静候千年，只待你轻轻叩问——\n\n用智慧拨开迷雾，猜猜我是谁？🤫',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [gameConfig]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 文字换行函数
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, currentY);
  };

  // 生成分享图片
  const generateShareImage = () => {
    // 计算用户消息次数（排除初始AI消息）
    const userMessageCount = messages.filter(msg => msg.type === 'user').length;
    
    // 获取倒数三次对话（6句话）
    const userMessages = messages.filter(msg => msg.type === 'user');
    const conversationPairs = [];
    
    // 获取最后3轮对话
    for (let i = Math.max(0, userMessages.length - 3); i < userMessages.length; i++) {
      const userMsg = userMessages[i];
      const userMsgIndex = messages.findIndex(msg => msg.id === userMsg.id);
      const aiMsg = messages[userMsgIndex + 1];
      
      if (userMsg && aiMsg) {
        conversationPairs.push({ user: userMsg, ai: aiMsg });
      }
    }

    // 创建canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸为正方形
    const size = 800;
    canvas.width = size;
    canvas.height = size;

    // 设置神秘的通灵背景
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, '#1a0033');
    gradient.addColorStop(0.3, '#2d1b69');
    gradient.addColorStop(0.6, '#1a0033');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // 添加星空效果
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 添加神秘光晕效果
    const glowGradient = ctx.createRadialGradient(size/2, 100, 0, size/2, 100, 200);
    glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, size, size);

    // 设置字体样式
    ctx.textAlign = 'center';

    // 神秘标题
    ctx.font = 'bold 42px serif';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.fillText('✨ 通灵寻踪 ✨', size/2, 60);
    ctx.shadowBlur = 0;

    // 副标题
    ctx.font = 'italic 24px serif';
    ctx.fillStyle = '#e6e6fa';
    ctx.fillText('灵魂的秘密已被揭开', size/2, 90);

    // 成就文字
    ctx.font = 'bold 26px serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`我仅用 ${userMessageCount} 次对话`, size/2, 140);
    
    ctx.font = 'bold 30px serif';
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 8;
    ctx.fillText(`就猜出了 ${gameConfig.character_name}`, size/2, 180);
    ctx.shadowBlur = 0;
    
    ctx.font = '22px serif';
    ctx.fillStyle = '#e6e6fa';
    ctx.fillText('你也来挑战通灵之谜吧！', size/2, 220);

    // 装饰性分割线
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(80, 250);
    ctx.lineTo(size - 80, 250);
    ctx.stroke();
    ctx.setLineDash([]);

    // 对话标题
    ctx.font = 'bold 22px serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('🔮 通灵对话记录 🔮', size/2, 280);

    // 绘制对话内容
    let currentY = 310;
    ctx.textAlign = 'left';
    ctx.font = '18px Arial';
    
    conversationPairs.forEach((pair, index) => {
      // 用户消息
      ctx.fillStyle = '#87ceeb';
      const userText = `👤 ${pair.user.content.substring(0, 40)}${pair.user.content.length > 40 ? '...' : ''}`;
      ctx.fillText(userText, 60, currentY);
      currentY += 30;
      
      // AI消息
      ctx.fillStyle = '#98fb98';
      const aiText = `🔮 ${pair.ai.content.substring(0, 40)}${pair.ai.content.length > 40 ? '...' : ''}`;
      ctx.fillText(aiText, 60, currentY);
      currentY += 40;
    });

    // 二维码区域（调大尺寸）
    const qrSize = 180;
    const qrX = size/2 - qrSize/2;
    const qrY = size - qrSize - 60;
    
    // 二维码神秘边框
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
    ctx.shadowBlur = 0;
    
    // 二维码背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);

    // 二维码URL配置（用户可以在这里填充自己的二维码图片URL）
    const qrCodeUrl = 'data:image/png;base64,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';
    
    // 加载并绘制二维码
    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      
      // 二维码说明
      ctx.font = '18px serif';
      ctx.fillStyle = '#ffd700';
      ctx.textAlign = 'center';
      ctx.fillText('扫码开启你的通灵之旅', size/2, size - 20);
      
      // 显示弹窗而非下载
      showImageModal(canvas);
    };
    
    qrImage.onerror = () => {
      // 如果二维码加载失败，直接绘制占位符
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('二维码', qrX + qrSize/2, qrY + qrSize/2);
      
      // 二维码说明
      ctx.font = '18px serif';
      ctx.fillStyle = '#ffd700';
      ctx.fillText('扫码开启你的通灵之旅', size/2, size - 20);
      
      // 显示弹窗而非下载
      showImageModal(canvas);
    };
    
    qrImage.src = qrCodeUrl;
  };

  // 显示图片弹窗
  const showImageModal = (canvas) => {
    // 创建弹窗容器
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    // 创建内容容器
    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(135deg, #1a0033, #2d1b69);
      padding: 20px;
      border-radius: 15px;
      border: 2px solid #ffd700;
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      text-align: center;
      max-width: 90%;
      max-height: 90%;
    `;

    // 创建图片元素
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.style.cssText = `
      max-width: 100%;
      max-height: 400px;
      border-radius: 10px;
      margin-bottom: 15px;
    `;

    // 创建提示文字
    const text = document.createElement('p');
    text.textContent = '右键点击图片选择"保存图片"来保存到本地';
    text.style.cssText = `
      color: #ffd700;
      font-size: 16px;
      margin: 10px 0;
      font-family: serif;
    `;

    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      color: #1a0033;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
      transition: all 0.3s ease;
    `;

    closeBtn.onmouseover = () => {
      closeBtn.style.transform = 'scale(1.05)';
      closeBtn.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)';
    };

    closeBtn.onmouseout = () => {
      closeBtn.style.transform = 'scale(1)';
      closeBtn.style.boxShadow = 'none';
    };

    closeBtn.onclick = () => {
      document.body.removeChild(modal);
    };

    // 点击背景关闭
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };

    // 组装弹窗
    content.appendChild(img);
    content.appendChild(text);
    content.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !chatClient) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    let fullAnswer = '';

    try {
      const userConfig = (window.ONEDAY_CONFIG || window.parent.ONEDAY_CONFIG);
      const userId = userConfig?.user?.workid || 'anonymous';

      // 统一的人名检测函数
      const checkPersonNameMatch = (userInput, characterName) => {
        const input = userInput.toLowerCase().trim();
        const name = characterName.toLowerCase().trim();
        
        console.log('匹配检测 - 输入:', userInput, '目标:', characterName);
        console.log('转换后 - 输入:', input, '目标:', name);
        
        // 精确匹配
        if (input === name) {
          console.log('精确匹配成功');
          return true;
        }
        
        // 包含匹配
        if (input.includes(name)) {
          console.log('包含匹配成功');
          return true;
        }
        
        // 去空格匹配
        const inputNoSpace = input.replace(/\s+/g, '');
        const nameNoSpace = name.replace(/\s+/g, '');
        if (inputNoSpace.includes(nameNoSpace)) {
          console.log('去空格匹配成功');
          return true;
        }
        
        console.log('所有匹配都失败');
        return false;
      };
      
      // 检测用户输入是否包含人名
      const containsPersonName = checkPersonNameMatch(userMessage.content, gameConfig.character_name);
      
      if (containsPersonName) {
        console.log('检测到人名:', gameConfig.character_name);
      }
      
      // 构建请求参数
      const requestParams = {
        query: userMessage.content,
        user: userId,
        response_mode: 'streaming',
        inputs: {
          character: gameConfig.character_name,
          guess_flag: containsPersonName.toString()
        }
      };

      // 如果不是第一次对话且有conversation_id，则添加会话ID
      if (!isFirstMessage && conversationId) {
        requestParams.conversation_id = conversationId;
        console.log('发送消息（续话）:', requestParams, '猜测标志:', containsPersonName);
      } else {
        console.log('发送消息（首次）:', requestParams, '猜测标志:', containsPersonName);
      }

      await chatClient.sendMessageStream(
        requestParams,
        {
          onMessage: (event) => {
            console.log('收到AI回复片段:', event.answer);
            fullAnswer += event.answer;
            
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              
              if (lastMessage && lastMessage.type === 'ai' && lastMessage.isStreaming) {
                lastMessage.content = fullAnswer;
              } else {
                newMessages.push({
                  id: Date.now() + Math.random(),
                  type: 'ai',
                  content: fullAnswer,
                  timestamp: new Date(),
                  isStreaming: true
                });
              }
              
              return newMessages;
            });
          },
          onMessageEnd: (event) => {
            setIsLoading(false);
            
            // 如果是第一次对话，从响应中获取conversation_id
            if (isFirstMessage && event.conversation_id) {
              console.log('获取到会话ID:', event.conversation_id);
              setConversationId(event.conversation_id);
              setIsFirstMessage(false);
            } else if (isFirstMessage) {
              // 如果响应中没有conversation_id，标记为非首次以避免重复处理
              setIsFirstMessage(false);
              console.log('首次对话完成，但未获取到conversation_id');
            }
            
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.isStreaming) {
                lastMessage.isStreaming = false;
              }
              return newMessages;
            });

            // 检查用户输入是否包含角色名称，判断游戏是否结束
            if (checkPersonNameMatch(userMessage.content, gameConfig.character_name)) {
              // 游戏结束，清除会话ID
              console.log('游戏结束，清除conversation_id');
              setConversationId(null);
              setIsFirstMessage(true);
              setTimeout(() => {
                onGameComplete();
              }, 2000);
            }
          },
          onError: (event) => {
            console.error('发生错误:', event.message);
            setIsLoading(false);
            
            const errorMessage = {
              id: Date.now(),
              type: 'ai',
              content: '抱歉，我的灵力似乎受到了干扰，请稍后再试...',
              timestamp: new Date(),
              isError: true
            };
            
            setMessages(prev => [...prev, errorMessage]);
          },
        }
      );
    } catch (error) {
      console.error('发送消息失败:', error);
      setIsLoading(false);
      
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: '通灵连接中断，请检查网络后重试...',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass-effect rounded-2xl overflow-hidden max-w-4xl mx-auto">
      {/* 游戏状态栏 */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-4 border-b border-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-user-secret text-spirit-gold text-xl mr-3"></i>
            <div>
              <h3 className="text-white font-semibold">神秘的附身者</h3>
              <p className="text-purple-200 text-sm">通过对话寻找线索，猜出真实身份</p>
            </div>
          </div>
          
          {gameCompleted && (
            <div className="flex items-center text-green-400">
              <i className="fas fa-check-circle mr-2"></i>
              <span className="font-semibold">灵魂已解脱</span>
            </div>
          )}
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-6 border-t border-purple-600">
        {gameCompleted ? (
          <div className="text-center space-y-4">
            <div className="text-green-400 text-lg font-semibold">
              <i className="fas fa-star mr-2"></i>
              恭喜！你成功帮助灵魂获得了解脱
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={generateShareImage}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transform hover:scale-105 transition-all flex items-center space-x-2"
              >
                <i className="fas fa-share-alt"></i>
                <span>分享成就</span>
              </button>
              <button
                onClick={onRestart}
                className="px-6 py-3 bg-gradient-to-r from-spirit-gold to-yellow-500 text-purple-900 font-bold rounded-xl hover:from-yellow-400 hover:to-spirit-gold transform hover:scale-105 transition-all"
              >
                <i className="fas fa-redo mr-2"></i>
                开始新的通灵
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的问题，寻找线索..."
                rows="2"
                disabled={isLoading}
                className="w-full p-3 pr-12 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-300 focus:border-spirit-gold focus:outline-none resize-none disabled:opacity-50"
              />
              <div className="absolute bottom-2 right-2 text-purple-400 text-xs">
                Enter发送
              </div>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-spirit-gold to-yellow-500 text-purple-900 font-bold rounded-xl hover:from-yellow-400 hover:to-spirit-gold transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;