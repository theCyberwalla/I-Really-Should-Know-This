import requests,re,json,html,concurrent.futures,pathlib
root=pathlib.Path('output/research');root.mkdir(exist_ok=True,parents=True)
url='https://millercenter.org/president'
r=requests.get(url,timeout=30);r.raise_for_status()
slugs=list(dict.fromkeys(re.findall(r'href="/president/([a-z-]+)"',r.text)))
slugs=[s for s in slugs if s not in ['presidential-speeches']]
def fetch(slug):
 u=url+'/'+slug
 try:
  r=requests.get(u,timeout=30);r.raise_for_status();raw=r.text
  body=re.search(r'<main\b.*?</main>',raw,re.S);body=body.group() if body else raw
  body=re.sub(r'<(script|style)\b.*?</\1>','',body,flags=re.S)
  text=html.unescape(re.sub('<[^>]+>',' ',body));text=re.sub(r'\s+',' ',text).strip()
  return {'slug':slug,'url':u,'text':text}
 except Exception as e:return {'slug':slug,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: rows=list(pool.map(fetch,slugs))
(root/'presidents-sources.json').write_text(json.dumps(rows,indent=2))
for row in rows:print(row['slug'],row.get('error',''),row.get('text','')[:1800])
