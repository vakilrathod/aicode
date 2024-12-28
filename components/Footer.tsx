import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mb-3 mt-5 flex h-16 w-full flex-col items-center justify-between px-3 pt-4 text-center sm:mb-0 sm:h-20 sm:flex-row sm:pt-2">
      <div className="text-white">
        <div className="font-medium">
          Built with{" "}
          <a
            href="https://ai.google.dev/gemini-api/docs"
            className="font-semibold text-blue-400 underline-offset-4 transition hover:text-blue-300 hover:underline"
            target="_blank"
          >
            Gemini API
          </a>{" "}
          and{" "}
          <a
            href="https://huggingface.co/spaces/osanseviero/gemini-coder"
            className="font-semibold text-blue-400 underline-offset-4 transition hover:text-blue-300 hover:underline"
            target="_blank"
          >
            Inspired by GeminiCoder
          </a>
          . This is not an official Google product.
        </div>
      </div>
    </footer>
  );
}
