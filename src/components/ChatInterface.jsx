/**
 * 聊天界面组件
 * 应用标识: 7b07f649-6197-421d-8513-a65e74792267
 * 功能: 实现与AI附身者的对话交互，使用OneDay Workflow SDK进行历史人物猜测
 */
import React, { useState, useEffect, useRef } from 'react';
import { ChatClient } from '@ali/oneday-workflow-sdk';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatInterface = ({ gameConfig, onGameComplete, onRestart, gameCompleted }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatClient, setChatClient] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 初始化聊天客户端
    const client = new ChatClient({
      headers: {
        Authorization: '7b07f649-6197-421d-8513-a65e74792267',
      },
      baseUrl: 'https://1d.alibaba-inc.com/api/proxy/workflow/v1',
    });
    setChatClient(client);

    // 重置会话状态
    setConversationId(null);
    setIsFirstMessage(true);
    console.log('开始新游戏，角色:', gameConfig.character_name);

    // 添加初始消息
    const initialMessage = {
      id: Date.now(),
      type: 'ai',
      content: '在这片被时光尘封的记忆里，一道身影静候千年，只待你轻轻叩问——\n\n用智慧拨开迷雾，猜猜我是谁？🤫',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [gameConfig]);  // 添加gameConfig依赖，确保每次新游戏都创建新会话

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      // 检测用户输入是否包含人名
      const userInput = userMessage.content.toLowerCase();
      const characterName = gameConfig.character_name.toLowerCase();
      const containsPersonName = userInput.includes(characterName);
      
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
            const userInput = userMessage.content.toLowerCase();
            const characterName = gameConfig.character_name.toLowerCase();
            
            // 更精确的名字匹配，支持部分匹配和全名匹配
            if (userInput.includes(characterName) || 
                userInput.includes(gameConfig.character_name) ||
                userInput.replace(/\s+/g, '').includes(characterName.replace(/\s+/g, ''))) {
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
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-gradient-to-r from-spirit-gold to-yellow-500 text-purple-900 font-bold rounded-xl hover:from-yellow-400 hover:to-spirit-gold transform hover:scale-105 transition-all"
            >
              <i className="fas fa-redo mr-2"></i>
              开始新的通灵
            </button>
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
