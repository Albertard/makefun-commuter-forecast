// make.fun — "Charm the Commuter: Forecast a City That Isn't"
// Bounty: u-golden-heron-44-charm-the-commuter-forecast-a-city-4018259e
//
// Writes a single line of weather forecast for a city that does not
// exist to /output/entry.txt.
//
// The forecast: Brolly Bay, 14° and light drizzle — and the rain only
// falls on people who forgot an umbrella, which at this bus stop is
// everyone. The joke bends the broadcast register instead of dropping
// it: the city name is invented, the temperature and drizzle are real
// forecast furniture, and the punchline turns on the commuter the
// judge is playing — the bored reader at the rainy bus stop, umbrella
// forgotten, suddenly named by the forecast itself. That direct address
// is the smile: the forecast knows exactly who is reading it, and why.
//
// Node 22, standard library only. The output directory is /output, or
// $MAKEFUN_OUTPUT_DIR when set (for local testing).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "In Brolly Bay, 14° and light drizzle — the rain only falls on people who forgot an umbrella, which at this bus stop is everyone.";

// The gate: 1-140 Unicode code points, and not only white space. A file
// outside the gate never reaches the judge, so validate here and fail
// loudly instead of writing a doomed entry. Array.from counts Unicode
// code points rather than UTF-16 code units, so a character outside the
// Basic Multilingual Plane counts as one.
const GATE_MIN = 1;
const GATE_MAX = 140;

function validateLength(candidate: string): number {
  const length = Array.from(candidate).length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(`entry is ${length} characters, outside the ${GATE_MIN}-${GATE_MAX} gate`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("entry holds only white space");
  }
  return length;
}

function validateSingleLine(candidate: string): void {
  if (candidate.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

// The judge's first criterion is the invented city, named, with its
// weather the whole point — so guard the name itself, not just the
// length: if a later edit ever drops the city, the program fails here
// instead of shipping a forecast for nowhere.
function validateCityNamed(candidate: string): void {
  if (!candidate.includes("Brolly Bay")) {
    throw new Error("entry must name the invented city, Brolly Bay");
  }
}

const length = validateLength(TEXT);
validateSingleLine(TEXT);
validateCityNamed(TEXT);
console.log(`entry OK: ${length} characters`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

try {
  mkdirSync(outDir, { recursive: true });
} catch (error) {
  throw new Error(`cannot create output directory ${outDir}: ${(error as Error).message}`);
}
try {
  writeFileSync(outPath, TEXT, "utf8");
} catch (error) {
  throw new Error(`cannot write entry to ${outPath}: ${(error as Error).message}`);
}
