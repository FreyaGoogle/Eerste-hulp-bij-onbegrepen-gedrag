export type RouteId =
  | "pijn"
  | "overprikkeling"
  | "onderprikkeling"
  | "angst"
  | "communicatie"
  | "autonomie"
  | "rouw"
  | "slaap"
  | "lichamelijk"
  | "omgeving";

export interface Behavior {
  id: string;
  label: string;
  icon: string;
  acuutRisk: boolean;
}

export interface TriageContext {
  tijdstip: "ochtend" | "middag" | "avond" | "nacht" | null;
  locatie: "huiskamer" | "eigen_kamer" | "overgang" | "activiteit" | null;
  metWie: "alleen" | "druk" | "veel_prikkels" | null;
  veranderingen: Array<"nieuw_gezicht" | "nieuwe_activiteit" | "zorgmoment" | "bezoek">;
}

export interface BasicChecks {
  pijn: boolean;
  toilet: boolean;
  dorst_honger: boolean;
  temperatuur: boolean;
  overprikkeling: boolean;
  onderprikkeling: boolean;
  vermoeidheid: boolean;
  onveilig: boolean;
  miscommunicatie: boolean;
  rouw: boolean;
  medicatie: boolean;
}

export interface TriageInput {
  behaviors: string[];
  context: TriageContext;
  checks: BasicChecks;
}

export interface RouteScore {
  id: RouteId;
  score: number;
}

export interface TriageResult {
  topRoutes: RouteId[];
  isAcuteRisk: boolean;
  acuutBehaviors: string[];
}

// Data shapes from JSON files
export interface RouteData {
  id: RouteId;
  label: string;
  icon: string;
  kleur: string;
  kortUitleg: string;
  canPastBij: string;
  acties: string[];
  zinnen: string[];
  valkuilen: string[];
  observatieSuggestie: string;
}

export interface KnowledgeItem {
  id: string;
  titel: string;
  icon: string;
  tekst: string;
}

export interface AppConfig {
  organisatieNaam: string;
  noodProtocol: Record<string, string>;
  extraProtocolUrl: string;
  extraProtocolLabel: string;
  toonAnoniemeFoutmeldingen: boolean;
}

// App state machine
export type AppScreen =
  | "home"
  | "acuut"
  | "wizard"
  | "results"
  | "stappenplan"
  | "kennisbank";

export interface WizardState {
  step: number; // 0=gedrag, 1=context, 2=checks
  behaviors: string[];
  context: TriageContext;
  checks: BasicChecks;
}
