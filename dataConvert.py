import pandas as pd

# Load the Excel file
excel_file = 'data/GDPdata.xlsx'
df = pd.read_excel(excel_file)

# Save the data to a JSON file
df.to_json('data/GDPdata.json', orient='values')
