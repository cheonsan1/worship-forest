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

export const historicalYearsData: Record<number, any> = {
  2017: { treesCount: 2, flowersCount: 5, activeFamilies: 2, score: 15, growthIndex: '🌱 새싹기' },
  2018: { treesCount: 4, flowersCount: 12, activeFamilies: 4, score: 28, growthIndex: '🌱 새싹기' },
  2019: { treesCount: 7, flowersCount: 20, activeFamilies: 6, score: 45, growthIndex: '🌿 묘목기' },
  2020: { treesCount: 12, flowersCount: 35, activeFamilies: 10, score: 70, growthIndex: '🌿 묘목기' },
  2021: { treesCount: 18, flowersCount: 50, activeFamilies: 14, score: 110, growthIndex: '🌲 성장기' },
  2022: { treesCount: 25, flowersCount: 72, activeFamilies: 19, score: 160, growthIndex: '🌲 성장기' },
  2023: { treesCount: 32, flowersCount: 95, activeFamilies: 24, score: 210, growthIndex: '🌳 울창기' },
  2024: { treesCount: 40, flowersCount: 120, activeFamilies: 30, score: 280, growthIndex: '🌳 울창기' },
  2025: { treesCount: 52, flowersCount: 165, activeFamilies: 38, score: 390, growthIndex: '🍎 결실기' },
  2026: { treesCount: 8, flowersCount: 15, activeFamilies: 3, score: 85, growthIndex: '🌲 성장기' }
};

export const flowerEmojis = ['🌸', '🌷', '🌹', '🌻', '🌼', '🌺'];
