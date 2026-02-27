"use client";

import type { AppConfig } from "@/lib/types";

interface Props {
  config: AppConfig;
  onClose: () => void;
}

export default function SafetyBanner({ config, onClose }: Props) {
  const stappen = Object.values(config.noodProtocol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-red-600 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-t-2xl bg-red-700 px-6 py-4">
          <span className="text-4xl">🚨</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Acuut gevaar</p>
            <h2 className="text-xl font-bold">Stop en schakel hulp in</h2>
          </div>
        </div>

        {/* Stappen */}
        <div className="px-6 py-5">
          <p className="mb-4 text-sm opacity-90">
            Er is mogelijk acuut gevaar voor de bewoner of medewerker. Onderneem nu de volgende stappen:
          </p>
          <ol className="space-y-3">
            {stappen.map((stap, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-red-700">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm font-medium">{stap}</span>
              </li>
            ))}
          </ol>

          {config.extraProtocolUrl && (
            <a
              href={config.extraProtocolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-lg bg-white/20 px-4 py-2 text-center text-sm font-semibold underline"
            >
              {config.extraProtocolLabel || "Bekijk lokaal protocol →"}
            </a>
          )}
        </div>

        {/* Sluit */}
        <div className="border-t border-white/20 px-6 py-4">
          <p className="mb-3 text-xs opacity-75">
            Ga alleen terug naar deze app als de situatie veilig is en u ondersteuning heeft.
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white py-3 font-bold text-red-700 transition hover:bg-red-50"
          >
            Situatie is veilig — ga terug
          </button>
        </div>
      </div>
    </div>
  );
}
