import { useState } from 'react';
import { Sprout, Flower, Info, Lock, LogOut, LogIn, Trophy } from 'lucide-react';
import { useFirebase } from './hooks/useFirebase';
import { useAuth } from './hooks/useAuth';
import ThreeScene from './components/ThreeScene';
import AdminConsole from './components/AdminConsole';
import { AdminLoginModal, FlowerFormModal, TreeFormModal, DetailModal } from './components/Modals';
import { RankingModal } from './components/RankingModal';
import { filterData } from './utils/helpers';

export default function App() {
  const { trees, flowers, settings, updateChurchName, addFlower, updateFlower, addTree, updateTree, resetAllData } = useFirebase();
  const { user, loginWithGoogle, logout } = useAuth();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filterPeriod, setFilterPeriod] = useState('ALL');

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [isFlowerFormOpen, setIsFlowerFormOpen] = useState(false);
  const [isTreeFormOpen, setIsTreeFormOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [treeFormMode, setTreeFormMode] = useState<'new' | 'existing'>('new');
  const [selectedTreeForForm, setSelectedTreeForForm] = useState('');

  const [selectedElement, setSelectedElement] = useState<{ type: 'flower' | 'tree', id: string } | null>(null);

  const { filteredTrees, filteredFlowers } = filterData(trees, flowers, filterPeriod, currentYear);

  const activeFlower = selectedElement?.type === 'flower' ? flowers.find(f => f.id === selectedElement.id) || null : null;
  const activeTree = selectedElement?.type === 'tree' ? trees.find(t => t.id === selectedElement.id) || null : null;

  const requireAuth = (callback: () => void) => {
    if (!user) {
      alert("로그인이 필요한 기능입니다. 상단의 로그인 버튼을 눌러주세요.");
      return;
    }
    callback();
  };

  const handleLikeFlower = (id: string) => {
    requireAuth(() => {
      const f = flowers.find(f => f.id === id);
      if (f) updateFlower(id, { likes: f.likes + 1 });
    });
  };

  const handleLikeTreeLog = (treeId: string, logId: string) => {
    requireAuth(() => {
      const t = trees.find(t => t.id === treeId);
      if (t) {
        const logs = t.logs.map(l => l.id === logId ? { ...l, likes: l.likes + 1 } : l);
        updateTree(treeId, { logs });
      }
    });
  };

  const handleAddFlowerComment = (flowerId: string, name: string, text: string) => {
    requireAuth(() => {
      const f = flowers.find(f => f.id === flowerId);
      if (f) {
        const newComment = { id: Date.now().toString(), name, text, date: new Date().toLocaleString('ko-KR') };
        updateFlower(flowerId, { comments: [...f.comments, newComment] });
      }
    });
  };

  const handleAddTreeLogComment = (treeId: string, logId: string, name: string, text: string) => {
    requireAuth(() => {
      const t = trees.find(t => t.id === treeId);
      if (t) {
        const newComment = { id: Date.now().toString(), name, text, date: new Date().toLocaleString('ko-KR') };
        const logs = t.logs.map(l => l.id === logId ? { ...l, comments: [...l.comments, newComment] } : l);
        updateTree(treeId, { logs });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-gray-800 font-sans selection:bg-emerald-200">
      <header className="bg-emerald-600 shadow-md sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center gap-2 text-white hover:text-emerald-100 transition-colors">
              <span className="text-xl md:text-2xl font-extrabold tracking-tight">
                🌳 동부교회 워십 트리
              </span>
            </a>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/50 border border-emerald-500 text-white">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="profile" className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-bold">{user.displayName}님</span>
                </div>
                <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-100 hover:bg-emerald-700 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
              </div>
            ) : (
              <button onClick={loginWithGoogle} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm">
                <LogIn className="w-3.5 h-3.5" />
                <span>구글 로그인</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                if(isAdminMode) {
                  setIsAdminAuthenticated(false);
                  setFilterPeriod('ALL');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all border ${
                isAdminMode ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-emerald-700 text-emerald-200 border-emerald-600 hover:bg-emerald-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {isAdminMode && isAdminAuthenticated && (
        <AdminConsole
          churchName={settings.churchName}
          setChurchName={updateChurchName}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          onReset={resetAllData}
          onSaveChurchName={() => {}} 
          trees={trees}
          flowers={flowers}
        />
      )}

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-2">동부교회 워십 숲</h2>
          <p className="text-sm md:text-base text-gray-500">모든 성도님의 예배 나무가 모여 만들어진 숲입니다.</p>
        </div>

        {/* Action Bar (Filters & Ranks) */}
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 items-center text-emerald-700 font-bold text-sm md:text-base">
            <span className="bg-emerald-100 px-3 py-1 rounded-full">{settings.churchName}</span>
            <span>{currentYear}년 정원</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button onClick={() => setIsRankingOpen(true)} className="flex gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-yellow-200 p-2 rounded-xl text-xs text-yellow-800 font-extrabold justify-center items-center hover:scale-105 transition-transform shadow-sm">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span>명예의 전당 랭킹</span>
            </button>
            <div className="flex gap-1.5 bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-xs text-emerald-800 font-extrabold justify-center items-center">
              <span>필터:</span>
              <span className="text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">{filterPeriod === 'ALL' ? '1년 전체' : filterPeriod}</span>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[550px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="absolute top-4 left-4 bg-white/80 text-emerald-900 text-[10px] md:text-xs font-bold px-3 py-2 rounded-xl shadow-sm pointer-events-none space-y-1 z-10 border border-emerald-50">
            <p>🔄 드래그 : 회전</p>
            <p>🔎 휠 : 줌 인/아웃</p>
            <p>👆 클릭 : 상세 보기</p>
          </div>

          <div className="absolute bottom-4 right-4 bg-white/90 border border-emerald-100 text-emerald-900 text-[10px] md:text-xs font-bold px-3.5 py-2.5 rounded-2xl shadow-sm pointer-events-none z-10 space-y-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
              <span>가정 나무: {filteredTrees.length}그루</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-sm"></span>
              <span>기도 꽃밭: {filteredFlowers.length}송이</span>
            </div>
          </div>

          <ThreeScene 
            trees={filteredTrees} 
            flowers={filteredFlowers} 
            onSelect={(type, id) => setSelectedElement({ type, id })} 
          />
        </div>

        {user ? (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => requireAuth(() => setIsFlowerFormOpen(true))}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold text-base shadow-sm transition-all border border-emerald-200"
            >
              <Flower className="w-5 h-5 text-pink-500" />
              <span>사랑의 꽃 피우기 (기도)</span>
            </button>
            
            <button
              onClick={() => requireAuth(() => {
                setTreeFormMode('new');
                setSelectedTreeForForm('');
                setIsTreeFormOpen(true);
              })}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-sm transition-all"
            >
              <Sprout className="w-5 h-5" />
              <span>가정예배 나무 심기</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={loginWithGoogle}
              className="w-full sm:w-auto px-10 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base shadow-sm transition-all"
            >
              구글 계정으로 로그인
            </button>
          </div>
        )}
      </main>

      {isAdminMode && !isAdminAuthenticated && (
        <AdminLoginModal onClose={() => setIsAdminMode(false)} onSuccess={() => setIsAdminAuthenticated(true)} />
      )}

      {isRankingOpen && (
        <RankingModal onClose={() => setIsRankingOpen(false)} trees={trees} flowers={flowers} />
      )}

      {isFlowerFormOpen && (
        <FlowerFormModal 
          currentYear={currentYear} 
          onClose={() => setIsFlowerFormOpen(false)} 
          onSubmit={addFlower} 
          userName={user?.displayName || ''}
        />
      )}

      {isTreeFormOpen && (
        <TreeFormModal 
          trees={trees}
          onClose={() => setIsTreeFormOpen(false)}
          onSubmitNewTree={addTree}
          onSubmitLog={(id, log) => {
            const t = trees.find(t => t.id === id);
            if (t) updateTree(id, { logs: [log, ...t.logs] });
          }}
          initialMode={treeFormMode}
          initialTreeId={selectedTreeForForm}
        />
      )}

      <DetailModal
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
        activeFlower={activeFlower}
        activeTree={activeTree}
        currentYear={currentYear}
        onLikeFlower={handleLikeFlower}
        onLikeTreeLog={handleLikeTreeLog}
        onAddFlowerComment={handleAddFlowerComment}
        onAddTreeLogComment={handleAddTreeLogComment}
        onOpenTreeForm={(id) => requireAuth(() => {
          setTreeFormMode('existing');
          setSelectedTreeForForm(id);
          setIsTreeFormOpen(true);
        })}
        userName={user?.displayName || ''}
      />
    </div>
  );
}
