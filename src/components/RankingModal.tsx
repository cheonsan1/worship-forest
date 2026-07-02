import { X, Trophy, Medal, Heart, Sprout, Flower } from 'lucide-react';
import type { Tree, Flower as FlowerType } from '../types';

interface RankingModalProps {
  onClose: () => void;
  trees: Tree[];
  flowers: FlowerType[];
}

export function RankingModal({ onClose, trees, flowers }: RankingModalProps) {
  // 꽃 랭킹 (Top 5)
  const topFlowers = [...flowers]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  // 나무 랭킹 (가정별 모든 통나무의 하트 합산 기준 Top 5)
  const topTrees = [...trees]
    .map(tree => ({
      ...tree,
      totalLikes: tree.logs.reduce((sum, log) => sum + (log.likes || 0), 0)
    }))
    .sort((a, b) => b.totalLikes - a.totalLikes)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl p-6 md:p-8 my-8 relative animate-in fade-in zoom-in-95 duration-300 border border-white/40" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-black/5 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-yellow-500/30">
            <Trophy className="w-8 h-8 text-yellow-900" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">명예의 전당</h2>
          <p className="text-sm text-gray-500 mt-1">이달의 가장 많은 공감을 받은 축복의 기록들입니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기도의 꽃밭 랭킹 */}
          <div className="bg-pink-50/50 border border-pink-100/50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-pink-700 mb-4 flex items-center gap-2">
              <Flower className="w-5 h-5 text-pink-500" /> 기도의 꽃송이
            </h3>
            <div className="space-y-3">
              {topFlowers.length > 0 ? topFlowers.map((flower, idx) => (
                <div key={flower.id} className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-pink-100 flex items-center gap-3 transition-transform hover:scale-[1.02]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-pink-100 text-pink-600'}`}>
                    {idx < 3 ? <Medal className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{flower.name}</p>
                    <p className="text-xs text-gray-500 truncate">{flower.message}</p>
                  </div>
                  <div className="flex items-center gap-1 text-pink-500 bg-pink-50 px-2 py-1 rounded-lg">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold">{flower.likes}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-center text-gray-400 py-4">아직 피어난 꽃이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 가정예배 나무 랭킹 */}
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" /> 은혜의 가정예배
            </h3>
            <div className="space-y-3">
              {topTrees.length > 0 ? topTrees.map((tree, idx) => (
                <div key={tree.id} className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-emerald-100 flex items-center gap-3 transition-transform hover:scale-[1.02]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                    {idx < 3 ? <Medal className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{tree.familyName}</p>
                    <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 w-fit px-1.5 py-0.5 rounded">누적 {tree.logs.length}회 예배</p>
                  </div>
                  <div className="flex items-center gap-1 text-pink-500 bg-pink-50 px-2 py-1 rounded-lg">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold">{tree.totalLikes}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-center text-gray-400 py-4">아직 심겨진 나무가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
