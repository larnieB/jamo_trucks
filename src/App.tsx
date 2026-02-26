import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import TruckList from './views/TruckList';
import Drivers from './views/Drivers';
import DriverModal from './components/DriverModal';
import Financing from './views/Financing'; // Keep your existing full view
import TruckCard from './components/TruckCard';

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


const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
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
   const BRAND_ORANGE = '#F28C28';

   const carouselImages = [
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1600", // Truck on highway
  "https://images.unsplash.com/photo-1586191582151-f73972d107c4?auto=format&fit=crop&q=80&w=1600", // Fleet of trucks
  "https://images.unsplash.com/photo-1591768793355-74d758169956?auto=format&fit=crop&q=80&w=1600"  // Dashboard/Modern truck
];


  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false,     // Whether animation should happen only once - while scrolling down
      easing: 'ease-in-out',
    });
  }, []);

useEffect(() => {
  if (view === 'home') {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Slide every 5 seconds
    return () => clearInterval(timer);
  }
}, [view]);



  // Fetch data on mount
  useEffect(() => {
    fetch('http://localhost:8080/jamo_trucks/jamo_trucks/src/backend/getTrucks.php')
      .then(res => res.json())
      .then(data => {
        setTrucks(data);
        setFilteredTrucks(data.slice(0, 12)); // Initial 3x4 limit
      });
  }, []);

  React.useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  // Filter & Sort Logic
 useEffect(() => {
    let result = [...trucks];

    // 1. Filter by Brand (Make)
    if (filters.make) result = result.filter(t => t.make === filters.make);
    
    // 2. Filter by Model
    if (filters.model) result = result.filter(t => t.model.toLowerCase().includes(filters.model.toLowerCase()));

    // 3. Filter by Year
    if (filters.year) result = result.filter(t => t.year.toString() === filters.year);

    // 4. Filter by Location
    if (filters.location) result = result.filter(t => t.location === filters.location);

    // 5. Filter by Price Range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(t => {
        const p = parseFloat(t.price);
        return max ? (p >= min && p <= max) : (p >= min);
      });
    }

    // 6. Sorting Logic (Top of Grid)
    if (sortBy === 'price-low') result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortBy === 'price-high') result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (sortBy === 'year-desc') result.sort((a, b) => b.year - a.year);
    if (sortBy === 'year-asc') result.sort((a, b) => a.year - b.year);

    setFilteredTrucks(result.slice(0, 12));
  }, [filters, sortBy, trucks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
      
      {/* 1. TOP UTILITY BAR (Matches the thin dark bar in screenshot) */}
      <div style={{ backgroundColor: '#222', color: '#fff', padding: '8px 40px', fontSize: '12px', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
       <span style={utilityLink}  onClick={() => setView('drivers')}>find a driver</span>
        <span style={utilityLink} onClick={() => setIsModalOpen(true)}>Apply to become a driver</span>
        <span style={utilityLink} onClick={() => setView('financing')}>Financing</span>
        <span style={utilityLink} >
           Contact Us: +254 791 790744-JAMOH-KE
        </span>

      </div>

      {/* 2. MAIN NAVIGATION */}
     {/* 2. MAIN NAVIGATION */}
{/* 2. MAIN NAVIGATION */}
<nav style={{
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
  borderBottom: `3px solid ${BRAND_ORANGE}`,
}}>
  <div style={{
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1300px',
    margin: '0 auto',
    padding: isMobile ? '15px' : '12px 40px',
    gap: isMobile ? '15px' : '0'
  }}>
    {/* Logo Section */}
    <div 
      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      onClick={() => setView('home')}
    >
      <img 
        src="http://localhost:8080/jamo_trucks/jamo_trucks/src/assets/jamohTruckslogo.png" 
        alt="Logo" 
        style={{ width: isMobile ? '80px' : '100px', height: 'auto', objectFit: 'contain' }} 
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ 
          fontSize: isMobile ? '1.1rem' : '1.4rem', 
          fontWeight: '900', 
          color: '#1a1a1a', 
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          lineHeight: 1 
        }}>
          Jamoh Trucks
        </span>
        <span style={{ 
          color: BRAND_ORANGE, 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '2px' 
        }}>
          sellers Kenya
        </span>
      </div>
    </div>

    {/* Menu Items */}
    <div style={{ 
      display: 'flex', 
      gap: isMobile ? '20px' : '35px', 
      alignItems: 'center',
    }}>
      <span 
        onClick={() => setView('home')}
        style={view === 'home' ? activeNavLink : navLink}
      >
        Home
      </span>
      <span 
        onClick={() => setView('drivers')}
        style={view === 'drivers' ? activeNavLink : navLink}
      >
        Drivers
      </span>
     
      
      <button 
        onClick={() => setView('list')}
        style={{ 
          backgroundColor: '#1a1a1a', 
          color: '#fff', 
          border: 'none', 
          padding: isMobile ? '10px 18px' : '12px 24px', 
          fontWeight: '800',
          cursor: 'pointer',
          fontSize: isMobile ? '12px' : '13px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_ORANGE)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
      >
        <span style={{ color: BRAND_ORANGE }}>●</span> VIEW INVENTORY
      </button>
    </div>
  </div>
</nav>


      {view === 'home' && (
  <>
    <div style={heroContainer}>
      {/* Background Images */}
      {carouselImages.map((img, index) => (
        <div
          key={index}
          style={{
            ...heroSlide,
            backgroundImage: `url(${img})`,
            opacity: currentSlide === index ? 1 : 0,
          }}
        />
      ))}

      {/* Modern Overlay Gradient */}
      <div style={heroOverlay}></div>

      {/* Content */}
      <div style={heroContent}>
        <h1 style={heroTitle}>
          Premium Heavy Duty <span style={{ color: '#F28C28' }}>Trucks</span>
        </h1>
        <p style={heroSubtitle}>
          Reliable transport solutions for the Kenyan terrain. 
          New arrivals weekly in Nairobi & Mombasa.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <button onClick={() => setView('list')} style={heroPrimaryBtn}>View Inventory</button>
          <button style={heroSecondaryBtn}>Get Financing</button>
        </div>
      </div>

      {/* Carousel Dots */}
      <div style={dotContainer}>
        {carouselImages.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              ...dot,
              backgroundColor: currentSlide === i ? '#F28C28' : 'rgba(255,255,255,0.5)',
              width: currentSlide === i ? '30px' : '10px',
            }}
          />
        ))}
      </div>
    </div>

          {/* 3. MAIN CONTENT AREA (Sidebar + Grid) */}
<div style={{ 
  display: 'flex', 
  flexDirection: isMobile ? 'column' : 'row', // Stacks sidebar on top of grid on mobile
  maxWidth: '1300px', 
  margin: '0 auto', 
  padding: isMobile ? '20px 15px' : '40px 20px', 
  gap: isMobile ? '20px' : '30px' 
}}>            
            {/* LEFT SIDEBAR FILTER */}
<aside style={{ width: isMobile ? '100%' : '280px', flexShrink: 0 }} data-aos="fade-right">              <div style={filterCard}>
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: 0 }}> find your truck</h3>
                
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
                    <option value="3000000-6000000">3M - 6M KES</option>
                    <option value="6000000-10000000">6M - 10M KES</option>
                    <option value="10000000">Over 10M KES</option>
                  </select>
                </div>
                
                <button style={resetBtn} onClick={() => setFilters({ make: '', model: '', year: '', location: '', priceRange: '' })}>
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* RIGHT GRID (3x4 Layout) */}
            <main style={{ flexGrow: 1 }}>
              
              <div style={gridHeader}>
                <div>
                   <h2 style={{ margin: 0 }}>Recent Inventory</h2>
                   <span style={{ color: '#666', fontSize: '14px' }}>Found {filteredTrucks.length} results</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Sort By:</label>
                  <select style={sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="price-low">Lowest Price to Highest</option>
                    <option value="price-high">Highest Price to Lowest</option>
                    <option value="year-desc">Year: Newest First</option>
                    <option value="year-asc">Year: Oldest First</option>
                  </select>
                </div>
              </div>

              
<div style={getHomepageGridStyle(isMobile)}>
  {filteredTrucks.map(truck => (
    <TruckCard 
      key={truck.id} 
      truck={truck} 
      baseUrl={BASE_URL} 
      onClick={() => {
        // Since home doesn't have a modal, you can redirect to list 
        // or set a selected truck state if you add a modal to App.tsx
        setView('list'); 
      }} 
    />
  ))}
</div>
              
              <button 
                onClick={() => setView('list')}
                style={viewAllBtn}>
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
    </div>
  );
};

// --- STYLES ---
const utilityLink: React.CSSProperties = { 
  cursor: 'pointer', 
  textDecoration: 'none',
  transition: 'color 0.2s',
  opacity: 0.8,
};

const navLink: React.CSSProperties = {
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '700',
  color: '#444',
  textTransform: 'uppercase',
  position: 'relative',
  transition: 'color 0.3s'
};

const activeNavLink: React.CSSProperties = {
  ...navLink,
  color: '#F28C28',
};

const heroContainer: React.CSSProperties = {
  height: '500px',
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
  transition: 'opacity 1s ease-in-out',
  zIndex: 0,
};

const heroOverlay: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
  zIndex: 1,
};

const heroContent: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  maxWidth: '1300px',
  margin: '0 auto',
  padding: '0 40px',
  width: '100%',
  color: 'white',
};

const heroTitle: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  fontWeight: '800',
  margin: '0 0 15px 0',
  lineHeight: '1.1',
  textTransform: 'uppercase',
  letterSpacing: '-1px',
};

const heroSubtitle: React.CSSProperties = {
  fontSize: '1.2rem',
  maxWidth: '600px',
  marginBottom: '30px',
  opacity: 0.9,
  lineHeight: '1.6',
};

const heroPrimaryBtn: React.CSSProperties = {
  padding: '15px 35px',
  backgroundColor: '#F28C28',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

const heroSecondaryBtn: React.CSSProperties = {
  padding: '15px 35px',
  backgroundColor: 'transparent',
  color: '#fff',
  border: '2px solid #fff',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};

const dotContainer: React.CSSProperties = {
  position: 'absolute',
  bottom: '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '10px',
  zIndex: 3,
};

const dot: React.CSSProperties = {
  height: '10px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};


const gridHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '25px',
  paddingBottom: '15px',
  borderBottom: '1px solid #ddd'
};

const sortSelect: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  fontSize: '14px',
  cursor: 'pointer'
};

const resetBtn: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#eee',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#666',
  marginTop: '10px'
};



const getHomepageGridStyle = (isMobile: boolean): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(3, 1fr)',
  gap: '20px',
});

const miniCard: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #e0e0e0'
};

const miniImageContainer: React.CSSProperties = {
  width: '100%',
  height: '160px',
  position: 'relative'
};

const filterCard: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #ddd',
  position: 'sticky',
  top: '20px'
};

const filterGroup: React.CSSProperties = {
  marginBottom: '20px'
};

const filterLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: '#888',
  marginBottom: '8px'
};

const filterInput: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const miniBadge: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#F28C28',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '10px',
  fontWeight: 'bold'
};

const viewAllBtn: React.CSSProperties = {
    marginTop: '30px',
    width: '100%',
    padding: '15px',
    backgroundColor: 'transparent',
    border: '2px solid #00447C',
    color: '#00447C',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '8px'
};

// ... Utility styles from previous code
const imgStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const heroSlantWhite: React.CSSProperties = { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', backgroundColor: '#f4f4f4', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)', zIndex: 1 };
const heroSlantYellow: React.CSSProperties = { position: 'absolute', bottom: 0, right: 0, width: '50%', height: '100px', backgroundColor: '#FFD200', clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)', zIndex: 0, opacity: 0.6 };

export default App;