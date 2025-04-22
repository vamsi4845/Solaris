"use client";

import { ChatMessage } from "@/components/chatbox/chat-message";
import { ScrollArea } from "@/components/scroll-area";
import AIResponse from "@/lib/ai-response";
import { cn } from "@/lib/utils";
import { Message } from "@/utils/types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SettingsPanelTrigger } from "@/components/settings-panel";
import { AudioLines, Bot, Mic } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface SpeechRecognitionResult {
  0: {
    transcript: string;
  };
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm Solaris AI Agent. How can I help you today?",
      role: "system",
    },
  ]);

  const suggestions = [
    { label: "Recent Transactions", value: "What's my 5 recent transactions?" },
    { label: "Create Token", value: "Create a Solaris Token" },
    { label: "SOL Balance", value: "What's my SOL balance?" },
    { label: "Launch NFTs", value: "Launch a Solaris NFT Collection" },
    { label: "Faucet", value: "Request devnet SOL from faucet" },
    { label: "Stake", value: "Stake 0.01 SOL to a validator" },
    { label: "My Address", value: "What's my wallet address?" },
    {label:"Swap", value:"Swap 0.01 SOL for USDC"}
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages, isTyping]); 

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputText(finalTranscript || interimTranscript);
      if (finalTranscript) {
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      console.error('Speech recognition error:', errorEvent.error, errorEvent.message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [setInputText, setIsListening]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    if (!publicKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          content: "Please connect your wallet to send a message",
          role: "system",
        },
      ]);
      setInputText("");
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      content,
      role: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setIsTyping(true);
    const chatHistory = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    chatHistory.push({
      content,
      role: "user",
    });
    const AIResponseText = await AIResponse(
      chatHistory,
      publicKey,
      sendTransaction,
      connection
    );
    console.log(AIResponseText)
    if (AIResponseText?.action === "send" && AIResponseText?.status === "success"){
      console.log("invalidating wallet data")
        queryClient.invalidateQueries({ queryKey: ["wallet-data", publicKey?.toString()] });
    }
    const aiMessage: Message = {
      id: messages.length + 2,
      content: AIResponseText?.message as string,
      role: "system",
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const toggleSpeechRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  return (
    <ScrollArea className=" flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[900px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <div className="py-5 bg-background sticky top-0 z-10 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 -my-2 -me-2">
            {messages.filter(message => message.role === "user").length > 0 && (
            <div className="w-full max-w-5xl mx-auto">
              <div className="flex justify-evenly gap-3">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm text-muted-foreground",
                    "bg-muted/80 hover:bg-muted focus:bg-muted",
                    "border border-transparent hover:border-border",
                    "transition-all duration-200",
                    "text-left font-medium"
                  )}
                  onClick={() => handleSend(suggestion.value)}
                >
                  {suggestion.label}
                </motion.button>
              ))}
            </div>
          </div>
          )}
              <SettingsPanelTrigger />
            </div>
          </div>
        </div>
        <div className="relative grow overflow-y-auto">
          <div className="max-w-5xl mx-auto mt-6 space-y-6 pb-10" >
            <AnimatePresence mode="wait">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ChatMessage isUser={message.role === "user"}>
                    {message.content}
                  </ChatMessage>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-muted-foreground rounded-full"
              >
               <Image src="/logo.png" alt="logo" width={32} height={32} className="rounded-full" />
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                    className="size-1 bg-current rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    className="size-1 bg-current rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                    className="size-1 bg-current rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.6 }}
                    className="size-1 bg-current rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.8 }}
                    className="size-1 bg-current rounded-full"
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} aria-hidden="true" className="h-14" />
          </div>
        </div>
        <div className="sticky bottom-0 z-50 flex flex-col gap-2">
          {messages.filter(message => message.role === "user").length < 1 && (
            <div className="w-full max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-4">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm text-muted-foreground flex items-center justify-center",
                    "bg-muted/50 hover:bg-muted focus:bg-muted",
                    "border border-transparent hover:border-border",
                    "transition-all duration-200",
                    "text-left font-medium"
                  )}
                  onClick={() => handleSend(suggestion.value)}
                >
                  {suggestion.label}
                </motion.button>
              ))}
            </div>
          </div>
          )}
          <div >
            <div className="w-full max-w-5xl mx-auto bg-background rounded-[20px] pb-4 md:pb-6">
              <div className="relative rounded-[20px] border border-transparent bg-muted transition-colors focus-within:bg-muted/50 focus-within:border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
                <textarea
                  ref={textareaRef}
                  className="flex w-full bg-transparent px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none] pr-14 min-h-[44px] max-h-[180px] overflow-y-auto"
                  placeholder="Ask me anything..."
                  aria-label="Enter your prompt"
                  rows={1}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    adjustTextareaHeight();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(inputText);
                      setInputText('');
                    }
                  }}
                />
                <button
                    className={`absolute right-3 bottom-3 cursor-pointer ${isListening ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'text-muted-foreground'} rounded-full p-1.5 transition-all duration-300`}
                    onClick={toggleSpeechRecognition}
                    title={isListening ? "Stop listening" : "Start listening"}
                  >
                   {isListening ?
                    <AudioLines className="w-4 h-4 text-white" /> :
                    <Mic className="w-4 h-4 text-muted-foreground" />
                   }
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
