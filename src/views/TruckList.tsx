import React, { useState, useEffect } from 'react';

interface Truck {
  id: number;
  numberPlate: string;
  make: string;
  model: string;
  year: number;
  price: string;
  color: string;
  location: string;
  truck_condition: string;
  paymentMethod: string;
  images: string[];
  description?: string; 
  deposit: string;
  bankBalance: string;
  monthlyInstallments: string;// Added for more detail in modal
}
interface TruckListProps {
  baseUrl: string;
}


const TruckList: React.FC<TruckListProps> = ({ baseUrl }) => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  useEffect(() => {
    fetch(`${baseUrl}backend/getTrucks.php`, {
      headers: { "ngrok-skip-browser-warning": "true" }
    })
      .then(res => res.json())
      .then(data => {
        setTrucks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedTruck ? 'hidden' : 'unset';

return () => {
    
    document.body.style.overflow = 'unset'; 
  };

  }, [selectedTruck]);

  

  if (loading) return <div style={centerTextStyle}><p>Loading trucks...</p></div>;

  return (
    <div style={pageWrapper}>
      <header style={headerStyle}>
        <h2>Available Inventory</h2>
        <p>{trucks.length} Trucks found</p>
      </header>

      <div style={gridContainer}>
       {trucks.map(truck => (
  <div 
    key={truck.id} 
    style={cardStyle} 
    onClick={() => setSelectedTruck(truck)}
    role="button"
  >
    <div style={imageContainer}>
      {truck.images && truck.images.length > 0 ? (
        <img src={`${baseUrl}${truck.images[0]}`} alt={truck.model} style={imgStyle} />
      ) : (
        <div style={placeholderStyle}>No Image Available</div>
      )}
      <div style={badgeStyle(truck.truck_condition)}>{truck.truck_condition}</div>
    </div>

    <div style={detailsStyle}>
      <h3 style={titleStyle}>{truck.make} {truck.model}</h3>
      <p style={yearStyle}>{truck.year}</p>

      {/* New Details Section */}
      <div style={cardInfoGrid}>
        <div style={cardInfoItem}>
          <span style={labelStyle}>Plate:</span> {truck.numberPlate}
        </div>
        <div style={cardInfoItem}>
          <span style={labelStyle}>Loc:</span> {truck.location}
        </div>
        <div style={cardInfoItem}>
          <span style={labelStyle}>Color:</span> {truck.color}
        </div>
        <div style={cardInfoItem}>
          <span style={labelStyle}>Pay:</span> {truck.paymentMethod}
        </div>
      </div>

      {/* Inside the trucks.map loop, replace the priceContainer div with this: */}

<div style={priceContainer}>
  {truck.paymentMethod.toLowerCase() === 'cash' ? (
    /* --- CASE 1: CASH VIEW --- */
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <span style={labelStyle}>Full Price</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={currencyStyle}>KES</span>
        <span style={amountStyle}>
          {parseFloat(truck.price || '0').toLocaleString()}
        </span>
      </div>
    </div>
  ) : (
    /* --- CASE 2: FINANCE / SKUMA LOAN VIEW --- */
    (truck.paymentMethod === 'Finance' || truck.paymentMethod === 'skumaLoan') && (
      <div style={{ 
        width: '100%',
        padding: '12px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0' 
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '0.85rem', color: '#1e293b' }}>
          Loan Breakdown
        </p>
        <div style={financeRow}>
          <span style={labelStyle}>Deposit:</span>
          <span style={financeValueSmall}>KES {parseFloat(truck.deposit || '0').toLocaleString()}</span>
        </div>
        <div style={financeRow}>
          <span style={labelStyle}>Bank Bal:</span>
          <span style={financeValueSmall}>KES {parseFloat(truck.bankBalance || '0').toLocaleString()}</span>
        </div>
        <div style={{ ...financeRow, marginTop: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
          <span style={labelStyle}>Monthly:</span>
          <span style={{ ...financeValueSmall, color: '#2563eb' }}>
            KES {parseFloat(truck.monthlyInstallments || '0').toLocaleString()}
          </span>
        </div>
      </div>
    )
  )}
</div>
    </div>
  </div>
))}
      </div>

      {/* Modal Component */}
      {selectedTruck && (
        <TruckModal 
          truck={selectedTruck} 
          onClose={() => setSelectedTruck(null)} 
          baseUrl= {baseUrl}
        />
      )}
    </div>
  );
};

// --- MODAL & CAROUSEL COMPONENT ---

const TruckModal: React.FC<{ truck: Truck; onClose: () => void; baseUrl: string;  }> = ({ truck, onClose, baseUrl}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % truck.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + truck.images.length) % truck.images.length);
  };

  // Check if we should show loan details
  const isFinanced = truck.paymentMethod === 'Finance' || truck.paymentMethod === 'skumaLoan';

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalContent} onClick={e => e.stopPropagation()}>
        <button style={closeButton} onClick={onClose}>✕</button>
        
        <div style={modalGrid}>
          {/* Left Side: Carousel */}
          <div style={carouselContainer}>
            {truck.images && truck.images.length > 0 ? (
              <>
                <img src={`${baseUrl}${truck.images[currentImgIndex]}`} alt="Truck" style={modalImg} />
                {truck.images.length > 1 && (
                  <>
                    <button style={navBtn('left')} onClick={prevImg}>‹</button>
                    <button style={navBtn('right')} onClick={nextImg}>›</button>
                    <div style={dotContainer}>
                      {truck.images.map((_, i) => (
                        <div key={i} style={dotStyle(i === currentImgIndex)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={placeholderStyle}>No Images</div>
            )}
          </div>

          {/* Right Side: Details */}
          <div style={modalDetails}>
            <h2 style={{ marginBottom: '8px' }}>{truck.make} {truck.model}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <span style={badgeStyleStatic(truck.truck_condition)}>{truck.truck_condition}</span>
                <span style={{ color: '#666', fontSize: '1rem' }}>Year: {truck.year}</span>
            </div>
            
            <div style={modalInfoGrid}>
              <div style={infoItem}><strong>Location:</strong> {truck.location}</div>
              <div style={infoItem}><strong>Color:</strong> {truck.color}</div>
              <div style={infoItem}><strong>Plate:</strong> {truck.numberPlate}</div>
              <div style={infoItem}><strong>Payment:</strong> {truck.paymentMethod}</div>
            </div>

            {/* --- LOAN DETAILS SECTION IN MODAL --- */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              {isFinanced ? (
                <div style={modalFinanceContainer}>
                  <p style={{ fontWeight: 800, color: '#1e293b', marginBottom: '12px', fontSize: '1.1rem' }}>Payment Plan</p>
                  
                  <div style={modalFinanceRow}>
                    <span style={labelStyle}>Total Price:</span>
                    <span style={modalFinanceVal}>KES {parseFloat(truck.price).toLocaleString()}</span>
                  </div>
                  
                  <div style={modalFinanceRow}>
                    <span style={labelStyle}>Deposit Required:</span>
                    <span style={modalFinanceVal}>KES {parseFloat(truck.deposit || '0').toLocaleString()}</span>
                  </div>

                  <div style={modalFinanceRow}>
                    <span style={labelStyle}>Bank Balance:</span>
                    <span style={modalFinanceVal}>KES {parseFloat(truck.bankBalance || '0').toLocaleString()}</span>
                  </div>

                  <div style={{ ...modalFinanceRow, borderTop: '2px solid #e2e8f0', marginTop: '10px', paddingTop: '10px' }}>
                    <span style={{ ...labelStyle, color: '#2563eb' }}>Monthly Installment:</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>
                        KES {parseFloat(truck.monthlyInstallments || '0').toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                /* --- CASH VIEW IN MODAL --- */
                <div>
                  <div style={currencyStyle}>TOTAL CASH PRICE</div>
                  <div style={amountStyle}>KES {parseFloat(truck.price).toLocaleString()}</div>
                </div>
              )}
              
              <button style={contactBtn}>Inquire About This Truck</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADDITIONAL STYLES ---
const modalFinanceContainer: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1'
};

const modalFinanceRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const modalFinanceVal: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '1rem',
  color: '#0f172a'
};

// Use this for the badge inside the modal so it doesn't float absolute
const badgeStyleStatic = (condition: string): React.CSSProperties => ({
  padding: '4px 12px',
  borderRadius: '99px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  backgroundColor: condition.toLowerCase() === 'new' ? '#059669' : '#d97706',
  color: '#fff',
  display: 'inline-block'
});

const financeRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2px'
};

const financeValueSmall: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#334155'
};

const modalOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.85)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px'
};

const modalContent: React.CSSProperties = {
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: '900px',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  maxHeight: '90vh'
};

const modalGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
};

const carouselContainer: React.CSSProperties = {
  position: 'relative',
  height: '400px',
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center'
};

const modalImg: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'contain'
};

const navBtn = (dir: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  [dir]: '15px',
  transform: 'translateY(-50%)',
  background: 'rgba(255,255,255,0.2)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  fontSize: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)'
});

const modalDetails: React.CSSProperties = {
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  overflowY: 'auto'
};

const modalInfoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px',
  marginTop: '20px',
  padding: '20px 0',
  borderTop: '1px solid #eee'
};

const infoItem: React.CSSProperties = {
  fontSize: '0.95rem'
};

const closeButton: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  zIndex: 10,
  background: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
};

const dotContainer: React.CSSProperties = {
  position: 'absolute',
  bottom: '15px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: '8px'
};

const dotStyle = (active: boolean): React.CSSProperties => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: active ? '#fff' : 'rgba(255,255,255,0.4)',
  transition: 'all 0.3s ease'
});

const contactBtn: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#059669',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '1rem',
  marginTop: '20px',
  cursor: 'pointer'
};

const cardInfoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr', // Creates a 2x2 grid for details
  gap: '8px',
  marginBottom: '16px',
  fontSize: '0.85rem',
  color: '#4b5563'
};

const cardInfoItem: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#9ca3af',
  textTransform: 'uppercase',
  fontSize: '0.75rem'
};



// ... (Rest of your existing styles below)
const pageWrapper: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' };
const headerStyle: React.CSSProperties = { marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' };
const gridContainer: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', width: '100%' };
const cardStyle: React.CSSProperties = { cursor: 'pointer', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s ease', border: '1px solid #e5e7eb' };
const imageContainer: React.CSSProperties = { position: 'relative', width: '100%', height: '200px', backgroundColor: '#f3f4f6' };
const imgStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const detailsStyle: React.CSSProperties = { padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' };
const titleStyle: React.CSSProperties = { margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 700, color: '#111827' };
const yearStyle: React.CSSProperties = { color: '#6b7280', fontSize: '0.9rem', marginBottom: '16px' };
const priceContainer: React.CSSProperties = { marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'baseline', gap: '4px' };
const currencyStyle: React.CSSProperties = { fontSize: '0.875rem', fontWeight: 600, color: '#059669' };
const amountStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 800, color: '#059669' };
const badgeStyle = (condition: string): React.CSSProperties => ({ position: 'absolute', top: '12px', right: '12px', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: condition.toLowerCase() === 'new' ? '#059669' : '#d97706', color: '#fff' });
const placeholderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af' };
const centerTextStyle: React.CSSProperties = { textAlign: 'center', padding: '50px' };

export default TruckList;