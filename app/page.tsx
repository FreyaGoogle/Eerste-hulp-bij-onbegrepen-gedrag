"use client";

import { useState, useEffect } from "react";
import type { AppScreen, WizardState, TriageResult, RouteData, KnowledgeItem, AppConfig, Behavior } from "@/lib/types";
import { triage } from "@/lib/triageEngine";
import SafetyBanner from "@/components/SafetyBanner";
import Wizard from "@/components/Wizard";
import Results from "@/components/Results";
import StepPlan from "@/components/StepPlan";
import KnowledgeBase from "@/components/KnowledgeBase";
import AcuutScreen from "@/components/AcuutScreen";

import behaviorsData from "@/data/behaviors.json";
import routesData from "@/data/routes.json";
import knowledgeData from "@/data/knowledge.json";
import configData from "@/data/config.json";

const behaviors = behaviorsData as Behavior[];
const routes = routesData as RouteData[];
const knowledge = knowledgeData as KnowledgeItem[];
const config = configData as AppConfig;

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [darkMode, setDarkMode] = useState(false);
  const [showSafetyBanner, setShowSafetyBanner] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  // Donkere modus instellen op html-element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  function handleWizardComplete(state: WizardState) {
    const result = triage({
      behaviors: state.behaviors,
      context: state.context,
      checks: state.checks,
    });
    setTriageResult(result);
    setScreen("results");
  }

  function handleAcuutBehaviors() {
    setShowSafetyBanner(true);
  }

  function handleReset() {
    setTriageResult(null);
    setScreen("home");
  }

  return (
    <div className="min-h-screen bg-dv-cream dark:bg-gray-950">
      {/* Veiligheidsbanner overlay */}
      {showSafetyBanner && (
        <SafetyBanner config={config} onClose={() => setShowSafetyBanner(false)} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-dv-gold-light bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-sm font-bold text-dv-navy dark:text-white leading-tight">
              Eerste Hulp bij
            </h1>
            <h1 className="text-sm font-bold text-dv-navy dark:text-white leading-tight">
              Onbegrepen Gedrag
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {screen !== "home" && (
              <button
                onClick={handleReset}
                className="rounded-full border border-dv-gold-light px-3 py-1 text-xs font-semibold text-dv-navy hover:bg-dv-cream dark:border-gray-700 dark:text-gray-400"
                title="Alles wissen"
              >
                ↺ Reset
              </button>
            )}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="rounded-full border border-dv-gold-light p-2 text-sm hover:bg-dv-cream dark:border-gray-700 dark:hover:bg-gray-800"
              title="Donker/licht modus"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* Inhoud */}
      <main className="mx-auto max-w-lg px-4 py-6 pb-24">
        {/* Startscherm */}
        {screen === "home" && (
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <p className="text-sm font-semibold text-dv-navy dark:text-gray-400">
                {config.organisatieNaam !== "Uw organisatie" ? config.organisatieNaam : ""}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Kies een startpunt:
              </p>
            </div>

            {/* Nu acuut */}
            <button
              onClick={() => setScreen("acuut")}
              className="flex items-start gap-4 rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-left transition hover:border-red-400 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:hover:bg-red-900/30"
            >
              <span className="mt-1 text-3xl">🚨</span>
              <div>
                <h2 className="text-lg font-bold text-red-800 dark:text-red-300">Nu accuut</h2>
                <p className="mt-0.5 text-sm text-red-600 dark:text-red-400">
                  Directe veiligheidscheck en de-escalatiestappen
                </p>
              </div>
            </button>

            {/* Begrijpen */}
            <button
              onClick={() => setScreen("wizard")}
              className="flex items-start gap-4 rounded-2xl border-2 border-dv-gold bg-dv-gold-light/20 p-5 text-left transition hover:border-dv-navy hover:bg-dv-gold-light/40 dark:border-blue-900 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
            >
              <span className="mt-1 text-3xl">🔍</span>
              <div>
                <h2 className="text-lg font-bold text-dv-navy dark:text-blue-300">Ik wil begrijpen wat er speelt</h2>
                <p className="mt-0.5 text-sm text-dv-navy/70 dark:text-blue-400">
                  Triage-analyse: gedrag → verklaringsroutes → aanpak
                </p>
              </div>
            </button>

            {/* Stappenplan */}
            <button
              onClick={() => setScreen("stappenplan")}
              className="flex items-start gap-4 rounded-2xl border-2 border-dv-gold bg-dv-gold-light/20 p-5 text-left transition hover:border-dv-navy hover:bg-dv-gold-light/40 dark:border-green-900 dark:bg-green-900/20 dark:hover:bg-green-900/30"
            >
              <span className="mt-1 text-3xl">📋</span>
              <div>
                <h2 className="text-lg font-bold text-dv-navy dark:text-green-300">Stappenplan begeleiding</h2>
                <p className="mt-0.5 text-sm text-dv-navy/70 dark:text-green-400">
                  5 stappen: rust → aansluiten → prikkelregie → actie → evaluatie
                </p>
              </div>
            </button>

            {/* Kennisbank */}
            <button
              onClick={() => setScreen("kennisbank")}
              className="flex items-start gap-4 rounded-2xl border-2 border-dv-gold-light bg-white p-5 text-left transition hover:border-dv-gold hover:bg-dv-cream dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <span className="mt-1 text-3xl">📚</span>
              <div>
                <h2 className="text-lg font-bold text-dv-navy dark:text-gray-200">Kennisbank</h2>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Achtergrondinformatie over prikkelverwerking, validatie en meer
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Acuut scherm */}
        {screen === "acuut" && (
          <AcuutScreen config={config} onBack={() => setScreen("home")} />
        )}

        {/* Wizard */}
        {screen === "wizard" && (
          <Wizard
            behaviors={behaviors}
            onComplete={handleWizardComplete}
            onAcuut={handleAcuutBehaviors}
          />
        )}

        {/* Resultaten */}
        {screen === "results" && triageResult && (
          <Results
            result={triageResult}
            routes={routes}
            onReset={handleReset}
            onStappenplan={() => setScreen("stappenplan")}
          />
        )}

        {/* Stappenplan */}
        {screen === "stappenplan" && (
          <StepPlan onBack={() => setScreen(triageResult ? "results" : "home")} />
        )}

        {/* Kennisbank */}
        {screen === "kennisbank" && (
          <KnowledgeBase items={knowledge} onBack={() => setScreen("home")} />
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-dv-gold-light/60 bg-dv-cream/95 px-4 py-2 dark:border-gray-800 dark:bg-gray-950/95">
        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          ⚕️ Dit is geen medisch hulpmiddel. Geen gegevens worden opgeslagen. Gebruik voor professionele ondersteuning.
        </p>
      </footer>
    </div>
  );
}
