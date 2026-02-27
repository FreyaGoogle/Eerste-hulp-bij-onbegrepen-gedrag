"use client";

import { useState } from "react";
import type { Behavior, WizardState, BasicChecks, TriageContext } from "@/lib/types";

interface Props {
  behaviors: Behavior[];
  onComplete: (state: WizardState) => void;
  onAcuut: (behaviors: string[]) => void;
}

const EMPTY_CONTEXT: TriageContext = {
  tijdstip: null,
  locatie: null,
  metWie: null,
  veranderingen: [],
};

const EMPTY_CHECKS: BasicChecks = {
  pijn: false,
  toilet: false,
  dorst_honger: false,
  temperatuur: false,
  overprikkeling: false,
  onderprikkeling: false,
  vermoeidheid: false,
  onveilig: false,
  miscommunicatie: false,
  rouw: false,
  medicatie: false,
};

const TIJDSTIPPEN = [
  { id: "ochtend", label: "Ochtend", icon: "🌅" },
  { id: "middag",  label: "Middag",  icon: "☀️" },
  { id: "avond",   label: "Avond",   icon: "🌆" },
  { id: "nacht",   label: "Nacht",   icon: "🌙" },
] as const;

const LOCATIES = [
  { id: "huiskamer",    label: "Huiskamer",         icon: "🛋️" },
  { id: "eigen_kamer",  label: "Eigen kamer",        icon: "🛏️" },
  { id: "overgang",     label: "Gang / overgang",    icon: "🚪" },
  { id: "activiteit",   label: "Activiteitenruimte", icon: "🎨" },
] as const;

const MET_WIE = [
  { id: "alleen",       label: "Alleen",               icon: "👤" },
  { id: "druk",         label: "Druk (meerdere mensen)", icon: "👥" },
  { id: "veel_prikkels",label: "Veel prikkels",          icon: "🌊" },
] as const;

const VERANDERINGEN = [
  { id: "nieuw_gezicht",    label: "Nieuw gezicht" },
  { id: "nieuwe_activiteit",label: "Nieuwe activiteit" },
  { id: "zorgmoment",       label: "Zorgmoment" },
  { id: "bezoek",           label: "Bezoek" },
] as const;

const CHECK_LABELS: Record<keyof BasicChecks, string> = {
  pijn:            "Pijn of ongemak mogelijk",
  toilet:          "Toiletbehoefte",
  dorst_honger:    "Dorst of honger",
  temperatuur:     "Temperatuur / kleding",
  overprikkeling:  "Overprikkeling",
  onderprikkeling: "Onderprikkeling",
  vermoeidheid:    "Vermoeidheid",
  onveilig:        "Onveilig gevoel",
  miscommunicatie: "Miscommunicatie",
  rouw:            "Verlies / rouw / herinnering",
  medicatie:       "Medicatiewijziging (mogelijk)",
};

export default function Wizard({ behaviors, onComplete, onAcuut }: Props) {
  const [step, setStep] = useState(0);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [context, setContext] = useState<TriageContext>(EMPTY_CONTEXT);
  const [checks, setChecks] = useState<BasicChecks>(EMPTY_CHECKS);

  function toggleBehavior(id: string) {
    setSelectedBehaviors((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }

  function toggleVerandering(id: TriageContext["veranderingen"][number]) {
    setContext((prev) => ({
      ...prev,
      veranderingen: prev.veranderingen.includes(id)
        ? prev.veranderingen.filter((v) => v !== id)
        : [...prev.veranderingen, id],
    }));
  }

  function toggleCheck(key: keyof BasicChecks) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleNext() {
    if (step === 0) {
      // Check acuut risico
      const acuut = selectedBehaviors.filter(
        (id) => behaviors.find((b) => b.id === id)?.acuutRisk
      );
      if (acuut.length > 0) {
        onAcuut(acuut);
        return;
      }
    }
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      onComplete({ step: 2, behaviors: selectedBehaviors, context, checks });
    }
  }

  const stepLabels = ["Wat zie je?", "Context", "Basischeck"];
  const canProceed = step === 0 ? selectedBehaviors.length > 0 : true;

  return (
    <div className="flex flex-col gap-6">
      {/* Voortgangsindicator */}
      <div className="flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`h-2 w-full rounded-full transition-colors ${
                i <= step ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
            <span className={`text-xs ${i === step ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Stap 0: Gedragskeuze */}
      {step === 0 && (
        <div>
          <h2 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">Wat zie je?</h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Selecteer alles wat van toepassing is.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {behaviors.map((b) => {
              const selected = selectedBehaviors.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBehavior(b.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center text-sm font-medium transition-all ${
                    b.acuutRisk
                      ? selected
                        ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : "border-red-200 text-red-600 hover:border-red-400 dark:border-red-800 dark:text-red-400"
                      : selected
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "border-gray-200 text-gray-700 hover:border-blue-300 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <span className="leading-tight">{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stap 1: Context */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Wanneer?</h2>
            <div className="grid grid-cols-4 gap-2">
              {TIJDSTIPPEN.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setContext((c) => ({ ...c, tijdstip: c.tijdstip === t.id ? null : t.id }))}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 text-xs font-medium transition-all ${
                    context.tijdstip === t.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Waar?</h3>
            <div className="grid grid-cols-2 gap-2">
              {LOCATIES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setContext((c) => ({ ...c, locatie: c.locatie === l.id ? null : l.id }))}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${
                    context.locatie === l.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  <span className="text-lg">{l.icon}</span> {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Met wie / welke omgeving?</h3>
            <div className="grid grid-cols-3 gap-2">
              {MET_WIE.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setContext((c) => ({ ...c, metWie: c.metWie === m.id ? null : m.id }))}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all ${
                    context.metWie === m.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-center leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Veranderingen vandaag?</h3>
            <div className="flex flex-wrap gap-2">
              {VERANDERINGEN.map((v) => (
                <button
                  key={v.id}
                  onClick={() => toggleVerandering(v.id)}
                  className={`rounded-full border-2 px-3 py-1 text-sm font-medium transition-all ${
                    context.veranderingen.includes(v.id)
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stap 2: Basischeck */}
      {step === 2 && (
        <div>
          <h2 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">Snelle basischeck</h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Vink aan wat van toepassing is of mogelijk zou kunnen zijn.
          </p>
          <div className="flex flex-col gap-2">
            {(Object.keys(checks) as (keyof BasicChecks)[]).map((key) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                  checks[key]
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checks[key]}
                  onChange={() => toggleCheck(key)}
                  className="h-5 w-5 rounded accent-blue-600"
                />
                <span className={`text-sm font-medium ${checks[key] ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                  {CHECK_LABELS[key]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Navigatie */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            ← Terug
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {step < 2 ? "Volgende →" : "Bekijk analyse"}
        </button>
      </div>
    </div>
  );
}
