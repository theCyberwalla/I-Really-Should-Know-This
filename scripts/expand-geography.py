import json,math
old=json.loads(open('src/data/world.js').read().split('export const countries=')[1].strip().removesuffix(';'));authored={c['code']:c['description'] for c in old}
fs=json.load(open('/tmp/atlas-world50.geojson'))['features'];exclude={'TWN','SOL','CYN','PSX','VAT','JEY','GGY','IMN','ABW','CUW','ALD','GRL','MAC','HKG','SXM'}
memberfs=[f for f in fs if (f['properties']['TYPE'] in ['Sovereign country','Country','Sovereignty'] or f['properties']['ADM0_A3']=='ISR') and f['properties']['ADM0_A3'] not in exclude]
assert len(memberfs)==193
# Explicit reviewed membership IDs, separate from cartographic classification.
json.dump(sorted(f['properties']['ADM0_A3'] for f in memberfs),open('src/data/un-members.json','w'),indent=2)
def area(r):return abs(sum(r[i][0]*r[i-1][1]-r[i-1][0]*r[i][1] for i in range(len(r)))/2)
def simplify(points,epsilon=.045):
 if len(points)<4:return points
 a,b=points[0],points[-1]; dx,dy=b[0]-a[0],b[1]-a[1]; denom=dx*dx+dy*dy
 ds=[]
 for x,y,*_ in points[1:-1]:
  t=max(0,min(1,((x-a[0])*dx+(y-a[1])*dy)/denom)) if denom else 0
  ds.append((x-a[0]-t*dx)**2+(y-a[1]-t*dy)**2)
 d=max(ds); i=ds.index(d)+1
 return simplify(points[:i+1],epsilon)[:-1]+simplify(points[i:],epsilon) if d>epsilon**2 else [a,b]
shapes=[];countries=[]
for f in fs:
 p=f['properties'];code=p['ADM0_A3'];g=f['geometry'];polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]; paths=[]
 for poly in polys:
  for ring in poly:
   pts=simplify(ring)
   if len(pts)<4:pts=ring
   xy=[(round((x+180)*2,2),round((90-y)*2,2)) for x,y,*_ in pts]
   paths.append('M'+'L'.join(f'{x},{y}' for x,y in xy)+'Z')
 shapes.append(dict(code=code,path=''.join(paths)))
 if f not in memberfs:continue
 lon,lat=round(p['LABEL_X'],1),round(p['LABEL_Y'],1);region=p['SUBREGION'];name={'TUR':'Türkiye','CIV':'Côte d’Ivoire','TLS':'Timor-Leste','SWZ':'Eswatini','USA':'United States','KOR':'South Korea','PRK':'North Korea','COG':'Republic of the Congo','COD':'Democratic Republic of the Congo','FSM':'Micronesia (Federated States of)'}.get(code,p['NAME_EN'])
 main=max([area(poly[0]) for poly in polys]);tiny=main<.6
 desc=authored.get(code,f'{name} is grouped in {region}. Its map label sits near {abs(lat)}° {"south" if lat<0 else "north"} and {abs(lon)}° {"west" if lon<0 else "east"}.')
 countries.append(dict(code=code,id='country-'+code.lower(),name=name,region=region,continent=p['REGION_UN'],lon=lon,lat=lat,description=desc,tiny=tiny,iso=p['ISO_A3_EH'],aliases=p['ADMIN']+' '+(p['NAME_ALT'] or ''),locator='The locator represents the principal mapped land area, not necessarily the full extent of the country or its overseas territories.'))
countries.sort(key=lambda c:c['name'])
open('src/data/world.js','w').write('// Natural Earth 1:50m, public domain; simplified at 0.045 degrees. Retrieved 2026-09-05.\nexport const shapes='+json.dumps(shapes,separators=(',',':'))+';\nexport const countries='+json.dumps(countries,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(countries),'UN members;',len(shapes),'context features;',sum(c['tiny'] for c in countries),'small-country locator alternatives')
