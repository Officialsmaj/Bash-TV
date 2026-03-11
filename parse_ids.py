import re
from pathlib import Path
text=Path('bashtv.html').read_text(encoding='utf-8', errors='ignore')
ids=sorted({match for match in re.findall(r'videoId":"([^"]+)', text)})
for vid in ids:
    print(vid)
print('total', len(ids))
