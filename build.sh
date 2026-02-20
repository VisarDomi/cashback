#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist

# --- Generate doc list HTML from docs/*.md ---
doc_links=""
for md_file in docs/*.md; do
  name=$(basename "$md_file" .md)
  doc_links="${doc_links}<a href=\"/${name}\">${name}.md</a>"
done
doc_list_html="<div id=\"doc-nav\" class=\"doc-list\">${doc_links}</div>"

# --- Build slideshow (index.html) with injected doc list ---
sed "s|<!-- DOCS_LIST -->|${doc_list_html}|" slideshow.html > dist/index.html
echo "Built index.html (slideshow with $(echo docs/*.md | wc -w) doc links)"

# --- Build each .md as a standalone HTML page ---
for md_file in docs/*.md; do
  name=$(basename "$md_file" .md)
  display=$(echo "$name" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
  content=$(cat "$md_file")

  cat > "dist/${name}.html" << 'TEMPLATE_START'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TITLE_PLACEHOLDER</title>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#0a0a0f;--surface:#12121a;--border:#2a2a3a;--text:#e0e0ec;--text-dim:#8888a0;--accent:#6366f1;--accent-light:#818cf8;--green:#22c55e;--red:#ef4444;--orange:#f59e0b;--blue:#3b82f6}
  body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
  .back{display:inline-block;margin:24px 32px;color:var(--text-dim);text-decoration:none;font-size:13px;font-weight:500;padding:6px 14px;border-radius:6px;border:1px solid var(--border);transition:all .15s}
  .back:hover{color:var(--accent-light);border-color:var(--accent);background:rgba(99,102,241,.08)}
  .content{max-width:860px;margin:0 auto;padding:0 32px 120px}
  .markdown h1{font-size:36px;font-weight:800;letter-spacing:-1px;margin:48px 0 16px;color:#f0f0fa;border-bottom:1px solid var(--border);padding-bottom:12px}
  .markdown h1:first-child{margin-top:0}
  .markdown h2{font-size:26px;font-weight:700;letter-spacing:-.5px;margin:40px 0 12px;color:#e0e0f0}
  .markdown h3{font-size:19px;font-weight:600;margin:28px 0 8px;color:var(--accent-light)}
  .markdown h4{font-size:16px;font-weight:600;margin:24px 0 8px;color:var(--text)}
  .markdown p{font-size:16px;line-height:1.75;margin:12px 0;color:var(--text)}
  .markdown ul,.markdown ol{margin:12px 0;padding-left:24px}
  .markdown li{font-size:16px;line-height:1.7;margin:6px 0;color:var(--text)}
  .markdown li::marker{color:var(--accent)}
  .markdown strong{color:#f0f0fa;font-weight:600}
  .markdown a{color:var(--accent-light);text-decoration:none;border-bottom:1px solid transparent;transition:border-color .15s}
  .markdown a:hover{border-bottom-color:var(--accent-light)}
  .markdown code{font-family:'JetBrains Mono','SF Mono',Consolas,monospace;font-size:14px;background:rgba(255,255,255,.06);padding:2px 7px;border-radius:4px;color:var(--accent-light)}
  .markdown pre{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:20px;margin:16px 0;overflow-x:auto}
  .markdown pre code{background:none;padding:0;font-size:14px;line-height:1.6;color:var(--text-dim)}
  .markdown blockquote{border-left:3px solid var(--accent);padding:8px 20px;margin:16px 0;background:rgba(99,102,241,.05);border-radius:0 8px 8px 0}
  .markdown blockquote p{color:var(--text-dim)}
  .markdown hr{border:none;border-top:1px solid var(--border);margin:32px 0}
  .markdown table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
  .markdown th{text-align:left;padding:10px 14px;background:var(--surface);color:var(--accent-light);font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid var(--border)}
  .markdown td{padding:10px 14px;border-bottom:1px solid var(--border);color:var(--text)}
  .markdown tr:last-child td{border-bottom:none}
  .markdown img{max-width:100%;border-radius:8px}
</style>
</head>
<body>
<a href="/" class="back">&larr; Back to slideshow</a>
<div class="content">
  <div id="output" class="markdown"></div>
</div>
<script id="md-source" type="text/markdown">
TEMPLATE_START

  # Escape content for safe embedding
  escaped_content=$(echo "$content" | sed 's|</script>|<\\/script>|g')
  echo "$escaped_content" >> "dist/${name}.html"

  cat >> "dist/${name}.html" << TEMPLATE_END
</script>
<script>
  var md = document.getElementById('md-source').textContent;
  document.getElementById('output').innerHTML = marked.parse(md);
</script>
</body>
</html>
TEMPLATE_END

  # Fix the title
  sed -i "s/TITLE_PLACEHOLDER/${display}/" "dist/${name}.html"
  echo "Built ${name}.html"
done

echo "Done: $(ls dist/)"
