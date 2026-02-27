/**
 * Triage Engine
 * Pure function: TriageInput → TriageResult
 *
 * Logic:
 * 1. Score alle 10 verklaringsroutes op basis van geselecteerde gedragingen.
 * 2. Pas contextmodifiers toe.
 * 3. Pas basischeck-modifiers toe.
 * 4. Retourneer top-3 routes en acuutrisico-signalering.
 */

import type { TriageInput, TriageResult, RouteId, RouteScore } from "./types";

// --- Gedrag → route-gewichten ---
const GEDRAG_GEWICHTEN: Record<string, Partial<Record<RouteId, number>>> = {
  onrust_ijsberen:    { overprikkeling: 2, angst: 2, pijn: 1, slaap: 1 },
  roepen_boos:        { communicatie: 2, autonomie: 2, angst: 1, pijn: 1 },
  angstig:            { angst: 3, omgeving: 1, rouw: 1 },
  apathisch:          { onderprikkeling: 3, lichamelijk: 1, rouw: 1 },
  verzet_zorg:        { autonomie: 3, communicatie: 2, angst: 1 },
  nachtelijke_onrust: { slaap: 3, lichamelijk: 1, overprikkeling: 1 },
  huilen_verdriet:    { rouw: 3, angst: 2, pijn: 1 },
  achterdocht_wanen:  { angst: 3, communicatie: 2, overprikkeling: 1 },
  claimend:           { angst: 2, communicatie: 2, onderprikkeling: 1 },
  seksueel_ontremd:   { communicatie: 2, onderprikkeling: 1, autonomie: 1 },
  eet_drinkprobleem:  { lichamelijk: 2, pijn: 1, communicatie: 1 },
  wegloopneiging:     { angst: 2, autonomie: 2, rouw: 1 },
  pijnsignalen:       { pijn: 3, lichamelijk: 2 },
  // Acuut-risicogedrag draagt ook bij aan scores
  fysiek_agressief:   { autonomie: 2, angst: 2, overprikkeling: 1 },
  zelfbeschadiging:   { angst: 3, rouw: 2 },
};

// --- Context → route-modifiers ---
function applyContext(scores: Map<RouteId, number>, input: TriageInput): void {
  const { tijdstip, locatie, metWie, veranderingen } = input.context;

  if (tijdstip === "nacht")   { add(scores, "slaap", 2); add(scores, "overprikkeling", 1); }
  if (tijdstip === "ochtend") { add(scores, "slaap", 1); }
  if (tijdstip === "avond")   { add(scores, "slaap", 1); add(scores, "overprikkeling", 1); }

  if (locatie === "overgang")     { add(scores, "omgeving", 2); add(scores, "angst", 1); }
  if (locatie === "huiskamer")    { add(scores, "overprikkeling", 1); }
  if (locatie === "eigen_kamer")  { add(scores, "onderprikkeling", 1); }
  if (locatie === "activiteit")   { add(scores, "overprikkeling", 1); }

  if (metWie === "alleen")        { add(scores, "angst", 1); add(scores, "onderprikkeling", 1); }
  if (metWie === "druk")          { add(scores, "overprikkeling", 2); }
  if (metWie === "veel_prikkels") { add(scores, "overprikkeling", 3); }

  for (const v of veranderingen) {
    if (v === "nieuw_gezicht")    { add(scores, "omgeving", 2); add(scores, "angst", 1); }
    if (v === "nieuwe_activiteit"){ add(scores, "omgeving", 1); }
    if (v === "zorgmoment")       { add(scores, "autonomie", 1); }
    if (v === "bezoek")           { add(scores, "omgeving", 1); add(scores, "angst", 1); }
  }
}

// --- Basischeck → route-modifiers ---
function applyChecks(scores: Map<RouteId, number>, input: TriageInput): void {
  const c = input.checks;
  if (c.pijn)          { add(scores, "pijn", 3); }
  if (c.overprikkeling){ add(scores, "overprikkeling", 2); }
  if (c.onderprikkeling){ add(scores, "onderprikkeling", 2); }
  if (c.onveilig)      { add(scores, "angst", 2); }
  if (c.miscommunicatie){ add(scores, "communicatie", 2); }
  if (c.rouw)          { add(scores, "rouw", 3); }
  if (c.vermoeidheid)  { add(scores, "slaap", 1); add(scores, "lichamelijk", 1); }
  if (c.toilet)        { add(scores, "lichamelijk", 1); add(scores, "pijn", 1); }
  if (c.dorst_honger)  { add(scores, "lichamelijk", 1); }
  if (c.temperatuur)   { add(scores, "lichamelijk", 1); }
  if (c.medicatie)     { add(scores, "pijn", 1); add(scores, "lichamelijk", 1); }
}

function add(scores: Map<RouteId, number>, route: RouteId, amount: number): void {
  scores.set(route, (scores.get(route) ?? 0) + amount);
}

const ACUUT_GEDRAG = new Set(["fysiek_agressief", "zelfbeschadiging"]);

export function triage(input: TriageInput): TriageResult {
  const scores = new Map<RouteId, number>();

  // Stap 1: gedragingen
  for (const behaviorId of input.behaviors) {
    const gewichten = GEDRAG_GEWICHTEN[behaviorId];
    if (!gewichten) continue;
    for (const [route, score] of Object.entries(gewichten) as [RouteId, number][]) {
      add(scores, route, score);
    }
  }

  // Stap 2: context
  applyContext(scores, input);

  // Stap 3: basischeck
  applyChecks(scores, input);

  // Top 3 routes (minimaal score 1)
  const sorted: RouteScore[] = Array.from(scores.entries())
    .filter(([, s]) => s > 0)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  const topRoutes = sorted.slice(0, 3).map((r) => r.id);

  // Acuut risico
  const acuutBehaviors = input.behaviors.filter((b) => ACUUT_GEDRAG.has(b));
  const isAcuteRisk = acuutBehaviors.length > 0;

  return { topRoutes, isAcuteRisk, acuutBehaviors };
}
