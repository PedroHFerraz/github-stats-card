from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# ── Paleta ──
AZUL     = RGBColor(0x1a, 0x1f, 0x3c)
ACENTO   = RGBColor(0xe8, 0xa0, 0x20)
BRANCO   = RGBColor(0xff, 0xff, 0xff)
CINZA    = RGBColor(0x88, 0x92, 0xa4)
CARD     = RGBColor(0x28, 0x2f, 0x50)
AZUL_ESC = RGBColor(0x0d, 0x11, 0x20)
VERDE    = RGBColor(0x52, 0xb0, 0x7a)
AZUL_C   = RGBColor(0x6b, 0x8c, 0xce)
PRETO    = RGBColor(0x00, 0x00, 0x00)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

# ── helpers ──────────────────────────────────────────
def add_slide():
    return prs.slides.add_slide(BLANK)

def bg(slide, cor=AZUL):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = cor

def rect(slide, l, t, w, h, fill=None, line_color=None, line_pt=0):
    shp = slide.shapes.add_shape(1, l, t, w, h)
    shp.line.fill.background()
    if fill:
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
    else:
        shp.fill.background()
    if line_color and line_pt:
        shp.line.color.rgb = line_color
        shp.line.width     = Pt(line_pt)
    return shp

def txt(slide, text, l, t, w, h,
        size=14, bold=False, italic=False, cor=BRANCO,
        align=PP_ALIGN.LEFT, wrap=True):
    txb = slide.shapes.add_textbox(l, t, w, h)
    tf  = txb.text_frame
    tf.word_wrap = wrap
    p   = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size      = Pt(size)
    run.font.bold      = bold
    run.font.italic    = italic
    run.font.color.rgb = cor
    run.font.name      = "Calibri"
    return txb

def label(slide, text):
    txt(slide, text,
        Inches(.6), Inches(.35), Inches(11), Inches(.38),
        size=9, bold=True, cor=ACENTO)

def titulo(slide, text, t=Inches(.78), h=Inches(1.1)):
    txt(slide, text,
        Inches(.6), t, Inches(12.1), h,
        size=32, bold=True, cor=BRANCO)

def linha_ouro(slide, t=Inches(1.82)):
    rect(slide, Inches(.6), t, Inches(.9), Pt(5), fill=ACENTO)

def foto_placeholder(slide, caption, l, t, w, h, cor_bg=RGBColor(0x22,0x28,0x42)):
    """Retângulo estilizado no lugar de foto."""
    rect(slide, l, t, w, h, fill=cor_bg, line_color=ACENTO, line_pt=1.5)
    txt(slide, caption,
        l, t + h/2 - Inches(.25), w, Inches(.5),
        size=11, italic=True, cor=ACENTO, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════
# SLIDE 1 — CAPA
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s, AZUL_ESC)

# fundo gradiente simulado com faixas
for i in range(8):
    c_val = int(0x0d + i * 4)
    rect(s, Inches(0), Inches(i * 0.94), Inches(13.33), Inches(0.95),
         fill=RGBColor(c_val, c_val + 4, int(c_val * 1.5)))

# coluna direita decorativa
rect(s, Inches(8.5), Inches(0), Inches(4.83), Inches(7.5),
     fill=RGBColor(0x10, 0x14, 0x28))
rect(s, Inches(8.5), Inches(0), Pt(4), Inches(7.5), fill=ACENTO)

# ícone decorativo direito
txt(s, "📱\n🌐\n✦",
    Inches(9.8), Inches(1.5), Inches(3), Inches(4),
    size=60, cor=RGBColor(0x30,0x38,0x60), align=PP_ALIGN.CENTER)

# conteúdo esquerdo
rect(s, Inches(.6), Inches(1.3), Inches(1.0), Pt(5), fill=ACENTO)
label(s, "TRABALHO DE SOCIOLOGIA · 2026")
txt(s, "Influenciadores Digitais\ne Dominação Carismática",
    Inches(.6), Inches(1.4), Inches(7.6), Inches(2.3),
    size=40, bold=True, cor=BRANCO)
txt(s, "Como criadores de conteúdo exercem influência semelhante\nao conceito de liderança carismática de Max Weber",
    Inches(.6), Inches(3.9), Inches(7.5), Inches(1.0),
    size=14, italic=True, cor=RGBColor(0xbb, 0xbb, 0xcc))

rect(s, Inches(.6), Inches(6.0), Inches(7.5), Pt(2), fill=ACENTO)
txt(s, "Grupo: Ana Clara · Manuela · Maria Eduarda     |     Sociologia     |     10/06/2026",
    Inches(.6), Inches(6.1), Inches(7.5), Inches(.5),
    size=11, cor=RGBColor(0xaa, 0xaa, 0xbb))


# ══════════════════════════════════════════════════════
# SLIDE 2 — WEBER
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "CONTEXTO TEÓRICO")
titulo(s, "Quem foi Max Weber?")
linha_ouro(s)

# Placeholder foto Weber
foto_placeholder(s, "Max Weber (1864–1920)\nFonte: Wikimedia Commons",
                 Inches(.6), Inches(2.1), Inches(2.3), Inches(4.2),
                 cor_bg=RGBColor(0x20,0x26,0x40))
txt(s, "Max Weber\n(1864–1920)",
    Inches(.65), Inches(3.4), Inches(2.2), Inches(.8),
    size=13, bold=True, cor=ACENTO, align=PP_ALIGN.CENTER)

pontos = [
    "Sociólogo e economista alemão (1864–1920)",
    "Desenvolveu conceitos fundamentais: ação social,\ntipos ideais e racionalização",
    "Identificou 3 formas de dominação legítima:\nTradicional · Racional-Legal · Carismática",
    "Obras-chave: Economia e Sociedade (1922) e\nA Ética Protestante e o Espírito do Capitalismo (1905)",
    "O carisma, para Weber, é a crença dos seguidores\nnas qualidades extraordinárias do líder",
]
for i, p in enumerate(pontos):
    y = Inches(2.1) + i * Inches(0.92)
    rect(s, Inches(3.2), y + Inches(.15), Inches(.07), Inches(.5), fill=ACENTO)
    txt(s, p, Inches(3.45), y, Inches(9.6), Inches(.85), size=13, cor=BRANCO)


# ══════════════════════════════════════════════════════
# SLIDE 3 — 3 TIPOS DE DOMINAÇÃO
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "MAX WEBER · TEORIA DA DOMINAÇÃO")
titulo(s, "Os 3 Tipos de Dominação Legítima")
linha_ouro(s)

tipos = [
    ("Dominação\nTradicional",     AZUL_C,
     "Baseada nos costumes e hábitos históricos. A obediência se dá pela crença no caráter sagrado das tradições transmitidas de geração em geração.",
     "Ex.: monarquias, patriarcalismo, feudalismo"),
    ("Dominação\nRacional-Legal",  VERDE,
     "Baseada em leis, normas e regras formais. A obediência se dá ao cargo ou função, não à pessoa. Fundamento dos Estados modernos e burocracias.",
     "Ex.: governos democráticos, empresas, leis"),
    ("Dominação\nCarismática",     ACENTO,
     "Baseada nas qualidades excepcionais do líder. Os seguidores obedecem por admiração pessoal e crença nas capacidades extraordinárias do indivíduo.",
     "Ex.: líderes religiosos, políticos, influenciadores digitais"),
]

for i, (t_nome, cor, descr, exemplo) in enumerate(tipos):
    x = Inches(.5) + i * Inches(4.25)
    rect(s, x, Inches(2.1), Inches(4.0), Inches(4.8), fill=CARD)
    rect(s, x, Inches(2.1), Inches(4.0), Pt(6), fill=cor)
    txt(s, t_nome, x + Inches(.2), Inches(2.22), Inches(3.6), Inches(.8),
        size=16, bold=True, cor=cor)
    rect(s, x + Inches(.2), Inches(3.08), Inches(3.6), Pt(2), fill=cor)
    txt(s, descr, x + Inches(.2), Inches(3.15), Inches(3.6), Inches(2.4),
        size=12, cor=BRANCO)
    txt(s, exemplo, x + Inches(.2), Inches(5.6), Inches(3.6), Inches(.6),
        size=11, italic=True, cor=cor)

txt(s, "Fonte: WEBER, Max. Economia e Sociedade. UnB, 2000 · Redalyc (10758900010) · Brasilescola.uol.com.br",
    Inches(.5), Inches(7.1), Inches(12.3), Inches(.33), size=8, cor=CINZA)


# ══════════════════════════════════════════════════════
# SLIDE 4 — DOMINAÇÃO CARISMÁTICA (detalhe)
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "CONCEITO CENTRAL")
titulo(s, "O que é a Dominação Carismática?")
linha_ouro(s)

pilares = [
    ("Qualidade Extraordinária",
     "O carisma é uma crença dos seguidores de que o líder possui dons e poderes excepcionais que os demais não possuem."),
    ("Devoção Pessoal",
     "A relação entre líder e seguidor é altamente emocional e pessoal — movida por admiração, entusiasmo e identificação."),
    ("Missão e Vocação",
     "O líder apresenta uma visão de mundo ou estilo de vida que seus seguidores abraçam como própria identidade."),
    ("Instabilidade Estrutural",
     "O carisma depende da manutenção contínua da crença — se o líder decepciona, a dominação se dissolve."),
]

for i, (p_titulo, p_desc) in enumerate(pilares):
    col = i % 2
    row = i // 2
    x = Inches(.5) + col * Inches(6.4)
    y = Inches(2.1) + row * Inches(1.75)
    rect(s, x, y, Inches(6.1), Inches(1.58), fill=CARD)
    rect(s, x, y, Pt(6), Inches(1.58), fill=ACENTO)
    txt(s, p_titulo, x + Inches(.2), y + Inches(.12), Inches(5.7), Inches(.45),
        size=13, bold=True, cor=ACENTO)
    txt(s, p_desc, x + Inches(.2), y + Inches(.58), Inches(5.7), Inches(.9),
        size=12, cor=BRANCO)

# citação
rect(s, Inches(.5), Inches(5.75), Inches(12.3), Inches(1.1),
     fill=RGBColor(0x28, 0x20, 0x08))
rect(s, Inches(.5), Inches(5.75), Pt(6), Inches(1.1), fill=ACENTO)
txt(s,
    '"O carisma é uma qualidade extraordinária (...) de uma personalidade, em virtude da qual '
    'é considerado alguém dotado de forças ou características sobrenaturais, sobre-humanas, '
    'ou pelo menos especificamente excepcionais."\n— Max Weber, Economia e Sociedade',
    Inches(.75), Inches(5.82), Inches(11.9), Inches(1.0),
    size=11, italic=True, cor=BRANCO)


# ══════════════════════════════════════════════════════
# SLIDE 5 — O QUE SÃO INFLUENCIADORES
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "ERA DIGITAL")
titulo(s, "O que são Influenciadores Digitais?")
linha_ouro(s)

foto_placeholder(s, "Criador de conteúdo\nem plataformas digitais",
                 Inches(.5), Inches(2.1), Inches(4.5), Inches(4.8),
                 cor_bg=RGBColor(0x15,0x1d,0x35))
txt(s, "📸  YouTube  TikTok  Instagram",
    Inches(.5), Inches(4.4), Inches(4.5), Inches(.5),
    size=12, cor=ACENTO, align=PP_ALIGN.CENTER)

pontos5 = [
    "Indivíduos que usam plataformas digitais (Instagram, YouTube, TikTok) para compartilhar opiniões, experiências e estilos de vida, construindo audiências leais.",
    "Atuam como mediadores simbólicos: disseminam valores, comportamentos e ideologias para milhões de seguidores.",
    "Seu poder não vem de posição formal de autoridade, mas da conexão emocional com a audiência — próximo da dominação carismática de Weber.",
    "Constroem comunidades participativas em que os seguidores se identificam com o estilo de vida do criador de conteúdo.",
]

for i, p in enumerate(pontos5):
    y = Inches(2.1) + i * Inches(1.1)
    rect(s, Inches(5.3), y + Inches(.2), Inches(.18), Inches(.18), fill=ACENTO)
    txt(s, p, Inches(5.65), y, Inches(7.5), Inches(1.0), size=13, cor=BRANCO)


# ══════════════════════════════════════════════════════
# SLIDE 6 — DADOS BRASIL
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "CONTEXTO BRASILEIRO")
titulo(s, "Influenciadores Digitais no Brasil")
linha_ouro(s)

dados_num = [
    ("55%",  "dos brasileiros já compraram um produto indicado por influenciadores"),
    ("85%",  "dos influenciadores produzem conteúdo em mais de uma rede social"),
    ("#1",   "o Brasil é um dos maiores mercados de influência digital do mundo"),
]

for i, (num, descr) in enumerate(dados_num):
    x = Inches(.5) + i * Inches(4.25)
    rect(s, x, Inches(2.1), Inches(4.0), Inches(2.2), fill=CARD)
    txt(s, num, x, Inches(2.15), Inches(4.0), Inches(1.1),
        size=46, bold=True, cor=ACENTO, align=PP_ALIGN.CENTER)
    txt(s, descr, x + Inches(.2), Inches(3.3), Inches(3.6), Inches(.9),
        size=12, cor=BRANCO, align=PP_ALIGN.CENTER)

txt(s, "Maiores influenciadores brasileiros",
    Inches(.5), Inches(4.45), Inches(12), Inches(.4),
    size=12, bold=True, cor=ACENTO)

exemplos6 = [
    ("Virgínia Fonseca", "52,8 mi · lifestyle"),
    ("Neymar Jr.", "44–200 mi · esporte"),
    ("Bruna Marquezine", "44,7 mi · moda"),
    ("Nikolas Ferreira", "+6,9 mi em 2025"),
    ("Felca", "+12 mi em 2025 · humor"),
]

for i, (nome, seg) in enumerate(exemplos6):
    x = Inches(.5) + i * Inches(2.56)
    rect(s, x, Inches(4.9), Inches(2.42), Inches(1.15), fill=CARD)
    txt(s, nome, x + Inches(.12), Inches(4.96), Inches(2.2), Inches(.45),
        size=12, bold=True, cor=ACENTO)
    txt(s, seg, x + Inches(.12), Inches(5.42), Inches(2.2), Inches(.5),
        size=11, cor=BRANCO)

txt(s, "Fonte: Hype Auditor (2025) · Favikon (2026) · Qualibest · Redalyc (4777/477774328005)",
    Inches(.5), Inches(7.1), Inches(12.3), Inches(.33), size=8, cor=CINZA)


# ══════════════════════════════════════════════════════
# SLIDE 7 — PARALELO WEBER × INFLUENCIADORES
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "ANÁLISE SOCIOLÓGICA")
titulo(s, "Paralelo: Weber × Influenciadores Digitais")
linha_ouro(s)

headers = ["Conceito em Weber", "Dominação Carismática Clássica", "Nos Influenciadores Digitais"]
col_w   = [Inches(2.9),         Inches(4.6),                      Inches(4.6)]
col_x   = [Inches(.4),          Inches(3.3),                      Inches(7.9)]

for h, w, x in zip(headers, col_w, col_x):
    rect(s, x, Inches(2.1), w, Inches(.52), fill=ACENTO)
    txt(s, h, x + Inches(.12), Inches(2.12), w - Inches(.15), Inches(.48),
        size=12, bold=True, cor=PRETO)

linhas = [
    ("Qualidade extraordinária",  "Dom divino, heroísmo, carisma inato",          "Autenticidade percebida, estética e estilo de vida aspiracional"),
    ("Devoção dos seguidores",    "Fé irracional, entrega emocional ao líder",     'Engajamento intenso, identificação, "fanbase" leal'),
    ("Missão e visão",            "Mensagem revolucionária ou religiosa",           "Estilo de vida, causas, nicho (moda, fitness, política)"),
    ("Dependência da crença",     "Carisma some com falhas do líder",              '"Cancel culture": influenciador perde poder com polêmicas'),
    ("Apóstolos",                 "Discípulos que espalham a mensagem",            "Seguidores que compartilham e defendem o influenciador"),
]

for ri, linha in enumerate(linhas):
    cor_row = CARD if ri % 2 == 0 else RGBColor(0x22, 0x28, 0x45)
    y = Inches(2.62) + ri * Inches(.82)
    for cell, w, x in zip(linha, col_w, col_x):
        rect(s, x, y, w, Inches(.8), fill=cor_row)
        cor_c = ACENTO if x == Inches(.4) else BRANCO
        txt(s, cell, x + Inches(.12), y + Inches(.06), w - Inches(.18), Inches(.7),
            size=11, bold=(x == Inches(.4)), cor=cor_c)

txt(s, "Fonte: Redalyc (10758900010) · Scielo · WEBER, Max. Economia e Sociedade.",
    Inches(.4), Inches(7.1), Inches(12.5), Inches(.33), size=8, cor=CINZA)


# ══════════════════════════════════════════════════════
# SLIDE 8 — COMO EXERCEM A INFLUÊNCIA
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "MECANISMOS DE PODER")
titulo(s, "Como os Influenciadores Exercem Influência Carismática?")
linha_ouro(s)

mecs = [
    ("📱", "Autenticidade Performática",
     "Transmitem imagem de intimidade e sinceridade, criando sensação de acesso à vida real — o que gera vínculos emocionais profundos com seguidores."),
    ("🔄", "Constância e Presença",
     "A produção contínua de conteúdo mantém o carisma vivo. Weber alertava: o carisma precisa ser provado continuamente — influenciadores precisam de engajamento constante."),
    ("🧠", "Identificação e Projeção",
     "Os seguidores projetam nos influenciadores seus sonhos e aspirações. Seguir o criador é, simbolicamente, aproximar-se do estilo de vida desejado."),
    ("🌐", "Algoritmo como Amplificador",
     "Plataformas amplificam o carisma: mais engajamento = mais visibilidade — um ciclo que reforça a dominação carismática no ambiente digital."),
]

for i, (icone, m_titulo, m_desc) in enumerate(mecs):
    col = i % 2
    row = i // 2
    x = Inches(.5) + col * Inches(6.4)
    y = Inches(2.1) + row * Inches(2.4)
    rect(s, x, y, Inches(6.1), Inches(2.2), fill=CARD)
    # círculo
    rect(s, x + Inches(.2), y + Inches(.35), Inches(.75), Inches(.75),
         fill=RGBColor(0x32,0x24,0x05), line_color=ACENTO, line_pt=1.5)
    txt(s, icone, x + Inches(.22), y + Inches(.37), Inches(.7), Inches(.7),
        size=22, align=PP_ALIGN.CENTER)
    txt(s, m_titulo, x + Inches(1.15), y + Inches(.28), Inches(4.8), Inches(.5),
        size=13, bold=True, cor=ACENTO)
    txt(s, m_desc, x + Inches(.2), y + Inches(.98), Inches(5.7), Inches(1.1),
        size=12, cor=BRANCO)


# ══════════════════════════════════════════════════════
# SLIDE 9 — EXEMPLOS CONCRETOS
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "CASOS REAIS")
titulo(s, "Exemplos Concretos de Carisma Digital")
linha_ouro(s)

exs9 = [
    ("🏠", "Lifestyle & Consumo",
     "Influenciadores como Virgínia Fonseca constroem uma narrativa de vida aspiracional. Seguidores consomem não apenas produtos, mas um estilo de vida — comportamento tipicamente carismático segundo Weber."),
    ("🗳️", "Política & Mobilização",
     "Nikolas Ferreira usou o Instagram para construir uma base de seguidores devotos antes mesmo de ter poder institucional — dominação carismática pura, sem burocracia ou tradição."),
    ("😂", "Humor & Cultura",
     "Youtubers como Felca crescem 12 mi de seguidores em um ano via conteúdo viral. O humor cria identidade de grupo: fãs compartilham valores e linguagem — comunidade típica da dominação carismática."),
]

for i, (icone, ex_titulo, ex_desc) in enumerate(exs9):
    x = Inches(.5) + i * Inches(4.25)
    rect(s, x, Inches(2.1), Inches(4.0), Inches(4.9), fill=CARD)
    # área de "imagem" decorativa
    rect(s, x, Inches(2.1), Inches(4.0), Inches(2.0),
         fill=RGBColor(0x15, 0x1d, 0x35))
    txt(s, icone, x, Inches(2.5), Inches(4.0), Inches(1.0),
        size=48, align=PP_ALIGN.CENTER)
    txt(s, ex_titulo, x + Inches(.15), Inches(4.22), Inches(3.7), Inches(.5),
        size=13, bold=True, cor=ACENTO)
    txt(s, ex_desc, x + Inches(.15), Inches(4.78), Inches(3.7), Inches(2.0),
        size=11, cor=BRANCO)

txt(s, "Fonte: Hype Auditor (2025) · Favikon (2026) · Mundo do Marketing (2025)",
    Inches(.5), Inches(7.1), Inches(12.3), Inches(.33), size=8, cor=CINZA)


# ══════════════════════════════════════════════════════
# SLIDE 10 — CONCLUSÃO
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s)
label(s, "CONSIDERAÇÕES FINAIS")
titulo(s, "Conclusão")
linha_ouro(s)

conclusoes = [
    ("1", "A teoria da dominação carismática de Weber, elaborada no século XX, se mostra surpreendentemente atual para analisar o fenômeno dos influenciadores digitais."),
    ("2", "Criadores de conteúdo exercem poder sem cargo ou tradição: seu único instrumento é a crença dos seguidores em suas qualidades excepcionais — o núcleo do conceito weberiano."),
    ("3", 'O ambiente digital potencializa e acelera a dominação carismática: algoritmos amplificam o carisma, e a "cancel culture" ilustra a fragilidade estrutural que Weber já havia identificado.'),
    ("4", "Compreender essa dinâmica é fundamental para uma leitura crítica da sociedade digital, revelando as estruturas de poder presentes nas redes sociais."),
]

for i, (num, texto) in enumerate(conclusoes):
    y = Inches(2.1) + i * Inches(1.2)
    rect(s, Inches(.5), y, Inches(11.8), Inches(1.08), fill=CARD)
    txt(s, num, Inches(.62), y + Inches(.1), Inches(.6), Inches(.88),
        size=30, bold=True, cor=ACENTO)
    txt(s, texto, Inches(1.42), y + Inches(.13), Inches(10.65), Inches(.85),
        size=13, cor=BRANCO)


# ══════════════════════════════════════════════════════
# SLIDE 11 — REFERÊNCIAS
# ══════════════════════════════════════════════════════
s = add_slide(); bg(s, AZUL_ESC)
label(s, "FONTES CONSULTADAS")
titulo(s, "Referências")
linha_ouro(s)

refs = [
    "WEBER, Max. Economia e Sociedade: fundamentos da sociologia compreensiva. Brasília: Editora UnB, 2000. [Obra original: 1922]",
    "BRASILESCOLA. Dominação Carismática. Disponível em: brasilescola.uol.com.br. Acesso em: junho de 2026.",
    "UNIVERSIDADE ESTADUAL DO CENTRO-OESTE (UNICENTRO). Produção acadêmica em Ciências Sociais. Disponível em: www3.unicentro.br. Acesso em: junho de 2026.",
    "REDALYC. Poder Instituído e Potência Subversiva: Max Weber e a Dupla Face da Dominação Carismática. Revista de Ciências Sociais, v. 107, n. 10758900010.",
    "REDALYC. Influenciadores Digitais e Branding: Uma Revisão Bibliométrica. Revista de Gestão, v. 4777, n. 477774328005. Disponível em: redalyc.org.",
    "SCIELO PORTUGAL. Influenciadores digitais: os novos mediadores simbólico-ideológicos da era digital. Sociologia, Problemas e Práticas, n. 300, 2023.",
]

for i, ref in enumerate(refs):
    y = Inches(2.05) + i * Inches(.87)
    rect(s, Inches(.5), y, Inches(12.3), Inches(.8), fill=CARD)
    rect(s, Inches(.5), y, Pt(6), Inches(.8), fill=ACENTO)
    txt(s, ref, Inches(.76), y + Inches(.1), Inches(11.9), Inches(.65),
        size=11, cor=BRANCO)


# ══════════════════════════════════════════════════════
output = "/home/user/github-stats-card/Influenciadores_Digitais_Dominacao_Carismatica.pptx"
prs.save(output)
print(f"Salvo: {output}")
