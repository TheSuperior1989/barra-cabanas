#!/usr/bin/env python3
"""
Script to remove Quote Settings and Email Settings buttons from QuoteManagement.tsx
"""

import re

def remove_buttons():
    file_path = "src/components/QuoteManagement.tsx"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the Quote Settings button block
    quote_settings_pattern = r'<button[^>]*onClick=\{\(\) => setShowSettings\(true\)\}[^>]*>.*?</button>'
    content = re.sub(quote_settings_pattern, '', content, flags=re.DOTALL)
    
    # Remove the Email Settings button block  
    email_settings_pattern = r'<button[^>]*onClick=\{\(\) => setShowEmailSettings\(true\)\}[^>]*>.*?</button>'
    content = re.sub(email_settings_pattern, '', content, flags=re.DOTALL)
    
    # Also remove any standalone lines that might be left
    lines = content.split('\n')
    filtered_lines = []
    
    for line in lines:
        # Skip lines that contain the button text or onClick handlers
        if ('Quote Settings' in line or 
            'Email Settings' in line or 
            'setShowSettings(true)' in line or 
            'setShowEmailSettings(true)' in line):
            continue
        filtered_lines.append(line)
    
    # Join the lines back
    content = '\n'.join(filtered_lines)
    
    # Write the file back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Buttons removed successfully!")

if __name__ == "__main__":
    remove_buttons()
