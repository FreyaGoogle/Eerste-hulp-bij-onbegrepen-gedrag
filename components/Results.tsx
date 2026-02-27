"use client";

import { useState } from "react";
import type { TriageResult, RouteData } from "@/lib/types";

interface Props {
  result: TriageResult;
  routes: RouteData[];
  onReset: () => void;
  onStappenplan: () => void;
}

const KLEUR_MAP: Record<string, string> = {
  red:    "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
  orange: "border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800",
  blue:   "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
  purple: "border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800",
  teal:   "border-teal-300 bg-teal-50 dark:bg-teal-900/20 dark:border-teal-800",
  amber:  "border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800",
  indigo: "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800",
  slate:  "border-slate-300 bg-slate-50 dark:bg-slate-900/20 dark:border-slate-700",
  green:  "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800",
  rose:   "border-rose-300 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800",
};

const BADGE_MAP: Record<string, string> = {
  red:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  teal:   "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  amber:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  slate:  "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  green:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rose:   "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function Results({ result, routes, onReset, onStappenplan }: Props) {
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set());
  const [copiedObs, setCopiedObs] = useState(false);

  const topRouteData = result.topRoutes
    .map((id) => routes.find((r) => r.id === id))
    .filter(Boolean) as RouteData[];

  function toggleAction(key: string) {
    setCheckedActions((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function copyObservatie(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedObs(true);
      setTimeout(() => setCopiedObs(false), 2000);
    });
  }

  if (topRouteData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Geen duidelijke verklaringsroute gevonden op basis van de ingevoerde gegevens.
          Probeer meer gedragingen te selecteren.
        </p>
        <button onClick={onReset} className="mt-4 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">
          Opnieuw beginnen
        </button>
      </div>
    );
  }

  // Primaire route voor acties en zinnen
  const primair = topRouteData[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analyse</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Op basis van uw invoer zijn dit de meest waarschijnlijke verklaringen:
        </p>
      </div>

      {/* Verklaringsroutes */}
      <div className="flex flex-col gap-3">
        {topRouteData.map((route, i) => (
          <div
            key={route.id}
            className={`rounded-xl border-2 p-4 ${KLEUR_MAP[route.kleur] ?? KLEUR_MAP.blue}`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-2xl">{route.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${BADGE_MAP[route.kleur] ?? BADGE_MAP.blue}`}>
                    {i === 0 ? "Meest waarschijnlijk" : i === 1 ? "Mogelijk" : "Ook mogelijk"}
                  </span>
                </div>
                <h3 className="mt-1 font-bold text-gray-900 dark:text-white">{route.label}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{route.canPastBij}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{route.kortUitleg}</p>
              </div>
            </div>
          </div>
        ))}
        {topRouteData.length < 3 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            Minder dan 3 routes gevonden — voeg meer context toe voor een completere analyse.
          </p>
        )}
      </div>

      {/* Doe nu */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 font-bold text-gray-900 dark:text-white">✅ Doe nu</h3>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Gebaseerd op de meest waarschijnlijke route: {primair.label}
        </p>
        <ol className="flex flex-col gap-2">
          {primair.acties.map((actie, i) => {
            const key = `${primair.id}-${i}`;
            const checked = checkedActions.has(key);
            return (
              <li key={key} className="flex items-start gap-3">
                <button
                  onClick={() => toggleAction(key)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-all ${
                    checked
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {checked ? "✓" : <span className="text-xs text-gray-400">{i + 1}</span>}
                </button>
                <span className={`text-sm ${checked ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>
                  {actie}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Zinnen die helpen */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 font-bold text-gray-900 dark:text-white">💬 Zinnen die helpen</h3>
        <div className="flex flex-col gap-2">
          {primair.zinnen.map((zin, i) => (
            <div
              key={i}
              className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            >
              {zin}
            </div>
          ))}
        </div>
      </div>

      {/* Valkuilen */}
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <h3 className="mb-3 font-bold text-amber-800 dark:text-amber-300">⚠️ Wat liever niet</h3>
        <ul className="flex flex-col gap-2">
          {primair.valkuilen.map((val, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
              <span className="mt-0.5 shrink-0">✗</span>
              <span>{val}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Observatievoorstel */}
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">📝 Observatie om te noteren</h3>
          <button
            onClick={() => copyObservatie(primair.observatieSuggestie)}
            className="rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-600 transition hover:bg-white dark:border-gray-600 dark:text-gray-400"
          >
            {copiedObs ? "Gekopieerd ✓" : "Kopieer tekst"}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Geen namen, kamernummers of herleidbare gegevens invullen.
        </p>
        <p className="rounded-lg bg-white p-3 text-sm italic text-gray-600 dark:bg-gray-900 dark:text-gray-400">
          {primair.observatieSuggestie}
        </p>
      </div>

      {/* Actieknoppen */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onStappenplan}
          className="w-full rounded-xl bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
        >
          📋 Bekijk volledig stappenplan
        </button>
        <button
          onClick={onReset}
          className="w-full rounded-xl border-2 border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          🔄 Nieuwe analyse starten
        </button>
      </div>
    </div>
  );
}
