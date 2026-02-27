import { triage } from "../lib/triageEngine";
import type { TriageInput } from "../lib/types";

const EMPTY_CONTEXT = {
  tijdstip: null,
  locatie: null,
  metWie: null,
  veranderingen: [],
} as const;

const EMPTY_CHECKS = {
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

describe("triage engine — basisgedrag", () => {
  test("geen gedrag geeft lege routes terug", () => {
    const input: TriageInput = {
      behaviors: [],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes).toHaveLength(0);
    expect(result.isAcuteRisk).toBe(false);
  });

  test("pijnsignalen geeft pijn als eerste route", () => {
    const input: TriageInput = {
      behaviors: ["pijnsignalen"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes[0]).toBe("pijn");
  });

  test("apathisch geeft onderprikkeling als eerste route", () => {
    const input: TriageInput = {
      behaviors: ["apathisch"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes[0]).toBe("onderprikkeling");
  });

  test("nachtelijke onrust geeft slaap als eerste route", () => {
    const input: TriageInput = {
      behaviors: ["nachtelijke_onrust"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes[0]).toBe("slaap");
  });

  test("verzet bij zorg geeft autonomie als eerste route", () => {
    const input: TriageInput = {
      behaviors: ["verzet_zorg"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes[0]).toBe("autonomie");
  });

  test("huilen geeft rouw als eerste route", () => {
    const input: TriageInput = {
      behaviors: ["huilen_verdriet"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes[0]).toBe("rouw");
  });
});

describe("triage engine — acuut risico", () => {
  test("fysiek agressief triggert acuut risico", () => {
    const input: TriageInput = {
      behaviors: ["fysiek_agressief"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.isAcuteRisk).toBe(true);
    expect(result.acuutBehaviors).toContain("fysiek_agressief");
  });

  test("zelfbeschadiging triggert acuut risico", () => {
    const input: TriageInput = {
      behaviors: ["zelfbeschadiging"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.isAcuteRisk).toBe(true);
  });

  test("normaal gedrag triggert geen acuut risico", () => {
    const input: TriageInput = {
      behaviors: ["angstig", "roepen_boos"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.isAcuteRisk).toBe(false);
  });
});

describe("triage engine — context versterkt scores", () => {
  test("nacht context verhoogt slaap-score", () => {
    const zonderNacht: TriageInput = {
      behaviors: ["onrust_ijsberen"],
      context: EMPTY_CONTEXT,
      checks: EMPTY_CHECKS,
    };
    const metNacht: TriageInput = {
      behaviors: ["onrust_ijsberen"],
      context: { ...EMPTY_CONTEXT, tijdstip: "nacht" },
      checks: EMPTY_CHECKS,
    };
    const r1 = triage(zonderNacht);
    const r2 = triage(metNacht);
    // Met nacht moet slaap in de top 3 zitten
    expect(r2.topRoutes).toContain("slaap");
    // En slaap-prioriteit is hoger bij nacht
    const slaapIndexZonder = r1.topRoutes.indexOf("slaap");
    const slaapIndexMet = r2.topRoutes.indexOf("slaap");
    // slaap zit eerder in de lijst (lagere index) of komt erbij
    expect(slaapIndexMet).toBeLessThanOrEqual(
      slaapIndexZonder === -1 ? 2 : slaapIndexZonder
    );
  });

  test("veel prikkels context verhoogt overprikkeling", () => {
    const input: TriageInput = {
      behaviors: ["angstig"],
      context: { ...EMPTY_CONTEXT, metWie: "veel_prikkels" },
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes).toContain("overprikkeling");
  });

  test("nieuw gezicht verhoogt omgeving-score", () => {
    const input: TriageInput = {
      behaviors: ["angstig"],
      context: { ...EMPTY_CONTEXT, veranderingen: ["nieuw_gezicht"] },
      checks: EMPTY_CHECKS,
    };
    const result = triage(input);
    expect(result.topRoutes).toContain("omgeving");
  });
});

describe("triage engine — basischeck versterkt scores", () => {
  test("pijn-check verhoogt pijn naar top-1", () => {
    const input: TriageInput = {
      behaviors: ["onrust_ijsberen"],
      context: EMPTY_CONTEXT,
      checks: { ...EMPTY_CHECKS, pijn: true },
    };
    const result = triage(input);
    expect(result.topRoutes[0]).toBe("pijn");
  });

  test("rouw-check verhoogt rouw-score significant", () => {
    const input: TriageInput = {
      behaviors: ["claimend"],
      context: EMPTY_CONTEXT,
      checks: { ...EMPTY_CHECKS, rouw: true },
    };
    const result = triage(input);
    expect(result.topRoutes).toContain("rouw");
  });

  test("max 3 routes worden teruggegeven", () => {
    const input: TriageInput = {
      behaviors: ["onrust_ijsberen", "roepen_boos", "angstig", "apathisch"],
      context: { tijdstip: "nacht", locatie: "huiskamer", metWie: "veel_prikkels", veranderingen: ["nieuw_gezicht"] },
      checks: { ...EMPTY_CHECKS, pijn: true, rouw: true, overprikkeling: true },
    };
    const result = triage(input);
    expect(result.topRoutes.length).toBeLessThanOrEqual(3);
  });
});
