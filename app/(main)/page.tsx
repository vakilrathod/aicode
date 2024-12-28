"use client";

import CodeViewer from "@/components/code-viewer";
import CodeDialog from "@/components/code-dialog";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import LoadingDots from "../../components/loading-dots";

function removeCodeFormatting(code: string): string {
  return code.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, '$1').trim();
}

export default function Home() {
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated"
  >("initial");
  let [prompt, setPrompt] = useState("");
  let models = [
    {
      label: "gemini-2.0-flash-exp",
      value: "gemini-2.0-flash-exp",
    },
    {
      label: "gemini-1.5-pro",
      value: "gemini-1.5-pro",
    },
    {
      label: "gemini-1.5-flash",
      value: "gemini-1.5-flash",
    }
  ];
  let [model, setModel] = useState(models[0].value);
  let [shadcn, setShadcn] = useState(false);
  let [modification, setModification] = useState("");
  let [generatedCode, setGeneratedCode] = useState("");
  let [initialAppConfig, setInitialAppConfig] = useState({
    model: "",
    shadcn: true,
  });
  let [dialogOpen, setDialogOpen] = useState(false);
  let [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  let loading = status === "creating" || status === "updating";

  async function handleMessage(message: string) {
    let res = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        shadcn,
        messages: [...messages, { role: "user", content: message }],
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    if (!res.body) {
      throw new Error("No response body");
    }

    const reader = res.body.getReader();
    let receivedData = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      receivedData += new TextDecoder().decode(value);
    }

    const cleanedCode = removeCodeFormatting(receivedData);
    setGeneratedCode(cleanedCode);
    setMessages(prev => [...prev, 
      { role: "user", content: message },
      { role: "assistant", content: receivedData }
    ]);

    return cleanedCode;
  }

  async function createApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("creating");
    setGeneratedCode("");

    try {
      const code = await handleMessage(prompt);
      setInitialAppConfig({ model, shadcn });
      setStatus("created");
      setDialogOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setStatus("initial");
    }
  }

  async function updateApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("updating");

    try {
      await handleMessage(modification);
      setStatus("updated");
    } catch (error) {
      console.error("Error:", error);
      setStatus("created");
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl font-semibold sm:text-4xl">
          VizionCoder Alpha
        </h1>
        <p className="text-lg text-gray-600">
          Generate React components with Gemini 2.0 Flash
        </p>
      </div>

      <form onSubmit={createApp} className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="prompt"
              className="flex items-center gap-2 font-medium"
            >
              What would you like to create?
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful landing page with a hero section, features grid, and pricing table..."
              className="h-32 rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
            />
          </div>

          <div className="flex flex-wrap items-start gap-8">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 font-medium">
                Model
              </label>
              <Select.Root value={model} onValueChange={setModel}>
                <Select.Trigger className="inline-flex h-10 items-center justify-between gap-2 rounded-lg border bg-gray-50 px-3 outline-none focus:border-gray-400">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-lg border bg-white shadow-lg">
                    <Select.Viewport>
                      {models.map((model) => (
                        <Select.Item
                          key={model.value}
                          value={model.value}
                          className="flex h-10 cursor-pointer items-center gap-2 px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>{model.label}</Select.ItemText>
                          <Select.ItemIndicator>
                            <CheckIcon className="h-4 w-4" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 font-medium">
                Use shadcn/ui
              </label>
              <Switch.Root
                checked={shadcn}
                onCheckedChange={setShadcn}
                className="relative h-6 w-11 cursor-pointer rounded-full bg-gray-200 outline-none transition-colors data-[state=checked]:bg-blue-500"
              >
                <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !prompt}
            className="group flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? (
              <>
                <LoadingDots />
                {status === "creating" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>
                Create
                <ArrowLongRightIcon className="h-5 w-5 transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>

      <CodeDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialCode={generatedCode}
        initialPrompt={prompt}
        onSendMessage={handleMessage}
      />
    </div>
  );
}
