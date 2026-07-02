import { useState } from 'react';
import { Sprout, Flower, Info, Lock } from 'lucide-react';
import { useFirebase } from './hooks/useFirebase';
import ThreeScene from './components/ThreeScene';
import AdminConsole from './components/AdminConsole';
import { AdminLoginModal, FlowerFormModal, TreeFormModal, DetailModal } from './components/Modals';
import { filterData } from './utils/helpers';

export default function App() {
  const { trees, flowers, settings, updateChurchName, addFlower, updateFlower, addTree, updateTree, resetAllData } = useFirebase();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filterPeriod, setFilterPeriod] = useState('ALL');

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [isFlowerFormOpen, setIsFlowerFormOpen] = useState(false);
  const [isTreeFormOpen, setIsTreeFormOpen] = useState(false);
  const [treeFormMode, setTreeFormMode] = useState<'new' | 'existing'>('new');
  const [selectedTreeForForm, setSelectedTreeForForm] = useState('');

  const [selectedElement, setSelectedElement] = useState<{ type: 'flower' | 'tree', id: string } | null>(null);

  const { filteredTrees, filteredFlowers } = filterData(trees, flowers, filterPeriod, currentYear);

  const activeFlower = selectedElement?.type === 'flower' ? flowers.find(f => f.id === selectedElement.id) || null : null;
  const activeTree = selectedElement?.type === 'tree' ? trees.find(t => t.id === selectedElement.id) || null : null;

  const handleLikeFlower = (id: string) => {
    const f = flowers.find(f => f.id === id);
    if (f) updateFlower(id, { likes: f.likes + 1 });
  };

  const handleLikeTreeLog = (treeId: string, logId: string) => {
    const t = trees.find(t => t.id === treeId);
    if (t) {
      const logs = t.logs.map(l => l.id === logId ? { ...l, likes: l.likes + 1 } : l);
      updateTree(treeId, { logs });
    }
  };

  const handleAddFlowerComment = (flowerId: string, name: string, text: string) => {
    const f = flowers.find(f => f.id === flowerId);
    if (f) {
      const newComment = { id: Date.now().toString(), name, text, date: new Date().toLocaleString('ko-KR') };
      updateFlower(flowerId, { comments: [...f.comments, newComment] });
    }
  };

  const handleAddTreeLogComment = (treeId: string, logId: string, name: string, text: string) => {
    const t = trees.find(t => t.id === treeId);
    if (t) {
      const newComment = { id: Date.now().toString(), name, text, date: new Date().toLocaleString('ko-KR') };
      const logs = t.logs.map(l => l.id === logId ? { ...l, comments: [...l.comments, newComment] } : l);
      updateTree(treeId, { logs });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-xl">
              <Sprout className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-green-800 tracking-tight">{settings.churchName} 워십 숲 3D</h1>
              <p className="text-[10px] text-green-600 font-bold">성장형 정원 & 밀집형 정돈 시스템</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                if(isAdminMode) {
                  setIsAdminAuthenticated(false);
                  setFilterPeriod('ALL');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
                isAdminMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-800 text-white hover:bg-emerald-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminMode ? '관리자 퇴장' : '관리자 모드'}</span>
            </button>
          </div>
        </div>
      </header>

      {isAdminMode && isAdminAuthenticated && (
        <AdminConsole
          churchName={settings.churchName}
          setChurchName={(name) => updateChurchName(name)} // This is a temporary fast update to local state if needed, but since it's firebase backed we might want a local buffer. For simplicity we use the hook directly or just wait for snap.
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          onReset={resetAllData}
          onSaveChurchName={() => {}} // Not needed if onChange directly updates it, but to prevent spam, we could use local state. Let's assume input value updates DB on blur. 
        />
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 bg-white/95 p-5 rounded-2xl shadow-sm border border-green-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-3">
            <div className="p-2.5 bg-green-100 rounded-2xl h-fit flex-shrink-0">
              <Info className="text-green-600 w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm md:text-base">둥근 3D {settings.churchName} 정원 활용법 ({currentYear}년 숲)</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                현재 숲의 참여자 수가 늘어남에 따라 <strong>정원이 점진적으로 더 크게 자동 확장</strong>됩니다. <br />
                나무들은 <strong>가운데 중심으로 포근하게 밀집</strong>되어 있으며, 꽃들은 <strong>나무 바로 사이사이에 예쁘게 피어납니다</strong>. 
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex gap-1.5 bg-blue-50 border border-blue-100 p-2 rounded-xl text-xs text-blue-800 font-extrabold justify-center items-center">
              <span>조회 년도:</span>
              <span className="text-blue-700 bg-white px-2.5 py-0.5 rounded shadow-sm">{currentYear}년도</span>
            </div>
            <div className="flex gap-1.5 bg-green-100/50 p-2 rounded-xl text-xs text-green-800 font-extrabold justify-center items-center">
              <span>현재 구역 필터:</span>
              <span className="text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">{filterPeriod === 'ALL' ? '1년 전체' : filterPeriod}</span>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[65vh] min-h-[480px] bg-gradient-to-b from-sky-100 to-green-100 rounded-3xl shadow-xl overflow-hidden border-4 border-white">
          <div className="absolute top-8 left-[10%] w-24 h-8 bg-white/50 rounded-full blur-md pointer-events-none"></div>
          <div className="absolute top-16 right-[15%] w-32 h-10 bg-white/40 rounded-full blur-lg pointer-events-none"></div>
          
          <div className="absolute top-4 left-4 bg-slate-900/40 text-white text-[10px] md:text-xs px-3 py-1.5 rounded-xl backdrop-blur-md pointer-events-none space-y-1 z-10">
            <p>🔄 마우스 드래그 : 360도 정원 회전</p>
            <p>🔎 마우스 스크롤 : 줌 인/아웃</p>
            <p>👆 개체 직접 터치 : 예배 기록 카드 오픈</p>
          </div>

          <div className="absolute bottom-4 right-4 bg-white/90 border border-green-200 text-green-900 text-[10px] md:text-xs font-bold px-3 py-2 rounded-xl shadow-lg pointer-events-none z-10 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>가정예배 나무: {filteredTrees.length}그루</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
              <span>기도의 꽃밭: {filteredFlowers.length}송이</span>
            </div>
          </div>

          <ThreeScene 
            trees={filteredTrees} 
            flowers={filteredFlowers} 
            onSelect={(type, id) => setSelectedElement({ type, id })} 
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setIsFlowerFormOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <Flower className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>사랑의 꽃 피우기 (기도)</span>
          </button>
          
          <button
            onClick={() => {
              setTreeFormMode('new');
              setSelectedTreeForForm('');
              setIsTreeFormOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <Sprout className="w-5 h-5" />
            <span>가정예배 나무 심기 & 가꾸기</span>
          </button>
        </div>
      </main>

      {isAdminMode && !isAdminAuthenticated && (
        <AdminLoginModal onClose={() => setIsAdminMode(false)} onSuccess={() => setIsAdminAuthenticated(true)} />
      )}

      {isFlowerFormOpen && (
        <FlowerFormModal 
          currentYear={currentYear} 
          onClose={() => setIsFlowerFormOpen(false)} 
          onSubmit={addFlower} 
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
        onOpenTreeForm={(id) => {
          setTreeFormMode('existing');
          setSelectedTreeForForm(id);
          setIsTreeFormOpen(true);
        }}
      />
    </div>
  );
}
