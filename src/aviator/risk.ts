/**
 * Aviator — Gestor de banca / calculadora de risco.
 *
 * IMPORTANTE (leia): o Aviator (e jogos "crash" em geral) usa um sistema
 * provably fair onde o multiplicador de cada rodada é gerado por hash
 * criptográfico ANTES da rodada e é estatisticamente INDEPENDENTE das
 * rodadas anteriores. Não existe padrão no histórico para "prever" o
 * próximo valor — qualquer bot que prometa isso está mentindo.
 *
 * O que ESTE módulo faz é honesto: usa a matemática real do jogo para
 * mostrar suas probabilidades, o valor esperado (sempre negativo por causa
 * da vantagem da casa) e o risco de quebrar a banca. Serve para você decidir
 * com consciência — não para "vencer" o jogo, porque matematicamente, no
 * longo prazo, não dá.
 */

/** Parâmetros do jogo e da estratégia do jogador. */
export interface RiskParams {
  /** Banca inicial (mesma unidade da aposta). */
  bankroll: number;
  /** Valor apostado por rodada. */
  bet: number;
  /** Multiplicador de saída automática (ex.: 2.0 = sair em 2x). Deve ser >= 1. */
  cashout: number;
  /**
   * Vantagem da casa (fração). RTP = 1 - houseEdge.
   * Aviator costuma ficar em ~0.03 (RTP ~97%). Padrão: 0.03.
   */
  houseEdge?: number;
}

export interface RiskAnalysis {
  /** Probabilidade de a rodada atingir o multiplicador de saída (vitória). */
  winProb: number;
  /** Probabilidade de perder a aposta na rodada. */
  loseProb: number;
  /** RTP efetivo (retorno esperado por unidade apostada). Sempre = 1 - houseEdge. */
  rtp: number;
  /** Valor esperado por rodada (negativo = perda média). */
  evPerRound: number;
  /** Lucro líquido quando a rodada é vencida. */
  profitOnWin: number;
  /** Quantas rodadas a banca aguenta perdendo seguidas (flat bet). */
  roundsUntilBroke: number;
  /** Probabilidade de quebrar só por sequência de derrotas seguidas. */
  ruinFromStreakProb: number;
}

const EPS = 1e-12;

/**
 * Probabilidade de o crash acontecer EM OU ACIMA de um multiplicador `m`.
 * Modelo padrão de crash games provably fair: P(crash >= m) = (1 - edge) / m
 * para m >= 1. Como o payout é `m * aposta` quando você sai a tempo, isso dá
 * um RTP constante de (1 - edge) para QUALQUER alvo de saída — ou seja,
 * nenhum alvo te dá vantagem. Esse é o ponto honesto da coisa.
 */
export function probReachMultiplier(m: number, houseEdge: number): number {
  if (m <= 1) return 1 - houseEdge;
  const p = (1 - houseEdge) / m;
  return Math.min(1, Math.max(0, p));
}

export function analyze(params: RiskParams): RiskAnalysis {
  const { bankroll, bet, cashout } = params;
  const houseEdge = params.houseEdge ?? 0.03;

  if (bet <= 0) throw new Error("A aposta precisa ser maior que zero.");
  if (bankroll <= 0) throw new Error("A banca precisa ser maior que zero.");
  if (cashout < 1) throw new Error("O multiplicador de saída precisa ser >= 1.");
  if (houseEdge < 0 || houseEdge >= 1) throw new Error("houseEdge precisa estar entre 0 e 1.");

  const winProb = probReachMultiplier(cashout, houseEdge);
  const loseProb = 1 - winProb;
  const profitOnWin = bet * (cashout - 1);

  // EV por rodada: ganha (cashout-1)*bet com prob winProb, perde bet caso contrário.
  const evPerRound = winProb * profitOnWin - loseProb * bet;
  const rtp = 1 - houseEdge;

  const roundsUntilBroke = Math.floor(bankroll / bet);
  // Probabilidade de perder `roundsUntilBroke` rodadas seguidas (flat bet).
  const ruinFromStreakProb = Math.pow(loseProb, roundsUntilBroke);

  return {
    winProb,
    loseProb,
    rtp,
    evPerRound,
    profitOnWin,
    roundsUntilBroke,
    ruinFromStreakProb,
  };
}

/** Aposta máxima sugerida para um risco de quebra "aceitável" por sequência. */
export function suggestedBet(
  bankroll: number,
  cashout: number,
  maxRuinProb = 0.05,
  houseEdge = 0.03
): number {
  const loseProb = 1 - probReachMultiplier(cashout, houseEdge);
  if (loseProb <= EPS) return bankroll;
  // Queremos loseProb^(bankroll/bet) <= maxRuinProb.
  const n = Math.log(maxRuinProb) / Math.log(loseProb);
  if (n <= 1) return 0;
  return bankroll / n;
}
