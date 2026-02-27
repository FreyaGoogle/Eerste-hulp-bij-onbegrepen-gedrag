# Eerste Hulp bij Onbegrepen Gedrag (Dementie)

MVP-webapp voor zorgmedewerkers in de ouderenzorg. Geeft snel, praktisch en veilig handelingsperspectief bij gedrag dat niet begrepen wordt.

---

## Privacy by design

- **Geen opslag van gegevens**: alle invoer is in-memory en verdwijnt bij vernieuwen of de "Reset"-knop.
- **Geen namen, kamernummers of locaties**: de app vraagt hier nooit naar.
- **Geen analytics of tracking** (tenzij u zelf iets toevoegt).
- **Observatiesuggesties zijn anoniem** van opzet.

---

## Starten (lokaal)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Build en deploy (Vercel)

```bash
npm run build
```

**Vercel (aanbevolen):**

1. Push de repo naar GitHub.
2. Ga naar [vercel.com](https://vercel.com) → "New Project" → selecteer de repo.
3. Vercel detecteert Next.js automatisch. Klik "Deploy".
4. Elke push naar `main` deployt automatisch.

---

## Aanpassen als product owner

### 1. Organisatienaam en noodprotocol aanpassen

Bewerk `data/config.json`:

```json
{
  "organisatieNaam": "Verpleeghuis De Zonnehoek",
  "noodProtocol": {
    "stap1": "Roep direct een collega erbij",
    "stap2": "Bel de verpleegkundige: 06-12345678",
    "stap3": "Bel de dienstdoende arts: 06-87654321",
    "stap4": "Volg crisisprotocol: map blauwe kast, afdeling B",
    "stap5": "Bel BHV: toestel 999"
  },
  "extraProtocolUrl": "https://intranet.uw-organisatie.nl/crisisprotocol",
  "extraProtocolLabel": "Crisisprotocol bekijken →"
}
```

### 2. Gedragscategorieën aanpassen

Bewerk `data/behaviors.json`. Elke rij is een knop in de wizard:

```json
{ "id": "uniek_id", "label": "Tekst op de knop", "icon": "emoji", "acuutRisk": false }
```

Zet `acuutRisk: true` om een gedrag als acuut te markeren (toont veiligheidsbanner).

### 3. Verklaringsroutes, zinnen en acties aanpassen

Bewerk `data/routes.json`. Per route kunt u aanpassen:
- `kortUitleg` — uitleg die getoond wordt bij de route
- `acties` — de "Doe nu"-lijst (array van 3 zinnen)
- `zinnen` — voorbeeldzinnen voor de medewerker
- `valkuilen` — wat te vermijden
- `observatieSuggestie` — sjabloon voor anonieme notitie

### 4. Kennisbank aanpassen

Bewerk `data/knowledge.json`. Elke entry heeft `titel`, `icon` en `tekst` (gebruik `\n` voor alinea-einden).

---

## Teststatus

```bash
npm test
```

Tests bevinden zich in `__tests__/triageEngine.test.ts` en testen de kernlogica van de mapping engine.

---

## Disclaimer

Dit is **geen medisch hulpmiddel** en **geen diagnostisch instrument**. De app ondersteunt zorgmedewerkers bij het bedenken van handelingsperspectief. Bij twijfel altijd een verpleegkundige of arts raadplegen.
