import type { Tree, Flower } from '../types';

export const getPeriodFromDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1; // 1 ~ 12
  const year = d.getFullYear();
  
  let quarter = 'Q1';
  if (month >= 4 && month <= 6) quarter = 'Q2';
  else if (month >= 7 && month <= 9) quarter = 'Q3';
  else if (month >= 10) quarter = 'Q4';

  const half = (month <= 6) ? 'H1' : 'H2';
  return { quarter, half, year };
};

export const filterData = (rawTrees: Tree[], rawFlowers: Flower[], period: string, targetYear: number) => {
  const filteredFlowers = rawFlowers.filter(f => {
    const info = getPeriodFromDate(f.date);
    if (info.year !== targetYear) return false;

    if (period === 'ALL') return true;
    if (period === 'H1') return info.half === 'H1';
    if (period === 'H2') return info.half === 'H2';
    if (period === 'Q1') return info.quarter === 'Q1';
    if (period === 'Q2') return info.quarter === 'Q2';
    if (period === 'Q3') return info.quarter === 'Q3';
    if (period === 'Q4') return info.quarter === 'Q4';
    return true;
  });

  const filteredTrees = rawTrees.map(tree => {
    const filteredLogs = tree.logs.filter(log => {
      const info = getPeriodFromDate(log.date);
      if (info.year !== targetYear) return false;

      if (period === 'ALL') return true;
      if (period === 'H1') return info.half === 'H1';
      if (period === 'H2') return info.half === 'H2';
      if (period === 'Q1') return info.quarter === 'Q1';
      if (period === 'Q2') return info.quarter === 'Q2';
      if (period === 'Q3') return info.quarter === 'Q3';
      if (period === 'Q4') return info.quarter === 'Q4';
      return true;
    });
    return { ...tree, logs: filteredLogs };
  }).filter(tree => tree.logs.length > 0);

  return { filteredTrees, filteredFlowers };
};

export const calculateHistoricalData = (rawTrees: Tree[], rawFlowers: Flower[]) => {
  const yearsMap: Record<number, { treesCount: number, flowersCount: number, activeFamilies: Set<string>, score: number, growthIndex: string }> = {};

  rawFlowers.forEach(f => {
    const { year } = getPeriodFromDate(f.date);
    if (!yearsMap[year]) {
      yearsMap[year] = { treesCount: 0, flowersCount: 0, activeFamilies: new Set(), score: 0, growthIndex: '' };
    }
    yearsMap[year].flowersCount += 1;
    yearsMap[year].score += 5; // 꽃 하나당 점수
  });

  rawTrees.forEach(t => {
    t.logs.forEach(log => {
      const { year } = getPeriodFromDate(log.date);
      if (!yearsMap[year]) {
        yearsMap[year] = { treesCount: 0, flowersCount: 0, activeFamilies: new Set(), score: 0, growthIndex: '' };
      }
      yearsMap[year].treesCount += 1;
      yearsMap[year].activeFamilies.add(t.id);
      yearsMap[year].score += 15; // 예배 1회당 점수
    });
  });

  const result: Record<number, any> = {};
  Object.keys(yearsMap).forEach(y => {
    const year = Number(y);
    const data = yearsMap[year];
    let growthIndex = '🌱 새싹기';
    if (data.score > 40) growthIndex = '🌿 묘목기';
    if (data.score > 100) growthIndex = '🌲 성장기';
    if (data.score > 200) growthIndex = '🌳 울창기';
    if (data.score > 350) growthIndex = '🍎 결실기';

    result[year] = {
      treesCount: data.treesCount,
      flowersCount: data.flowersCount,
      activeFamilies: data.activeFamilies.size,
      score: data.score,
      growthIndex
    };
  });

  return result;
};

export const flowerEmojis = ['🌸', '🌷', '🌹', '🌻', '🌼', '🌺'];
