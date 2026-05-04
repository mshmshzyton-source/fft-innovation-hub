"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, Sun, Moon, Instagram, Youtube, Edit3, Trash2, CheckCircle2, Circle, ChevronLeft, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// ===== DATA =====
const CLUBS_DATA = [
  {
    name: 'Tech & AI Club',
    emoji: '🤖',
    description: 'نادي متخصص في التقنية والذكاء الاصطناعي، يوفر بيئة تعليمية تفاعلية لتطوير المهارات البرمجية وفهم تطبيقات الذكاء الاصطناعي.',
    skills: ['Data Analysis', 'Machine Learning', 'Python', 'Web Development'],
    gradient: 'from-blue-500/20 to-cyan-500/5',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10',
  },
  {
    name: 'Entrepreneurship & Projects Club',
    emoji: '🚀',
    description: 'نادي يركز على تحويل الأفكار إلى مشاريع ريادية ناجحة، من خلال ورشات عمل وإرشاد من رواد أعمال ناجحين.',
    skills: ['Pitch Presentation', 'Business Model Canvas', 'Market Research', 'Financial Planning'],
    gradient: 'from-purple-500/20 to-pink-500/5',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/10',
  },
  {
    name: 'Media & Creativity Club',
    emoji: '🎨',
    description: 'نادي يهتم بصناعة المحتوى الإبداعي والتسويق الرقمي، ويوفر مساحة للطلاب لتطوير مهاراتهم في التصميم والإعلام.',
    skills: ['Graphic Design', 'Content Creation', 'Social Media Marketing', 'Video Editing'],
    gradient: 'from-pink-500/20 to-orange-500/5',
    border: 'border-pink-500/20',
    iconBg: 'bg-pink-500/10',
  },
];

type ContentItem = {
  id: string; title: string; description: string; type: 'بوست' | 'ستوري' | 'فيديو';
  status: 'مخطط' | 'جاهز'; day: string; platform: string[]; club: string; clubEmoji: string;
  week: number;
};

const DEFAULT_CALENDAR_DATA: ContentItem[] = [
  // Week 1 - FFT
  { id:'w1f1', title:'تعرّف على FFT', description:'هل سمعت عن FFT؟ ملتقى طلابي رائد يجمع طلاب من مختلف التخصصات لتطوير مهاراتهم العملية في الذكاء الاصطناعي، ريادة الأعمال، والتسويق. انضم لنا وابدأ رحلتك!', type:'بوست', status:'مخطط', day:'الأحد', platform:['Instagram'], club:'ملتقى FFT', clubEmoji:'🏆', week: 1 },
  { id:'w1f2', title:'ليش FFT مختلف؟', description:'FFT مش مجرد نادي... هو مجتمع كامل يساعدك تبني شبكة علاقات، تشتغل على مشاريع حقيقية، وتكون جاهز لسوق العمل 💪🔥', type:'ستوري', status:'مخطط', day:'الثلاثاء', platform:['Instagram'], club:'ملتقى FFT', clubEmoji:'🏆', week: 1 },
  { id:'w1f3', title:'رؤية FFT - فيديو تعريفي', description:'فيديو قصير يعرض رؤية FFT ورسالته وكيف يساعد الطلاب على التطور والنمو المهني والشخصي 🎬', type:'فيديو', status:'مخطط', day:'الخميس', platform:['Instagram','YouTube'], club:'ملتقى FFT', clubEmoji:'🏆', week: 1 },
  // Week 1 - Tech
  { id:'w1t1', title:'نادي التقنية والذكاء الاصطناعي 🤖', description:'عالم التقنية والذكاء الاصطناعي بينتظرك! نادي التقنية هو مكانك لتتعلم البرمجة، تحليل البيانات، وتطبيقات AI ✨🤖', type:'بوست', status:'مخطط', day:'الأحد', platform:['Instagram'], club:'نادي التقنية والذكاء الاصطناعي', clubEmoji:'🤖', week: 1 },
  { id:'w1t2', title:'أول خطوة في البرمجة', description:'مش لازم تكون خبير! مع نادي التقنية، رح نبدأ معك من الصفر ونوصلك لمستوى احترافي 🚀💻', type:'ستوري', status:'مخطط', day:'الثلاثاء', platform:['Instagram'], club:'نادي التقنية والذكاء الاصطناعي', clubEmoji:'🤖', week: 1 },
  { id:'w1t3', title:'مهارات المستقبل التقنية', description:'Python | Data Analysis | Machine Learning | Web Dev - كل المهارات اللي بتحتاجها لتكون جاهز للمستقبل 📊🐍', type:'بوست', status:'مخطط', day:'الخميس', platform:['Instagram'], club:'نادي التقنية والذكاء الاصطناعي', clubEmoji:'🤖', week: 1 },
];

const NAV_ITEMS = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'النوادي', href: '#clubs' },
  { label: 'التقويم', href: '#calendar' },
  { label: 'خطة التعريف', href: '#intro-plan' },
  { label: 'مصنع الأفكار ✨', href: '/dashboard/idea-factory' },
];

const FILTER_CLUBS = [
  { label: 'الكل', value: 'all' },
  { label: 'ملتقى FFT 🏆', value: 'ملتقى FFT' },
  { label: 'نادي التقنية والذكاء الاصطناعي 🤖', value: 'نادي التقنية والذكاء الاصطناعي' },
  { label: 'نادي ريادة الأعمال والمشاريع 🚀', value: 'نادي ريادة الأعمال والمشاريع' },
  { label: 'نادي الإعلام والإبداع 🎨', value: 'نادي الإعلام والإبداع' },
];

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// ===== COMPONENT =====
export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [calendarFilter, setCalendarFilter] = useState('all');
  const [calendarWeek, setCalendarWeek] = useState(1);
  const [weeks, setWeeks] = useState([1, 2, 3, 4]);
  const [calendarData, setCalendarData] = useState<ContentItem[]>(DEFAULT_CALENDAR_DATA);
  const [isClient, setIsClient] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    title: '', description: '', type: 'بوست', status: 'مخطط', day: 'الأحد', club: 'ملتقى FFT', clubEmoji: '🏆', platform: ['Instagram'], week: 1
  });

  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem('fft_calendar_data');
    if (savedData) setCalendarData(JSON.parse(savedData));
    const savedWeeks = localStorage.getItem('fft_calendar_weeks');
    if (savedWeeks) setWeeks(JSON.parse(savedWeeks));
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('fft_calendar_data', JSON.stringify(calendarData));
      localStorage.setItem('fft_calendar_weeks', JSON.stringify(weeks));
    }
  }, [calendarData, weeks, isClient]);

  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'clubs', 'calendar', 'intro-plan'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addWeek = () => {
    // Find the next available week number
    const nextWeek = weeks.length > 0 ? Math.max(...weeks) + 1 : 1;
    setWeeks([...weeks, nextWeek]);
    setCalendarWeek(nextWeek);
  };

  const deleteWeek = (weekNum: number) => {
    if(confirm(`هل أنت متأكد من حذف الأسبوع ${weekNum} وكل محتواه؟`)) {
      const newWeeks = weeks.filter(w => w !== weekNum);
      setWeeks(newWeeks);
      setCalendarData(calendarData.filter(c => c.week !== weekNum));
      if(calendarWeek === weekNum) {
        setCalendarWeek(newWeeks.length > 0 ? newWeeks[newWeeks.length - 1] : 1);
      }
    }
  };

  const deleteContent = (id: string) => {
    if(confirm("هل أنت متأكد من حذف هذا المحتوى؟")) {
      setCalendarData(calendarData.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setCalendarData(calendarData.map(c => 
      c.id === id ? { ...c, status: c.status === 'مخطط' ? 'جاهز' : 'مخطط' } : c
    ));
  };

  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.title || !newContent.description) return alert('الرجاء إدخال العنوان والوصف');
    
    // Determine Emoji based on Club
    let emoji = '🏆';
    if (newContent.club?.includes('التقنية')) emoji = '🤖';
    if (newContent.club?.includes('ريادة')) emoji = '🚀';
    if (newContent.club?.includes('الإعلام')) emoji = '🎨';

    const item: ContentItem = {
      id: uuidv4(),
      title: newContent.title!,
      description: newContent.description!,
      type: newContent.type as 'بوست' | 'ستوري' | 'فيديو',
      status: newContent.status as 'مخطط' | 'جاهز',
      day: newContent.day!,
      club: newContent.club!,
      clubEmoji: emoji,
      platform: newContent.platform || ['Instagram'],
      week: newContent.week || calendarWeek
    };

    setCalendarData([...calendarData, item]);
    setShowAddModal(false);
    setNewContent({ title: '', description: '', type: 'بوست', status: 'مخطط', day: 'الأحد', club: 'ملتقى FFT', clubEmoji: '🏆', platform: ['Instagram'], week: calendarWeek });
  };

  const filteredContent = calendarData.filter(item =>
    (calendarFilter === 'all' || item.club === calendarFilter) && item.week === calendarWeek
  );

  const introPlanData = weeks.map(w => ({
    week: w,
    label: `الأسبوع ${w}`,
    items: calendarData.filter(c => c.week === w)
  })).filter(w => w.items.length > 0);

  const typeBadge = (type: string) => {
    if (type === 'بوست') return <span className="badge badge-post">📄 بوست</span>;
    if (type === 'ستوري') return <span className="badge badge-story">📱 ستوري</span>;
    return <span className="badge badge-video">🎬 فيديو</span>;
  };

  const statusBadge = (status: string) => {
    if (status === 'مخطط') return <span className="badge badge-planned">🗓 مخطط</span>;
    return <span className="badge badge-ready">✅ جاهز</span>;
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/30" dir="rtl">
      {/* BG Blurs */}
      <div className="fixed top-[-20%] right-[-15%] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-15%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[180px] pointer-events-none" />

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ borderColor: 'rgba(var(--border-color))', background: 'rgba(var(--nav-bg))' }}>
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-primary/20">F</div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'rgb(var(--text-primary))' }}>FFT Hub</span>
            <span className="text-primary">🎓</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href} className={`px-4 py-2 rounded-lg transition-all ${activeSection === item.href.slice(1) ? 'nav-pill-active' : ''} ${item.href.startsWith('/') ? 'text-primary font-bold bg-primary/10 hover:bg-primary/20' : ''}`}
                style={{ color: item.href.startsWith('/') ? '' : (activeSection === item.href.slice(1) ? '#8b5cf6' : 'rgb(var(--text-secondary))') }}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(var(--card-bg))' }}>
              {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(var(--card-bg))' }}>
              {mobileMenu ? <X className="w-4 h-4" style={{ color: 'rgb(var(--text-primary))' }} /> : <Menu className="w-4 h-4" style={{ color: 'rgb(var(--text-primary))' }} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden border-t px-4 py-4 space-y-1" style={{ borderColor: 'rgba(var(--border-color))', background: 'rgba(var(--nav-bg))' }}>
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenu(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.href.startsWith('/') ? 'text-primary font-bold' : ''}`}
                style={{ color: item.href.startsWith('/') ? '' : 'rgb(var(--text-secondary))' }}>{item.label}</a>
            ))}
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* ===== HERO ===== */}
        <section id="home" className="pt-16 sm:pt-24 pb-20 sm:pb-32 text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
              style={{ background: 'rgba(var(--card-bg))', border: '1px solid rgba(var(--border-color))', color: 'rgb(var(--text-secondary))' }}>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              ملتقى طلابي رائد 🏆
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 animate-slide-up" style={{ color: 'rgb(var(--text-primary))' }}>
            مرحباً بك في{' '}
            <span className="gradient-text">FFT Content Hub</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in" style={{ color: 'rgb(var(--text-secondary))', animationDelay: '0.2s' }}>
            منصة إدارة المحتوى الأسبوعي لملتقى FFT الطلابي. نظّم، خطط، وأنشر محتوى النوادي الثلاثة بسهولة واحترافية.
          </p>
          <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/dashboard/idea-factory" className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5" />
              الدخول لمصنع الأفكار (AI)
            </Link>
          </div>
          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[{ num: '3', label: 'نوادي طلابية' }, { num: `+${calendarData.length}`, label: 'محتوى مخطط' }, { num: weeks.length.toString(), label: 'أسابيع تعريفية' }].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">{s.num}</div>
                <div className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CLUBS ===== */}
        <section id="clubs" className="pb-20 sm:pb-32 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>🏛️ النوادي الطلابية</h2>
            <p style={{ color: 'rgb(var(--text-secondary))' }}>ثلاثة نوادي متخصصة مشتقة من ملتقى FFT</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLUBS_DATA.map((club, i) => (
              <div key={i} className={`glass-card p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 group`}>
                <div className={`w-14 h-14 rounded-2xl ${club.iconBg} flex items-center justify-center text-3xl mb-5`}>
                  {club.emoji}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>{club.name}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgb(var(--text-secondary))' }}>{club.description}</p>
                <div className="flex flex-wrap gap-2">
                  {club.skills.map(skill => (
                     <span key={skill} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(var(--card-bg))', color: 'rgb(var(--text-secondary))', border: '1px solid rgba(var(--border-color))' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CALENDAR ===== */}
        <section id="calendar" className="pb-20 sm:pb-32 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>📅 تقويم المحتوى الأسبوعي</h2>
            <p style={{ color: 'rgb(var(--text-secondary))' }}>خطط وتابع المحتوى لكل نادي أسبوعياً</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6 justify-center sm:justify-end">
            <button onClick={() => setShowAddModal(true)} className="filter-pill active text-sm px-4 py-2 rounded-full bg-primary text-white border-primary flex items-center gap-1" style={{ boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
              <Plus className="w-4 h-4" /> إضافة محتوى
            </button>
            <div className="w-full sm:w-auto" />
            {FILTER_CLUBS.map(f => (
              <button key={f.value} onClick={() => setCalendarFilter(f.value)}
                className={`filter-pill ${calendarFilter === f.value ? 'active' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Week tabs */}
          <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
            <span className="text-sm font-bold flex items-center gap-1" style={{ color: 'rgb(var(--text-primary))' }}>📅 الأسبوع:</span>
            {weeks.map(w => (
              <div key={w} className={`week-pill flex items-center gap-2 ${calendarWeek === w ? 'active' : ''}`}>
                <button onClick={() => setCalendarWeek(w)} className="outline-none">الأسبوع {w}</button>
                <button onClick={(e) => { e.stopPropagation(); deleteWeek(w); }} className="opacity-50 hover:opacity-100 text-red-400 transition-opacity" title="حذف الأسبوع">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button onClick={addWeek} className="week-pill text-primary border-primary/50 hover:bg-primary/10">+ أسبوع جديد</button>
          </div>

          {/* Content Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredContent.map(item => (
              <div key={item.id} className="glass-card p-5 group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: 'rgba(var(--card-bg))', color: 'rgb(var(--text-secondary))' }}>
                    {item.club} {item.clubEmoji}
                  </span>
                  <div className="flex gap-1.5">
                    {statusBadge(item.status)}
                    {typeBadge(item.type)}
                  </div>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'rgb(var(--text-primary))' }}>{item.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgb(var(--text-secondary))' }}>{item.description}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(var(--border-color))' }}>
                  <div className="flex items-center gap-3">
                    {item.platform.includes('Instagram') && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                    {item.platform.includes('YouTube') && <Youtube className="w-3.5 h-3.5 text-red-400" />}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mr-auto">
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(item.id); }} title={item.status === 'مخطط' ? "تحديد كـ 'جاهز'" : "تحديد كـ 'مخطط'"}>
                        {item.status === 'مخطط' ? (
                          <Circle className="w-5 h-5 text-gray-500 hover:text-green-400 transition-colors" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500 hover:text-gray-400 transition-colors" />
                        )}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteContent(item.id); }} title="حذف المحتوى">
                        <Trash2 className="w-5 h-5 text-red-500/70 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>🗓 {item.day}</span>
                </div>
              </div>
            ))}
            {filteredContent.length === 0 && (
              <div className="col-span-full text-center py-12 border border-dashed rounded-2xl" style={{ borderColor: 'rgba(var(--border-color))', color: 'rgb(var(--text-secondary))' }}>
                لا يوجد محتوى لهذا النادي في الأسبوع {calendarWeek}
              </div>
            )}
          </div>
        </section>

        {/* ===== INTRO PLAN ===== */}
        <section id="intro-plan" className="pb-20 sm:pb-32 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>📋 خطة المحتوى التعريفي</h2>
            <p style={{ color: 'rgb(var(--text-secondary))' }}>خطة تفصيلية لعرض محتوى الأسابيع لجميع النوادي</p>
          </div>
          <div className="relative timeline-connector space-y-10 pr-12 sm:pr-16">
            {introPlanData.map((week, wi) => (
              <div key={wi} className="relative">
                <div className="timeline-dot" style={{ top: '1.5rem' }} />
                <div className="mb-3">
                  <span className="text-sm font-bold text-primary">{week.label}</span>
                </div>
                <div className="glass-card p-5 sm:p-6 space-y-4">
                  {week.items.map(item => (
                    <div key={item.id} className="p-4 rounded-xl transition-colors border" style={{ background: 'rgba(var(--card-bg))', borderColor: 'rgba(var(--border-color))' }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                           <span className="text-xl">{item.clubEmoji}</span>
                           <span className="font-bold text-sm" style={{ color: 'rgb(var(--text-primary))' }}>
                             {item.title} <span className="text-xs px-2" style={{ color: 'rgb(var(--text-secondary))' }}>({item.club})</span>
                           </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded-md text-gray-400">{item.day}</span>
                          {typeBadge(item.type)}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed pr-8" style={{ color: 'rgb(var(--text-secondary))' }}>{item.description}</p>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 mt-3 pr-8">
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(item.id); }} title={item.status === 'مخطط' ? "تحديد كـ 'جاهز'" : "تحديد كـ 'مخطط'"}>
                          {item.status === 'مخطط' ? (
                            <Circle className="w-5 h-5 text-gray-500 hover:text-green-400 transition-colors" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-500 hover:text-gray-400 transition-colors" />
                          )}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteContent(item.id); }} title="حذف المحتوى">
                          <Trash2 className="w-5 h-5 text-red-500/70 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {introPlanData.length === 0 && (
              <div className="text-center text-gray-400 py-8">لم يتم إضافة أي محتوى للأسابيع حتى الآن.</div>
            )}
          </div>
        </section>
      </main>

      {/* ===== ADD CONTENT MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-surfaceSolid border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6" onClick={e => e.stopPropagation()} style={{ background: 'rgba(var(--nav-bg))', borderColor: 'rgba(var(--border-color))' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">إضافة محتوى جديد (الأسبوع {calendarWeek})</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddContent} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">عنوان المحتوى</label>
                <input type="text" required value={newContent.title} onChange={e => setNewContent({...newContent, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">الوصف</label>
                <textarea required value={newContent.description} onChange={e => setNewContent({...newContent, description: e.target.value})} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">النوع</label>
                  <select value={newContent.type} onChange={e => setNewContent({...newContent, type: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
                    <option value="بوست" className="bg-gray-800">بوست</option>
                    <option value="ستوري" className="bg-gray-800">ستوري</option>
                    <option value="فيديو" className="bg-gray-800">فيديو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">الحالة</label>
                  <select value={newContent.status} onChange={e => setNewContent({...newContent, status: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
                    <option value="مخطط" className="bg-gray-800">مخطط</option>
                    <option value="جاهز" className="bg-gray-800">جاهز</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">النادي</label>
                  <select value={newContent.club} onChange={e => setNewContent({...newContent, club: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none text-xs sm:text-sm">
                    {FILTER_CLUBS.filter(f => f.value !== 'all').map(f => (
                      <option key={f.value} value={f.value} className="bg-gray-800">{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">اليوم</label>
                  <select value={newContent.day} onChange={e => setNewContent({...newContent, day: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
                    {DAYS.map(d => <option key={d} value={d} className="bg-gray-800">{d}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-3 mt-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all">
                حفظ وإضافة للتقويم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="py-8 relative z-10 backdrop-blur-lg" style={{ borderTop: '1px solid rgba(var(--border-color))', background: 'rgba(var(--nav-bg))' }}>
        <div className="container mx-auto px-6 text-center text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          <p>صُنع بـ ❤️ لـ <span className="text-primary font-bold">FFT</span> — ملتقى طلابي رائد © 2026</p>
        </div>
      </footer>
    </div>
  );
}
