import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TruckList from './views/TruckList';
import Drivers from './views/Drivers';
import DriverModal from './components/DriverModal';
import Financing from './views/Financing';
import TruckCard from './components/TruckCard';
import Chatbot from './components/ChatBot';
import jamohLogo from './assets/jamohTruckslogo.png';
import heroImage1 from './assets/heroImage1.jpg';
import heroImage2 from './assets/heroImage2.jpg';

// --- TYPES ---
interface Truck {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string;
  truck_condition: string;
  images: string[];
  location: string;
  paymentMethod: string;
  deposit: string;
  monthlyInstallments: string;
}

type ViewState = 'home' | 'list' | 'drivers' | 'financing';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BRAND_ORANGE = '#F28C28';
const RICH_BLACK = '#1a1a1a';

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [view, setView] = useState<ViewState>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    location: '',
    priceRange: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const carouselImages = [heroImage1, heroImage2];

  const handleLinkClick = (view: ViewState) => {
    setView(view);
    setIsMenuOpen(false);
  };

  // AOS init
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-out-cubic',
      offset: 60,
    });
  }, []);

  // Hero carousel auto-slide
  useEffect(() => {
    if (view === 'home') {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [view]);

  // Fetch trucks
  useEffect(() => {
    fetch('http://localhost:8080/jamo_trucks/jamo_trucks/src/backend/getTrucks.php')
      .then(res => res.json())
      .then(data => {
        setTrucks(data);
        setFilteredTrucks(data.slice(0, 12));
      });
  }, []);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Nav scroll shadow
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter & Sort
  useEffect(() => {
    let result = [...trucks];
    if (filters.make) result = result.filter(t => t.make === filters.make);
    if (filters.model) result = result.filter(t => t.model.toLowerCase().includes(filters.model.toLowerCase()));
    if (filters.year) result = result.filter(t => t.year.toString() === filters.year);
    if (filters.location) result = result.filter(t => t.location === filters.location);
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(t => {
        const p = parseFloat(t.price);
        return max ? (p >= min && p <= max) : (p >= min);
      });
    }
    if (sortBy === 'price-low') result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortBy === 'price-high') result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (sortBy === 'year-desc') result.sort((a, b) => b.year - a.year);
    if (sortBy === 'year-asc') result.sort((a, b) => a.year - b.year);
    setFilteredTrucks(result.slice(0, 12));
  }, [filters, sortBy, trucks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // =============== RENDER ===============
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif", margin: 0, padding: 0, backgroundColor: '#fff' }}>

      {/* ▬▬▬ 1. TOP UTILITY BAR ▬▬▬ */}
      <div style={utilityBar}>
        <div style={getUtilityBarInnerStyle(isMobile)}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={utilityLink} onClick={() => handleLinkClick('drivers')}>Find a Driver</span>
            <span style={utilityDivider}>|</span>
            <span style={utilityLink} onClick={() => setIsModalOpen(true)}>Become a Driver</span>
            <span style={utilityDivider}>|</span>
            <span style={utilityLink} onClick={() => handleLinkClick('financing')}>Financing</span>
          </div>
          <span style={{ ...utilityLink, opacity: 0.7, cursor: 'default' }}>
            ✆ +254 791 790744
          </span>
        </div>
      </div>

      {/* ▬▬▬ 2. MAIN NAVIGATION ▬▬▬ */}
      <nav style={{
        ...navBar,
        boxShadow: navScrolled ? '0 4px 30px rgba(0,0,0,0.12)' : '0 1px 0 rgba(0,0,0,0.06)',
      }}>
        <div style={navBarInner}>

          {/* Logo */}
          <div style={navLogoContainer} onClick={() => handleLinkClick('home')}>
            <img
              src={jamohLogo}
              alt="Jamoh Trucks Logo"
              style={{ width: '90px', height: 'auto', objectFit: 'contain' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={navLogoText}>Jamoh Trucks</span>
              <span style={navLogoSubText}>Sellers Kenya</span>
            </div>
          </div>

          {/* Desktop Links & CTA */}
          {!isMobile && (
            <>
              {/* Links */}
              <div style={navLinksContainer}>
                {(['home', 'drivers'] as ViewState[]).map((v) => (
                  <span
                    key={v}
                    onClick={() => handleLinkClick(v)}
                    style={{ ...(view === v ? activeNavLink : navLink) }}
                  >
                    {v === 'home' ? 'Home' : 'Drivers'}
                    {view === v && <span style={navUnderline} />}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div style={navCtaContainer}>
                <button
                  onClick={() => handleLinkClick('list')}
                  style={navCTABtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND_ORANGE;
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = RICH_BLACK;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ color: BRAND_ORANGE, fontSize: '8px', marginRight: '6px', transition: 'color 0.3s' }}>⬤</span>
                  VIEW INVENTORY
                </button>
              </div>
            </>
          )}

          {/* Hamburger Toggle */}
          {isMobile && (
            <div style={hamburgerIcon} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div style={{ ...hamburgerLine, transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <div style={{ ...hamburgerLine, opacity: isMenuOpen ? 0 : 1 }} />
              <div style={{ ...hamburgerLine, transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }} />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobile && (
        <>
          <div style={{ ...mobileMenuBackdrop, opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? 'auto' : 'none' }} onClick={() => setIsMenuOpen(false)} />
          <div style={{ ...mobileMenuDrawer, transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
            <div style={{ padding: '80px 30px 30px 30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(['home', 'drivers', 'financing'] as ViewState[]).map((v) => (
                <span key={v} onClick={() => handleLinkClick(v)} style={mobileNavLink}>
                  {v === 'home' ? 'Home' : v.charAt(0).toUpperCase() + v.slice(1)}
                </span>
              ))}

              <button
                onClick={() => handleLinkClick('list')}
                style={{ ...navCTABtn, width: '100%', marginTop: '20px', justifyContent: 'center' }}
              >
                VIEW INVENTORY
              </button>
            </div>
          </div>
        </>
      )}

      {/* ▬▬▬ HOME VIEW ▬▬▬ */}
      {view === 'home' && (
        <>
          {/* ▬▬▬ 3. HERO SECTION ▬▬▬ */}
          <section style={heroContainer} aria-label="Hero banner">
            {/* Background slides */}
            {carouselImages.map((img, index) => (
              <div
                key={index}
                style={{
                  ...heroSlide,
                  backgroundImage: `url(${img})`,
                  opacity: currentSlide === index ? 1 : 0,
                  transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            ))}

            {/* Gradient overlay */}
            <div style={heroOverlay} />

            {/* Content */}
            <div style={getHeroContentStyle(isMobile)}>
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-duration="1000"
              >
                <p style={heroEyebrow}>TRUSTED BY TRANSPORTERS ACROSS EAST AFRICA</p>
                <h1 style={heroTitle}>
                  Premium Heavy Duty{' '}
                  <span style={{ color: BRAND_ORANGE, display: 'inline-block' }}>Trucks</span>
                </h1>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="1000"
              >
                <p style={heroSubtitle}>
                  Reliable transport solutions for the Kenyan terrain.
                  New arrivals weekly in Nairobi & Mombasa.
                </p>
              </div>
              <div
                style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}
                data-aos="fade-up"
                data-aos-delay="500"
                data-aos-duration="1000"
              >
                <button
                  onClick={() => handleLinkClick('list')}
                  style={heroPrimaryBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.06)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(242, 140, 40, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(242, 140, 40, 0.3)';
                  }}
                >
                  View Inventory →
                </button>
                <button
                  onClick={() => handleLinkClick('financing')}
                  style={heroSecondaryBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Get Financing
                </button>
              </div>
            </div>

            {/* Carousel dots */}
            <div style={dotContainer}>
              {carouselImages.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  style={{
                    ...dot,
                    backgroundColor: currentSlide === i ? BRAND_ORANGE : 'rgba(255,255,255,0.4)',
                    width: currentSlide === i ? '32px' : '10px',
                  }}
                />
              ))}
            </div>

            {/* Bottom gradient fade */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, width: '100%', height: '80px',
              background: 'linear-gradient(to top, #fff 0%, transparent 100%)',
              zIndex: 3,
            }} />
          </section>

          {/* ▬▬▬ 4. MAIN CONTENT (Sidebar + Grid) ▬▬▬ */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            maxWidth: '1300px',
            margin: '0 auto',
            padding: isMobile ? '20px 15px' : '50px 20px',
            gap: isMobile ? '20px' : '30px'
          }}>
            {/* Sidebar */}
            <aside style={{ width: isMobile ? '100%' : '280px', flexShrink: 0 }} data-aos="fade-right" data-aos-delay="100">
              <div style={filterCard}>
                <h3 style={filterHeading}>
                  <span style={{ display: 'inline-block', width: '4px', height: '20px', backgroundColor: BRAND_ORANGE, marginRight: '10px', borderRadius: '2px' }} />
                  Find Your Truck
                </h3>

                <div style={filterGroup}>
                  <label style={filterLabel}>Brand</label>
                  <select name="make" style={filterInput} value={filters.make} onChange={handleFilterChange}>
                    <option value="">All Makes</option>
                    <option value="Scania">Scania</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Volvo">Volvo</option>
                    <option value="Isuzu">Isuzu</option>
                  </select>
                </div>

                <div style={filterGroup}>
                  <label style={filterLabel}>Model</label>
                  <input name="model" type="text" placeholder="e.g. Actros" style={filterInput} value={filters.model} onChange={handleFilterChange} />
                </div>

                <div style={filterGroup}>
                  <label style={filterLabel}>Location</label>
                  <select name="location" style={filterInput} value={filters.location} onChange={handleFilterChange}>
                    <option value="">All Locations</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Nakuru">Nakuru</option>
                  </select>
                </div>

                <div style={filterGroup}>
                  <label style={filterLabel}>Year</label>
                  <select name="year" style={filterInput} value={filters.year} onChange={handleFilterChange}>
                    <option value="">Any Year</option>
                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div style={filterGroup}>
                  <label style={filterLabel}>Price Range</label>
                  <select name="priceRange" style={filterInput} value={filters.priceRange} onChange={handleFilterChange}>
                    <option value="">Any Price</option>
                    <option value="0-3000000">Under 3M KES</option>
                    <option value="3000000-6000000">3M – 6M KES</option>
                    <option value="6000000-10000000">6M – 10M KES</option>
                    <option value="10000000">Over 10M KES</option>
                  </select>
                </div>

                <button
                  style={resetBtn}
                  onClick={() => setFilters({ make: '', model: '', year: '', location: '', priceRange: '' })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = RICH_BLACK;
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Grid */}
            <main style={{ flexGrow: 1 }}>
              <div style={gridHeader}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', color: RICH_BLACK }}>Recent Inventory</h2>
                  <span style={{ color: '#999', fontSize: '13px' }}>Found {filteredTrucks.length} results</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Sort:</label>
                  <select style={sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="year-desc">Year: Newest</option>
                    <option value="year-asc">Year: Oldest</option>
                  </select>
                </div>
              </div>

              <div style={getHomepageGridStyle(isMobile)}>
                {filteredTrucks.map(truck => (
                  <TruckCard
                    key={truck.id}
                    truck={truck}
                    baseUrl={BASE_URL}
                    onClick={() => handleLinkClick('list')}
                  />
                ))}
              </div>

              <button
                onClick={() => handleLinkClick('list')}
                style={viewAllBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = RICH_BLACK;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = RICH_BLACK;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = RICH_BLACK;
                  e.currentTarget.style.borderColor = RICH_BLACK;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                VIEW ALL INVENTORY →
              </button>
            </main>
          </div>
        </>
      )}

      {view === 'list' && <TruckList baseUrl={BASE_URL} />}
      {view === 'drivers' && <Drivers />}
      {view === 'financing' && <Financing />}
      {isModalOpen && <DriverModal onClose={() => setIsModalOpen(false)} />}
      <Chatbot />
    </div>
  );
};


// ═════════════════════════════════════════════
// STYLES — Modern Industrial
// ═════════════════════════════════════════════

const getUtilityBarInnerStyle = (isMobile: boolean): React.CSSProperties => ({
  maxWidth: '1300px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: isMobile ? 'space-around' : 'flex-end',
  alignItems: 'center',
  gap: '12px',
});

const getHeroContentStyle = (isMobile: boolean): React.CSSProperties => ({
  position: 'relative',
  zIndex: 2,
  maxWidth: '1300px',
  margin: '0 auto',
  padding: isMobile ? '0 20px' : '0 40px',
  width: '100%',
  color: 'white',
  textAlign: isMobile ? 'center' : 'left',
});

// --- Utility Bar ---
const utilityBar: React.CSSProperties = {
  backgroundColor: RICH_BLACK,
  color: 'rgba(255,255,255,0.7)',
  padding: '8px 20px',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.5px',
};

const utilityLink: React.CSSProperties = {
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'color 0.25s ease',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
};

const utilityDivider: React.CSSProperties = {
  opacity: 0.25,
  fontSize: '10px',
};

// --- Navigation ---
const navBar: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.97)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderBottom: `2px solid ${BRAND_ORANGE}`,
  transition: 'box-shadow 0.3s ease',
  height: '70px',
};

const navBarInner: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1300px',
  height: '100%',
  margin: '0 auto',
  padding: '0 20px',
};

const navLogoContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  cursor: 'pointer',
  flexShrink: 0,
};

const navLogoText: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 900,
  color: RICH_BLACK,
  textTransform: 'uppercase',
  letterSpacing: '-1px',
  lineHeight: 1,
};

const navLogoSubText: React.CSSProperties = {
  color: BRAND_ORANGE,
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '3px',
  marginTop: '2px',
};

const navLinksContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '30px',
  width: '100%',
};

const navLink: React.CSSProperties = {
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 700,
  color: '#555',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  position: 'relative',
  padding: '26px 4px',
  transition: 'color 0.3s ease',
};

const activeNavLink: React.CSSProperties = {
  ...navLink,
  color: BRAND_ORANGE,
};

const navUnderline: React.CSSProperties = {
  position: 'absolute',
  bottom: '-2px',
  left: 0,
  width: '100%',
  height: '2px',
  backgroundColor: BRAND_ORANGE,
  borderRadius: '2px',
};

const navCtaContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  flexShrink: 0,
};

const navCTABtn: React.CSSProperties = {
  backgroundColor: RICH_BLACK,
  color: '#fff',
  border: 'none',
  padding: '12px 26px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: '12px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  borderRadius: '3px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

// --- Mobile Menu / Hamburger ---
const hamburgerIcon: React.CSSProperties = {
  width: '24px',
  height: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  cursor: 'pointer',
  zIndex: 1101, // Higher than drawer
};

const hamburgerLine: React.CSSProperties = {
  width: '100%',
  height: '3px',
  backgroundColor: RICH_BLACK,
  borderRadius: '2px',
  transition: 'all 0.3s ease',
};

const mobileMenuBackdrop: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 1050,
  transition: 'opacity 0.3s ease',
};

const mobileMenuDrawer: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '280px',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  zIndex: 1100,
  boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

const mobileNavLink: React.CSSProperties = {
  ...navLink,
  color: RICH_BLACK,
  fontSize: '1.1rem',
  fontWeight: 800,
  padding: '12px 15px',
  borderRadius: '6px',
  transition: 'background-color 0.2s ease, color 0.2s ease',
};

// --- Hero ---
const heroContainer: React.CSSProperties = {
  height: '85vh',
  minHeight: '550px',
  maxHeight: '800px',
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: '#000',
};

const heroSlide: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'opacity 1.2s ease-in-out, transform 8s ease-out',
  zIndex: 0,
};

const heroOverlay: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(
    135deg,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.6) 40%,
    rgba(0,0,0,0.2) 70%,
    rgba(0,0,0,0.05) 100%
  )`,
  zIndex: 1,
};

const heroEyebrow: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '4px',
  textTransform: 'uppercase',
  color: BRAND_ORANGE,
  marginBottom: '16px',
  opacity: 0.9,
};

const heroTitle: React.CSSProperties = {
  fontSize: 'clamp(2.8rem, 6vw, 5rem)',
  fontWeight: 900,
  margin: '0 0 20px 0',
  lineHeight: 1.0,
  textTransform: 'uppercase',
  letterSpacing: '-2px',
  maxWidth: '700px',
};

const heroSubtitle: React.CSSProperties = {
  fontSize: '1.15rem',
  maxWidth: '550px',
  marginBottom: '35px',
  opacity: 0.85,
  lineHeight: 1.7,
  fontWeight: 400,
  letterSpacing: '0.2px',
};

const heroPrimaryBtn: React.CSSProperties = {
  padding: '16px 38px',
  backgroundColor: BRAND_ORANGE,
  color: '#000',
  border: 'none',
  borderRadius: '3px',
  fontWeight: 800,
  fontSize: '14px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  boxShadow: '0 4px 15px rgba(242, 140, 40, 0.3)',
};

const heroSecondaryBtn: React.CSSProperties = {
  padding: '16px 38px',
  backgroundColor: 'transparent',
  color: '#fff',
  border: '2px solid rgba(255,255,255,0.5)',
  borderRadius: '3px',
  fontWeight: 700,
  fontSize: '14px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

const dotContainer: React.CSSProperties = {
  position: 'absolute',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '10px',
  zIndex: 4,
};

const dot: React.CSSProperties = {
  height: '4px',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

// --- Filter Sidebar ---
const filterCard: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #e5e5e5',
  position: 'sticky',
  top: '90px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
};

const filterHeading: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.95rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: RICH_BLACK,
  paddingBottom: '14px',
  marginBottom: '18px',
  marginTop: 0,
  borderBottom: '1px solid #eee',
};

const filterGroup: React.CSSProperties = {
  marginBottom: '18px',
};

const filterLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#999',
  marginBottom: '6px',
  letterSpacing: '1px',
};

const filterInput: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '13px',
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color 0.25s ease',
  backgroundColor: '#fafafa',
};

const resetBtn: React.CSSProperties = {
  width: '100%',
  padding: '11px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '12px',
  color: '#666',
  marginTop: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
};

// --- Grid ---
const gridHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '25px',
  paddingBottom: '15px',
  borderBottom: '1px solid #eee',
};

const sortSelect: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  backgroundColor: '#fafafa',
  fontSize: '13px',
  fontFamily: "'Inter', sans-serif",
  cursor: 'pointer',
};

const getHomepageGridStyle = (isMobile: boolean): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(3, 1fr)',
  gap: '22px',
});

const viewAllBtn: React.CSSProperties = {
  marginTop: '35px',
  width: '100%',
  padding: '16px',
  backgroundColor: 'transparent',
  border: `2px solid ${RICH_BLACK}`,
  color: RICH_BLACK,
  fontWeight: 800,
  fontSize: '13px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  borderRadius: '3px',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};


export default App;