"use client";

import { useState } from "react";
import type { KnowledgeItem } from "@/lib/types";

interface Props {
  items: KnowledgeItem[];
  onBack: () => void;
}

export default function KnowledgeBase({ items, onBack }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">📚 Kennisbank</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Korte uitleg over veelgestelde vragen en achtergrond.
        </p>
      </div>

      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className="rounded-xl border-2 border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="flex-1 font-semibold text-gray-900 dark:text-white">{item.titel}</span>
              <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-800">
                {item.tekst.split("\n").map((line, i) => (
                  <p key={i} className={`text-sm text-gray-700 dark:text-gray-300 ${i > 0 ? "mt-2" : ""}`}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={onBack}
        className="mt-2 w-full rounded-xl border-2 border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        ← Terug naar begin
      </button>
    </div>
  );
}
