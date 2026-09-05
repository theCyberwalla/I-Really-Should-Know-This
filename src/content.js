import {
  areas,
  extraTopics,
  extraConcepts,
  extraSources,
  extraPrompts,
} from "./curriculum.js";
import {
  geographyTopic,
  geographyConcepts,
  geographySources,
  geographyPrompts,
} from "./geography.js";
import {
  astronomyTopics,
  astronomyConcepts,
  astronomySources,
  astronomyPrompts,
} from "./astronomy.js";
export { areas };
import {
  presidencyConcepts,
  presidencySources,
  presidencyPrompts,
} from "./presidents.js";
// Original editorial text; source links are attached to each concept, reviewed 2026-09-05.
export const revision = "atlas-2026-09-05";
export const sources = {
  origins: [
    "Library of Congress · Origins of the war",
    "https://www.loc.gov/classroom-materials/world-war-i/",
  ],
  global: [
    "Library of Congress · Echoes of the Great War",
    "https://www.loc.gov/exhibitions/world-war-i-american-experiences/about-this-exhibition",
  ],
  armistice: [
    "National Army Museum · Peace and commemoration",
    "https://www.nam.ac.uk/explore/peace-and-commemoration",
  ],
  treaty: [
    "Palace of Versailles · The treaty of 1919",
    "https://en.chateauversailles.fr/discover/history/key-dates/treaty-versailles-1919",
  ],
  invasion: [
    "US Holocaust Memorial Museum · World War II in Europe",
    "https://encyclopedia.ushmm.org/content/en/article/world-war-ii-in-europe",
  ],
  surrender: [
    "US National Archives · Surrender of Japan",
    "https://www.archives.gov/milestone-documents/surrender-of-japan",
  ],
  washington: [
    "US National Archives · The first inauguration",
    "https://www.archives.gov/milestone-documents/president-george-washingtons-first-inaugural-speech",
  ],
  precedent: [
    "US National Archives · A precedent-breaking inauguration",
    "https://prologue.blogs.archives.gov/2017/01/18/a-precedent-breaking-inauguration/",
  ],
  emancipation: [
    "US National Archives · Emancipation Proclamation",
    "https://www.archives.gov/milestone-documents/emancipation-proclamation",
  ],
  abolition: [
    "US National Archives · Thirteenth Amendment",
    "https://www.archives.gov/milestone-documents/13th-amendment",
  ],
  limits: [
    "US National Archives · Amending America",
    "https://www.archives.gov/publications/prologue/2015/winter/amending-america",
  ],
  amendments: [
    "US National Archives · Constitutional amendments",
    "https://www.archives.gov/founding-docs/amendments-11-27",
  ],
  revolution: [
    "Palace of Versailles · The French Revolution",
    "https://en.chateauversailles.fr/discover/history/key-dates/versailles-heart-french-revolution",
  ],
  waterloo: [
    "National Army Museum · Waterloo",
    "https://www.nam.ac.uk/explore/battle-waterloo",
  ],
  cooperation: [
    "European Union · History, 1945–59",
    "https://european-union.europa.eu/principles-countries-history/history-eu/1945-59_en",
  ],
  berlin: [
    "Berlin city history · Opening the Wall",
    "https://www.berlin.de/en/history/8482274-8619314-opening-and-fall-of-the-berlin-wall.en.html",
  ],
};
export const topics = [
  {
    id: "world-wars",
    title: "World Wars",
    short: "Two wars. A world transformed.",
    question: "How does a war end—and what happens next?",
    description:
      "Follow the distance between a crisis, a ceasefire and a lasting peace.",
    range: [1914, 1945],
    color: "rust",
    type: "periods",
    scope:
      "Selected turning points, 1914–1945. The second war began earlier in parts of Asia; this timeline uses the European opening in 1939.",
    items: ["crisis", "armistice", "versailles", "invasion", "endings"],
    periods: [
      ["First World War", 1914, 1918, "crisis"],
      ["Between the wars", 1918, 1939, "versailles"],
      ["Second World War · Europe", 1939, 1945, "invasion"],
    ],
    takeaway:
      "The years between the wars were longer than both wars together. They were not years of worldwide peace.",
  },
  {
    id: "presidents",
    title: "Presidents of the United States",
    short: "People change. The office evolves.",
    question: "What shapes a presidency beyond the person?",
    description:
      "Explore selected moments when practice, wartime action and written rules met.",
    range: [1789, 1967],
    color: "green",
    type: "institutions",
    scope:
      "Four institutional turning points, 1789–1967. This is a selected history of the office, not a list or ranking of presidents.",
    items: ["precedent", "emancipation", "term-limits", "succession"],
    takeaway:
      "A precedent is a practice others may follow. An amendment changes the Constitution itself.",
  },
  {
    id: "europe",
    title: "European history",
    short: "A continent, continually remade.",
    question: "Who holds power—and how can it be shared?",
    description:
      "Trace four transformations: revolution, military defeat, shared industry and an opening border.",
    range: [1789, 1989],
    color: "blue",
    type: "transformations",
    scope:
      "Selected French, Western European and German turning points, 1789–1989. These do not represent the whole continent or a single path of progress.",
    items: ["revolution", "waterloo", "cooperation", "berlin"],
    takeaway:
      "Europe’s history is not a straight road to unity. Cooperation and division existed at the same time.",
  },
];
// Each concept has one canonical topic; related links may cross topic boundaries.
export const concepts = [
  {
    id: "crisis",
    topic: "world-wars",
    year: 1914,
    date: "Summer 1914",
    title: "A spark is not the whole fire",
    label: "A crisis becomes a world war",
    summary:
      "The assassination of Archduke Franz Ferdinand and Sophie in Sarajevo triggered a crisis in an already tense Europe.",
    why: "Nationalist ambitions, imperial rivalry and military alliances shaped how that crisis spread. A trigger identifies the opening event; it does not explain every later decision.",
    detail:
      "The conflict expanded through empires and their connections, involving people far beyond Europe. Calling it a world war describes that reach, not a claim that every country entered at once.",
    diagram: [
      ["Trigger", "Assassination in Sarajevo"],
      ["Wider conditions", "Rivalries, empires and alliances"],
      ["Changing scale", "Conflict across regions"],
    ],
    diagramNote:
      "Three lenses on the outbreak, not an automatic chain of causes.",
    sources: ["origins", "global"],
    related: [
      ["armistice", "What finally stopped the fighting?"],
      ["revolution", "How can a crisis change political power?"],
    ],
  },
  {
    id: "armistice",
    topic: "world-wars",
    year: 1918,
    date: "11 November 1918",
    title: "The guns stop. The work does not.",
    label: "The armistice",
    summary:
      "The armistice with Germany stopped fighting on the Western Front. It was not the same thing as a final peace settlement.",
    why: "Ceasing fire is a military step. Agreeing on borders, obligations and a political settlement is a different task.",
    detail:
      "The familiar 1918 endpoint compresses a longer aftermath. Peace negotiations followed, while communities faced mourning and remembrance. Read an end date as a useful marker, not an instant return to ordinary life everywhere.",
    diagram: [
      ["11 Nov 1918", "Fighting stops on the Western Front"],
      ["28 Jun 1919", "Treaty with Germany signed"],
    ],
    diagramNote:
      "Ordered milestones; spacing is not proportional to elapsed time.",
    sources: ["armistice", "treaty"],
    related: [
      ["versailles", "What did the peace treaty address?"],
      ["endings", "Why does 1945 have more than one ending?"],
    ],
  },
  {
    id: "versailles",
    topic: "world-wars",
    year: 1919,
    date: "28 June 1919",
    title: "Making a settlement is a separate task",
    label: "The Treaty of Versailles",
    summary:
      "Germany and the Allied powers signed the Treaty of Versailles in 1919, after the fighting on the Western Front had stopped.",
    why: "The treaty imposed territorial, military and financial terms on Germany. A treaty determines obligations; an armistice suspends fighting.",
    detail:
      "The setting carried its own history: the German Empire had been proclaimed in the same Hall of Mirrors in 1871. The 1919 settlement was one part of a wider postwar order, not a single explanation for everything that followed.",
    diagram: [
      ["Military", "Limits on armed forces"],
      ["Territorial", "Changes to territory"],
      ["Financial", "Reparations obligations"],
    ],
    diagramNote:
      "Categories of treaty terms; equal boxes do not imply equal importance.",
    sources: ["treaty"],
    related: [
      ["armistice", "Compare a treaty with an armistice"],
      ["cooperation", "Explore a later approach to peace"],
    ],
  },
  {
    id: "invasion",
    topic: "world-wars",
    year: 1939,
    date: "1 September 1939",
    title: "A European war begins",
    label: "Germany invades Poland",
    summary:
      "Nazi Germany invaded Poland on 1 September 1939. Britain and France declared war on Germany two days later.",
    why: "German expansion was pursued by a regime whose plans for conquest and racial domination linked war with persecution and genocide.",
    detail:
      "Military campaigns alone cannot explain this war. Occupation transformed civilian life and enabled mass violence. The Holocaust occurred within this wider conflict; its victims must not disappear behind a sequence of battles.",
    diagram: [
      ["1 September", "German invasion of Poland"],
      ["3 September", "Britain and France declare war"],
      ["Wider context", "Occupation, persecution and genocide"],
    ],
    diagramNote:
      "The last panel is a thematic context, not a third dated event.",
    sources: ["invasion"],
    related: [
      ["endings", "Follow the different endings of the war"],
      ["cooperation", "What forms of cooperation followed?"],
    ],
  },
  {
    id: "endings",
    topic: "world-wars",
    year: 1945,
    date: "May–September 1945",
    title: "One war, different endings",
    label: "The war ends in stages",
    summary:
      "The war in Europe ended in May 1945. Japan’s formal surrender was signed on 2 September 1945.",
    why: "An end date depends on the place and event being described. Victory in Europe did not mean the war in Asia and the Pacific had already ended.",
    detail:
      "In August, atomic bombs struck Hiroshima and Nagasaki and the Soviet Union entered the war against Japan. Japan announced its acceptance of surrender terms before the formal September ceremony. Distinguishing announcement, signature and theatre makes a timeline more precise.",
    diagram: [
      ["May", "War ends in Europe"],
      ["August", "Japan announces surrender"],
      ["2 September", "Formal Japanese surrender signed"],
    ],
    diagramNote:
      "Ordered stages in 1945, not a scaled timeline or a claim about one decisive cause.",
    sources: ["cooperation", "surrender"],
    related: [
      ["armistice", "Compare how the first war ended"],
      ["cooperation", "From destruction to shared institutions"],
    ],
  },
  {
    id: "precedent",
    topic: "presidents",
    year: 1789,
    date: "1789 · The first presidency",
    title: "An office needs more than a rulebook",
    label: "Washington and precedent",
    summary:
      "George Washington took the first presidential oath in 1789. The new office had a written framework but no previous president to follow.",
    why: "Actions of the first officeholders can become precedents: examples that influence later practice without themselves becoming constitutional amendments.",
    detail:
      "The two-term tradition is a useful example. Franklin D. Roosevelt later served beyond it; the constitutional limit arrived in 1951. Distinguishing custom from written law helps explain how an institution changes.",
    diagram: [
      ["1789", "A new office in operation"],
      ["Tradition", "Examples influence successors"],
      ["1951", "A constitutional election limit"],
    ],
    diagramNote:
      "A conceptual sequence with selected dates, not a complete succession chart.",
    sources: ["washington", "precedent", "amendments"],
    related: [
      ["term-limits", "When did the tradition become a rule?"],
      ["revolution", "What changed in France in the same year?"],
    ],
  },
  {
    id: "emancipation",
    topic: "presidents",
    year: 1863,
    date: "1 January 1863",
    title: "A wartime order and a lasting amendment",
    label: "Emancipation and its limits",
    summary:
      "Lincoln’s Emancipation Proclamation applied to designated areas in rebellion. It did not abolish slavery everywhere in the United States.",
    why: "Its reach reflected its basis as a wartime measure. Freedom under the proclamation also depended on Union military success.",
    detail:
      "The Thirteenth Amendment, ratified in December 1865, abolished slavery and involuntary servitude, except as punishment for a crime following conviction. A presidential proclamation and a constitutional amendment differ in authority and scope.",
    diagram: [
      ["1863 · Proclamation", "Designated areas in rebellion"],
      ["1865 · Amendment", "Constitutional abolition, with a penal exception"],
    ],
    diagramNote:
      "Compare legal scope, not the worth of individuals or a measure of lived freedom.",
    sources: ["emancipation", "abolition"],
    related: [
      ["term-limits", "How else has an amendment changed the presidency?"],
      ["succession", "How does the Constitution handle continuity?"],
    ],
  },
  {
    id: "term-limits",
    topic: "presidents",
    year: 1951,
    date: "27 February 1951",
    title: "From a tradition to a written limit",
    label: "Presidential election limits",
    summary:
      "The Twenty-second Amendment limits a person to being elected president twice.",
    why: "There is a further restriction for someone who served more than two years of another person’s term: that person may be elected only once.",
    detail:
      "Roosevelt’s service beyond two terms preceded this amendment. The distinction is between a historical convention and a later constitutional rule. This is a history of institutional change, not a judgment of presidents.",
    diagram: [
      ["Precedent", "A two-term tradition"],
      ["Exception", "Roosevelt serves beyond two terms"],
      ["1951", "Election limits enter the Constitution"],
    ],
    diagramNote:
      "Selected institutional stages, not lengths of presidential service.",
    sources: ["precedent", "limits", "amendments"],
    related: [
      ["precedent", "Return to the idea of precedent"],
      ["succession", "Compare election limits with succession"],
    ],
  },
  {
    id: "succession",
    topic: "presidents",
    year: 1967,
    date: "10 February 1967",
    title: "Becoming president is not the same as acting",
    label: "Succession and inability",
    summary:
      "The Twenty-fifth Amendment distinguishes a vacant presidency from a president temporarily unable to perform the job.",
    why: "On death, resignation or removal, the vice president becomes president. Under the amendment’s inability procedures, the vice president serves as acting president.",
    detail:
      "That difference preserves continuity without treating every temporary transfer of power as a permanent change of officeholder.",
    diagram: [
      ["Vacancy", "Vice president becomes president"],
      ["Inability procedures", "Vice president acts as president"],
    ],
    diagramNote:
      "Two constitutional situations compared; these are not consecutive steps.",
    sources: ["amendments"],
    related: [
      ["term-limits", "How do partial terms affect election limits?"],
      ["precedent", "Explore the office’s earlier foundations"],
    ],
  },
  {
    id: "revolution",
    topic: "europe",
    year: 1789,
    date: "1789 · France",
    title: "Who gets to speak for a nation?",
    label: "Revolution in France",
    summary:
      "In 1789, the Estates-General assembled at Versailles. Representatives of the Third Estate declared themselves a National Assembly.",
    why: "The Tennis Court Oath committed participants to remain assembled until a constitution was established. Authority was being challenged and redefined.",
    detail:
      "The royal family moved from Versailles to Paris in October. These events did not instantly settle how France would be governed; they show a struggle over where political authority belonged.",
    diagram: [
      ["Estates-General", "Representation through separate estates"],
      ["National Assembly", "A claim to represent the nation"],
      ["Constitution", "A demand for a new framework"],
    ],
    diagramNote:
      "Selected shifts in claims to authority, not a complete account of the Revolution.",
    sources: ["revolution"],
    related: [
      ["waterloo", "Follow the story to Napoleon’s final defeat"],
      ["precedent", "Compare another new political framework in 1789"],
    ],
  },
  {
    id: "waterloo",
    topic: "europe",
    year: 1815,
    date: "18 June 1815",
    title: "A defeat shaped by a coalition",
    label: "Waterloo",
    summary:
      "At Waterloo, Napoleon’s army faced a coalition led by Wellington and Blücher. Napoleon was defeated.",
    why: "Remembering only one opposing commander hides the role of coalition forces. The battle brought Napoleon’s final return to power to an end.",
    detail:
      "The armies were multinational. Wellington’s force held its position while Prussian forces joined the battle. A single famous name is a poor substitute for understanding how different forces acted together.",
    diagram: [
      ["Wellington’s army", "An allied force holds its position"],
      ["Blücher’s Prussians", "Join the battle against Napoleon"],
      ["Outcome", "Napoleon’s final defeat"],
    ],
    diagramNote:
      "Contributions and outcome; a schematic, not battlefield geography.",
    sources: ["waterloo"],
    related: [
      ["revolution", "Return to the earlier challenge to monarchy"],
      ["cooperation", "Compare a military coalition with shared institutions"],
    ],
  },
  {
    id: "cooperation",
    topic: "europe",
    year: 1951,
    date: "1951 treaty · In force 1952",
    title: "Why start with coal and steel?",
    label: "Sharing coal and steel",
    summary:
      "Six countries signed a treaty to place coal and steel industries under common management. These industries were central to making weapons.",
    why: "The idea was to make rivalry harder by sharing control of essential production. This was a specific institutional experiment, not the immediate creation of today’s European Union.",
    detail:
      "France, West Germany, Italy, Belgium, the Netherlands and Luxembourg were the six participants. The treaty was signed in 1951 and the community began in 1952. Meanwhile, Cold War division continued across Europe.",
    diagram: [
      [
        "Six participants",
        "France · West Germany · Italy · Belgium · Netherlands · Luxembourg",
      ],
      ["Shared management", "Coal and steel production"],
      ["Intention", "Make future conflict harder"],
    ],
    diagramNote:
      "A schematic of the proposal’s mechanism and intention, not proof of a single cause of peace.",
    sources: ["cooperation"],
    related: [
      ["versailles", "Compare two approaches to a postwar settlement"],
      ["berlin", "See the division that continued alongside cooperation"],
    ],
  },
  {
    id: "berlin",
    topic: "europe",
    year: 1989,
    date: "9 November 1989",
    title: "An open border, then a longer transition",
    label: "The Berlin Wall opens",
    summary:
      "On 9 November 1989, crowds gathered at Berlin’s border crossings after a confused announcement about new travel rules. The crossings opened.",
    why: "The opening of the Wall and German reunification are related events, but they are not the same event or date.",
    detail:
      "Pressure from people at the crossings mattered. The border’s opening became a symbol of a much broader transition; it did not instantly resolve every political division in Europe.",
    diagram: [
      ["Announcement", "Unclear timing of new travel rules"],
      ["Crowds at crossings", "People seek passage"],
      ["Open border", "Crossings open on 9 November"],
    ],
    diagramNote:
      "Selected developments that evening; not a complete explanation of the Cold War’s end.",
    sources: ["berlin"],
    related: [
      ["cooperation", "Explore cooperation during a divided era"],
      ["endings", "Compare another date that compresses a longer transition"],
    ],
  },
];
Object.assign(sources, presidencySources);
concepts.push(...presidencyConcepts);
for (const t of topics) t.area = "history";
Object.assign(sources, extraSources, geographySources, astronomySources);
topics.push(...extraTopics, geographyTopic, ...astronomyTopics);
concepts.push(...extraConcepts, ...geographyConcepts, ...astronomyConcepts);
export const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));
export const prompts = [
  {
    id: "peace-a",
    concept: "armistice",
    family: "definition",
    question:
      "A ceasefire stops fighting. Which task belongs to a peace treaty?",
    options: [
      "Negotiating the political settlement",
      "Making the guns stop at an agreed hour",
      "Recording a soldier’s enlistment",
    ],
    answer: 0,
    explanation:
      "A treaty sets out a political settlement and obligations. The 1918 armistice and the 1919 Treaty of Versailles did different jobs.",
  },
  {
    id: "peace-b",
    concept: "armistice",
    family: "application",
    question:
      "A timeline marks fighting stopping in 1918 and a treaty in 1919. What does the gap help explain?",
    options: [
      "That one date must be wrong",
      "That ending combat and negotiating peace are distinct",
      "That nothing happened between the two dates",
    ],
    answer: 1,
    explanation:
      "Both dates can be right. An armistice can halt combat before a political settlement is signed.",
  },
  {
    id: "rules-a",
    concept: "term-limits",
    family: "definition",
    question: "What changed in 1951?",
    options: [
      "The first president took office",
      "The vice presidency was created",
      "Presidential election limits became constitutional",
    ],
    answer: 2,
    explanation:
      "The Twenty-second Amendment put presidential election limits in the Constitution. A tradition is not the same as an amendment.",
  },
  {
    id: "rules-b",
    concept: "term-limits",
    family: "application",
    question: "Why could Roosevelt be elected more than twice before 1951?",
    options: [
      "The later constitutional election limit was not yet in force",
      "The amendment had expired",
      "Every wartime president is exempt",
    ],
    answer: 0,
    explanation:
      "Roosevelt preceded the Twenty-second Amendment. This illustrates the difference between a convention and a later written rule.",
  },
  {
    id: "coal-a",
    concept: "cooperation",
    family: "mechanism",
    question: "Why did early European cooperation focus on coal and steel?",
    options: [
      "All six countries had identical economies",
      "These industries were essential to weapons production",
      "Coal and steel had no military uses",
    ],
    answer: 1,
    explanation:
      "Common management of key industries was intended to make future conflict harder. It was an institutional approach to a political problem.",
  },
  {
    id: "coal-b",
    concept: "cooperation",
    family: "contrast",
    question:
      "How did the coal and steel community differ from a temporary military coalition?",
    options: [
      "It had no shared activity",
      "It was a single army",
      "It shared management of selected industries",
    ],
    answer: 2,
    explanation:
      "Its mechanism was common management of industrial production, rather than armies cooperating for a campaign.",
  },
];
prompts.push(
  ...presidencyPrompts,
  ...extraPrompts,
  ...geographyPrompts,
  ...astronomyPrompts,
);
export function validateCatalog() {
  const seen = new Set();
  for (const c of concepts) {
    if (seen.has(c.id) || !topicById[c.topic])
      throw Error("Invalid concept " + c.id);
    seen.add(c.id);
    if (
      !c.summary ||
      !c.why ||
      !c.detail ||
      c.diagram.length < 2 ||
      !c.related.length
    )
      throw Error("Incomplete concept " + c.id);
    for (const [id] of c.related)
      if (!byId[id]) throw Error("Broken relation " + id);
    for (const s of c.sources)
      if (!sources[s] || !sources[s][1].startsWith("https://"))
        throw Error("Invalid source " + s);
  }
  for (const t of topics) {
    if (!t.items.length || !t.scope || !t.takeaway)
      throw Error("Incomplete topic");
    for (const id of t.items)
      if (
        !byId[id] ||
        byId[id].topic !== t.id ||
        byId[id].year < t.range[0] ||
        byId[id].year > t.range[1]
      )
        throw Error("Invalid topic item");
  }
  for (const p of prompts) {
    if (
      !byId[p.concept] ||
      !(p.method === "map_location"
        ? p.options.includes(p.answer)
        : p.options[p.answer]) ||
      new Set(p.options).size !== p.options.length
    )
      throw Error("Invalid prompt");
  }
  return {
    topics: topics.length,
    concepts: concepts.length,
    prompts: prompts.length,
  };
}
