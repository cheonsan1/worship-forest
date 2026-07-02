import React, { useState } from 'react';
import { X, Flower, Sprout, MessageCircle, Heart, Calendar, ChevronRight, Send, Lock } from 'lucide-react';
import type { Tree, Flower as FlowerType } from '../types';
import { flowerEmojis } from '../utils/helpers';

// ... (Will define the AdminModal, FlowerFormModal, TreeFormModal, and DetailModal here)

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0691') {
      onSuccess();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="text-red-500 w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">관리자 보호망</h2>
          <p className="text-xs text-slate-400 mt-1">관리자 인증을 위해 마스터 번호를 입력해 주십시오.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              required
              autoFocus
              maxLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호(4자리) 입력"
              className="w-full text-center tracking-widest text-lg font-extrabold px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            {error && <p className="text-xs text-red-500 mt-2 font-bold text-center">⚠️ {error}</p>}
          </div>
          <button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl transition">
            인증 완료
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================

interface FlowerFormModalProps {
  onClose: () => void;
  onSubmit: (flower: Omit<FlowerType, 'id'>) => void;
  currentYear: number;
}

export function FlowerFormModal({ onClose, onSubmit, currentYear }: FlowerFormModalProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    onSubmit({
      name,
      message,
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      date: `${currentYear}-07-02`, // 실시간에 맞게 임의 날짜
      likes: 0,
      comments: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-pink-700 mb-6 flex items-center gap-2">
          <Flower className="text-pink-500 animate-pulse" /> 꽃밭에 새 꽃 피우기
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">성도명 / 닉네임</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="예: 홍길동 집사"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">나누고 싶은 은혜 / 중보기도</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition h-28 resize-none"
              placeholder="오늘 마음에 다가온 은혜의 고백이나 함께 기도하고 싶은 소망을 담아보세요."
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2">
            예쁜 꽃 심기
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================

interface TreeFormModalProps {
  onClose: () => void;
  trees: Tree[];
  onSubmitNewTree: (tree: Omit<Tree, 'id'>) => void;
  onSubmitLog: (treeId: string, log: any) => void;
  initialMode?: 'new' | 'existing';
  initialTreeId?: string;
}

export function TreeFormModal({ onClose, trees, onSubmitNewTree, onSubmitLog, initialMode = 'new', initialTreeId = '' }: TreeFormModalProps) {
  const [treeMode, setTreeMode] = useState(initialMode);
  const [selectedTreeId, setSelectedTreeId] = useState(initialTreeId);
  const [familyName, setFamilyName] = useState('');
  const [worshipDate, setWorshipDate] = useState(new Date().toISOString().split('T')[0]);
  const [passage, setPassage] = useState('');
  const [praise, setPraise] = useState('');
  const [grace, setGrace] = useState('');
  const [prayer, setPrayer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog = {
      id: Date.now().toString(),
      date: worshipDate,
      passage: passage.trim(),
      praise: praise.trim(),
      grace: grace.trim(),
      prayer: prayer.trim(),
      likes: 0,
      comments: []
    };

    if (treeMode === 'existing') {
      if (!selectedTreeId) return;
      onSubmitLog(selectedTreeId, newLog);
    } else {
      if (!familyName.trim()) return;
      onSubmitNewTree({
        familyName: `${familyName.trim()} 가정`,
        logs: [newLog]
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 my-8 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
          <Sprout className="text-emerald-500" /> 가정예배 나무 기록하기
        </h2>

        <div className="flex border-b border-gray-100 mb-5">
          <button
            type="button"
            onClick={() => setTreeMode('new')}
            className={`flex-1 pb-3 text-center font-bold text-sm border-b-2 transition-all ${treeMode === 'new' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400'}`}
          >
            🌱 처음 심기
          </button>
          <button
            type="button"
            onClick={() => setTreeMode('existing')}
            disabled={trees.length === 0}
            className={`flex-1 pb-3 text-center font-bold text-sm border-b-2 transition-all disabled:opacity-40 ${treeMode === 'existing' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400'}`}
          >
            💧 나무 가꾸기
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {treeMode === 'new' ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">가정 이름</label>
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="예: 믿음, 소망"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">나무 선택</label>
              <select
                required
                value={selectedTreeId}
                onChange={(e) => setSelectedTreeId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">-- 가정 선택 --</option>
                {trees.map(tree => (
                  <option key={tree.id} value={tree.id}>
                    {tree.familyName} (예배 {tree.logs.length}회)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">예배 날짜</label>
                <input
                  type="date"
                  required
                  value={worshipDate}
                  onChange={(e) => setWorshipDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">찬양</label>
                <input
                  type="text"
                  required
                  value={praise}
                  onChange={(e) => setPraise(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">말씀 본문</label>
              <input
                type="text"
                required
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">은혜 나눔</label>
              <textarea
                required
                value={grace}
                onChange={(e) => setGrace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none h-16 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">기도제목</label>
              <textarea
                required
                value={prayer}
                onChange={(e) => setPrayer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none h-16 resize-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2">
            {treeMode === 'new' ? '첫 예배 기록하기' : '예배 더하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================

interface DetailModalProps {
  element: { type: 'flower' | 'tree', id: string } | null;
  onClose: () => void;
  activeFlower: FlowerType | null;
  activeTree: Tree | null;
  currentYear: number;
  onLikeFlower: (id: string) => void;
  onLikeTreeLog: (treeId: string, logId: string) => void;
  onAddFlowerComment: (flowerId: string, name: string, text: string) => void;
  onAddTreeLogComment: (treeId: string, logId: string, name: string, text: string) => void;
  onOpenTreeForm: (treeId: string) => void;
}

export function DetailModal({
  element, onClose, activeFlower, activeTree, currentYear,
  onLikeFlower, onLikeTreeLog, onAddFlowerComment, onAddTreeLogComment, onOpenTreeForm
}: DetailModalProps) {
  const [flowerCommenter, setFlowerCommenter] = useState('');
  const [flowerCommentText, setFlowerCommentText] = useState('');
  
  const [treeCommenterMap, setTreeCommenterMap] = useState<Record<string, string>>({});
  const [treeCommentTextMap, setTreeCommentTextMap] = useState<Record<string, string>>({});

  if (!element) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 my-8 relative animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {element.type === 'flower' && activeFlower && (
          <div className="space-y-6 text-center">
            <div>
              <div className="text-6xl mb-4 animate-bounce">{activeFlower.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{activeFlower.name}님의 향기꽃</h3>
              <p className="text-[11px] text-pink-500 font-semibold mb-2 bg-pink-50 w-fit mx-auto px-2.5 py-0.5 rounded-full">사랑과 기도의 꽃밭</p>
              <p className="text-[10px] text-gray-400">피어난 날: {activeFlower.date}</p>
            </div>
            
            <div className="bg-pink-50/50 border border-pink-100 p-5 rounded-2xl text-pink-950 text-left relative shadow-sm">
              <MessageCircle className="absolute -top-3 left-4 text-pink-200 w-8 h-8 fill-current" />
              <p className="relative z-10 whitespace-pre-wrap text-sm leading-relaxed">{activeFlower.message}</p>
            </div>

            <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
              <div className="flex items-center space-x-1.5">
                <Heart className="w-4 h-4 text-pink-500 fill-current" />
                <span className="text-xs text-gray-500 font-semibold">공감 {activeFlower.likes}명</span>
              </div>
              <button onClick={() => onLikeFlower(activeFlower.id)} className="flex items-center space-x-1 px-4 py-1.5 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-all font-bold text-xs shadow-sm">
                <Heart className="w-3.5 h-3.5 fill-current text-pink-600 animate-ping" />
                <span>하트 공감</span>
              </button>
            </div>

            {/* 댓글 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5 text-left">
                <MessageCircle className="w-3.5 h-3.5" /> 댓글 ({activeFlower.comments.length})
              </h4>
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 text-left">
                {activeFlower.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-left text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-700">{comment.name}</span>
                      <span className="text-[9px] text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if(flowerCommenter && flowerCommentText) {
                  onAddFlowerComment(activeFlower.id, flowerCommenter, flowerCommentText);
                  setFlowerCommenter(''); setFlowerCommentText('');
                }
              }} className="flex gap-2">
                <input type="text" required value={flowerCommenter} onChange={e => setFlowerCommenter(e.target.value)} placeholder="이름" className="w-20 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-pink-400" />
                <input type="text" required value={flowerCommentText} onChange={e => setFlowerCommentText(e.target.value)} placeholder="격려 한마디" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-pink-400" />
                <button type="submit" className="bg-pink-500 text-white p-2 rounded-lg shadow-sm"><Send className="w-3.5 h-3.5" /></button>
              </form>
            </div>
          </div>
        )}

        {element.type === 'tree' && activeTree && (
          <div className="space-y-6">
            <div className="text-center border-b border-gray-100 pb-4">
              <div className="text-5xl mb-2">🌳</div>
              <h3 className="text-xl font-bold text-gray-800">{activeTree.familyName}</h3>
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full">
                  누적 {activeTree.logs.length}회 예배 ({currentYear}년)
                </span>
              </div>
            </div>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1">
              {activeTree.logs.map((log, index) => (
                <div key={log.id} className="bg-green-50/70 border border-green-100/70 p-4 rounded-2xl space-y-3 shadow-sm text-left">
                  <div className="flex items-center justify-between text-xs font-bold border-b border-green-100/50 pb-2">
                    <span className="flex items-center gap-1 text-sm text-emerald-800"><Calendar className="w-4 h-4" />{log.date}</span>
                    <span className="bg-emerald-200/60 px-2.5 py-0.5 rounded text-[10px]">{activeTree.logs.length - index}회차</span>
                  </div>
                  <div className="text-xs space-y-1 bg-white/50 p-2.5 rounded-xl border border-green-100/30">
                    <p><strong>📖 본문:</strong> {log.passage}</p>
                    <p className="mt-1"><strong>🎵 찬양:</strong> {log.praise}</p>
                  </div>
                  <div className="text-xs bg-white p-3 rounded-xl border border-green-100/20">
                    <p className="font-bold text-green-950 mb-1">🎁 은혜 나눔</p>
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{log.grace}</p>
                  </div>
                  <div className="text-xs bg-emerald-100/30 p-3 rounded-xl border border-emerald-200/20">
                    <p className="font-bold text-emerald-950 mb-1">🙏 기도제목</p>
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{log.prayer}</p>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-green-100/40 pt-2.5 mt-2">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
                      <span className="text-[11px] text-gray-500 font-semibold">{log.likes || 0}명 공감</span>
                    </div>
                    <button onClick={() => onLikeTreeLog(activeTree.id, log.id)} className="flex items-center space-x-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 font-bold text-[11px]">
                      <Heart className="w-3 h-3 fill-current text-pink-500" />
                      <span>아멘·공감</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-dashed border-green-100 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 댓글 ({log.comments?.length || 0})</p>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                      {log.comments?.map(comment => (
                        <div key={comment.id} className="bg-white/80 p-2 rounded-lg text-[11px] border border-gray-100">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-green-900">{comment.name}</span>
                            <span className="text-[8px] text-gray-400">{comment.date}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const cName = treeCommenterMap[log.id];
                      const cText = treeCommentTextMap[log.id];
                      if(cName && cText) {
                        onAddTreeLogComment(activeTree.id, log.id, cName, cText);
                        setTreeCommenterMap(p => ({...p, [log.id]: ''}));
                        setTreeCommentTextMap(p => ({...p, [log.id]: ''}));
                      }
                    }} className="flex gap-1.5 pt-1">
                      <input type="text" required value={treeCommenterMap[log.id] || ''} onChange={e => setTreeCommenterMap(p => ({...p, [log.id]: e.target.value}))} placeholder="이름" className="w-16 px-2 py-1 border border-gray-200 rounded-md text-[10px] outline-none" />
                      <input type="text" required value={treeCommentTextMap[log.id] || ''} onChange={e => setTreeCommentTextMap(p => ({...p, [log.id]: e.target.value}))} placeholder="축복의 말" className="flex-1 px-2.5 py-1 border border-gray-200 rounded-md text-[10px] outline-none" />
                      <button type="submit" className="bg-emerald-600 text-white px-2.5 rounded-md text-[10px]">등록</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => { onClose(); onOpenTreeForm(activeTree.id); }}
                className="flex items-center gap-1 text-xs text-green-700 font-bold hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                예배 일지 누적하여 쓰기 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
