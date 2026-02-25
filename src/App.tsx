import React, { useState, useEffect } from 'react';
import TruckList from './views/TruckList';
import Drivers from './views/Drivers';
import DriverModal from './components/DriverModal';
import Financing from './views/Financing'; // Keep your existing full view

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
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [view, setView] = useState<ViewState>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
        <span style={utilityLink}  onClick={() => setShowContactModal(true)}>
           Contact Us: +254 791 790744-JAMOH-KE
        </span>

      </div>

      {/* 2. MAIN NAVIGATION */}
     {/* 2. MAIN NAVIGATION */}
<nav style={{
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row', // Stacks items on mobile
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: isMobile ? '15px' : '10px 40px',
  backgroundColor: '#ffffff',
  borderBottom: `1px solid #ddd`,
  gap: isMobile ? '15px' : '0'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', textAlign: isMobile ? 'center' : 'left' }}>
    <img 
      src="http://localhost:8080/jamo_trucks/jamo_trucks/src/assets/jamohTruckslogo.png" 
      alt="Logo" 
      style={{ width: isMobile ? '100px' : '120px', height: 'auto' }} 
    />
    <span style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '800', color: '#333', textTransform: 'uppercase' }}>
      Jamoh Trucks <span style={{ color: BRAND_ORANGE }}>Kenya</span>
    </span>
  </div>

  <div style={{ 
    display: 'flex', 
    gap: isMobile ? '15px' : '25px', 
    alignItems: 'center', 
    fontWeight: '500', 
    color: '#555' 
  }}>
    <span style={{ cursor: 'pointer' }} onClick={() => setView('home')}>Home</span>
    <button 
      onClick={() => setView('list')}
      style={{ 
        backgroundColor: '#FFD200', 
        color: '#000', 
        border: 'none', 
        padding: '10px 20px', 
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px'
      }}
    >
      🔍 INVENTORY
    </button>
  </div>
</nav>


      {view === 'home' && (
        <>
          {/* 2. HERO SECTION */}
          <div style={{ height: '350px', backgroundColor: BRAND_ORANGE, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
            <h1 style={{ fontSize: '3rem', zIndex: 2 }}>Premium Heavy Duty Trucks</h1>
            <div style={heroSlantWhite}></div>
            <div style={heroSlantYellow}></div>
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
<aside style={{ width: isMobile ? '100%' : '280px', flexShrink: 0 }}>              <div style={filterCard}>
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: 0 }}>Refine Search</h3>
                
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
                  <div key={truck.id} style={miniCard}>
                    <div style={miniImageContainer}>
                      <img src={`${BASE_URL}${truck.images[0]}`} alt={truck.model} style={imgStyle} />
                      <div style={miniBadge}>{truck.truck_condition}</div>
                    </div>
                    <div style={{ padding: '15px' }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{truck.make} {truck.model}</h4>
                      <p style={{ color: '#666', fontSize: '12px', margin: '0 0 10px 0' }}>{truck.year} • {truck.location}</p>
                      
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
                          KES {parseFloat(truck.price).toLocaleString()}
                        </span>
                        <div style={{ fontSize: '11px', color: '#999' }}>Deposit: KES {parseFloat(truck.deposit).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
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
  textDecoration: 'none' 
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

const inventoryBtnStyle: React.CSSProperties = {
  backgroundColor: '#FFD200',
  color: '#000',
  border: 'none',
  padding: '10px 20px',
  fontWeight: 'bold',
  cursor: 'pointer'
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
const contactBtn: React.CSSProperties = { width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const heroSlantWhite: React.CSSProperties = { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', backgroundColor: '#f4f4f4', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)', zIndex: 1 };
const heroSlantYellow: React.CSSProperties = { position: 'absolute', bottom: 0, right: 0, width: '50%', height: '100px', backgroundColor: '#FFD200', clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)', zIndex: 0, opacity: 0.6 };

export default App;