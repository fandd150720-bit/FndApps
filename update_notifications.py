import os
import glob

for js_file in glob.glob('js/*.js'):
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We only want to replace instances that look like calls, i.e. 'window.saveData();'
    new_content = content.replace('window.saveData();', "window.saveData(); if(window.showNotification) window.showNotification('Input berhasil disimpan');")
    
    if new_content != content:
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {js_file}")
