export type Palace = {
  position: number;
  direction: string;
  heavenly_stem: string;
  eight_gate: string;
  eight_deity: string;
  eight_star: string;
  is_void: boolean;
};

export type ComputedChart = {
  title: string;
  chart_datetime: string;
  hour_stem: string;
  day_stem: string;
  month_stem: string;
  year_stem: string;
  duty_chief: string;
  palaces: Palace[];
};

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const directions = ["坎", "坤", "震", "巽", "中", "乾", "兑", "艮", "离"];
const gates = ["休门", "死门", "伤门", "杜门", "中宫", "开门", "惊门", "生门", "景门"];
const deities = ["值符", "螣蛇", "太阴", "六合", "勾陈", "朱雀", "九地", "九天", "值使"];
const stars = ["天蓬", "天芮", "天冲", "天辅", "天禽", "天心", "天柱", "天任", "天英"];
const hourNames = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Deterministic hour-chart calculator. Calendar pillars use the standard 1984-02-02 甲子 epoch. */
export function computeChart(input: Date | string): ComputedChart {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid chart datetime");
  const local = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
  const dayIndex = mod(Math.floor((Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()) - Date.UTC(1984, 1, 2)) / 86400000), 60);
  const hourBranch = mod(Math.floor((local.getHours() + 1) / 2), 12);
  const yearIndex = mod(local.getFullYear() - 1984, 60);
  const solarMonth = mod(local.getMonth() + 11, 12);
  const monthIndex = mod((yearIndex % 5) * 12 + solarMonth + 2, 60);
  const hourIndex = mod((dayIndex % 5) * 12 + hourBranch, 60);
  const offset = mod(dayIndex + hourBranch, 9);
  const voidBranches = [mod((Math.floor(dayIndex / 10) * 2 + 10), 12), mod((Math.floor(dayIndex / 10) * 2 + 11), 12)];
  const palaces = directions.map((direction, i) => ({
    position: i + 1,
    direction,
    heavenly_stem: stems[mod(i + hourIndex + 4, stems.length)],
    eight_gate: gates[mod(i + offset, 9)],
    eight_deity: deities[mod(i + hourBranch, 9)],
    eight_star: stars[mod(i + dayIndex, 9)],
    is_void: voidBranches.includes(mod(i + 1, 12)),
  }));
  return {
    title: `${local.toISOString().slice(0, 10)} ${hourNames[hourBranch]}时盘`,
    chart_datetime: date.toISOString(),
    hour_stem: stems[hourIndex % 10],
    day_stem: stems[dayIndex % 10],
    month_stem: stems[monthIndex % 10],
    year_stem: stems[yearIndex % 10],
    duty_chief: deities[hourBranch % 8],
    palaces,
  };
}

export function scoreChart(palaces: Palace[]) {
  const favourableGates = new Set(["开门", "生门", "休门"]);
  const favourableDeities = new Set(["值符", "太阴", "六合", "九天"]);
  const raw = palaces.reduce((score, palace) => score + (favourableGates.has(palace.eight_gate) ? 1 : 0) + (favourableDeities.has(palace.eight_deity) ? 1 : 0) + (!palace.is_void ? 0.25 : 0), 0);
  return Math.min(10, Math.round(raw * 10) / 10);
}

export function tagPurpose(purpose: string) {
  if (/事业|工作|升职|生意/.test(purpose)) return "事业";
  if (/出行|旅行|方向/.test(purpose)) return "出行";
  if (/感情|婚姻|恋爱/.test(purpose)) return "感情";
  if (/财|投资|收入/.test(purpose)) return "财运";
  return "其他";
}
