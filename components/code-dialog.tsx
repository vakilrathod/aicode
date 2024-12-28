"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import CodeViewer from "./code-viewer";

export default function CodeDialog({
  isOpen,
  onClose,
  initialCode,
  initialPrompt,
  onSendMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialCode: string;
  initialPrompt: string;
  onSendMessage: (message: string) => Promise<string>;
}) {
  const [messages, setMessages] = useState([
    { role: "user", content: initialPrompt },
    { role: "assistant", content: "Here's what I've generated based on your request:" }
  ]);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: "user", content: newMessage }]);
    setNewMessage("");

    try {
      const updatedCode = await onSendMessage(newMessage);
      setCurrentCode(updatedCode);
      setMessages(prev => [...prev, { role: "assistant", content: "I've updated the code based on your request." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, there was an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] flex h-[90vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Left side - Chat */}
          <div className="flex w-1/3 flex-col rounded-lg bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Chat</h2>
              <DialogPrimitive.Close className="rounded-full p-1.5 hover:bg-gray-200">
                <XMarkIcon className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
            
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-100 ml-4" : "bg-gray-100 mr-4"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Right side - Preview */}
          <div className="w-2/3">
            <CodeViewer code={currentCode} showEditor={false} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
