import { analyze, suggestedBet, RiskParams } from "./risk";
import { simulate } from "./simulate";

function getArg(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

function num(args: string[], flag: string, def: number): number {
  const v = getArg(args, flag);
  if (v === undefined) return def;
  const n = parseFloat(v);
  if (Number.isNaN(n)) throw new Error(`Valor inválido para ${flag}: "${v}"`);
  return n;
}

function pct(x: number): string {
  return `${(x * 100).toFixed(2)}%`;
}

function money(x: number): string {
  return x.toFixed(2);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
  ✈️  Aviator — Gestor de banca / calculadora de risco

  Ferramenta HONESTA. Não prevê rodadas (isso é impossível: o resultado é
  gerado por hash criptográfico antes da rodada e é independente do passado).
  Ela mostra suas probabilidades reais, o valor esperado e o risco de quebrar.

  Uso:
    npx ts-node src/aviator/cli.ts [opções]

  Opções:
    --bankroll <n>   Banca inicial (padrão: 100)
    --bet <n>        Aposta por rodada (padrão: 5)
    --cashout <n>    Multiplicador de saída automática (padrão: 2.0)
    --edge <n>       Vantagem da casa, fração (padrão: 0.03 = RTP 97%)
    --rounds <n>     Rodadas por sessão na simulação (padrão: 100)
    --sessions <n>   Nº de sessões simuladas (padrão: 10000)

  Exemplos:
    npx ts-node src/aviator/cli.ts --bankroll 200 --bet 10 --cashout 1.5
    npx ts-node src/aviator/cli.ts --cashout 3 --edge 0.01
`);
    process.exit(0);
  }

  const params: RiskParams = {
    bankroll: num(args, "--bankroll", 100),
    bet: num(args, "--bet", 5),
    cashout: num(args, "--cashout", 2.0),
    houseEdge: num(args, "--edge", 0.03),
  };
  const rounds = Math.floor(num(args, "--rounds", 100));
  const sessions = Math.floor(num(args, "--sessions", 10_000));

  try {
    const a = analyze(params);

    console.log(`\n  ✈️  Análise de risco — Aviator\n`);
    console.log(`  Banca: ${money(params.bankroll)} · Aposta: ${money(params.bet)} · Saída: ${params.cashout}x · Vantagem da casa: ${pct(params.houseEdge!)}\n`);

    console.log(`  📊 Por rodada`);
    console.log(`     Chance de atingir ${params.cashout}x (vitória): ${pct(a.winProb)}`);
    console.log(`     Chance de perder a aposta:                ${pct(a.loseProb)}`);
    console.log(`     Lucro se vencer:                          +${money(a.profitOnWin)}`);
    console.log(`     RTP efetivo:                              ${pct(a.rtp)}`);
    console.log(`     Valor esperado (EV):                      ${a.evPerRound >= 0 ? "+" : ""}${money(a.evPerRound)} por rodada\n`);

    console.log(`  💀 Risco de quebrar`);
    console.log(`     Rodadas perdidas seguidas que zeram a banca: ${a.roundsUntilBroke}`);
    console.log(`     Chance dessa sequência acontecer:            ${pct(a.ruinFromStreakProb)}`);
    const sug = suggestedBet(params.bankroll, params.cashout, 0.05, params.houseEdge);
    console.log(`     Aposta sugerida p/ risco de quebra ~5%:      ${money(sug)}\n`);

    const sim = simulate(params, rounds, sessions);
    console.log(`  🎲 Simulação Monte Carlo (${sessions} sessões de ${rounds} rodadas)`);
    console.log(`     Banca final mediana:   ${money(sim.medianFinalBankroll)}  (começou em ${money(params.bankroll)})`);
    console.log(`     Banca final média:     ${money(sim.avgFinalBankroll)}`);
    console.log(`     Sessões no lucro:      ${pct(sim.profitRate)}`);
    console.log(`     Sessões quebradas:     ${pct(sim.bustRate)}`);
    console.log(`     Pior / melhor caso:    ${money(sim.worst)} / ${money(sim.best)}\n`);

    const lost = params.bankroll - sim.avgFinalBankroll;
    if (lost > 0) {
      console.log(`  🧭 Conclusão: em média você TERMINA com ${money(sim.avgFinalBankroll)}, ou seja, perde ~${money(lost)}`);
      console.log(`     depois de ${rounds} rodadas. A vantagem da casa torna a perda o resultado esperado`);
      console.log(`     no longo prazo, qualquer que seja o multiplicador de saída. Jogue por diversão,`);
      console.log(`     com dinheiro que você pode perder — nunca como fonte de renda.\n`);
    } else {
      console.log(`  🧭 Observação: com edge negativa o EV seria positivo, mas isso não acontece num`);
      console.log(`     Aviator real (a casa sempre tem vantagem). Confira o parâmetro --edge.\n`);
    }
  } catch (err) {
    console.error(`\n  ❌ ${(err as Error).message}\n`);
    process.exit(1);
  }
}

main();
