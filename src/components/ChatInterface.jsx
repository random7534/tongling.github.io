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
    
    // 获取最后一轮对话（最后一个用户消息和对应的AI回复）
    const userMessages = messages.filter(msg => msg.type === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    const lastUserMessageIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
    const lastAiMessage = messages[lastUserMessageIndex + 1];

    // 创建canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸为正方形
    const size = 800;
    canvas.width = size;
    canvas.height = size;

    // 设置背景
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // 设置字体样式
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    // 标题
    ctx.font = 'bold 32px Arial';
    ctx.fillText('🎉 通灵寻踪成功！', size/2, 60);

    // 成就文字
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`我 ${userMessageCount} 次就猜出了AI背后的历史名人是`, size/2, 120);
    
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText(`${gameConfig.character_name}`, size/2, 160);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('你也来猜猜看吧！', size/2, 200);

    // 分割线
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 230);
    ctx.lineTo(size - 50, 230);
    ctx.stroke();

    // 最后一轮对话标题
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('最后一轮对话：', size/2, 270);

    // 用户消息
    ctx.font = '16px Arial';
    ctx.fillStyle = '#87ceeb';
    ctx.textAlign = 'left';
    const userText = `玩家：${lastUserMessage?.content || ''}`;
    wrapText(ctx, userText, 50, 300, size - 100, 20);

    // AI回复
    ctx.fillStyle = '#98fb98';
    const aiText = `AI：${lastAiMessage?.content || ''}`;
    wrapText(ctx, aiText, 50, 360, size - 100, 20);

    // 二维码区域
    const qrSize = 120;
    const qrX = size/2 - qrSize/2;
    const qrY = size - qrSize - 80;
    
    // 二维码背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

    // 二维码URL配置（用户可以在这里填充自己的二维码图片URL）
    const qrCodeUrl = 'data:image/png;base64,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';
    
    // 加载并绘制二维码
    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      
      // 二维码说明
      ctx.font = '14px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('扫码体验通灵寻踪', size/2, size - 30);
      
      // 下载图片
      const link = document.createElement('a');
      link.download = `通灵寻踪-${gameConfig.character_name}-${userMessageCount}次成功.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    qrImage.onerror = () => {
      // 如果二维码加载失败，直接绘制占位符文字
      ctx.font = '12px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('二维码', qrX + qrSize/2, qrY + qrSize/2);
      
      // 二维码说明
      ctx.font = '14px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('扫码体验通灵寻踪', size/2, size - 30);
      
      // 下载图片
      const link = document.createElement('a');
      link.download = `通灵寻踪-${gameConfig.character_name}-${userMessageCount}次成功.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    qrImage.src = qrCodeUrl;
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