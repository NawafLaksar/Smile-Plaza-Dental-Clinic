import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  ArrowUpLeft,
  BadgeCheck,
  Baby,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Facebook,
  HeartHandshake,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Menu,
  Phone,
  ScanLine,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  X,
} from 'lucide-react';
import './index.css';

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
};

type FormErrors = Partial<Record<keyof BookingForm, string>>;

const serviceOptions = [
  'تجميل الأسنان وتبييضها',
  'زراعة الأسنان',
  'تقويم الأسنان',
  'أسنان الأطفال والعائلة',
];

const navItems = [
  { label: 'الرئيسية', target: 'home' },
  { label: 'خدماتنا', target: 'services' },
  { label: 'نتائجنا', target: 'results' },
  { label: 'فريقنا', target: 'doctors' },
  { label: 'تجربة المريض', target: 'journey' },
];

const doctors = [
  {
    initials: 'د. أ',
    name: 'د. أحمد السالم',
    speciality: 'استشاري زراعة وتجميل الأسنان',
    bio: 'خبرة تمتد لأكثر من 14 عاماً في ابتكار خطط علاج طبيعية المظهر.',
    experience: '١٤+ عاماً من الخبرة',
    certification: 'زمالة زراعة الأسنان',
    image: '/doctor-ahmad.png',
  },
  {
    initials: 'د. ن',
    name: 'د. نورة الحربي',
    speciality: 'أخصائية تقويم الأسنان',
    bio: 'تمنح كل ابتسامة وقتها، مع حلول دقيقة تناسب أسلوب حياة المريض.',
    experience: '١١ عاماً من الخبرة',
    certification: 'اعتماد تقويم شفاف',
    image: '/doctor-noura.png',
  },
  {
    initials: 'د. س',
    name: 'د. سارة العتيبي',
    speciality: 'أخصائية أسنان الأطفال',
    bio: 'تبني علاقة محببة مع الصغار لتصبح زيارة الطبيب عادة مطمئنة.',
    experience: '٩ أعوام من الخبرة',
    certification: 'عضو طب أسنان الأطفال',
    image: '/doctor-sara.png',
  },
];

const comparisonCases = [
  {
    label: 'تبييض الأسنان',
    eyebrow: 'إشراقة طبيعية',
    title: 'ابتسامة أكثر إشراقاً',
    description: 'تغيير ناعم يحافظ على طبيعية ابتسامتك ويمنحها حضوراً أجمل.',
    before: '/whitening-before.png',
    after: '/whitening-after.png',
    result: 'إشراقة متوازنة',
  },
  {
    label: 'زراعة الأسنان',
    eyebrow: 'ثبات وراحة',
    title: 'حل يعيد لك الثقة',
    description: 'تصميم دقيق ينسجم مع ابتسامتك ويعيد لك الراحة في تفاصيل يومك.',
    before: '/implant-before.png',
    after: '/implant-after.png',
    result: 'نتيجة طبيعية',
  },
  {
    label: 'تجميل الابتسامة',
    eyebrow: 'تفاصيل تصنع الفرق',
    title: 'تناغم يليق بك',
    description: 'خطة تجميلية شخصية توازن بين صحة الأسنان وشكل الابتسامة.',
    before: '/makeover-before.png',
    after: '/makeover-after.png',
    result: 'تصميم شخصي',
  },
];

function scrollToSection(target: string) {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Reveal({ children, className = '', delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ ...style, transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<BookingForm>({ name: '', phone: '', email: '', service: '', date: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [comparisonPosition, setComparisonPosition] = useState(52);

  const today = new Date().toISOString().split('T')[0];
  const selectedCase = comparisonCases[activeCase];

  const handleNavigation = (target: string) => {
    setMenuOpen(false);
    scrollToSection(target);
  };

  const updateField = (field: keyof BookingForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitted) setSubmitted(false);
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = 'يرجى كتابة الاسم الكامل';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) nextErrors.phone = 'يرجى إدخال رقم جوال صحيح';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    if (!form.service) nextErrors.service = 'اختاري الخدمة المطلوبة';
    if (!form.date) nextErrors.date = 'اختاري التاريخ المناسب';
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
    setForm({ name: '', phone: '', email: '', service: '', date: '' });
  };

  return (
    <div className="site-shell" dir="rtl">
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-items">
            <a className="topbar-item topbar-link" href="tel:+966500554938" data-testid="link-topbar-phone">
              <Phone size={13} />
              050 055 4938
            </a>
            <span className="topbar-item"><Clock3 size={13} /> السبت — الخميس، ٩ ص — ٩ م</span>
          </div>
          <span>رعاية هادئة تبدأ من أول تواصل</span>
        </div>
      </div>

      <header className="nav-wrap">
        <nav className="container nav" aria-label="التنقل الرئيسي">
          <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); handleNavigation('home'); }} data-testid="link-brand">
            <img className="brand-logo" src="/smile-plaza-logo.png" alt="شعار ساحة الابتسامة" />
            <span className="brand-word">
              <strong>ساحة الابتسامة</strong>
              <span>SMILE PLAZA</span>
            </span>
          </a>

          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.target} href={`#${item.target}`} onClick={(event) => { event.preventDefault(); handleNavigation(item.target); }} data-testid={`link-nav-${item.target}`}>
                {item.label}
              </a>
            ))}
          </div>

          <button className="button button-primary" type="button" onClick={() => handleNavigation('booking')} data-testid="button-nav-book">
            احجزي موعدك
            <ArrowUpLeft size={16} />
          </button>

          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setMenuOpen((open) => !open)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a key={item.target} href={`#${item.target}`} onClick={(event) => { event.preventDefault(); handleNavigation(item.target); }} data-testid={`link-mobile-${item.target}`}>
              {item.label}
            </a>
          ))}
          <a href="#booking" onClick={(event) => { event.preventDefault(); handleNavigation('booking'); }} data-testid="link-mobile-book">
            احجزي موعدك
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-layout">
            <div>
              <div className="eyebrow">عيادة أسنان سعودية بمعايير عالمية</div>
              <h1 className="hero-title">رحلتك لابتسامة <em>مثالية</em><br />تبدأ من هنا</h1>
              <p className="hero-copy">
                في ساحة الابتسامة، نؤمن أن الرعاية المميزة لا تظهر في النتيجة فقط، بل في كل لحظة تسبقها. فريقنا يستمع، يشرح، ويصمم لك تجربة تشعر معها بالاطمئنان.
              </p>
              <div className="hero-actions">
                <button className="button button-primary" type="button" onClick={() => scrollToSection('booking')} data-testid="button-hero-book">
                  احجزي استشارتك الآن
                  <ArrowUpLeft size={17} />
                </button>
                <button className="button button-quiet" type="button" onClick={() => scrollToSection('services')} data-testid="button-hero-services">
                  اكتشفي خدماتنا
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="hero-note"><ShieldCheck size={16} /> خطط علاج واضحة، ونتائج تشبهك</div>
            </div>

             <div className="hero-visual" aria-label="تجربة ساحة الابتسامة">
               <div className="hero-photo">
                 <img src="/clinic-hero.png" alt="استشارة أسنان هادئة في عيادة ساحة الابتسامة" />
               </div>
              <div className="visual-wash" />
              <div className="visual-orbit"><Sparkles size={22} /></div>
                <div className="hero-brand-badge">
                  <img className="hero-logo" src="/smile-plaza-logo.png" alt="ساحة الابتسامة - Smile Plaza" />
                </div>
              <div className="visual-card">
                <span className="visual-card-label">موعدك القادم، كما تحبينه</span>
                <strong>استشارة تبدأ بالاستماع</strong>
                <div className="visual-card-bottom"><span /> فريقنا مستعد لاستقبالك</div>
              </div>
              <span className="side-caption">CARE · CONFIDENCE · SMILE</span>
            </div>
          </div>
           <div className="hero-scroll"><i /> اكتشفي عالم ساحة الابتسامة</div>
        </section>

        <section className="trust-strip" aria-label="لماذا ساحة الابتسامة">
          <div className="container trust-grid">
            <div className="trust-item" data-testid="trust-experts">
              <div className="trust-icon"><Stethoscope size={19} /></div>
              <div><strong>فريق طبي موثوق</strong><span>خبرات متخصصة تحت سقف واحد</span></div>
            </div>
            <div className="trust-item" data-testid="trust-care">
              <div className="trust-icon"><HeartHandshake size={19} /></div>
              <div><strong>رعاية تفهمك</strong><span>نشرح لك كل خطوة بهدوء</span></div>
            </div>
            <div className="trust-item" data-testid="trust-technology">
              <div className="trust-icon"><ScanLine size={19} /></div>
              <div><strong>تقنيات دقيقة</strong><span>تشخيص أذكى ونتائج أدق</span></div>
            </div>
            <div className="trust-item" data-testid="trust-families">
              <div className="trust-icon"><Smile size={19} /></div>
              <div><strong>لكل أفراد العائلة</strong><span>من أول سن وحتى أجمل ابتسامة</span></div>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <div className="services-header">
              <Reveal>
                <span className="section-kicker">ما نقدمه لك</span>
                <h2 className="section-heading">العناية التي تحتاجها،<br />بلمسة تليق بك.</h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="section-intro">من التغيير البسيط إلى الخطة المتكاملة، نضع خبرتنا بين يديك لنصل إلى ابتسامة صحية، متوازنة، وتشبهك تماماً.</p>
              </Reveal>
            </div>
            <div className="services-grid">
              <Reveal className="service-card" delay={50}>
                <div className="service-card-media"><img src="/cosmetic-whitening.png" alt="ابتسامة مشرقة بعد تبييض الأسنان" /></div>
                <div className="service-card-body">
                  <span className="service-number">01 / 04</span>
                  <Sparkles className="service-icon" size={30} strokeWidth={1.5} />
                  <h3>تجميل الأسنان<br />وتبييضها</h3>
                  <p>تفاصيل صغيرة تصنع فرقاً كبيراً في إشراقة ابتسامتك.</p>
                  <span className="service-arrow"><ArrowUpLeft size={15} /></span>
                </div>
              </Reveal>
              <Reveal className="service-card implant-card" delay={120}>
                <div className="service-card-media"><img src="/dental-implants.png" alt="فحص الأسنان بأداة طبية تمهيدًا لزراعة الأسنان" /></div>
                <div className="service-card-body">
                  <span className="service-number">02 / 04</span>
                  <ScanLine className="service-icon" size={30} strokeWidth={1.5} />
                  <h3>زراعة<br />الأسنان</h3>
                  <p>حلول ثابتة تعيد لك الراحة والثقة في كل ابتسامة.</p>
                  <span className="service-arrow"><ArrowUpLeft size={15} /></span>
                </div>
              </Reveal>
              <Reveal className="service-card orthodontics-card" delay={190}>
                <div className="service-card-media"><img src="/orthodontics-smile.png" alt="ابتسامة مع تقويم أسنان معدني" /></div>
                <div className="service-card-body">
                  <span className="service-number">03 / 04</span>
                  <Smile className="service-icon" size={30} strokeWidth={1.5} />
                  <h3>تقويم<br />الأسنان</h3>
                  <p>ابتسامة متناسقة بخطة عصرية تناسب يومك.</p>
                  <span className="service-arrow"><ArrowUpLeft size={15} /></span>
                </div>
              </Reveal>
              <Reveal className="service-card pediatric-card" delay={260}>
                <div className="service-card-media"><img src="/family-pediatric.png" alt="طفل مبتسم داخل عيادة أسنان" /></div>
                <div className="service-card-body">
                  <span className="service-number">04 / 04</span>
                  <Baby className="service-icon" size={30} strokeWidth={1.5} />
                  <h3>أسنان الأطفال<br />والعائلة</h3>
                  <p>نبني لدى صغارك علاقة لطيفة ومطمئنة مع العناية.</p>
                  <span className="service-arrow"><ArrowUpLeft size={15} /></span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section results" id="results">
          <div className="container">
            <div className="results-header">
              <Reveal>
                <span className="section-kicker">نتائج نعتز بها</span>
                <h2 className="section-heading">فرقٌ تراه العين،<br />وتشعر به الثقة.</h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="section-intro">كل ابتسامة لها قصتها. تصفحي نماذج توضيحية لنتائج نعمل عليها بعناية، واسحبي المقارنة لتري الفرق.</p>
              </Reveal>
            </div>
            <div className="result-tabs" role="tablist" aria-label="اختاري نوع النتيجة">
              {comparisonCases.map((item, index) => (
                <button
                  key={item.label}
                  className={`result-tab ${activeCase === index ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeCase === index}
                  onClick={() => { setActiveCase(index); setComparisonPosition(52); }}
                  data-testid={`button-result-${index}`}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="results-layout">
              <Reveal className="result-copy">
                <span className="result-eyebrow">{selectedCase.eyebrow}</span>
                <h3>{selectedCase.title}</h3>
                <p>{selectedCase.description}</p>
                <div className="result-highlight">
                  <span className="result-highlight-dot" />
                  <span><strong>{selectedCase.result}</strong> · بتخطيط يناسبك</span>
                </div>
                <button className="button button-primary" type="button" onClick={() => scrollToSection('booking')} data-testid="button-results-book">
                  ابدئي قصتك
                  <ArrowUpLeft size={16} />
                </button>
              </Reveal>
              <Reveal className="comparison-card" delay={120}>
                <div className="comparison-stage">
                  <img src={selectedCase.after} alt={`نتيجة توضيحية بعد ${selectedCase.label}`} />
                  <img
                    className="comparison-before"
                    src={selectedCase.before}
                    alt={`حالة توضيحية قبل ${selectedCase.label}`}
                    style={{ clipPath: `inset(0 ${100 - comparisonPosition}% 0 0)` }}
                  />
                  <span className="compare-label compare-label-before">قبل</span>
                  <span className="compare-label compare-label-after">بعد</span>
                  <div className="comparison-divider" style={{ left: `${comparisonPosition}%` }}>
                    <span><ArrowUpLeft size={15} /></span>
                  </div>
                  <input
                    className="comparison-range"
                    type="range"
                    min="8"
                    max="92"
                    value={comparisonPosition}
                    onChange={(event) => setComparisonPosition(Number(event.target.value))}
                    aria-label={`مقارنة قبل وبعد ${selectedCase.label}`}
                    data-testid="input-comparison-range"
                  />
                </div>
                <div className="comparison-caption">
                  <span>اسحبي للمقارنة</span>
                  <span className="comparison-caption-line" />
                  <span>نماذج توضيحية</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section story" id="journey">
          <div className="container story-layout">
            <Reveal className="story-copy">
              <span className="section-kicker">تجربة مختلفة</span>
              <h2 className="section-heading">لأن الزيارة<br />أكثر من موعد.</h2>
              <p className="section-intro">نعتني بالتفاصيل التي تجعل رحلتك أسهل: من استقبال دافئ، إلى تشخيص مفهوم، إلى متابعة لا تنتهي بخروجك من العيادة.</p>
              <p className="story-quote">«نريد أن تغادري وأنتِ تعرفين تماماً أن ابتسامتك في أيدٍ أمينة.»</p>
            </Reveal>
            <div className="story-steps">
              <Reveal className="step" delay={80}>
                <span className="step-number">الخطوة الأولى</span>
                <h3>نستمع لك</h3>
                <p>نبدأ من احتياجك الحقيقي، لا من قالب جاهز. وقتك وتوقعاتك هما نقطة البداية.</p>
              </Reveal>
              <Reveal className="step" delay={160}>
                <span className="step-number">الخطوة الثانية</span>
                <h3>نوضح الصورة</h3>
                <p>تشخيص دقيق وخطة واضحة بلغة بسيطة، لتتخذي قرارك وأنتِ مطمئنة.</p>
              </Reveal>
              <Reveal className="step" delay={240}>
                <span className="step-number">الخطوة الثالثة</span>
                <h3>نرافقك</h3>
                <p>متابعة قريبة واهتمام مستمر حتى تستقري على ابتسامة تحبينها كل يوم.</p>
              </Reveal>
              <Reveal className="step" delay={320}>
                <span className="step-number">النتيجة</span>
                <h3>تبتسمين بثقة</h3>
                <p>تغيير طبيعي يليق بك، يبدأ من صحة فمك ويصل إلى حضورك.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section doctors" id="doctors">
          <div className="container">
            <div className="doctor-header">
              <Reveal>
                <span className="section-kicker">أشخاص يهتمون</span>
                <h2 className="section-heading">خبرة تسمعينها<br />في كل إجابة.</h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="section-intro">وراء كل ابتسامة في ساحة الابتسامة طبيب يملك العلم، والوقت، والاهتمام ليمنحك أفضل ما لديه.</p>
              </Reveal>
            </div>
            <div className="doctor-grid">
              {doctors.map((doctor, index) => (
                <Reveal key={doctor.name} className="doctor-card" delay={index * 110}>
                  <div className="doctor-portrait">
                    <img src={doctor.image} alt={`صورة ${doctor.name}`} />
                    <span className="doctor-dot" />
                  </div>
                  <div className="doctor-info">
                    <h3 data-testid={`text-doctor-name-${index}`}>{doctor.name}</h3>
                    <span>{doctor.speciality}</span>
                    <div className="doctor-meta">
                      <span>{doctor.experience}</span>
                      <span><BadgeCheck size={13} /> {doctor.certification}</span>
                    </div>
                    <p>{doctor.bio}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section voices">
          <div className="container voices-layout">
            <Reveal>
              <span className="section-kicker">من قلب التجربة</span>
              <div className="voices-mark">“</div>
              <p className="voice-quote">«من أول مكالمة حسيت أني مو مجرد رقم موعد. النتيجة طبيعية جداً، وهذا بالضبط اللي كنت أتمناه.»</p>
               <div className="voice-by">نوف، إحدى مريضات ساحة الابتسامة</div>
            </Reveal>
            <div className="voice-cards">
              <Reveal className="voice-card" delay={130}>
                <div className="stars" aria-label="تقييم خمس نجوم"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                <p>أسلوب راقٍ جداً وشرح واضح لكل الخيارات. ابنتي لم تعد تخاف من موعد الأسنان.</p>
                <strong>ريم العبدالله — علاج أسنان الأطفال</strong>
              </Reveal>
              <Reveal className="voice-card" delay={230}>
                <div className="stars" aria-label="تقييم خمس نجوم"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                <p>التزام بالمواعيد واهتمام بالتفاصيل. أشعر أن ابتسامتي أصبحت أهدأ وأكثر ثقة.</p>
                <strong>خالد المطيري — تقويم الأسنان</strong>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section booking" id="booking">
          <div className="container booking-layout">
            <Reveal className="booking-aside">
              <span className="section-kicker">خطوتك الأولى</span>
              <h2 className="section-heading">جاهزة لابتسامة<br />تشبهك؟</h2>
              <p className="section-intro">اتركي بياناتك وسيتواصل معك فريقنا في أقرب وقت لتأكيد الموعد المناسب لك.</p>
              <div className="booking-promise"><CheckCircle2 size={18} /> نضمن لك خصوصية بياناتك، ووضوح كل تفاصيل رحلتك قبل البدء.</div>
              <div className="booking-actions">
                <a className="booking-contact" href="tel:+966500554938" data-testid="link-booking-phone"><Phone size={17} /> 050 055 4938</a>
                <a className="booking-whatsapp" href="https://wa.me/966500554938?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF" target="_blank" rel="noreferrer" data-testid="link-booking-whatsapp">
                  <MessageCircle size={17} /> تواصلي عبر واتساب
                </a>
              </div>
            </Reveal>

            <Reveal className="booking-form-wrap" delay={130}>
              <div className="form-top">
                <div>
                  <h3>احجزي استشارتك</h3>
                  <span>املئي البيانات وسنعاود التواصل معك</span>
                </div>
                <img className="brand-logo" src="/smile-plaza-logo.png" alt="" aria-hidden="true" />
              </div>
              <form className="booking-form" onSubmit={handleSubmit} noValidate>
                {submitted && (
                  <div className="success-message" role="status" data-testid="status-booking-success">
                    <CheckCircle2 size={21} />
                    <div><strong>تم استلام طلبك بنجاح!</strong><span>سنتواصل معك لتأكيد الموعد</span></div>
                  </div>
                )}
                <div className="field">
                  <label htmlFor="booking-name">الاسم الكامل</label>
                  <input id="booking-name" type="text" placeholder="مثال: سارة محمد" value={form.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} data-testid="input-booking-name" />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="booking-phone">رقم الجوال</label>
                  <input id="booking-phone" type="tel" placeholder="05X XXX XXXX" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} data-testid="input-booking-phone" />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="field">
                  <label htmlFor="booking-email">البريد الإلكتروني</label>
                  <input id="booking-email" type="email" placeholder="name@email.com" value={form.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} data-testid="input-booking-email" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="booking-service">الخدمة المطلوبة</label>
                  <select id="booking-service" value={form.service} onChange={(event) => updateField('service', event.target.value)} aria-invalid={Boolean(errors.service)} data-testid="select-booking-service">
                    <option value="">اختاري الخدمة</option>
                    {serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
                  </select>
                  {errors.service && <span className="field-error">{errors.service}</span>}
                </div>
                <div className="field full">
                  <label htmlFor="booking-date">التاريخ المفضل للزيارة</label>
                  <input id="booking-date" type="date" min={today} value={form.date} onChange={(event) => updateField('date', event.target.value)} aria-invalid={Boolean(errors.date)} data-testid="input-booking-date" />
                  {errors.date && <span className="field-error">{errors.date}</span>}
                </div>
                <div className="submit-row">
                  <span className="submit-note"><ShieldCheck size={15} /> بياناتك محفوظة بسرية تامة</span>
                  <button className="button form-submit" type="submit" data-testid="button-booking-submit">
                    إرسال الطلب
                    <ArrowUpLeft size={16} />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); handleNavigation('home'); }} data-testid="link-footer-brand">
                <img className="brand-logo" src="/smile-plaza-logo.png" alt="شعار ساحة الابتسامة" />
                <span className="brand-word"><strong>ساحة الابتسامة</strong><span>SMILE PLAZA</span></span>
              </a>
              <p className="footer-about">مساحتك الهادئة لابتسامة صحية وواثقة في مكة. نراك كما أنت، ونعتني بك كما تستحق.</p>
            </div>
            <div>
              <h3 className="footer-title">تواصلي معنا</h3>
              <ul className="footer-list">
                <li><Phone size={15} /><a className="topbar-link" href="tel:+966500554938" data-testid="link-footer-phone">050 055 4938</a></li>
                <li><Mail size={15} /><a className="topbar-link" href="mailto:smile.plaza.dent@gmail.com" data-testid="link-footer-email">smile.plaza.dent@gmail.com</a></li>
                <li><MapPin size={15} /><span>الخالدية - شارع محمد صالح قزاز<br />مكة المكرمة، المملكة العربية السعودية 24211</span></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-title">ساعات العمل</h3>
              <ul className="footer-list">
                <li><Clock3 size={15} /><span>السبت — الخميس<br />٩:٠٠ صباحاً — ٩:٠٠ مساءً</span></li>
                <li><CalendarDays size={15} /><span>الجمعة<br />مغلق — للطوارئ اتصلي بنا</span></li>
              </ul>
            </div>
            <div className="footer-map">
              <h3 className="footer-title">موقعنا في مكة المكرمة</h3>
              <a
                className="map-placeholder"
                href="https://www.google.com/maps/search/?api=1&query=%D8%B3%D8%A7%D8%AD%D8%A9%20%D8%A7%D9%84%D8%A7%D8%A8%D8%AA%D8%B3%D8%A7%D9%85%D8%A9%20%D8%A7%D9%84%D8%AE%D8%A7%D9%84%D8%AF%D9%8A%D8%A9%20%D9%85%D9%83%D8%A9"
                target="_blank"
                rel="noreferrer"
                aria-label="فتح موقع ساحة الابتسامة في خرائط Google"
                data-testid="map-location"
              >
                <span className="map-details">
                  <strong>الخالدية</strong>
                  <span>شارع محمد صالح قزاز</span>
                  <span>مكة المكرمة</span>
                </span>
                <span className="map-pin"><MapPin size={16} /></span>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© ٢٠٢٤ ساحة الابتسامة. جميع الحقوق محفوظة.</span>
            <div className="social-links" aria-label="حسابات التواصل الاجتماعي">
              <a className="social-link" href="https://www.instagram.com/smileplaza.sa/" target="_blank" rel="noreferrer" aria-label="إنستغرام ساحة الابتسامة" data-testid="link-social-instagram"><Instagram size={16} /></a>
              <a className="social-link" href="https://www.facebook.com/smileplaza.sa/" target="_blank" rel="noreferrer" aria-label="فيسبوك ساحة الابتسامة" data-testid="link-social-facebook"><Facebook size={16} /></a>
              <a className="social-link" href="https://x.com/SmileplazaSa" target="_blank" rel="noreferrer" aria-label="إكس ساحة الابتسامة" data-testid="link-social-linkedin"><Linkedin size={16} /></a>
            </div>
            <button className="back-top" type="button" onClick={() => scrollToSection('home')} aria-label="العودة إلى الأعلى" data-testid="button-back-top"><ArrowUpLeft size={17} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;