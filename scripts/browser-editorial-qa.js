async (page) => {
 const context=await page.context().browser().newContext({serviceWorkers:'block',viewport:{width:1440,height:1000}});
 const p=await context.newPage(), errors=[], failures=[];
 p.on('pageerror', e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/'); await p.waitForSelector('.area-grid');
 const countries=await p.evaluate(async()=> (await import('/src/geography.js')).geographyConcepts);
 for(const c of countries){
  await p.goto('http://127.0.0.1:4173/#/concept/'+c.id);
  await p.waitForSelector('h1');
  if(await p.locator('h1').innerText() !== c.hook) failures.push(c.id+' hook');
  if(!(await p.locator('article').innerText()).includes(c.why)) failures.push(c.id+' explanation');
  if(!(await p.locator(`a[href="#/concept/${c.related[0][0]}"]`).count())) failures.push(c.id+' onward');
  if(!(await p.locator('details summary').allTextContents()).includes('Map location, coordinates & scope')) failures.push(c.id+' supporting details');
 }
 const others=await p.evaluate(async()=> (await import('/src/content.js')).concepts.filter(c=>!c.id.startsWith('country-')));
 for(const c of others){
  await p.goto('http://127.0.0.1:4173/#/concept/'+c.id);
  const body=await p.locator('main').innerText();
  if(!body.includes(c.why)) failures.push(c.id+' explanation');
  for(const [id,label] of c.related) if(!(await p.locator(`a[href="#/concept/${id}"]`).allTextContents()).some(t=>t.includes(label))) failures.push(c.id+' connection '+id);
 }
 const samples=['afg','bwa','bra','mco','sgp','tuv','kir','chn','isl','chl','lso','arm'];
 for(const width of [1440,390,320]){
  await p.setViewportSize({width,height:1000});
  for(const code of samples){
   for(const route of ['#/topic/world-atlas?select=country-'+code,'#/concept/country-'+code]){
    await p.goto('http://127.0.0.1:4173/'+route);
    const result=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,duplicate:[...document.querySelectorAll('[id]')].map(n=>n.id).filter((v,i,a)=>a.indexOf(v)!==i)}));
    if(result.overflow||result.duplicate.length) failures.push({width,route,...result});
   }
  }
 }
 await p.setViewportSize({width:1440,height:1000});
 await p.goto('http://127.0.0.1:4173/#/topic/world-atlas?select=country-afg');
 if(!(await p.locator('h3').allTextContents()).includes(countries.find(c=>c.id==='country-afg').hook)) failures.push('Map focus hook');
 await p.screenshot({path:'output/playwright/editorial-geography-desktop.png',fullPage:false});
 await p.goto('http://127.0.0.1:4173/#/concept/country-afg');
 await p.screenshot({path:'output/playwright/editorial-afghanistan-desktop.png',fullPage:true});
 await p.locator('article a[href="#/concept/country-hrv"]').click();
 if(!(await p.locator('h1').innerText()).includes('Water')) failures.push('Afghanistan to Croatia link');
 await p.setViewportSize({width:390,height:844});
 await p.goto('http://127.0.0.1:4173/#/concept/country-mco');
 await p.screenshot({path:'output/playwright/editorial-monaco-mobile.png',fullPage:true});
 await p.goto('http://127.0.0.1:4173/#/concept/country-afg');
 await p.screenshot({path:'output/playwright/editorial-afghanistan-mobile.png',fullPage:true});
 for(const width of [1440,390,320]) {
  await p.setViewportSize({width,height:1000});
  for(const route of ['#/topic/presidents?select=presidency-41','#/concept/presidency-23','#/concept/moon-europa','#/concept/planet-mercury','#/concept/credit-report']) {
   await p.goto('http://127.0.0.1:4173/'+route);
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)) failures.push({width,route,overflow:true});
  }
 }
 await p.setViewportSize({width:1440,height:1000});
 await p.goto('http://127.0.0.1:4173/#/topic/presidents?select=presidency-41');
 await p.screenshot({path:'output/playwright/editorial-presidents-desktop.png',fullPage:false});
 await p.setViewportSize({width:390,height:844});
 await p.goto('http://127.0.0.1:4173/#/concept/moon-europa');
 await p.screenshot({path:'output/playwright/editorial-europa-mobile.png',fullPage:true});
 await context.close();
 return {countries:countries.length,otherConcepts:others.length,sampleRoutes:samples.length*2*3+15,failures,errors};
}
