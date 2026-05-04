"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Sparkles, Loader2, MessageSquare, ThumbsUp, X, Home, Zap, ArrowRight, ExternalLink, Globe, LayoutGrid, KanbanSquare } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Idea = {
  id: string; title: string; content_angle: string; technical_highlight: string;
  roadmap: string; club_tag: string; creator_name: string; status: string; upvotes: number;
};

const COLUMNS = ["Crazy Idea", "Brainstorming & Refining", "Production/Scripting", "Ready for Reality"];
const COLUMN_EMOJIS: Record<string, string> = { "Crazy Idea": "💡", "Brainstorming & Refining": "🧠", "Production/Scripting": "🎬", "Ready for Reality": "🚀" };
const CLUBS = ["Tech & AI Club", "Media & Creativity Club", "Entrepreneurship & Projects Club"];

const LOADING_MESSAGES = [
  "جاري توليد أفكار خارج الصندوق... 🧠",
  "الذكاء الاصطناعي يفكر بعمق... 🤔",
  "نبحث عن الإلهام في الكون... ✨",
  "ممنوع الإزعاج، العبقرية تتشكل... 🔬",
];

const MOCK_PROJECTS = [
  {
    id: "proj_1",
    projectName: "Enactus",
    region: "Global",
    clubCategory: "Entrepreneurship & Projects Club",
    shortDescription: "A massive global student organization focusing on social entrepreneurship. Students innovate tech or engineering solutions and manage them to create real-world impact, documenting their success through high-quality presentations and mini-documentaries for global competitions.",
    websiteUrl: "https://enactus.org/"
  },
  {
    id: "proj_2",
    projectName: "Google Developer Student Clubs (GDSC)",
    region: "Global",
    clubCategory: "Tech & AI Club",
    shortDescription: "A global network of tech clubs. Their main event, the Solution Challenge, forces students to turn tech ideas into real projects and startups. Graphic design and marketing teams play a huge role in showcasing their open-source projects.",
    websiteUrl: "https://gdsc.community.dev/"
  },
  {
    id: "proj_3",
    projectName: "Major League Hacking (MLH)",
    region: "Global",
    clubCategory: "Tech & AI Club",
    shortDescription: "The ultimate hackathon community where a coder, a designer, and an entrepreneur team up to build a prototype in 48 hours. Many real startups are born here, with fully documented video pitches on Devpost.",
    websiteUrl: "https://mlh.io/"
  },
  {
    id: "proj_4",
    projectName: "Design for America (DFA)",
    region: "Global",
    clubCategory: "Media & Creativity Club",
    shortDescription: "A student network using design thinking and tech to build projects solving real community problems. Their content stands out through professional 'Case Studies' explaining the journey from idea, to design, to final product.",
    websiteUrl: "https://designforamerica.com/"
  },
  {
    id: "proj_5",
    projectName: "Stanford BASES",
    region: "Global",
    clubCategory: "Entrepreneurship & Projects Club",
    shortDescription: "A massive student-run startup incubator. They have a tech team for platforms, a media team for marketing content (podcasts, blogs, digital magazines), and an entrepreneurship team managing startup competitions. Billion-dollar founders started here.",
    websiteUrl: "https://bases.stanford.edu/"
  }
];

export default function IdeaFactory() {
  const [mainTab, setMainTab] = useState<'kanban' | 'inspiration'>('kanban');
  
  // Kanban State
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedClub, setSelectedClub] = useState(CLUBS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<'content' | 'tech' | 'roadmap'>('content');

  // Inspiration Directory State
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [extractingProjectId, setExtractingProjectId] = useState<string | null>(null);
  const [extractedIdeas, setExtractedIdeas] = useState<any[]>([]);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [savingIdeaIndex, setSavingIdeaIndex] = useState<number | null>(null);

  useEffect(() => { fetchIdeas(); }, []);

  useEffect(() => {
    if (!isGenerating && !extractingProjectId) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isGenerating, extractingProjectId]);

  // Kanban Functions
  const fetchIdeas = async () => {
    const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) { setIdeas(data); } else {
      setIdeas([
        { id: uuidv4(), title: "روبوت يصنع القهوة (ويشربها أيضاً)", content_angle: "تخيل أن تبرمج روبوتاً ليخدمك ثم يقرر أنه متعب ويشرب قهوتك!", technical_highlight: "ربط ذراع آلية مع خوارزمية التعلم المعزز.", roadmap: "1. شراء ذراع.\n2. برمجة الكود.\n3. البكاء.", club_tag: "Tech & AI Club", creator_name: "AI Engine", status: "Crazy Idea", upvotes: 42 },
        { id: uuidv4(), title: "تطبيق يعاتبك لو ما درست", content_angle: "إشعارات مستفزة بلغة أمك 😂", technical_highlight: "تتبع وقت الشاشة + GPT للتوبيخ.", roadmap: "1. ربط Screen Time API.\n2. كتابة prompt ساخر.\n3. إطلاق التطبيق.", club_tag: "Tech & AI Club", creator_name: "AI Engine", status: "Brainstorming & Refining", upvotes: 28 },
      ]);
    }
  };

  const handleInspire = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/inspire', { method: 'POST', body: JSON.stringify({ club: selectedClub }), headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      const newIdea: Idea = { id: uuidv4(), ...data, club_tag: selectedClub, creator_name: "AI Engine", status: "Crazy Idea", upvotes: 0 };
      await supabase.from('ideas').insert([newIdea]);
      setIdeas((prev) => [newIdea, ...prev]);
    } catch (e) { console.error(e); alert("فشل في توليد الفكرة. حاول مرة أخرى!"); }
    finally { setIsGenerating(false); }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newStatus = destination.droppableId;
    setIdeas((prev) => prev.map(idea => idea.id === draggableId ? { ...idea, status: newStatus } : idea));
    await supabase.from('ideas').update({ status: newStatus }).eq('id', draggableId);
  };

  const handleUpvote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Optimistic update
    setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea));
    
    // Find current upvotes to increment in DB
    const idea = ideas.find(i => i.id === id);
    if (idea) {
      await supabase.from('ideas').update({ upvotes: idea.upvotes + 1 }).eq('id', id);
    }
  };

  const openModal = async (idea: Idea) => {
    setSelectedIdea(idea); setActiveTab('content');
    const { data } = await supabase.from('idea_comments').select('*').eq('idea_id', idea.id).order('created_at', { ascending: true });
    if (data && data.length) setComments(data);
    else setComments([{ id: '1', user_name: 'أحمد', content: 'فكرة مجنونة فعلاً! 🔥' }, { id: '2', user_name: 'سارة', content: 'ممكن نضيف عنصر تسويقي قوي' }]);
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedIdea) return;
    const comment = { idea_id: selectedIdea.id, user_name: "عضو الفريق", content: newComment };
    await supabase.from('idea_comments').insert([comment]);
    setComments(prev => [...prev, { ...comment, id: uuidv4() }]);
    setNewComment("");
  };

  const columnsData = COLUMNS.reduce((acc, col) => { acc[col] = ideas.filter(i => i.status === col); return acc; }, {} as Record<string, Idea[]>);

  const clubColor = (tag: string) => {
    if (tag.includes('Tech')) return 'text-blue-400';
    if (tag.includes('Media')) return 'text-pink-400';
    return 'text-purple-400';
  };

  // Inspiration Directory Functions
  const filteredProjects = MOCK_PROJECTS.filter(p => {
    if (filterRegion !== 'All' && p.region !== filterRegion) return false;
    if (filterCategory !== 'All' && p.clubCategory !== filterCategory) return false;
    return true;
  });

  const extractIdeas = async (project: typeof MOCK_PROJECTS[0]) => {
    setExtractingProjectId(project.id);
    setShowExtractModal(true);
    setExtractedIdeas([]);
    
    try {
      const res = await fetch('/api/extract-ideas', { 
        method: 'POST', 
        body: JSON.stringify({ shortDescription: project.shortDescription, projectName: project.projectName }), 
        headers: { 'Content-Type': 'application/json' } 
      });
      const data = await res.json();
      if (data.ideas) {
        setExtractedIdeas(data.ideas.map((i: any) => ({...i, sourceClub: project.clubCategory})));
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء استخراج الأفكار. جرب مرة أخرى.");
    } finally {
      setExtractingProjectId(null);
    }
  };

  const saveToIdeaBoard = async (ideaData: any, index: number) => {
    setSavingIdeaIndex(index);
    try {
      const newIdea: Idea = { 
        id: uuidv4(), 
        title: ideaData.title,
        content_angle: ideaData.content_angle,
        technical_highlight: ideaData.technical_highlight,
        roadmap: ideaData.roadmap,
        club_tag: ideaData.sourceClub || "Entrepreneurship & Projects Club", 
        creator_name: "AI Extraction", 
        status: "Crazy Idea", 
        upvotes: 0 
      };
      
      await supabase.from('ideas').insert([newIdea]);
      setIdeas((prev) => [newIdea, ...prev]);
      
      // Update local state to show it was saved
      setExtractedIdeas(prev => prev.map((item, i) => i === index ? {...item, saved: true} : item));
    } catch (error) {
      console.error(error);
      alert("فشل في حفظ الفكرة");
    } finally {
      setSavingIdeaIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 sm:p-8 md:p-12 relative overflow-hidden" dir="rtl">
      {/* BG */}
      <div className="fixed top-[-20%] right-[-15%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-15%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Back Link */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 group z-10 relative">
        <Home className="w-4 h-4" /> <span>العودة للرئيسية</span>
        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all" />
      </Link>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-center z-10 relative">
        <div className="bg-surfaceSolid/60 p-1.5 rounded-xl border border-white/10 flex gap-2 backdrop-blur-sm">
          <button 
            onClick={() => setMainTab('kanban')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mainTab === 'kanban' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <KanbanSquare className="w-4 h-4" />
            لوحة الأفكار
          </button>
          <button 
            onClick={() => setMainTab('inspiration')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mainTab === 'inspiration' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Globe className="w-4 h-4" />
            دليل الإلهام العالمي
          </button>
        </div>
      </div>

      {mainTab === 'kanban' && (
        <div className="z-10 relative animate-in fade-in duration-500">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-primary to-secondary">⚡ مصنع الأفكار</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">حول الأفكار المجنونة إلى مشاريع واقعية مع قوة الذكاء الاصطناعي</p>
            </div>
            <div className="flex bg-surfaceSolid p-2 rounded-xl border border-white/5 shadow-xl gap-2 flex-wrap sm:flex-nowrap">
              <select value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}
                className="bg-transparent text-white outline-none px-3 py-2 border-l border-white/10 text-sm">
                {CLUBS.map(c => <option key={c} value={c} className="bg-surfaceSolid">{c}</option>)}
              </select>
              <button onClick={handleInspire} disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-pink-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 whitespace-nowrap text-sm">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? 'جاري التوليد...' : 'ألهمني! ✨'}
              </button>
            </div>
          </div>

          {/* Loading banner */}
          {isGenerating && (
            <div className="max-w-7xl mx-auto mb-6">
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center animate-pulse">
                <p className="text-accent font-bold text-sm">{loadingMsg}</p>
              </div>
            </div>
          )}

          {/* Kanban */}
          <div className="max-w-7xl mx-auto overflow-x-auto pb-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-5 min-w-max">
                {COLUMNS.map(col => (
                  <Droppable key={col} droppableId={col}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}
                        className={`w-72 sm:w-80 flex flex-col rounded-2xl p-4 min-h-[420px] transition-all border ${snapshot.isDraggingOver ? 'bg-surface/80 border-primary/40 shadow-lg shadow-primary/10' : 'bg-surface/40 border-white/5'}`}>
                        <h2 className="text-sm font-bold mb-4 flex items-center justify-between text-white">
                          <span>{COLUMN_EMOJIS[col]} {col}</span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-md">{columnsData[col].length}</span>
                        </h2>
                        <div className="flex-1 space-y-3">
                          {columnsData[col].map((idea, index) => (
                            <Draggable key={idea.id} draggableId={idea.id} index={index}>
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                  onClick={() => openModal(idea)}
                                  className={`bg-surfaceSolid border border-white/10 p-4 rounded-xl cursor-pointer hover:border-primary/40 transition-all ${snapshot.isDragging ? 'shadow-2xl shadow-primary/20 scale-[1.03] rotate-1' : 'shadow-md'}`}>
                                  <div className={`text-xs ${clubColor(idea.club_tag)} mb-2 font-bold`}>{idea.club_tag}</div>
                                  <h3 className="font-bold text-sm mb-3">{idea.title}</h3>
                                  <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-secondary" />
                                      {idea.creator_name}
                                    </span>
                                    <button onClick={(e) => handleUpvote(e, idea.id)} className="flex items-center gap-1 hover:text-accent transition-colors">
                                      <ThumbsUp className="w-3.5 h-3.5" /> {idea.upvotes}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      )}

      {mainTab === 'inspiration' && (
        <div className="z-10 relative max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
          {/* Header */}
          <div className="mb-10 text-center sm:text-right">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">🌍 دليل الإلهام العالمي</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
              تصفح أبرز المشاريع والمبادرات الطلابية الناجحة عالمياً، واستخدم الذكاء الاصطناعي لاستخراج أفكار قابلة للتطبيق لفريقك.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 bg-surfaceSolid/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">المنطقة:</span>
              <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary">
                <option value="All">الكل</option>
                <option value="Global">عالمي (Global)</option>
                <option value="Arab World">العالم العربي</option>
                <option value="Europe">أوروبا</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">النادي:</span>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary">
                <option value="All">الكل</option>
                {CLUBS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-surfaceSolid/80 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{project.projectName}</h3>
                    <div className="flex gap-2 text-xs mt-2">
                      <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-md">{project.region}</span>
                      <span className={`px-2 py-1 rounded-md bg-white/5 ${clubColor(project.clubCategory)}`}>{project.clubCategory}</span>
                    </div>
                  </div>
                  <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white" title="زيارة الموقع">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 text-left" dir="ltr">
                  {project.shortDescription}
                </p>
                
                <button 
                  onClick={() => extractIdeas(project)}
                  className="w-full py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                >
                  <Sparkles className="w-4 h-4" />
                  استخراج أفكار للفريق
                </button>
              </div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                لا توجد مشاريع تطابق خيارات التصفية الحالية.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Idea Factory Kanban Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedIdea(null)}>
          <div className="bg-surfaceSolid border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-surfaceSolid/95 backdrop-blur-md p-5 sm:p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <div className={`text-xs ${clubColor(selectedIdea.club_tag)} font-bold mb-1`}>{selectedIdea.club_tag}</div>
                <h2 className="text-xl sm:text-2xl font-bold">{selectedIdea.title}</h2>
              </div>
              <button onClick={() => setSelectedIdea(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-white/5 px-6">
              {([['content', '🎯 المحتوى'], ['tech', '⚙️ التقني'], ['roadmap', '🗺️ خارطة الطريق']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === key ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="p-5 sm:p-6 space-y-5">
              {activeTab === 'content' && (
                <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                  <h3 className="text-sm text-gray-400 mb-2">🎯 زاوية المحتوى والتسويق</h3>
                  <p className="font-medium text-pink-200 leading-relaxed">{selectedIdea.content_angle}</p>
                </div>
              )}
              {activeTab === 'tech' && (
                <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                  <h3 className="text-sm text-gray-400 mb-2">⚙️ الجانب التقني والعلمي</h3>
                  <p className="font-medium text-blue-200 leading-relaxed">{selectedIdea.technical_highlight}</p>
                </div>
              )}
              {activeTab === 'roadmap' && (
                <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                  <h3 className="text-sm text-gray-400 mb-2">🗺️ خارطة الطريق السريعة</h3>
                  <pre className="font-sans whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">{selectedIdea.roadmap}</pre>
                </div>
              )}
              {/* Comments */}
              <div className="pt-5 border-t border-white/5">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> نقاش الفريق</h3>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pl-2">
                  {comments.map((c, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg text-sm flex gap-2">
                      <span className="font-bold text-primary">{c.user_name}:</span>
                      <span className="text-gray-300">{c.content}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="أضف تعليقك..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                  <button onClick={addComment} className="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">إرسال</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extract Ideas Modal */}
      {showExtractModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => !extractingProjectId && setShowExtractModal(false)}>
          <div className="bg-surfaceSolid border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-6 border-b border-white/5 flex justify-between items-center bg-surfaceSolid/95 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">جلسة عصف ذهني بالذكاء الاصطناعي</h2>
                  <p className="text-xs text-gray-400">استخراج أفكار مستوحاة من أفضل المشاريع العالمية</p>
                </div>
              </div>
              {!extractingProjectId && (
                <button onClick={() => setShowExtractModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {extractingProjectId ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-accent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-accent animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white mb-2">{loadingMsg}</p>
                    <p className="text-sm text-gray-400">نقوم بتحليل المشروع وتوليد أفكار تناسب فريقك...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {extractedIdeas.map((idea, idx) => (
                    <div key={idx} className="bg-surface/50 border border-white/10 rounded-xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary to-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <h3 className="text-lg font-bold text-white mb-3 pl-4 pr-3">{idea.title}</h3>
                      
                      <div className="space-y-4 mb-5 pr-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">🎯 زاوية المحتوى</p>
                          <p className="text-sm text-pink-200">{idea.content_angle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">⚙️ التقنية المقترحة</p>
                          <p className="text-sm text-blue-200">{idea.technical_highlight}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">🗺️ خارطة الطريق</p>
                          <pre className="font-sans whitespace-pre-wrap text-sm text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5">{idea.roadmap}</pre>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => saveToIdeaBoard(idea, idx)}
                        disabled={idea.saved || savingIdeaIndex === idx}
                        className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${idea.saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-primary/20 hover:bg-primary/40 text-primary hover:text-white border border-primary/30'}`}
                      >
                        {savingIdeaIndex === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : (idea.saved ? 'تم الحفظ في لوحة الأفكار ✓' : 'حفظ إلى لوحة الأفكار 📌')}
                      </button>
                    </div>
                  ))}
                  
                  {extractedIdeas.length === 0 && !extractingProjectId && (
                    <div className="text-center text-gray-400 py-8">لم يتم العثور على أفكار.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
