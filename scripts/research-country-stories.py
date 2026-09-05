import requests,json
url='https://data.unesco.org/api/explore/v2.1/catalog/datasets/whc001/exports/json'
fields='id_no,name_en,short_description_en,description_en,justification_en,iso_codes,category,states_names'
r=requests.get(url,params={'select':fields},timeout=120);r.raise_for_status();rows=r.json();json.dump(rows,open('output/research/country-stories/unesco-records.json','w'),ensure_ascii=False)
print(len(rows),'UNESCO source records saved.');print(rows[0].keys())
