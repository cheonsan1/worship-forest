import { useState, useEffect } from 'react';
import { Sliders, Settings, RefreshCw, Trash2, BarChart2 } from 'lucide-react';
import { calculateHistoricalData } from '../utils/helpers';
import type { Tree, Flower } from '../types';

interface AdminConsoleProps {
  churchName: string;
  setChurchName: (name: string) => void;
  filterPeriod: string;
  setFilterPeriod: (period: string) => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  onReset: () => void;
  onSaveChurchName: () => void;
  trees: Tree[];
  flowers: Flower[];
}

export default function AdminConsole({
  churchName,
  setChurchName,
  filterPeriod,
  setFilterPeriod,
  currentYear,
  setCurrentYear,
  onReset,
  onSaveChurchName,
  trees,
  flowers
}: AdminConsoleProps) {
  const [localChurchName, setLocalChurchName] = useState(churchName);
  
  const historicalYearsData = calculateHistoricalData(trees, flowers);

  useEffect(() => {
    setLocalChurchName(churchName);
  }, [churchName]);

  const handleSave = () => {
    if (localChurchName !== churchName) {
      setChurchName(localChurchName);
      onSaveChurchName();
    }
  };
  
  return (
    <div className="bg-emerald-900 text-white py-6 shadow-xl border-b-4 border-yellow-400 animate-in fade-in slide-in-from-top duration-300">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        
        {/* 상단 제어 바: 숲 명칭 수정 기능 & 분기 필터 */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/20 pb-5">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold flex items-center gap-1.5 text-yellow-300">
              <Sliders className="w-5 h-5" />
              <span>워쉽 숲 관리자 콘솔</span>
            </h2>
            <p className="text-xs text-emerald-200">정원의 조회 기간을 설정하고, 메인 명칭을 커스텀 설정하세요.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* ⛪ 숲 명칭 입력 설정칸 */}
            <div className="flex items-center gap-2 bg-emerald-950 p-2 rounded-xl border border-white/10 w-full sm:w-auto">
              <Settings className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-bold text-white whitespace-nowrap">숲 이름 설정:</span>
              <input
                type="text"
                value={localChurchName}
                onChange={(e) => setLocalChurchName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                placeholder="예: 천산중앙"
                className="px-2.5 py-1 rounded-lg text-xs text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 font-bold w-full sm:w-32"
              />
            </div>

            {/* 분기 필터 제어 버튼 세트 */}
            <div className="flex flex-wrap gap-1 bg-emerald-950 p-1.5 rounded-xl border border-white/10 w-full sm:w-auto">
              {[
                { id: 'ALL', name: '1년 전체' },
                { id: 'H1', name: '상반기' },
                { id: 'H2', name: '하반기' },
                { id: 'Q1', name: '1분기' },
                { id: 'Q2', name: '2분기' },
                { id: 'Q3', name: '3분기' },
                { id: 'Q4', name: '4분기' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilterPeriod(item.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                    filterPeriod === item.id 
                      ? 'bg-yellow-400 text-emerald-950 shadow-md scale-105' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 수동 데이터 마감 보관기 및 데이터 리셋 보드 */}
        <div className="bg-emerald-950 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h4 className="text-sm font-bold text-yellow-300 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              <span>연도 마감 및 수동 정원 리셋 도구</span>
            </h4>
            <p className="text-xs text-emerald-300">현재의 실시간 데이터를 보관 이관 처리하고 새해의 빈 정원으로 정돈 및 수동 초기화를 실행합니다.</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm("정말 올해의 꽃과 예배 데이터를 초기화하시겠습니까? (이 작업은 되돌릴 수 없습니다!)")) {
                onReset();
                alert("올해의 정원이 안전하게 마감 처리되었습니다. 새로운 정원이 시작됩니다!");
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>정원 리셋 및 마감하기</span>
          </button>
        </div>

        {/* 10개년 대조 비교 그래프 보드 */}
        <div>
          <h3 className="text-sm font-extrabold text-yellow-300 flex items-center gap-1.5 mb-4">
            <BarChart2 className="w-4 h-4" />
            <span>10개년 연도별 예배 숲 비교 (2017 ~ 2026)</span>
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {Object.keys(historicalYearsData).length === 0 ? (
              <div className="col-span-full py-8 text-center text-emerald-300/60 text-sm font-bold">
                아직 누적된 데이터가 없습니다.
              </div>
            ) : Object.entries(historicalYearsData).map(([year, info]) => {
              const isCurrent = Number(year) === currentYear;
              return (
                <button 
                  key={year} 
                  onClick={() => {
                    setCurrentYear(Number(year));
                    setFilterPeriod('ALL'); 
                  }}
                  className={`rounded-2xl p-3.5 text-left transition-all hover:scale-[1.03] outline-none ${
                    isCurrent 
                      ? 'bg-gradient-to-br from-yellow-500/25 to-amber-500/10 border-2 border-yellow-400 text-white shadow-lg' 
                      : 'bg-emerald-950/60 border border-white/10 text-emerald-100 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-extrabold text-yellow-300">{year}년 {isCurrent && "📍"}</span>
                    <span className="text-[10px] bg-emerald-800 text-yellow-300 px-1.5 py-0.5 rounded font-extrabold">{info.growthIndex}</span>
                  </div>
                  
                  <div className="h-14 bg-emerald-950/80 rounded-lg mb-2 relative overflow-hidden flex items-center justify-center border border-white/5">
                    <span className="absolute text-[8px] top-1 left-1 text-emerald-400">Forest Density</span>
                    
                    <div className="flex flex-wrap gap-0.5 px-2 items-center justify-center">
                      {Array.from({ length: Math.min(10, Math.ceil(info.treesCount / 2)) }).map((_, i) => (
                        <span key={`t-${i}`} className="text-xs">🌳</span>
                      ))}
                      {Array.from({ length: Math.min(6, Math.ceil(info.flowersCount / 10)) }).map((_, i) => (
                        <span key={`f-${i}`} className="text-[10px]">🌸</span>
                      ))}
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-yellow-400" style={{ width: `${(info.score / 512) * 100}%` }}></div>
                  </div>

                  <div className="text-[10px] space-y-1 text-emerald-200">
                    <div className="flex justify-between">
                      <span>가정예배 횟수:</span>
                      <span className="font-bold text-white">{info.treesCount}그루 (회)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>기도의 꽃송이:</span>
                      <span className="font-bold text-white">{info.flowersCount}송이</span>
                    </div>
                    <div className="flex justify-between">
                      <span>참여 가정수:</span>
                      <span className="font-bold text-white">{info.activeFamilies}가구</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
