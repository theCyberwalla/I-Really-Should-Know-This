import { presidencyExplanations } from "./data/presidency-explanations.js";
export const presidents = [
  {
    number: 1,
    personId: "washington",
    name: "George Washington",
    start: "1789-04-30",
    end: "1797-03-04",
    source: "https://millercenter.org/president/washington",
    context:
      "The first presidency established working precedents for a new constitutional office. Washington had led the Continental Army before becoming president.",
  },
  {
    number: 2,
    personId: "adams",
    name: "John Adams",
    start: "1797-03-04",
    end: "1801-03-04",
    source: "https://millercenter.org/president/adams",
    context:
      "Adams served as a diplomat and as Washington\u2019s vice president before taking office. His administration followed the first transfer from one president to another.",
  },
  {
    number: 3,
    personId: "jefferson",
    name: "Thomas Jefferson",
    start: "1801-03-04",
    end: "1809-03-04",
    source: "https://millercenter.org/president/jefferson",
    context:
      "Jefferson wrote the Declaration of Independence before becoming president. His earlier work as a lawyer and political leader connected the founding era to the new republic.",
  },
  {
    number: 4,
    personId: "madison",
    name: "James Madison",
    start: "1809-03-04",
    end: "1817-03-04",
    source: "https://millercenter.org/president/madison",
    context:
      "Madison helped shape American constitutional thought before serving as president. His career crossed state legislatures, national lawmaking and executive office.",
  },
  {
    number: 5,
    personId: "monroe",
    name: "James Monroe",
    start: "1817-03-04",
    end: "1825-03-04",
    source: "https://millercenter.org/president/monroe",
    context:
      "The 1823 Monroe Doctrine stated a US position toward European intervention in the Americas. Monroe\u2019s earlier career included diplomacy and service as secretary of state.",
  },
  {
    number: 6,
    personId: "jqadams",
    name: "John Quincy Adams",
    start: "1825-03-04",
    end: "1829-03-04",
    source: "https://millercenter.org/president/jqadams",
    context:
      "John Quincy Adams served as secretary of state before his presidency. He lost the 1828 election to Andrew Jackson after a single term in office.",
  },
  {
    number: 7,
    personId: "jackson",
    name: "Andrew Jackson",
    start: "1829-03-04",
    end: "1837-03-04",
    source: "https://millercenter.org/president/jackson",
    context:
      "Jackson\u2019s presidency expanded the use and political influence of executive power. His career helped shape the emerging Democratic Party.",
  },
  {
    number: 8,
    personId: "vanburen",
    name: "Martin Van Buren",
    start: "1837-03-04",
    end: "1841-03-04",
    source: "https://millercenter.org/president/vanburen",
    context:
      "Van Buren\u2019s political organizing helped build the Democratic Party. He brought experience in New York and national politics to a single presidential term.",
  },
  {
    number: 9,
    personId: "harrison",
    name: "William Henry Harrison",
    start: "1841-03-04",
    end: "1841-04-04",
    source: "https://millercenter.org/president/harrison",
    context:
      "William Henry Harrison died in office in April 1841, just a month after his inauguration. His death raised an immediate question of presidential succession.",
  },
  {
    number: 10,
    personId: "tyler",
    name: "John Tyler",
    start: "1841-04-04",
    end: "1845-03-04",
    source: "https://millercenter.org/president/tyler",
    context:
      "Tyler succeeded to the presidency after Harrison died. His earlier career included the Virginia legislature and the US House of Representatives.",
  },
  {
    number: 11,
    personId: "polk",
    name: "James K. Polk",
    start: "1845-03-04",
    end: "1849-03-04",
    source: "https://millercenter.org/president/polk",
    context:
      "Polk\u2019s presidency included war with Mexico and major US territorial expansion. Territorial growth also sharpened disputes over whether slavery would expand.",
  },
  {
    number: 12,
    personId: "taylor",
    name: "Zachary Taylor",
    start: "1849-03-04",
    end: "1850-07-09",
    source: "https://millercenter.org/president/taylor",
    context:
      "Taylor\u2019s presidency confronted the status of slavery in territories acquired from Mexico. His death in 1850 brought Vice President Millard Fillmore into office.",
  },
  {
    number: 13,
    personId: "fillmore",
    name: "Millard Fillmore",
    start: "1850-07-09",
    end: "1853-03-04",
    source: "https://millercenter.org/president/fillmore",
    context:
      "Fillmore took office after Taylor died, during an intensifying national conflict over slavery. He served the remainder of the term and did not win his party\u2019s nomination in 1852.",
  },
  {
    number: 14,
    personId: "pierce",
    name: "Franklin Pierce",
    start: "1853-03-04",
    end: "1857-03-04",
    source: "https://millercenter.org/president/pierce",
    context:
      "Pierce supported passage of the Kansas\u2013Nebraska Act. The law became central to the growing conflict over slavery and the political future of western territories.",
  },
  {
    number: 15,
    personId: "buchanan",
    name: "James Buchanan",
    start: "1857-03-04",
    end: "1861-03-04",
    source: "https://millercenter.org/president/buchanan",
    context:
      "During Buchanan\u2019s administration, disputes over slavery and secession deepened. Several Southern states left the Union before his term ended in March 1861.",
  },
  {
    number: 16,
    personId: "lincoln",
    name: "Abraham Lincoln",
    start: "1861-03-04",
    end: "1865-04-15",
    source: "https://millercenter.org/president/lincoln",
    context:
      "Lincoln led the United States during the Civil War. His Emancipation Proclamation was a wartime measure with defined geographical limits; constitutional abolition followed through the Thirteenth Amendment.",
  },
  {
    number: 17,
    personId: "johnson",
    name: "Andrew Johnson",
    start: "1865-04-15",
    end: "1869-03-04",
    source: "https://millercenter.org/president/johnson",
    context:
      "Andrew Johnson succeeded Lincoln in April 1865. His term occupied the first years of Reconstruction, when the country confronted the consequences of civil war and emancipation.",
  },
  {
    number: 18,
    personId: "grant",
    name: "Ulysses S. Grant",
    start: "1869-03-04",
    end: "1877-03-04",
    source: "https://millercenter.org/president/grant",
    context:
      "Grant commanded Union armies before becoming president. His two presidential terms followed the Civil War and fell within the Reconstruction era.",
  },
  {
    number: 19,
    personId: "hayes",
    name: "Rutherford B. Hayes",
    start: "1877-03-04",
    end: "1881-03-04",
    source: "https://millercenter.org/president/hayes",
    context:
      "Hayes took office after the disputed election of 1876. His presidency coincided with the end of federal Reconstruction and a changing industrial economy.",
  },
  {
    number: 20,
    personId: "garfield",
    name: "James A. Garfield",
    start: "1881-03-04",
    end: "1881-09-19",
    source: "https://millercenter.org/president/garfield",
    context:
      "Garfield\u2019s presidency lasted from March to September 1881. His death after being shot brought Vice President Chester A. Arthur into office.",
  },
  {
    number: 21,
    personId: "arthur",
    name: "Chester A. Arthur",
    start: "1881-09-19",
    end: "1885-03-04",
    source: "https://millercenter.org/president/arthur",
    context:
      "Arthur became president after Garfield died. Before national office, his legal work included cases involving fugitive slavery and segregated streetcars in New York.",
  },
  {
    number: 22,
    personId: "cleveland",
    name: "Grover Cleveland",
    start: "1885-03-04",
    end: "1889-03-04",
    source: "https://millercenter.org/president/cleveland",
    context:
      "Cleveland served two nonconsecutive presidencies. His earlier public offices included mayor of Buffalo and governor of New York.",
  },
  {
    number: 23,
    personId: "bharrison",
    name: "Benjamin Harrison",
    start: "1889-03-04",
    end: "1893-03-04",
    source: "https://millercenter.org/president/bharrison/domestic-affairs",
    context:
      "Benjamin Harrison was the grandson of William Henry Harrison. His presidency falls between Grover Cleveland\u2019s two nonconsecutive periods in office.",
  },
  {
    number: 24,
    personId: "cleveland",
    name: "Grover Cleveland",
    start: "1893-03-04",
    end: "1897-03-04",
    source: "https://millercenter.org/president/cleveland",
    context:
      "Cleveland served two nonconsecutive presidencies. His earlier public offices included mayor of Buffalo and governor of New York.",
  },
  {
    number: 25,
    personId: "mckinley",
    name: "William McKinley",
    start: "1897-03-04",
    end: "1901-09-14",
    source: "https://millercenter.org/president/mckinley",
    context:
      "McKinley\u2019s presidency included the war with Spain and debates over the United States\u2019 growing role overseas. He died in 1901 and was succeeded by Theodore Roosevelt.",
  },
  {
    number: 26,
    personId: "roosevelt",
    name: "Theodore Roosevelt",
    start: "1901-09-14",
    end: "1909-03-04",
    source: "https://millercenter.org/president/roosevelt",
    context:
      "Theodore Roosevelt emphasized an active executive office and enlarged its political influence. He first took office through succession, then won election in his own right.",
  },
  {
    number: 27,
    personId: "taft",
    name: "William Howard Taft",
    start: "1909-03-04",
    end: "1913-03-04",
    source: "https://millercenter.org/president/taft",
    context:
      "Taft later became chief justice of the United States. He is the only person to have served as both president and chief justice.",
  },
  {
    number: 28,
    personId: "wilson",
    name: "Woodrow Wilson",
    start: "1913-03-04",
    end: "1921-03-04",
    source: "https://millercenter.org/president/wilson",
    context:
      "Wilson\u2019s administration expanded the federal government\u2019s economic role. His presidency also encompassed US participation in the First World War.",
  },
  {
    number: 29,
    personId: "harding",
    name: "Warren G. Harding",
    start: "1921-03-04",
    end: "1923-08-02",
    source: "https://millercenter.org/president/harding",
    context:
      "Harding entered the presidency from national politics in the period after the First World War. His death in August 1923 caused an unplanned transfer to Calvin Coolidge.",
  },
  {
    number: 30,
    personId: "coolidge",
    name: "Calvin Coolidge",
    start: "1923-08-02",
    end: "1929-03-04",
    source: "https://millercenter.org/president/coolidge",
    context:
      "Coolidge succeeded Harding in 1923. His father administered his first presidential oath at the family home in Vermont.",
  },
  {
    number: 31,
    personId: "hoover",
    name: "Herbert Hoover",
    start: "1929-03-04",
    end: "1933-03-04",
    source: "https://millercenter.org/president/hoover",
    context:
      "The 1929 stock-market crash occurred during Hoover\u2019s first year in office. His presidency became closely associated with the beginning of the Great Depression.",
  },
  {
    number: 32,
    personId: "fdroosevelt",
    name: "Franklin D. Roosevelt",
    start: "1933-03-04",
    end: "1945-04-12",
    source: "https://millercenter.org/president/fdroosevelt",
    context:
      "Franklin D. Roosevelt\u2019s presidency encompassed the New Deal and most of US participation in the Second World War. He served more than two terms before constitutional election limits were adopted.",
  },
  {
    number: 33,
    personId: "truman",
    name: "Harry S. Truman",
    start: "1945-04-12",
    end: "1953-01-20",
    source: "https://millercenter.org/president/truman",
    context:
      "Truman succeeded Roosevelt in April 1945. His administration managed the transition from wartime to peacetime and the early Cold War.",
  },
  {
    number: 34,
    personId: "eisenhower",
    name: "Dwight D. Eisenhower",
    start: "1953-01-20",
    end: "1961-01-20",
    source: "https://millercenter.org/president/eisenhower",
    context:
      "Eisenhower was a military commander before entering the presidency. His service connects the Second World War generation to the postwar executive office.",
  },
  {
    number: 35,
    personId: "kennedy",
    name: "John F. Kennedy",
    start: "1961-01-20",
    end: "1963-11-22",
    source: "https://millercenter.org/president/kennedy",
    context:
      "Kennedy served in the House and Senate before becoming president. His assassination in November 1963 brought Lyndon Johnson into office.",
  },
  {
    number: 36,
    personId: "lbjohnson",
    name: "Lyndon B. Johnson",
    start: "1963-11-22",
    end: "1969-01-20",
    source: "https://millercenter.org/president/lbjohnson",
    context:
      "Lyndon Johnson became president following Kennedy\u2019s assassination. Before serving as vice president, he had been a leader in the US Senate.",
  },
  {
    number: 37,
    personId: "nixon",
    name: "Richard Nixon",
    start: "1969-01-20",
    end: "1974-08-09",
    source: "https://millercenter.org/president/nixon",
    context:
      "Nixon resigned in August 1974 amid the Watergate crisis. He remains the only US president to have resigned the office, as of this collection\u2019s review date.",
  },
  {
    number: 38,
    personId: "ford",
    name: "Gerald Ford",
    start: "1974-08-09",
    end: "1977-01-20",
    source: "https://millercenter.org/president/ford",
    context:
      "Ford became president after Nixon resigned. The transfer illustrates the distinction between entering office through succession and winning a presidential election.",
  },
  {
    number: 39,
    personId: "carter",
    name: "Jimmy Carter",
    start: "1977-01-20",
    end: "1981-01-20",
    source: "https://millercenter.org/president/carter",
    context:
      "Carter\u2019s presidency faced inflation, energy pressures and the hostage crisis in Iran. He served one term, between Gerald Ford and Ronald Reagan.",
  },
  {
    number: 40,
    personId: "reagan",
    name: "Ronald Reagan",
    start: "1981-01-20",
    end: "1989-01-20",
    source: "https://millercenter.org/president/reagan",
    context:
      "Reagan worked in broadcasting and film before entering elected politics. He served as governor of California before his two presidential terms.",
  },
  {
    number: 41,
    personId: "bush",
    name: "George H. W. Bush",
    start: "1989-01-20",
    end: "1993-01-20",
    source: "https://millercenter.org/president/bush/foreign-affairs",
    context:
      "Bush’s presidency spanned the opening of the Berlin Wall and German reunification. The two German states and the four Second World War victors negotiated the international arrangements through the Two-plus-Four process.",
  },
  {
    number: 42,
    personId: "clinton",
    name: "Bill Clinton",
    start: "1993-01-20",
    end: "2001-01-20",
    source: "https://millercenter.org/president/clinton",
    context:
      "Clinton was elected to two terms. He was impeached by the House and acquitted by the Senate, illustrating that impeachment does not by itself remove a president.",
  },
  {
    number: 43,
    personId: "gwbush",
    name: "George W. Bush",
    start: "2001-01-20",
    end: "2009-01-20",
    source: "https://millercenter.org/president/gwbush",
    context:
      "George W. Bush\u2019s presidency included the September 11 attacks, wars in Afghanistan and Iraq, and the financial crisis of 2008. These events involved several different policy domains.",
  },
  {
    number: 44,
    personId: "obama",
    name: "Barack Obama",
    start: "2009-01-20",
    end: "2017-01-20",
    source: "https://millercenter.org/president/obama",
    context:
      "Obama became the first African American president in January 2009. He had previously served in the Illinois legislature and the US Senate.",
  },
  {
    number: 45,
    personId: "trump",
    name: "Donald Trump",
    start: "2017-01-20",
    end: "2021-01-20",
    source: "https://millercenter.org/president/trump",
    context:
      "Trump served as the 45th president and returned as the 47th in January 2025. Along with Grover Cleveland, he is one of two people to hold nonconsecutive presidencies.",
  },
  {
    number: 46,
    personId: "biden",
    name: "Joe Biden",
    start: "2021-01-20",
    end: "2025-01-20",
    source: "https://millercenter.org/president/biden",
    context:
      "Biden served as a US senator and as vice president before his 2021\u20132025 presidency. His term falls between Donald Trump\u2019s nonconsecutive presidencies.",
  },
  {
    number: 47,
    personId: "trump",
    name: "Donald Trump",
    start: "2025-01-20",
    end: null,
    source: "https://millercenter.org/president/trump",
    context:
      "Trump served as the 45th president and returned as the 47th in January 2025. Along with Grover Cleveland, he is one of two people to hold nonconsecutive presidencies.",
  },
];
export const presidencySources = {
  "presidential-terms": [
    "National Archives · Presidential term records",
    "https://www.archives.gov/presidential-records/research/additional-research-resources",
  ],
  "current-president": [
    "White House · Current president (identity only)",
    "https://www.whitehouse.gov/administration/donald-j-trump/",
  ],
  "inauguration-2025": [
    "Congress · 2025 inauguration",
    "https://www.inaugural.senate.gov/60th-inaugural-ceremonies/",
  ],
};
for (const p of presidents)
  presidencySources["bio-" + p.personId] = [
    "University of Virginia · " + p.name,
    p.source,
  ];
export const presidencyConcepts = presidents.map((p, i) => ({
  id: "presidency-" + p.number,
  topic: "presidents",
  year: Number(p.start.slice(0, 4)),
  date: p.start + " — " + (p.end ?? "present · verified 5 Sep 2026"),
  title: p.name,
  label: "#" + p.number + " · " + p.name,
  summary: p.context,
  why: presidencyExplanations[p.number][0],
  detail:
    (p.number === 22 || p.number === 24 || p.number === 45 || p.number === 47
      ? "This person appears twice in the chronology because the presidencies were nonconsecutive. "
      : "") +
    "Dates mark the period in office, which can differ from the date of a public inauguration ceremony. The selected context introduces one aspect of a presidency, not a complete evaluation.",
  diagram: [
    ["Entry", p.start],
    ["Officeholder", p.name],
    ["End", p.end ?? "Still serving as of 5 September 2026"],
  ],
  diagramNote:
    "A chronological reference, with dates in year-month-day order. No ratings or rankings.",
  sources: [
    "bio-" + p.personId,
    ...(p.number <= 30 ? ["presidential-terms"] : []),
    ...(p.number === 47 ? ["current-president", "inauguration-2025"] : []),
  ],
  related: [
    [presidencyExplanations[p.number][1], presidencyExplanations[p.number][2]],
    ...(i
      ? [["presidency-" + presidents[i - 1].number, "Who came before?"]]
      : [["precedent", "How did the office begin?"]]),
    ...(i < presidents.length - 1
      ? [["presidency-" + presidents[i + 1].number, "Who came next?"]]
      : [["term-limits", "How do election limits work?"]]),
  ].filter(
    ([id], i, items) => items.findIndex(([other]) => other === id) === i,
  ),
}));
export function validatePresidents() {
  if (
    presidents.length !== 47 ||
    new Set(presidents.map((p) => p.personId)).size !== 45
  )
    throw Error("Presidential completeness");
  for (let i = 0; i < 47; i++) {
    const p = presidents[i];
    if (
      p.number !== i + 1 ||
      !p.context ||
      !p.source ||
      !p.start ||
      (i < 46 && p.end !== presidents[i + 1].start)
    )
      throw Error("Chronology boundary " + p.number);
  }
  if (presidents[46].end !== null || presidents[46].personId !== "trump")
    throw Error("Current term");
  return true;
}
export const presidencyPrompts = presidents.map((p) => {
  const surname = p.name.split(" ").at(-1),
    uniquePeople = new Set(
      presidents
        .filter((x) => x.name.split(" ").at(-1) === surname)
        .map((x) => x.personId),
    );
  return {
    id: "presidency-" + p.number + "-recall",
    concept: "presidency-" + p.number,
    family: "officeholder-recall",
    method: "recall",
    question: `Who began US presidency number ${p.number} on ${p.start}?`,
    accepted: [p.name, ...(uniquePeople.size === 1 ? [surname] : [])],
    options: [p.name],
    answer: 0,
    explanation: `${p.name} began presidency number ${p.number} on ${p.start}. ${p.context}`,
    hint: p.name[0] + "… (first initial)",
  };
});
