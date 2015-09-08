import csv, json, sys

INCLUDE_GLOBAL_DATA = True

data = {}

if INCLUDE_GLOBAL_DATA:
  data['amenities'] = {}
  data['amenities']['private'] = ["Bakery",
			  "Bar",
			  "Bike Shop",
			  "Bookstore",
			  "Brewpub",
			  "Child Care",
			  "Cinema",
			  "Clothing Store",
			  "Coffee Shop",
			  "Department Store",
			  "Dry Cleaners",
			  "Fitness Gym",
			  "Grocery Store",
			  "Music Store",
			  "Restaurant",
			  "Specialty Snacks & Beverages"
		  ]

  data["town_center_averages"] = {"2011":{
        "total_pop": 2326,
        "avg_HH_size": 2.42,
        "med_HH_income": 60133,
        "med_age": 36.0,
        "pct_home_ownership": 47.4,
        "people_per_acre": 20.1,
        "du_per_acre": 5.0,
        "total_biz_acre": 0.72,
        "total_num_employees": 1745,
        "market_value": 39,
        "net_acreage": 222,
        "total_du": 1073,
        "total_biz": 120
    },
                                  "2015":{
        "total_pop": 2326,
        "avg_HH_size": 2.42,
        "med_HH_income": 60133,
        "med_age": 36.0,
        "pct_home_ownership": 47.4,
        "people_per_acre": 20.1,
        "du_per_acre": 5.0,
        "total_biz_acre": 0.72,
        "total_num_employees": 1745,
        "market_value": 39,
        "net_acreage": 222,
        "total_du": 1073,
        "total_biz": 120
    }}

  data["regional_center_averages"] = {"2011":{
        "total_pop": 2326,
        "avg_HH_size": 2.42,
        "med_HH_income": 60133,
        "med_age": 36.0,
        "pct_home_ownership": 47.4,
        "people_per_acre": 20.1,
        "du_per_acre": 5.0,
        "total_biz_acre": 0.72,
        "total_num_employees": 1745,
        "market_value": 39,
        "net_acreage": 222,
        "total_du": 1073,
        "total_biz": 120
    },
                                  "2015":{
        "total_pop": 2326,
        "avg_HH_size": 2.42,
        "med_HH_income": 60133,
        "med_age": 36.0,
        "pct_home_ownership": 47.4,
        "people_per_acre": 20.1,
        "du_per_acre": 5.0,
        "total_biz_acre": 0.72,
        "total_num_employees": 1745,
        "market_value": 39,
        "net_acreage": 222,
        "total_du": 1073,
        "total_biz": 120
    }}

  data['data_years'] = [2011,2015]

  data['amenities']['public'] = [
			  "Community Center",
			  "Fire Station",
			  "Govt. Building",
			  "Library",
			  "School"
		  ]
  data ['income_breaks'] = [
		  "<$15,000",
		  "$15,000-$34,999",
		  "$35,000-$49,999",
		  "$50,000-$74,999",
		  "$75,000-$99,999",
		  "$100,000 +"
	  ]
  data['context_tool_labels'] = ["Parks Access", "Transit Access", "Bike route density", "People per acre", "Sidewalk density", "Private amenities", "Block size"]
 
def getDataInHere(row):
  global data
   #EMPLOYMENT DATA
  for field in [ "<$15000", "$15000-$34999","$35000-$49999", "$50000-$74999", "$75000-$99999", "$100000 +"]:
    try:
      val = str(row[field]).replace('%','')
      #print float(val)
      data[row['NAME']][YEAR]['incomes'].append(float(val))
    except:
      data[row['NAME']][YEAR]['incomes'].append(0)
  #BUFFERED EMPLOYMENT DATA
  for field in ["1 mile <$15000", "1 mile $15000-$34999","1 mile $35000-$49999", "1 mile $50000-$74999", "1 mile $75000-$99999", "1 mile $100000 +"]:
    try:
      data[row['NAME']][YEAR]['incomes_1mi_buff'].append(float(row[field].replace('%','')))
    except:
      data[row['NAME']][YEAR]['incomes_1mi_buff'].append(0)
   #PRIVATE AMENITIES
  for field in ['Bakery', 'Bar', 'Bike Shop', 'Bookstore', 'Brewpub', 'Child Care', 'Cinema', 'Clothing Store', 'Coffee Shop', 'Department Store', 'Dry Cleaners', 'Fitness Gym', 'Grocery Store', 'Music Store', 'Restaurant', 'Specialty Snacks & Beverages']:
     try:
      data[row['NAME']][YEAR]['private_amenities'].append(int(float(row[field].replace('%',''))))
     except:
      data[row['NAME']][YEAR]['private_amenities'].append(0)

  for field in ['Community Center', 'Fire Station', 'Govt. Building', 'Library', 'School']:
     try:
      data[row['NAME']][YEAR]['public_amenities'].append(int(float(row[field].replace('%',''))))
     except:
      data[row['NAME']][YEAR]['public_amenities'].append(0)
  for field in ['total_pop', 'avg_HH_size', 'med_HH_income', 'med_age', 'pct_home_ownership', 'people_per_acre', 'du_per_acre', 'total_biz_acre', 'total_num_employees', 'market_value', 'net_acreage', 'total_du', 'total_biz', 'gross_acreage']:
    if '$' in row[field]:
      value =row[field]
      value = value.replace(' ', '').replace('$','').replace(',','')
      value = float(value)
      data[row['NAME']][YEAR]['stats'][field] = value
      continue
    if '%' in row[field]:
      value =row[field]
      value = value.replace(' ', '').replace('%','')
      value = float(value)
      data[row['NAME']][YEAR]['stats'][field] = value
      continue
    if ',' in row[field]:
      value = row[field].replace(',','')
      data[row['NAME']][YEAR]['stats'][field] = float(value)
      continue
    else:
      try:
        data[row['NAME']][YEAR]['stats'][field] = float(row[field])
      except:
        data[row['NAME']][YEAR]['stats'][field] = row[field]

  for field in ['total_pop 1-mile', 'avg_HH_size 1-mile', 'med_HH_income 1-mile', 'med_age 1-mile', 'pct_home_ownership 1-mile', 'people_per_acre 1-mile', 'du_per_acre 1-mile', 'total_biz_acre 1-mile', 'total_num_employees 1-mile', 'market_value 1-mile', 'net_acreage 1-mile', 'total_du 1-mile', 'total_biz 1-mile']:

    fld = field.replace(' 1-mile','')

    if '$' in row[field]:
      value =row[field]
      value = value.replace(' ', '').replace('$','').replace(',','')
      value = float(value)
      data[row['NAME']][YEAR]['stats_1mi_buff'][fld] = value
      continue
    if '%' in row[field]:
      value =row[field]
      value = value.replace(' ', '').replace('%','')
      value = float(value)
      data[row['NAME']][YEAR]['stats_1mi_buff'][fld] = value
      continue
    if ',' in row[field]:
      value = row[field].replace(',','')
      data[row['NAME']][YEAR]['stats_1mi_buff'][fld] = float(value)
      continue
    else:
      try:
        data[row['NAME']][YEAR]['stats_1mi_buff'][fld] = float(row[field])
      except:
        data[row['NAME']][YEAR]['stats_1mi_buff'][fld] = row[field]

  for field in ['Parks Access', 'Transit Access', 'Bike route density', 'People per acre', 'Sidewalk density', 'Private amenities', 'Block Size', 'Composite Score']:
    try:
     data[row['NAME']][YEAR]['context_tool_scores'].append(float(row[field]))
    except:
     data[row['NAME']][YEAR]['context_tool_scores'].append(0)
  for field in ['retail', 'service', 'other']:
     try:
      data[row['NAME']][YEAR]['employment_breakdown'].append(float(row[field]))
     except:
      data[row['NAME']][YEAR]['employment_breakdown'].append(0)

#Do 2011

csvfile = open(r'2011_all_data.csv', 'rU')
reader = csv.DictReader(csvfile)
#next(reader, None) #skip the header

YEAR = "2011"

for row in reader:

  data[row['NAME']] = {}
  data[row['NAME']][YEAR] = {}

  try: 
    data[row['NAME']]['narrative'] = row['Narrative'].encode('ascii', 'ignore')
  except:
    data[row['NAME']]['narrative'] = row['NAME']

  data[row['NAME']]['title'] = row['NAME']
  data[row['NAME']]['type'] = row['TYPE']

  data[row['NAME']][YEAR]['incomes'] = []
  data[row['NAME']][YEAR]['incomes_1mi_buff'] = []
  data[row['NAME']][YEAR]['private_amenities'] = []
  data[row['NAME']][YEAR]['public_amenities'] = []
  data[row['NAME']][YEAR]['stats'] = {}
  data[row['NAME']][YEAR]['stats_1mi_buff'] = {}
  data[row['NAME']][YEAR]['context_tool_scores'] = []
  data[row['NAME']][YEAR]['employment_breakdown'] = []
 
  getDataInHere(row)

csvfile.close()

#print json.dumps(data, indent=4, sort_keys=True)

## Now do 2015
csvfile = open(r'2015_all_data.csv', 'rU')
reader = csv.DictReader(csvfile)
next(reader, None) #skip the header
YEAR = "2015"

for row in reader:
  try: 
    print row['extent']
    data[row['NAME']]['extent'] = eval("["+row['extent'].encode('ascii', 'ignore')+"]")

  except:
    data[row['NAME']]['extent'] = ""

  data[row['NAME']][YEAR] = {}
  data[row['NAME']][YEAR]['incomes'] = []
  data[row['NAME']][YEAR]['incomes_1mi_buff'] = []
  data[row['NAME']][YEAR]['private_amenities'] = []
  data[row['NAME']][YEAR]['public_amenities'] = []
  data[row['NAME']][YEAR]['context_tool_scores'] = []
  data[row['NAME']][YEAR]['stats'] = {}
  data[row['NAME']][YEAR]['stats_1mi_buff'] = {}
  data[row['NAME']][YEAR]['employment_breakdown'] = []

  getDataInHere(row)

#print json.dumps(data, indent=4, sort_keys=True)

csvfile.close()

newdata = {}

#massage objectproperty names (center names)
for k in data.keys():
   newdata[str(k).lower().replace(' ','_').replace('.','').replace('/','')] = data[k]

with open('../data/newdata.json', 'w') as f:
  f.write(json.dumps(newdata, indent=4, sort_keys=True))

print 'Complete'