"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, Sun, Moon, Instagram, Youtube, Edit3, Image, Film, ChevronLeft } from 'lucide-react';

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
};

const CALENDAR_DATA: ContentItem[] = [
  // Week 1 - FFT
  { id:'w1f1', title:'تعرّف على FFT', description:'هل سمعت عن FFT؟ ملتقى طلابي رائد يجمع طلاب من مختلف التخصصات لتطوير مهاراتهم العملية في الذكاء الاصطناعي، ريادة الأعمال، والتسويق. انضم لنا وابدأ رحلتك!', type:'بوست', status:'مخطط', day:'الأحد', platform:['Instagram'], club:'ملتقى FFT', clubEmoji:'🏆' },
  { id:'w1f2', title:'ليش FFT مختلف؟', description:'FFT مش مجرد نادي... هو مجتمع كامل يساعدك تبني شبكة علاقات، تشتغل على مشاريع حقيقية، وتكون جاهز لسوق العمل 💪🔥', type:'ستوري', status:'مخطط', day:'الثلاثاء', platform:['Instagram'], club:'ملتقى FFT', clubEmoji:'🏆' },
  { id:'w1f3', title:'رؤية FFT - فيديو تعريفي', description:'فيديو قصير يعرض رؤية FFT ورسالته وكيف يساعد الطلاب على التطور والنمو المهني والشخصي 🎬', type:'فيديو', status:'مخطط', day:'الخميس', platform:['Instagram','YouTube'], club:'ملتقى FFT', clubEmoji:'🏆' },
  // Week 1 - Tech
  { id:'w1t1', title:'نادي التقنية والذكاء الاصطناعي 🤖', description:'عالم التقنية والذكاء الاصطناعي بينتظرك! نادي التقنية هو مكانك لتتعلم البرمجة، تحليل البيانات، وتطبيقات AI ✨🤖', type:'بوست', status:'مخطط', day:'الأحد', platform:['Instagram'], club:'نادي التقنية والذكاء الاصطناعي', clubEmoji:'🤖' },
  { id:'w1t2', title:'أول خطوة في البرمجة', description:'مش لازم تكون خبير! مع نادي التقنية، رح نبدأ معك من الصفر ونوصلك لمستوى احترافي 🚀💻', type:'ستوري', status:'مخطط', day:'الثلاثاء', platform:['Instagram'], club:'نادي التقنية والذكاء الاصطناعي', clubEmoji:'🤖' },
  { id:'w1t3', title:'مهارات المستقبل التقنية', description:'Python | Data Analysis | Machine Learning | Web Dev - كل المهارات اللي بتحتاجها لتكون جاهز للمستقبل 📊🐍', type:'بوست', status:'مخطط', day:'الخميس', platform:['Instagram'], club:'نادي التقنية والذكاء الاصطناعي', clubEmoji:'🤖' },
  // Week 1 - Entrepreneurship
  { id:'w1e1', title:'نادي ريادة الأعمال 🚀', description:'عندك فكرة مشروع بس ما بتعرف من وين تبدأ؟ نادي ريادة الأعمال والمشاريع رح يساعدك تحول فكرتك لمشروع ريادي ناجح! 💡🔥', type:'بوست', status:'مخطط', day:'الأحد', platform:['Instagram'], club:'نادي ريادة الأعمال والمشاريع', clubEmoji:'🚀' },
  { id:'w1e2', title:'من فكرة لمشروع ريادي', description:'الخطوة الأولى دائماً هي الأصعب... بس مع نادي ريادة الأعمال، رح نمشي معك خطوة بخطوة من الفكرة للتنفيذ 🎯', type:'ستوري', status:'مخطط', day:'الثلاثاء', platform:['Instagram'], club:'نادي ريادة الأعمال والمشاريع', clubEmoji:'🚀' },
  { id:'w1e3', title:'مهارات ريادة الأعمال', description:'Business Model Canvas | Pitch Deck | Market Research | Financial Planning - كل المهارات اللي بتحتاجها لتأسس مشروعك 📋🚀', type:'بوست', status:'مخطط', day:'الخميس', platform:['Instagram'], club:'نادي ريادة الأعمال والمشاريع', clubEmoji:'🚀' },
  // Week 1 - Media
  { id:'w1m1', title:'نادي الإعلام والإبداع 🎨', description:'إذا عندك شغف بالتصميم، صناعة المحتوى، أو التسويق الرقمي - نادي الإعلام والإبداع هو مكانك! انضم لمجتمع المبدعين ✨🎬', type:'بوست', status:'مخطط', day:'الأحد', platform:['Instagram'], club:'نادي الإعلام والإبداع', clubEmoji:'🎨' },
  { id:'w1m2', title:'إبداعك يبدأ من هون', description:'التصميم 🎨 | المونتاج 🎬 | كتابة المحتوى ✍️ | التسويق الرقمي 📱 طوّر إبداعك معنا!', type:'ستوري', status:'مخطط', day:'الثلاثاء', platform:['Instagram'], club:'نادي الإعلام والإبداع', clubEmoji:'🎨' },
  { id:'w1m3', title:'أنواع المحتوى الإبداعي', description:'المحتوى الإبداعي مش بس تصميم! هو فيديو، بودكاست، مقال، إنفوجرافيك وأكثر... تعال نستكشف الإبداع سوا! 🎭🌟', type:'بوست', status:'مخطط', day:'الخميس', platform:['Instagram'], club:'نادي الإعلام والإبداع', clubEmoji:'🎨' },
];

const INTRO_PLAN = [
  { week: 1, label: 'الأسبوع الأول', clubLabel: 'ملتقى FFT', clubEmoji: '🏆', items: CALENDAR_DATA.filter(c => c.club === 'ملتقى FFT') },
  { week: 2, label: 'الأسبوع الثاني', clubLabel: 'Tech & AI Club', clubEmoji: '🤖', items: CALENDAR_DATA.filter(c => c.clubEmoji === '🤖') },
  { week: 3, label: 'الأسبوع الثالث', clubLabel: 'Entrepreneurship & Projects Club', clubEmoji: '🚀', items: CALENDAR_DATA.filter(c => c.clubEmoji === '🚀') },
  { week: 4, label: 'الأسبوع الرابع', clubLabel: 'Media & Creativity Club', clubEmoji: '🎨', items: CALENDAR_DATA.filter(c => c.clubEmoji === '🎨') },
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

// ===== COMPONENT =====
export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [calendarFilter, setCalendarFilter] = useState('all');
  const [calendarWeek, setCalendarWeek] = useState(1);

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

  const filteredContent = CALENDAR_DATA.filter(item =>
    calendarFilter === 'all' || item.club === calendarFilter
  );

  const typeBadge = (type: string) => {
    if (type === 'بوست') return <span className="badge badge-post">📄 بوست</span>;
    if (type === 'ستوري') return <span className="badge badge-story">📱 ستوري</span>;
    return <span className="badge badge-video">🎬 فيديو</span>;
  };

  const statusBadge = (status: string) => {
    if (status === 'مخطط') return <span className="badge badge-planned">🗓 مخطط</span>;
    return <span className="badge badge-ready">✅ جاهز</span>;
  };

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/30">
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
                className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{ color: 'rgb(var(--text-secondary))' }}>{item.label}</a>
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
            {[{ num: '3', label: 'نوادي طلابية' }, { num: '+12', label: 'محتوى مخطط' }, { num: '4', label: 'أسابيع تعريفية' }].map(s => (
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
            <button className="filter-pill active text-sm px-4 py-2 rounded-full bg-primary text-white border-primary" style={{ boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
              + إضافة محتوى
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
            {[1, 2, 3, 4].map(w => (
              <button key={w} onClick={() => setCalendarWeek(w)} className={`week-pill ${calendarWeek === w ? 'active' : ''}`}>
                الأسبوع {w}
              </button>
            ))}
            <button className="week-pill">+ أسبوع جديد</button>
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
                  <div className="flex items-center gap-2">
                    {item.platform.includes('Instagram') && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                    {item.platform.includes('YouTube') && <Youtube className="w-3.5 h-3.5 text-red-400" />}
                    <Edit3 className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                  <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>🗓 {item.day}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== INTRO PLAN ===== */}
        <section id="intro-plan" className="pb-20 sm:pb-32 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>📋 خطة المحتوى التعريفي</h2>
            <p style={{ color: 'rgb(var(--text-secondary))' }}>خطة 4 أسابيع للتعريف بـ FFT والنوادي الثلاثة</p>
          </div>
          <div className="relative timeline-connector space-y-10 pr-12 sm:pr-16">
            {INTRO_PLAN.map((week, wi) => (
              <div key={wi} className="relative">
                <div className="timeline-dot" style={{ top: '1.5rem' }} />
                <div className="mb-3">
                  <span className="text-sm font-bold text-primary">{week.label}: <span className="text-secondary">{week.clubLabel}</span></span>
                </div>
                <div className="glass-card p-5 sm:p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'rgb(var(--text-primary))' }}>
                    {week.clubEmoji} {week.items[0]?.club || week.clubLabel}
                  </h3>
                  <div className="space-y-3">
                    {week.items.map(item => (
                      <div key={item.id} className="p-3 rounded-xl transition-colors" style={{ background: 'rgba(var(--card-bg))' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm" style={{ color: 'rgb(var(--text-primary))' }}>
                            {item.title} • <span style={{ color: 'rgb(var(--text-secondary))' }}>{item.day}</span>
                          </span>
                          {typeBadge(item.type)}
                        </div>
                        <p className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 relative z-10 backdrop-blur-lg" style={{ borderTop: '1px solid rgba(var(--border-color))', background: 'rgba(var(--nav-bg))' }}>
        <div className="container mx-auto px-6 text-center text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          <p>صُنع بـ ❤️ لـ <span className="text-primary font-bold">FFT</span> — ملتقى طلابي رائد © 2026</p>
        </div>
      </footer>
    </div>
  );
}
