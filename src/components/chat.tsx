"use client";

import { ChatMessage } from "@/components/chat-message";
import { ScrollArea } from "@/components/scroll-area";
import { Button } from "@/components/ui/button";
import AIResponse from "@/lib/ai-response";
import { cn } from "@/lib/utils";
import { Message } from "@/utils/types";
import {RiCodeSSlashLine,RiMicFill,RiMicLine,RiShareCircleLine,RiShareLine,RiShining2Line,} from "@remixicon/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SettingsPanelTrigger } from "./settings-panel";
import { Bot } from "lucide-react";

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

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  // Todo: we can store this to local storage (not db because it will be too much for an example)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm Solaris AI Agent. How can I help you today?",
      role: "system",
    },
  ]);

  const suggestions = [
    { label: "Recent Transactions", value: "Give last 5 transactions" },
    { label: "SOL Balance", value: "How much SOL do I have?" },
    { label: "My Address", value: "What is my Public Address?" },
    { label: "Create Token", value: "Create Token Named Solaris and assume other details" },
    { label: "Get SOL", value: "Faucet" },
    { label: "Launch NFTs", value: "Launch NFT Collection Named Solaris and assume other details" },
  ];

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    const aiMessage: Message = {
      id: messages.length + 2,
      content: AIResponseText?.message as string,
      role: "system",
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const results = Array.from(event.results);
          const transcript = results
            .map(result => result[0].transcript)
            .join('');
          
          setInputText(transcript);
          if (textareaRef.current) {
            textareaRef.current.value = transcript;
            adjustTextareaHeight();
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-grow textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  const handleMicClick = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
      } else {
        await recognitionRef.current.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
    }
  };

  return (
    <ScrollArea className=" flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[900px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        {/* Header */}
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
        {/* Chat */}
        <div className="relative grow">
          <div className="max-w-5xl mx-auto mt-6 space-y-6">
            <AnimatePresence>
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
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Bot className="size-4" />
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
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        </div>
        {/* Footer */}
        <div className="sticky bottom-0 z-50 flex flex-col gap-2">
          {/* Suggestions */}
          {messages.filter(message => message.role === "user").length < 1 && (
            <div className="w-full max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-4">
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
          {/* Input Area */}
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
                {/* Mic button positioned at the right */}
                <div className="absolute right-4 top-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-all duration-200",
                      isRecording && "bg-red-100 text-red-500 animate-pulse"
                    )}
                    onClick={handleMicClick}
                  >
                    {isRecording ? (
                      <RiMicFill
                        className="size-5"
                        size={20}
                        aria-hidden="true"
                      />
                    ) : (
                      <RiMicLine
                        className="text-muted-foreground/70 size-5"
                        size={20}
                        aria-hidden="true"
                      />
                    )}
                    <span className="sr-only">
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
