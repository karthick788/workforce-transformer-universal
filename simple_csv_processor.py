import pandas as pd
import json
from pathlib import Path

def process_csv_files():
    """Process all CSV files in the frontend directory and save as JSON."""
    frontend = Path('frontend')
    output_file = frontend / 'workforce_data.json'
    
    result = {'files': {}}
    
    for csv_file in frontend.glob('*.csv'):
        print(f"Processing {csv_file.name}...")
        try:
            # Try reading with different encodings and delimiters
            df = pd.read_csv(csv_file, encoding='latin1')
            if len(df.columns) == 1:  # Try different delimiter if only one column
                df = pd.read_csv(csv_file, sep=';', encoding='latin1')
            
            # Clean column names
            df.columns = [str(col).strip().lower().replace(' ', '_') for col in df.columns]
            
            # Store data
            result['files'][csv_file.stem] = df.to_dict(orient='records')
            print(f"  - Success: {len(df)} rows")
            
        except Exception as e:
            print(f"  - Error: {str(e)}")
    
    # Save results
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
    
    print(f"\nProcessing complete. Results saved to {output_file}")

if __name__ == "__main__":
    process_csv_files()
