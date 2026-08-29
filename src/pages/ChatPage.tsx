import React, { useState, useEffect, useRef } from 'react';
import { PageView, LanguageMode, ChatMessage } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { mentorData } from '../data/mentorData';
import {
  Send,
  Lock,
  Sparkles,
  Phone,
  Video,
  Mic,
  Smile,
  Volume2,
  Calendar,
  ShieldCheck,
  RotateCcw,
  CheckCheck,
} from 'lucide-react';

interface ChatPageProps {
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onNavigate, lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'mentor',
      senderName: 'Siddhi Patel',
      text: 'Namaste! Welcome to SupportSystem. I am Siddhi. This is your completely private, non-judgmental space. Take a deep breath. What is feeling heavy or confusing in your world today?',
      timestamp: 'Just now',
    },
    {
      id: 'msg-2',
      sender: 'mentor',
      senderName: 'Siddhi Patel',
      text: '“जो खुद कभी भटका हो, वही किसी दूसरे भटके हुए इंसान को रास्ता दिखाने का दर्द समझ सकता है।” You don’t need to have a polished story. You can start wherever you like.',
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    'I feel like my mind never stops overthinking.',
    'I have a difficult decision to make and feel frozen.',
    'Feeling anxious about career choices and expectations.',
    'I just need a safe space to vent without someone giving lectures.',
    'School/College pressure is getting overwhelming.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateEmpatheticResponse = (userText: string) => {
    const lower = userText.toLowerCase();
    let reply = '';

    if (lower.includes('overthink') || lower.includes('mind') || lower.includes('loop')) {
      reply =
        'I hear you. When overthinking takes over, our brain is usually trying to protect us by trying to predict every possible future outcome. What is one specific thought that keeps looping the most right now? Let’s put it on the table together.';
    } else if (lower.includes('career') || lower.includes('job') || lower.includes('college') || lower.includes('future')) {
      reply =
        'Navigating career and future expectations carries so much silent weight, especially when everyone around seems confident. Remember, confusion is not a dead-end—it is simply the first step of recalibrating what matters to you. What is the biggest fear underneath this choice?';
    } else if (lower.includes('decision') || lower.includes('stuck') || lower.includes('choose')) {
      reply =
        'Being at a crossroads is exhausting because every option feels heavy with consequences. In our sessions, we often separate the "fear voice" from the "alignment voice". If all fear of judgment was removed for 10 seconds, which path feels more honest to your heart?';
    } else if (lower.includes('vent') || lower.includes('listen') || lower.includes('heavy') || lower.includes('sad')) {
      reply =
        'I am listening with an open heart. Put down the armor here. Everything you feel is valid, and you don’t have to apologize for feeling overwhelmed. Please go ahead—what else is on your mind?';
    } else {
      reply =
        'Thank you for sharing that with me with such honesty. I hear the nuance in what you’re experiencing. Let’s explore this further: when you reflect on this, what does your inner self feel it needs most right now—clarity, peace, or validation?';
    }

    return reply;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    // Simulate mentor listening and typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const mentorReplyText = generateEmpatheticResponse(text);
      const mentorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        senderName: 'Siddhi Patel',
        text: mentorReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mentorMsg]);
    }, 1400);
  };

  const handlePlayVoiceNote = () => {
    // Add a simulated voice reflection note from Siddhi
    const voiceMsg: ChatMessage = {
      id: `msg-voice-${Date.now()}`,
      sender: 'mentor',
      senderName: 'Siddhi Patel',
      text: 'Voice note: "A 30-second grounding reminder to take one slow breath before we continue..."',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAudioNote: true,
      audioDuration: '0:34',
    };
    setMessages((prev) => [...prev, voiceMsg]);
  };

  return (
    <div id="chat-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-140px)] min-h-[580px] flex flex-col">
      {/* Chat Header Card */}
      <div className="bg-white rounded-t-3xl border border-b-0 border-[#e5dcce] p-4 sm:p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ebdccb] shadow-sm bg-[#fbf6ee]">
              <img
                src={mentorData.avatarUrl}
                alt={mentorData.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-[#1c1a18]">{mentorData.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#fff2ef] text-[#dc3c1c] font-bold text-[10px]">
                Life Mentor
              </span>
            </div>
            <p className="text-xs text-[#70665c]">Active now • Hindi, Gujarati, English</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="chat-schedule-btn"
            onClick={() => onNavigate('book')}
            className="px-4 py-2 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Zoom Session</span>
          </button>
        </div>
      </div>

      {/* Encryption & Security Mini Bar */}
      <div className="bg-[#f2ece2] border-x border-[#e5dcce] px-4 py-1.5 text-[11px] text-[#6b6257] flex items-center justify-center gap-2">
        <Lock className="w-3 h-3 text-[#dc3c1c]" />
        <span>End-to-End Private Mentorship Chat • No messages are stored publicly</span>
      </div>

      {/* Message History Body */}
      <div className="flex-1 bg-[#faf8f5] border-x border-[#e5dcce] p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-stone-400 px-1">
                <span>{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-[#22201e] text-white rounded-br-none'
                    : 'bg-white text-[#2a2622] border border-[#ebdccb] rounded-bl-none'
                }`}
              >
                {msg.isAudioNote ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#dc3c1c] text-white flex items-center justify-center flex-shrink-0">
                        <Volume2 className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="h-1.5 bg-[#f0e7db] rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-[#dc3c1c]" />
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono mt-1 block">{msg.audioDuration} Voice Reflection</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 italic border-t border-stone-100 pt-1.5">{msg.text}</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#70665c] p-2 bg-white rounded-xl border border-stone-200 w-36 shadow-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#dc3c1c] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#dc3c1c] animate-bounce delay-100" />
            <span className="w-2 h-2 rounded-full bg-[#dc3c1c] animate-bounce delay-200" />
            <span className="text-[11px] font-medium ml-1">Siddhi is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts */}
      <div className="bg-[#fbf7f1] border-x border-[#e5dcce] p-3 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[11px] font-bold text-stone-400 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#dc3c1c]" /> Topics:
          </span>
          {starterPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(p)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-[#ebdccb] text-[#554e46] hover:bg-[#dc3c1c] hover:text-white hover:border-[#dc3c1c] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div className="bg-white rounded-b-3xl border border-[#e5dcce] p-3 sm:p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handlePlayVoiceNote}
            className="p-2.5 rounded-xl bg-[#f4ede3] hover:bg-[#ebdccb] text-[#4f473e] text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Listen to Voice Note"
          >
            <Mic className="w-4 h-4 text-[#dc3c1c]" />
          </button>

          <input
            type="text"
            placeholder="Type what's on your mind... (Press enter to send)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] disabled:opacity-40 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
