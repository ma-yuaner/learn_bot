export function simulateExpedition(initialEnergy, baseCost, weather) {
  if (!Number.isFinite(initialEnergy) || initialEnergy < 0) {
    return { ok: false, reason: "能量必须是非负数" };
  }
  if (!Number.isFinite(baseCost) || baseCost <= 0) {
    return { ok: false, reason: "每轮消耗必须大于 0" };
  }

  const cost = baseCost + (weather === "storm" ? 2 : 0);
  let energy = initialEnergy;
  let rounds = 0;

  while (energy >= cost) {
    energy -= cost;
    rounds += 1;
  }

  return {
    ok: true,
    rounds,
    energy,
    cost,
    reason: "剩余能量不足，安全停止"
  };
}
