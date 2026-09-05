import { byId, prompts, revision } from "./content.js";
export const DAY = 86400000;
const intervals = [1, 3, 7, 21, 60];
export function makeEvent(kind, conceptId, extra = {}, now = Date.now()) {
  return {
    version: 1,
    id: crypto.randomUUID(),
    profileId: "local",
    encounterId: crypto.randomUUID(),
    kind,
    conceptId,
    objectiveId: conceptId,
    observedAt: now,
    localDate: new Date(now).toLocaleDateString("en-CA"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    contentRevision: revision,
    method: "exploration",
    outcome: "unscored",
    assistance: "none",
    priorAttemptCount: 0,
    ...extra,
  };
}
export function validateEvent(e) {
  if (
    !e ||
    e.version !== 1 ||
    typeof e.id !== "string" ||
    e.id.length > 180 ||
    typeof e.profileId !== "string" ||
    !e.profileId ||
    typeof e.encounterId !== "string" ||
    !byId[e.conceptId] ||
    e.objectiveId !== e.conceptId ||
    !Number.isFinite(e.observedAt) ||
    e.observedAt < 0 ||
    e.observedAt > 8640000000000000 ||
    !["opened", "saved", "self_report", "hint", "revealed", "attempt"].includes(
      e.kind,
    ) ||
    !["none", "hint", "answer_visible", "retry"].includes(e.assistance) ||
    !Number.isInteger(e.priorAttemptCount) ||
    e.priorAttemptCount < 0
  )
    throw Error("Invalid learning event. Nothing was imported.");
  if (
    !["unscored", "correct", "incorrect"].includes(e.outcome) ||
    ![
      "exploration",
      "recognition",
      "recall",
      "map_location",
      "self_report",
    ].includes(e.method)
  )
    throw Error("Invalid evidence method.");
  if (e.kind === "attempt") {
    const p = prompts.find((p) => p.id === e.promptId);
    if (
      !p ||
      p.concept !== e.conceptId ||
      p.family !== e.family ||
      e.promptRevision !== 1 ||
      e.method !== (p.method ?? "recognition") ||
      !["correct", "incorrect"].includes(e.outcome)
    )
      throw Error("Invalid scored attempt.");
  } else if (e.outcome !== "unscored")
    throw Error("Only an attempt can be scored.");
  for (const field of ["localDate", "timezone", "contentRevision"])
    if (typeof e[field] !== "string" || e[field].length > 120)
      throw Error("Invalid event provenance.");
  return e;
}
// Replay is chronological, independent of import ordering. No stored mastery or scores.
export function evidence(events, now = Date.now()) {
  const states = {},
    labels = {},
    encounters = new Set();
  for (const e of [...events].sort(
    (a, b) => a.observedAt - b.observedAt || a.id.localeCompare(b.id),
  )) {
    if (e.observedAt > now) {
      labels[e.id] = "Clock ahead · not evaluated";
      continue;
    }
    const s = (states[e.conceptId] ??= {
      exposure: null,
      due: null,
      level: 0,
      lastFamily: null,
      opened: 0,
      practiced: 0,
      later: 0,
      saved: false,
      methods: {},
    });
    let label = {
      opened: "Opened",
      saved: "Saved",
      self_report: "Marked familiar · self-reported",
      hint: "Assisted · hint",
      revealed: "Assisted · answer shown",
    }[e.kind];
    if (e.kind === "saved") s.saved = true;
    if (e.kind === "opened") s.opened++;
    if (e.kind === "attempt") {
      const method = (s.methods[e.method] ??= {
        level: 0,
        lastFamily: null,
        later: 0,
      });
      const first = !encounters.has(e.encounterId);
      encounters.add(e.encounterId);
      s.practiced++;
      const eligible =
        first &&
        e.priorAttemptCount === 0 &&
        e.assistance === "none" &&
        s.exposure !== null &&
        e.observedAt - s.exposure >= DAY &&
        e.observedAt >= s.due &&
        e.family !== method.lastFamily;
      label =
        e.assistance !== "none" || !first || e.priorAttemptCount > 0
          ? "Practiced · assisted"
          : "Practiced · " +
            {
              recall: "recall",
              map_location: "map location",
              recognition: "recognition",
            }[e.method];
      if (eligible && e.outcome === "correct") {
        label = {
          recognition: "Recognized later",
          recall: "Recalled later",
          map_location: "Located later",
        }[e.method];
        method.later++;
        method.level = Math.min(method.level + 1, intervals.length - 1);
        s.later++;
        s.level = method.level;
      }
      if (e.outcome === "incorrect") {
        s.level = 0;
        method.level = 0;
      }
      method.lastFamily = e.family;
    }
    if (["opened", "hint", "revealed", "attempt"].includes(e.kind)) {
      s.exposure = e.observedAt;
      if (
        e.kind === "attempt" &&
        ["Recognized later", "Recalled later", "Located later"].includes(label)
      )
        s.due = e.observedAt + intervals[s.level] * DAY;
      else if (
        ["hint", "revealed"].includes(e.kind) ||
        e.outcome === "incorrect"
      ) {
        s.level = 0;
        s.due = e.observedAt + DAY;
      } else s.due = Math.max(s.due ?? 0, e.observedAt + DAY);
    }
    if (["attempt", "hint", "revealed"].includes(e.kind) && e.family) {
      s.lastFamily = e.family;
      const p = prompts.find((p) => p.id === e.promptId);
      const method = p?.method ?? "recognition";
      const m = (s.methods[method] ??= {
        level: 0,
        lastFamily: null,
        later: 0,
      });
      m.lastFamily = e.family;
      if (["hint", "revealed"].includes(e.kind)) m.level = 0;
    }
    labels[e.id] = label;
  }
  return { states, labels };
}
export function selectPrompt(events, conceptId, now = Date.now()) {
  const { states } = evidence(events, now);
  const s = states[conceptId];
  const candidates = prompts.filter((p) => p.concept === conceptId);
  return candidates.find((p) => p.family !== s?.lastFamily) ?? candidates[0];
}
export function dueConcepts(events, now = Date.now()) {
  const { states } = evidence(events, now);
  return Object.entries(states)
    .filter(
      ([id, s]) =>
        s.due !== null && s.due <= now && prompts.some((p) => p.concept === id),
    )
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}

export function normalizeRecall(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
