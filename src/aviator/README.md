# ✈️ Aviator — Gestor de banca / calculadora de risco

Ferramenta **honesta** de análise de risco para o jogo Aviator (e crash games em geral).

## ⚠️ Leia isto primeiro

**Não existe bot que "preveja quando entrar e quando sair".** O Aviator usa um
sistema *provably fair*: o multiplicador de cada rodada é gerado por hash
criptográfico **antes** da rodada começar e é **estatisticamente independente**
das rodadas anteriores. Olhar o histórico ("deu 3 vermelhos seguidos, agora vai
subir") é a clássica **falácia do apostador** — não há padrão para prever.

Além disso, o jogo tem **vantagem da casa** (RTP ~97%). Matematicamente, no
longo prazo, o valor esperado é **negativo qualquer que seja o multiplicador de
saída**. Esta ferramenta não te ajuda a "ganhar" — ela te mostra, com números
reais, o tamanho do risco que você está correndo.

## O que ela faz

- **Probabilidades reais** de atingir um multiplicador de saída.
- **Valor esperado (EV)** por rodada e RTP efetivo.
- **Risco de quebrar a banca** (analítico + simulação Monte Carlo de milhares de sessões).
- **Aposta sugerida** para manter o risco de quebra dentro de um limite.

## Uso

```bash
npx ts-node src/aviator/cli.ts --bankroll 200 --bet 10 --cashout 1.5
```

Opções:

| Flag         | Descrição                                | Padrão |
|--------------|------------------------------------------|--------|
| `--bankroll` | Banca inicial                            | 100    |
| `--bet`      | Aposta por rodada                        | 5      |
| `--cashout`  | Multiplicador de saída automática        | 2.0    |
| `--edge`     | Vantagem da casa (fração; 0.03 = RTP 97%)| 0.03   |
| `--rounds`   | Rodadas por sessão na simulação          | 100    |
| `--sessions` | Nº de sessões simuladas                  | 10000  |

## API

```ts
import { analyze, suggestedBet } from "./risk";
import { simulate } from "./simulate";

const params = { bankroll: 200, bet: 10, cashout: 1.5, houseEdge: 0.03 };
analyze(params);              // probabilidades, EV, risco de quebra
simulate(params, 100, 10000); // Monte Carlo
```

## Jogue com responsabilidade

Aviator é entretenimento, não fonte de renda. Use só dinheiro que você pode
perder e defina limites. Se o jogo deixou de ser diversão, procure ajuda:
**CVV — 188** (ligação gratuita, 24h) ou https://www.cvv.org.br.
