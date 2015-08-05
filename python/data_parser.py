import csv
import json

INCLUDE_GLOBAL_DATA = True
csvfile = open(r'2011_all_data.csv', 'r')
reader = csv.DictReader(csvfile)
YEAR = "2011"
next(reader, None) #skip the header
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

for row in reader:
  data[row['NAME']] = {}
  data[row['NAME']][YEAR] = {}
  data[row['NAME']][YEAR]['employment_data'] = []
  data[row['NAME']][YEAR]['buffered_employment_data'] = []
  data[row['NAME']][YEAR]['private_amenities'] = []
  data[row['NAME']][YEAR]['public_amenities'] = []
  data[row['NAME']][YEAR]['context_tool_scores'] = []
  data[row['NAME']][YEAR]['employment_breakdown'] = []
  #EMPLOYMENT DATA
  for field in [ "<$15000", "$15000-$34999","$35000-$49999", "$50000-$74999", "$75000-$99999", "$100000+"]:
    try:
      data[row['NAME']][YEAR]['employment_data'].append(int(float(row[field].replace('%',''))))
    except:
      data[row['NAME']][YEAR]['employment_data'].append(0)
  #BUFFERED EMPLOYMENT DATA
  for field in ["NAME", "1mile<$15000", "1mile$15000-$34999","1mile$35000-$49999", "1mile$50000-$74999", "1mile$75000-$99999", "1mile$100000+"]:
    try:
      data[row['NAME']][YEAR]['buffered_employment_data'].append(int(float(row[field].replace('%',''))))
    except:
      data[row['NAME']][YEAR]['buffered_employment_data'].append(0)
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
  for field in ['total_pop', 'avg_HH_size', 'med_HH_income', 'med_age', 'pct_home_ownership', 'people_per_acre', 'du_per_acre', 'total_biz_acre', 'total_num_employees', 'market_value', 'net_acreage', 'total_du', 'total_biz', 'gross_acreage', 'total_pop 1-mile', 'avg_HH_size 1-mile', 'med_HH_income 1-mile', 'med_age 1-mile', 'pct_home_ownership 1-mile', 'people_per_acre 1-mile', 'du_per_acre 1-mile', 'total_biz_acre 1-mile', 'total_num_employees 1-mile', 'market_value 1-mile', 'net_acreage 1-mile', 'total_du 1-mile', 'total_biz 1-mile']:
    if '$' in row[field]:
      value =row[field]
      value = value.replace(' ', '').replace('$','').replace(',','')
      value = float(value)
      data[row['NAME']][YEAR][field] = value
      continue
    if '%' in row[field]:
      value =row[field]
      value = value.replace(' ', '').replace('%','')
      value = float(value)
      data[row['NAME']][YEAR][field] = value
      continue
    if ',' in row[field]:
      value = row[field].replace(',','')
      data[row['NAME']][YEAR][field] = float(value)
      continue
    else:
      try:
        data[row['NAME']][YEAR][field] = float(row[field])
      except:
        data[row['NAME']][YEAR][field] = row[field]
  for field in ['Parks Access', 'Transit Access', 'Bike route density', 'People per acre', 'Sidewalk density', 'Private amenities', 'Block Size', 'Composite Score']:
     data[row['NAME']][YEAR]['context_tool_scores'].append(float(row[field]))
  for field in ['retail', 'service', 'other']:
     try:
      data[row['NAME']][YEAR]['employment_breakdown'].append(float(row[field]))
     except:
      data[row['NAME']][YEAR]['employment_breakdown'].append(0)

#print json.dumps(data, indent=4, sort_keys=True)

csvfile.close()