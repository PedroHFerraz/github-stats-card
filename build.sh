#!/usr/bin/env bash
#
# build.sh — monta "A Biblioteca de Patrick Jane" em PDF, EPUB e HTML.
#
# Estratégia de ferramentas (tenta a melhor, cai para o fallback):
#   - HTML  : pandoc (standalone, com sumário e CSS de impressão)
#   - PDF   : weasyprint (usa @page do CSS: numeração de páginas e sumário com
#             números) → fallback: chromium headless --print-to-pdf
#   - EPUB  : pandoc (com capa e sumário navegável)
#
# Se o pandoc não estiver instalado, o script tenta instalá-lo (apt/pip);
# se tudo falhar, ao menos o HTML paginado é gerado como entregável.

set -euo pipefail
cd "$(dirname "$0")"

OUT="dist"
BASE="biblioteca-patrick-jane"
TITLE="A Biblioteca de Patrick Jane"
SUBTITLE="O manual de todas as coisas que ele leu antes de te ler"
mkdir -p "$OUT"

# Capítulos na ordem do livro (o outline 00 não entra no volume final).
SRC=(
  livro/01-prologo.md
  livro/02-leitura-fria.md
  livro/03-corpo-fala.md
  livro/04-influencia.md
  livro/05-memoria.md
  livro/06-trapaca.md
  livro/07-cetico.md
  livro/08-mente-criminosa.md
  livro/09-deducao.md
  livro/10-luto-vinganca.md
  livro/11-epilogo.md
  livro/90-apendice-bibliografia.md
  livro/91-apendice-exercicios.md
  livro/92-apendice-etica.md
)

echo ">> Verificando ferramentas..."
if ! command -v pandoc >/dev/null 2>&1; then
  echo "   pandoc ausente; tentando instalar..."
  (apt-get install -y --no-install-recommends pandoc >/dev/null 2>&1) || true
fi
command -v pandoc >/dev/null 2>&1 || { echo "ERRO: pandoc indisponível e não pôde ser instalado."; exit 1; }

# ---------------------------------------------------------------------------
# CSS de impressão (usado no HTML e no PDF via weasyprint).
# ---------------------------------------------------------------------------
cat > "$OUT/style.css" <<'CSS'
@page {
  size: A5;
  margin: 2cm 1.8cm 2.2cm 1.8cm;
  @bottom-center { content: counter(page); font-family: Georgia, serif; font-size: 9pt; color: #555; }
}
@page :first { @bottom-center { content: none; } }

html { font-size: 11pt; }
body {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.5; text-align: justify; hyphens: auto;
  color: #1a1a1a; max-width: 40em; margin: 0 auto; padding: 1em;
}

/* Capa (bloco de título do pandoc) */
header#title-block-header {
  break-after: page; text-align: center; padding-top: 30%;
}
header#title-block-header h1.title {
  font-size: 2.2em; line-height: 1.15; border: none; margin-bottom: .6em;
}
header#title-block-header p.subtitle {
  font-size: 1.1em; font-style: italic; color: #444; font-weight: normal;
}

/* Sumário */
nav#TOC { break-after: page; }
nav#TOC::before {
  content: "Sumário"; display: block;
  font-size: 1.6em; font-weight: bold; margin-bottom: 1em; text-align: left;
}
nav#TOC ul { list-style: none; padding-left: 0; }
nav#TOC li { margin: .35em 0; }
nav#TOC a { text-decoration: none; color: #1a1a1a; }
nav#TOC a::after { content: leader('.') target-counter(attr(href), page); color: #555; }

/* Títulos */
h1 { break-before: page; font-size: 1.7em; line-height: 1.2; margin: 0 0 .8em; }
h2 { font-size: 1.25em; margin: 1.6em 0 .5em; }
h3 { font-size: 1.05em; font-style: italic; margin: 1.3em 0 .4em; }
h1, h2, h3 { text-align: left; break-after: avoid; hyphens: none; }
p { margin: 0 0 .7em; orphans: 2; widows: 2; }

/* Tabelas da bibliografia */
table { width: 100%; border-collapse: collapse; font-size: .78em; margin: 1em 0; break-inside: avoid; }
th, td { border: 1px solid #bbb; padding: .35em .5em; text-align: left; vertical-align: top; hyphens: none; }
th { background: #f0f0f0; }

hr { border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }
em { font-style: italic; }
strong { font-weight: bold; }
CSS

# ---------------------------------------------------------------------------
# Capa simples em PNG para o EPUB (Pillow, que vem com o weasyprint).
# ---------------------------------------------------------------------------
COVER="$OUT/cover.png"
python3 - "$COVER" "$TITLE" "$SUBTITLE" <<'PY' || echo "   (capa PNG opcional não gerada)"
import sys
try:
    from PIL import Image, ImageDraw, ImageFont
except Exception:
    sys.exit(0)
path, title, subtitle = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 1200, 1800
img = Image.new("RGB", (W, H), "#141821")
d = ImageDraw.Draw(img)
def font(sz):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"]:
        try: return ImageFont.truetype(p, sz)
        except Exception: pass
    return ImageFont.load_default()
def wrap(text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=fnt) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines
d.rectangle([60, 60, W-60, H-60], outline="#c9a24b", width=4)
y = 420
for ln in wrap(title, font(96), W-260):
    d.text((W/2, y), ln, font=font(96), fill="#f4f4f4", anchor="mm"); y += 130
y += 40
for ln in wrap(subtitle, font(44), W-320):
    d.text((W/2, y), ln, font=font(44), fill="#c9a24b", anchor="mm"); y += 66
d.text((W/2, H-200), "Uma biblioteca em português", font=font(38), fill="#9aa0aa", anchor="mm")
img.save(path)
print("   capa:", path)
PY

# ---------------------------------------------------------------------------
# 1) HTML (entregável e base para o PDF)
# ---------------------------------------------------------------------------
echo ">> Gerando HTML..."
pandoc "${SRC[@]}" \
  --standalone --toc --toc-depth=1 \
  --metadata title="$TITLE" \
  --metadata subtitle="$SUBTITLE" \
  --metadata lang="pt-BR" \
  -c style.css \
  -o "$OUT/$BASE.html"
echo "   dist/$BASE.html"

# ---------------------------------------------------------------------------
# 2) PDF (weasyprint -> chromium fallback)
# ---------------------------------------------------------------------------
echo ">> Gerando PDF..."
if python3 -c "import weasyprint" 2>/dev/null; then
  ( cd "$OUT" && python3 -c "from weasyprint import HTML; HTML('$BASE.html').write_pdf('$BASE.pdf')" )
  echo "   dist/$BASE.pdf (weasyprint, com sumário e numeração)"
else
  CHROME="$(command -v chromium chromium-browser google-chrome 2>/dev/null | head -1 || true)"
  [ -z "$CHROME" ] && for c in /opt/pw-browsers/chromium*/chrome-linux/chrome /opt/pw-browsers/chromium; do [ -x "$c" ] && CHROME="$c" && break; done
  if [ -n "$CHROME" ]; then
    "$CHROME" --headless --no-sandbox --disable-gpu \
      --print-to-pdf="$OUT/$BASE.pdf" "$OUT/$BASE.html" >/dev/null 2>&1
    echo "   dist/$BASE.pdf (chromium; sem numeração de páginas)"
  else
    echo "   AVISO: nenhum motor de PDF disponível; ficou só o HTML."
  fi
fi

# ---------------------------------------------------------------------------
# 3) EPUB
# ---------------------------------------------------------------------------
echo ">> Gerando EPUB..."
EPUB_ARGS=()
[ -f "$COVER" ] && EPUB_ARGS+=(--epub-cover-image="$COVER")
pandoc "${SRC[@]}" \
  --toc --toc-depth=1 \
  --metadata title="$TITLE" \
  --metadata subtitle="$SUBTITLE" \
  --metadata lang="pt-BR" \
  "${EPUB_ARGS[@]}" \
  -o "$OUT/$BASE.epub"
echo "   dist/$BASE.epub"

echo ">> Concluído. Arquivos em ./$OUT/"
ls -lh "$OUT" | awk 'NR>1 {printf "   %-34s %s\n", $9, $5}'
