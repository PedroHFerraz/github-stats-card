# A Biblioteca de Patrick Jane
### O manual de todas as coisas que ele leu antes de te ler

Um livro em português do Brasil que faz a **engenharia reversa** de um mentalista. Patrick Jane, o
consultor de *The Mentalist* — ex-falso médium, mestre em leitura fria, memória e trapaça, depois cético
militante —, é o fio condutor para reconstruir, campo por campo, a estante real que produziria alguém
assim, e para **ensinar de verdade** cada habilidade.

Não é uma ficha da série. É um manual prático de psicologia aplicada, e **defensivo**: ensina a
reconhecer essas técnicas quando fazem com você, não a usá-las contra os outros. Boa parte da bibliografia
nunca foi publicada no Brasil — o livro é a ponte em português para ideias que só existem em inglês, com
tradução de títulos, glossário de jargão e sínteses autorais.

## Estrutura

- `00-outline.md` — o plano do livro (não entra no volume final).
- `01-prologo.md` … `11-epilogo.md` — prólogo, 9 partes e epílogo. Cada parte segue o mesmo esqueleto:
  abertura em cena, a estante, a ideia central, como Jane usa, **onde isso quebra** (limites e crítica
  científica), treino com 3 exercícios, e "se você só ler um".
- `90-apendice-bibliografia.md` — bibliografia comentada e bilíngue (Apêndice A) + glossário
  inglês→português (Apêndice A2).
- `91-apendice-exercicios.md` — os 30 exercícios em ordem de dificuldade (Apêndice B).
- `92-apendice-etica.md` — nota ética (Apêndice C).

As nove partes: **A Leitura Fria · O Corpo Fala · A Arte da Influência · O Palácio da Memória · A Grande
Trapaça · O Cético · A Mente Criminosa · A Dedução · O Luto e a Vingança.**

## Como construir

Na raiz do repositório:

```bash
./build.sh
```

Gera, em `dist/`:

- `biblioteca-patrick-jane.pdf` — PDF A5 com capa, sumário navegável (com números de página) e numeração.
- `biblioteca-patrick-jane.epub` — EPUB com capa e sumário.
- `biblioteca-patrick-jane.html` — HTML paginado com CSS de impressão.

O script usa **pandoc** (HTML/EPUB) e **weasyprint** (PDF, honrando o `@page` do CSS); se o weasyprint
faltar, cai para **chromium headless**. Se o pandoc não estiver instalado, ele tenta instalá-lo.

## Regras de originalidade

Todo o texto é autoral: as ideias das obras são sintetizadas e explicadas com exemplos próprios, nunca
reproduzidas. Não há citações longas nem bibliografia inventada — quando uma edição brasileira não pôde
ser confirmada, o livro declara "sem edição brasileira" em vez de arriscar um palpite.
