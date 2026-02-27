"use client";

import { useState } from "react";

const STAPPEN = [
  {
    nr: 1,
    titel: "Rust en veiligheid",
    icon: "🛑",
    kleur: "blue",
    uitleg: "Zorg eerst voor rust — voor de bewoner én voor uzelf. Een rustige, veilige omgeving is de basis voor alles wat daarna komt.",
    acties: [
      "Stop wat u aan het doen was. Adem bewust uit.",
      "Verlaag uw stem, vertraag uw tempo, ga op gelijke hoogte.",
      "Verminder prikkels: tv uit, deur dicht, minder mensen in de ruimte.",
      "Geef de bewoner ruimte — dwing geen contact af.",
    ],
    zinnen: [
      "\"Ik ben hier. We doen het rustig aan.\"",
      "\"U hoeft niks. Ik blijf even bij u.\"",
    ],
  },
  {
    nr: 2,
    titel: "Aansluiten (validatie)",
    icon: "🤝",
    kleur: "purple",
    uitleg: "Sluit aan op het gevoel, niet op de inhoud. Erken wat de persoon ervaart — zonder te corrigeren.",
    acties: [
      "Maak oogcontact en benoem wat u ziet: 'Ik zie dat u ergens mee zit.'",
      "Luister actief. Onderbreek niet.",
      "Herhaal of parafraseer het gevoel, niet de feitelijke inhoud.",
      "Raak aan als dat welkom is (hand, schouder).",
    ],
    zinnen: [
      "\"Ik hoor dat u verdrietig bent. Dat is begrijpelijk.\"",
      "\"U zoekt iemand. Ik blijf bij u.\"",
      "\"Ik luister. Vertel maar.\"",
    ],
  },
  {
    nr: 3,
    titel: "Prikkelregie",
    icon: "🎛️",
    kleur: "orange",
    uitleg: "Stem de hoeveelheid prikkels af op wat de bewoner aankan. Soms is dat minder (bij onrust), soms juist meer (bij apathie).",
    acties: [
      "Bij overprikkeling: dim licht, verwijder lawaai, beperk aantal mensen, spreek in korte zinnen.",
      "Bij onderprikkeling: bied zinvolle activiteit aan passend bij achtergrond en interesses.",
      "Gebruik vertrouwde prikkels: bekende muziek, eigen foto's, een vertrouwd voorwerp.",
      "Wissel van omgeving als de huidige plek de onrust versterkt.",
    ],
    zinnen: [
      "\"Zullen we even naar uw kamer gaan? Dat is rustiger.\"",
      "\"Ik heb hier muziek die u vast kent. Zal ik dat aanzetten?\"",
    ],
  },
  {
    nr: 4,
    titel: "Betekenisvolle actie",
    icon: "🌱",
    kleur: "green",
    uitleg: "Bied iets kleins en zinvols aan dat aansluit bij de persoon. Kleine successen geven gevoel van controle en verbinding.",
    acties: [
      "Bied een eenvoudige taak aan die past bij vroegere interesses of beroep.",
      "Ga samen iets doen: wandelen, drinken, een foto bekijken.",
      "Gebruik muziek, beweging of natuur als verbindingsmiddel.",
      "Sla grote activiteiten over als de onrust nog hoog is.",
    ],
    zinnen: [
      "\"Zullen we samen een stukje lopen?\"",
      "\"Kunt u mij helpen met [kleine taak]? Dat zou fijn zijn.\"",
      "\"Zal ik iets te drinken voor u halen?\""
    ],
  },
  {
    nr: 5,
    titel: "Evalueren",
    icon: "📋",
    kleur: "teal",
    uitleg: "Neem een moment om te reflecteren. Wat werkte? Wat niet? Wanneer terugkoppelen aan het team?",
    acties: [
      "Noteer (anoniem) wat er was en wat hielp — zonder namen of kamernummers.",
      "Bespreek met uw collega of teamleider als het patroon terugkeert.",
      "Vraag collegiale ondersteuning als u zelf aangeslagen bent.",
      "Bespreek bij het team-overleg of de begeleiding aangepast moet worden.",
    ],
    zinnen: [
      "\"Wat werkte bij de bewoner vandaag?\"",
      "\"Hebben we dit eerder gezien, en wat hielp toen?\"",
    ],
  },
];

const KLEUR_MAP: Record<string, { card: string; badge: string; title: string }> = {
  blue:   { card: "border-blue-200 dark:border-blue-800",   badge: "bg-blue-600",   title: "text-blue-700 dark:text-blue-300" },
  purple: { card: "border-purple-200 dark:border-purple-800", badge: "bg-purple-600", title: "text-purple-700 dark:text-purple-300" },
  orange: { card: "border-orange-200 dark:border-orange-800", badge: "bg-orange-600", title: "text-orange-700 dark:text-orange-300" },
  green:  { card: "border-green-200 dark:border-green-800",  badge: "bg-green-600",  title: "text-green-700 dark:text-green-300" },
  teal:   { card: "border-teal-200 dark:border-teal-800",   badge: "bg-teal-600",   title: "text-teal-700 dark:text-teal-300" },
};

export default function StepPlan({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  const [done, setDone] = useState<Set<number>>(new Set());

  function toggleDone(nr: number) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(nr) ? next.delete(nr) : next.add(nr);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stappenplan begeleiding</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Werk de stappen in volgorde door. Sla stappen over als ze al gedaan zijn.
        </p>
      </div>

      {STAPPEN.map((stap) => {
        const k = KLEUR_MAP[stap.kleur];
        const isOpen = open === stap.nr;
        const isDone = done.has(stap.nr);

        return (
          <div
            key={stap.nr}
            className={`rounded-xl border-2 transition-all ${k.card} ${isDone ? "opacity-60" : ""}`}
          >
            {/* Header */}
            <button
              onClick={() => setOpen(isOpen ? null : stap.nr)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold ${k.badge}`}>
                {isDone ? "✓" : stap.nr}
              </span>
              <span className="text-2xl">{stap.icon}</span>
              <div className="flex-1">
                <span className={`font-bold ${k.title}`}>Stap {stap.nr}: {stap.titel}</span>
              </div>
              <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
            </button>

            {/* Inhoud */}
            {isOpen && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-800">
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{stap.uitleg}</p>

                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Wat doen</h4>
                <ul className="mb-4 flex flex-col gap-1.5">
                  {stap.acties.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-1 text-xs text-gray-400">•</span>
                      {a}
                    </li>
                  ))}
                </ul>

                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Zinnen</h4>
                <div className="mb-4 flex flex-col gap-1.5">
                  {stap.zinnen.map((z, i) => (
                    <div key={i} className="rounded-lg bg-blue-50 px-3 py-2 text-sm italic text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                      {z}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { toggleDone(stap.nr); setOpen(null); }}
                  className={`w-full rounded-xl py-2.5 text-sm font-bold transition ${
                    isDone
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      : `text-white ${k.badge} hover:opacity-90`
                  }`}
                >
                  {isDone ? "✓ Gedaan — markeer als open" : "Markeer als gedaan →"}
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={onBack}
        className="mt-2 w-full rounded-xl border-2 border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        ← Terug
      </button>
    </div>
  );
}
