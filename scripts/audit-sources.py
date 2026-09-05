import json,requests,concurrent.futures
links=json.load(open('/tmp/atlas-source-links.json'))
def check(item):
 key,(title,url)=item
 try:
  r=requests.get(url,timeout=25,headers={'User-Agent':'Mozilla/5.0'})
  return {'id':key,'url':url,'finalUrl':r.url,'status':r.status_code}
 except Exception as e:return {'id':key,'url':url,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: results=list(ex.map(check,links.items()))
json.dump(results,open('output/research/source-link-audit.json','w'),indent=2)
print(json.dumps([r for r in results if r.get('status')!=200],indent=2));print('Total checked',len(results))
