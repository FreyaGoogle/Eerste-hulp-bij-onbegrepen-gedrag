"use client";

import type { AppConfig } from "@/lib/types";

interface Props {
  config: AppConfig;
  onBack: () => void;
}

export default function AcuutScreen({ config, onBack }: Props) {
  const stappen = Object.values(config.noodProtocol);

  return (
    <div className="flex flex-col gap-6">
      {/* Veiligheidsvraag */}
      <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">🚨</span>
          <h2 className="text-lg font-bold text-red-800 dark:text-red-300">
            Is er direct gevaar?
          </h2>
        </div>
        <p className="mb-4 text-sm text-red-700 dark:text-red-400">
          Als er een risico is op letsel voor de bewoner of uzelf — schakel dan <strong>direct hulp in</strong>:
        </p>
        <ol className="flex flex-col gap-3">
          {stappen.map((stap, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm font-medium text-red-800 dark:text-red-300">{stap}</span>
            </li>
          ))}
        </ol>
        {config.extraProtocolUrl && (
          <a
            href={config.extraProtocolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-lg bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            {config.extraProtocolLabel || "Lokaal protocol bekijken →"}
          </a>
        )}
      </div>

      {/* Geen direct gevaar: eerste stappen de-escalatie */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
        <h3 className="mb-3 font-bold text-amber-800 dark:text-amber-300">
          🟡 Geen direct letselrisico — eerste stappen
        </h3>
        <ol className="flex flex-col gap-3">
          {[
            { icon: "🛑", tekst: "Stop — adem uit — beoordeel de situatie opnieuw." },
            { icon: "📏", tekst: "Geef ruimte: houd voldoende afstand. Dwing geen contact." },
            { icon: "🗣️", tekst: "Verlaag uw stem. Spreek rustig, kort en duidelijk." },
            { icon: "👁️", tekst: "Ga op gelijke hoogte. Vermijd plotselinge bewegingen." },
            { icon: "👥", tekst: "Roep een collega erbij als de situatie niet verbetert." },
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-xl">{s.icon}</span>
              <span className="text-sm text-amber-800 dark:text-amber-300">{s.tekst}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* De-escalatie zinnen */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 font-bold text-gray-900 dark:text-white">💬 Zinnen voor nu</h3>
        <div className="flex flex-col gap-2">
          {[
            "\"Ik ben hier. U bent veilig.\"",
            "\"We doen het rustig aan. Ik blijf bij u.\"",
            "\"U hoeft niks te doen. Ik luister.\"",
            "\"Ik zie dat u ergens heel boos/bang over bent. Dat begrijp ik.\"",
          ].map((zin, i) => (
            <div key={i} className="rounded-lg bg-dv-gold-light/30 px-3 py-2 text-sm italic text-dv-navy dark:bg-dv-navy/20 dark:text-dv-gold">
              {zin}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full rounded-xl border-2 border-dv-gold-light py-3 text-sm font-semibold text-dv-navy transition hover:bg-dv-cream dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        ← Terug naar begin
      </button>
    </div>
  );
}
