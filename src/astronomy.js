import { worldExplanations } from "./data/world-explanations.js";
export const planets = [
  [
    "mercury",
    "Mercury",
    0.39,
    4879,
    "Rocky planet",
    "The smallest planet travels closest to the Sun. Its surface has many impact craters.",
  ],
  [
    "venus",
    "Venus",
    0.72,
    12104,
    "Rocky planet",
    "A thick atmosphere and strong greenhouse effect make Venus hotter at the surface than Mercury.",
  ],
  [
    "earth",
    "Earth",
    1,
    12756,
    "Rocky planet",
    "Our planet has abundant surface liquid water and is the only world currently known to host life.",
  ],
  [
    "mars",
    "Mars",
    1.52,
    6792,
    "Rocky planet",
    "Mars has a thin atmosphere and evidence of a wetter past; that evidence is not proof of past life.",
  ],
  [
    "jupiter",
    "Jupiter",
    5.2,
    142984,
    "Gas giant",
    "The largest planet has no solid surface like Earth’s. Its gravity shapes a large system of moons.",
  ],
  [
    "saturn",
    "Saturn",
    9.58,
    120536,
    "Gas giant",
    "Saturn’s prominent rings consist of countless particles, largely water ice, rather than a solid disk.",
  ],
  [
    "uranus",
    "Uranus",
    19.2,
    51118,
    "Ice giant",
    "Uranus rotates with an extreme axial tilt, effectively rolling on its side as it orbits.",
  ],
  [
    "neptune",
    "Neptune",
    30.07,
    49528,
    "Ice giant",
    "Neptune is the most distant of the eight planets. It is much farther from the Sun than the inner rocky worlds.",
  ],
  [
    "pluto",
    "Pluto",
    39.48,
    2376,
    "Dwarf planet",
    "Pluto belongs to the dwarf-planet category. Its eccentric orbit means distance from the Sun varies substantially.",
  ],
].map(([id, name, au, diameter, kind, summary]) => ({
  id: "planet-" + id,
  slug: id,
  name,
  au,
  diameter,
  kind,
  summary,
}));
export const moons = [
  [
    "moon",
    "The Moon",
    "Earth",
    3475,
    "The Moon turns once per orbit, so nearly the same hemisphere faces Earth. Its phases depend on viewing geometry.",
    "https://science.nasa.gov/moon/facts/",
  ],
  [
    "io",
    "Io",
    "Jupiter",
    3643,
    "Io is intensely volcanic. Tidal flexing driven by its orbital relationships supplies internal heat.",
    "https://science.nasa.gov/jupiter/jupiter-moons/io/",
  ],
  [
    "europa",
    "Europa",
    "Jupiter",
    3122,
    "Evidence points to a salty ocean beneath Europa’s ice. An ocean makes it interesting for habitability research, not a confirmed home for life.",
    "https://science.nasa.gov/jupiter/jupiter-moons/europa/europa-facts/",
  ],
  [
    "ganymede",
    "Ganymede",
    "Jupiter",
    5268,
    "Ganymede is the largest moon in the solar system and is wider than Mercury, though it has less mass.",
    "https://science.nasa.gov/jupiter/jupiter-moons/ganymede/facts/",
  ],
  [
    "titan",
    "Titan",
    "Saturn",
    5150,
    "Titan has a thick atmosphere and surface lakes and seas of liquid hydrocarbons, including methane and ethane.",
    "https://science.nasa.gov/saturn/moons/titan/",
  ],
  [
    "enceladus",
    "Enceladus",
    "Saturn",
    504,
    "Enceladus ejects icy material from its south polar region, providing evidence of a subsurface ocean.",
    "https://science.nasa.gov/saturn/moons/enceladus/",
  ],
].map(([slug, name, parent, diameter, summary, url]) => ({
  id: "moon-" + slug,
  slug,
  name,
  parent,
  diameter,
  summary,
  url,
}));
export const astronomySources = {
  planetScale: [
    "NASA · Planet sizes and locations",
    "https://science.nasa.gov/solar-system/planet-sizes-and-locations-in-our-solar-system/",
  ],
  seasons: [
    "NASA Space Place · Seasons",
    "https://spaceplace.nasa.gov/seasons/en/",
  ],
  phases: ["NASA · Moon phases", "https://science.nasa.gov/moon/moon-phases/"],
};
for (const p of planets)
  astronomySources[p.id] = [
    "NASA · " + p.name,
    p.slug === "pluto"
      ? "https://science.nasa.gov/dwarf-planets/pluto/facts/"
      : p.slug === "earth"
        ? "https://science.nasa.gov/earth/facts/"
        : ["venus", "jupiter", "neptune"].includes(p.slug)
          ? `https://science.nasa.gov/${p.slug}/${p.slug}-facts/`
          : `https://science.nasa.gov/${p.slug}/facts/`,
  ];
for (const m of moons) astronomySources[m.id] = ["NASA · " + m.name, m.url];
export const astronomyTopics = [
  {
    id: "solar-system",
    title: "Worlds, near and far",
    question: "How much space is between the planets?",
    type: "solar",
    items: planets.map((p) => p.id),
    scope:
      "Eight planets and Pluto. Approximate mean orbital distances (AU) and equatorial diameters (km), rounded from NASA. The default log distance scale compresses outer space; switch to linear for proportional distances. Markers are not planet sizes or current positions.",
    takeaway: "Distance and size need separate scales to remain readable.",
  },
  {
    id: "moon-worlds",
    title: "Not all moons are alike",
    question: "What can a moon be?",
    type: "moons",
    items: moons.map((m) => m.id),
    scope:
      "Six selected natural satellites, not a complete moon inventory. Approximate diameters are shown on one shared scale; illustrative colors are not photographs.",
    takeaway:
      "The category “moon” describes an orbital relationship, not one type of surface or atmosphere.",
  },
  {
    id: "sky-patterns",
    title: "A changing view",
    question: "Why do seasons and Moon phases change?",
    type: "sky",
    items: ["axial-tilt", "lunar-phases"],
    scope:
      "Schematic geometry, not distances or sizes to scale. Lunar appearances are simplified and their orientation varies with location and viewing conditions.",
    takeaway:
      "Seasons follow axial tilt; ordinary lunar phases follow the changing view of the Moon’s sunlit half.",
  },
].map((t) => ({
  ...t,
  area: "moons",
  short: t.title,
  description: t.question,
  color: "blue",
  range: [0, 1],
}));
export const astronomyConcepts = [
  ...planets.map((p, i) => ({
    id: p.id,
    topic: "solar-system",
    title: p.name,
    label: p.name,
    year: 0,
    date: p.kind,
    summary: p.summary,
    why: worldExplanations[p.id][0],
    detail: `Its mean distance is about ${p.au} AU, relative to the Earth–Sun reference distance. Its approximate equatorial diameter is ${p.diameter.toLocaleString("en-US")} km. The explorer separates size from distance; an orbit is not a fixed point on a straight line. Distances between moving planets change.`,
    diagram: [
      ["Class", p.kind],
      ["Distance", p.au + " AU mean distance"],
      ["Diameter", p.diameter.toLocaleString("en-US") + " km, approximately"],
    ],
    diagramNote:
      "Equatorial diameters and rounded mean orbital distances; diagrams are teaching comparisons, not current ephemerides.",
    sources: [p.id, "planetScale", ...(p.slug === "earth" ? ["water"] : [])],
    related: [worldExplanations[p.id].slice(1)],
  })),
  ...moons.map((m, i) => ({
    id: m.id,
    topic: "moon-worlds",
    title: m.name,
    label: m.name,
    year: 0,
    date: "Moon of " + m.parent,
    summary: m.summary,
    why: worldExplanations[m.id][0],
    detail: `${m.name} orbits ${m.parent}; its approximate diameter is ${m.diameter.toLocaleString("en-US")} km. The shared size scale compares physical dimensions, not habitability.`,
    diagram: [
      ["Orbit", m.parent],
      ["Diameter", m.diameter + " km, approximately"],
      [
        "Question",
        "What does the evidence establish, and what remains unknown?",
      ],
    ],
    diagramNote:
      "Selected moons compared by physical size, not habitability ranking.",
    sources: [m.id],
    related: [worldExplanations[m.id].slice(1)],
  })),
  {
    id: "axial-tilt",
    topic: "sky-patterns",
    title: "Tilt changes the seasons",
    label: "Axial tilt",
    date: "Earth’s year",
    year: 0,
    summary:
      "Earth’s tilted axis changes the angle and duration of sunlight received by each hemisphere during the year.",
    why: "Opposite hemispheres have opposite seasons; distance from the Sun is not the main cause.",
    detail:
      "Earth’s axis is tilted about 23.4° relative to the perpendicular to its orbital plane. In the northern June season, the north tilts toward the Sun; six months later the south does.",
    diagram: [
      ["June", "North tilted toward the Sun"],
      ["Equinox", "Neither hemisphere tilted toward the Sun"],
      ["December", "South tilted toward the Sun"],
    ],
    diagramNote:
      "Earth’s axis remains approximately parallel to itself over an orbit; the diagram is schematic.",
    sources: ["seasons"],
    related: [
      ["coordinates", "Connect latitude with sunlight"],
      ["lunar-phases", "Another changing view of sunlight"],
    ],
  },
  {
    id: "lunar-phases",
    topic: "sky-patterns",
    title: "We see a changing sunlit fraction",
    label: "Lunar phases",
    date: "A roughly 29.5-day cycle",
    year: 0,
    summary:
      "As the Moon orbits Earth, we see different fractions of its sunlit half.",
    why: "Ordinary phases are not Earth’s shadow crossing the Moon; that is a lunar eclipse.",
    detail:
      "New Moon lies approximately toward the Sun in the sky; full Moon lies approximately opposite it. Eclipses do not occur every orbit because the Moon’s orbital plane is tilted.",
    diagram: [
      ["New", "Near the Sun’s direction; dark side faces us"],
      ["Quarter", "Half of the visible disk is illuminated"],
      ["Full", "Sunlit side faces us"],
    ],
    diagramNote: "Simplified phase shapes, not a forecast of tonight’s Moon.",
    sources: ["phases"],
    related: [
      ["moon-moon", "Explore Earth’s Moon"],
      ["axial-tilt", "Distinguish phase geometry from seasons"],
    ],
  },
];
export const astronomyPrompts = planets.map((p) => ({
  id: p.id + "-recall",
  concept: p.id,
  family: "name-recall",
  method: "recall",
  question: `Name the world described: ${p.summary.replaceAll(p.name, "This world")}`,
  accepted: [p.name],
  answer: 0,
  options: [p.name],
  explanation: p.name + ". " + p.summary,
  hint: p.kind,
}));
for (const m of moons)
  astronomyPrompts.push({
    id: m.id + "-parent",
    concept: m.id,
    family: "parent-recall",
    method: "recall",
    question: `Which planet does ${m.name} orbit?`,
    accepted: [m.parent],
    options: [m.parent],
    answer: 0,
    explanation: `${m.name} orbits ${m.parent}. ${m.summary}`,
    hint: m.parent === "Earth" ? "Our home planet." : "A gas giant.",
  });
