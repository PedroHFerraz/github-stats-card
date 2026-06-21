/**
 * Simulação Monte Carlo de sessões do Aviator usando a distribuição real de
 * crash games provably fair. Mostra, na prática, para onde a banca tende.
 */

import { RiskParams, probReachMultiplier } from "./risk";

/** Sorteia o multiplicador de crash de uma rodada (modelo provably fair). */
export function sampleCrash(houseEdge: number, rng: () => number = Math.random): number {
  // P(crash >= m) = (1 - edge)/m  =>  invertendo a CDF com u uniforme em (0,1):
  // chance instantânea de bust (1.00x) = edge.
  const u = rng();
  if (u < houseEdge) return 1.0;
  const crash = (1 - houseEdge) / (1 - u);
  return Math.max(1.0, crash);
}

export interface SimResult {
  rounds: number;
  /** Banca final média entre todas as sessões. */
  avgFinalBankroll: number;
  /** Banca final mediana. */
  medianFinalBankroll: number;
  /** Fração de sessões que terminaram quebradas (banca < uma aposta). */
  bustRate: number;
  /** Fração de sessões que terminaram no lucro. */
  profitRate: number;
  /** Pior banca final observada. */
  worst: number;
  /** Melhor banca final observada. */
  best: number;
}

/**
 * Roda `sessions` sessões independentes de `rounds` rodadas cada, com flat bet
 * e saída automática no `cashout`. Para a sessão se a banca não cobrir a aposta.
 */
export function simulate(
  params: RiskParams,
  rounds = 100,
  sessions = 10_000,
  rng: () => number = Math.random
): SimResult {
  const { bet, cashout } = params;
  const houseEdge = params.houseEdge ?? 0.03;

  const finals: number[] = [];
  let busts = 0;
  let profits = 0;

  for (let s = 0; s < sessions; s++) {
    let bankroll = params.bankroll;
    for (let r = 0; r < rounds; r++) {
      if (bankroll < bet) break;
      bankroll -= bet;
      const crash = sampleCrash(houseEdge, rng);
      if (crash >= cashout) bankroll += bet * cashout; // saiu a tempo
    }
    finals.push(bankroll);
    if (bankroll < bet) busts++;
    if (bankroll > params.bankroll) profits++;
  }

  finals.sort((a, b) => a - b);
  const sum = finals.reduce((acc, v) => acc + v, 0);
  const mid = Math.floor(finals.length / 2);
  const median =
    finals.length % 2 === 0 ? (finals[mid - 1] + finals[mid]) / 2 : finals[mid];

  return {
    rounds,
    avgFinalBankroll: sum / finals.length,
    medianFinalBankroll: median,
    bustRate: busts / sessions,
    profitRate: profits / sessions,
    worst: finals[0],
    best: finals[finals.length - 1],
  };
}

// Reexporta para conveniência de quem importa só este módulo.
export { probReachMultiplier };
