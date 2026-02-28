// src/components/TruckCard.tsx
import React from 'react';

export interface Truck {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string;
  truck_condition: string;
  images: string[];
  location: string;
  numberPlate?: string;
  color?: string;
  paymentMethod: string;
  deposit: string;
  bankBalance?: string;
  monthlyInstallments: string;
}

interface TruckCardProps {
  truck: Truck;
  baseUrl: string;
  onClick: (truck: Truck) => void;
}

const BRAND_ORANGE = '#F28C28';
const RICH_BLACK = '#1a1a1a';

const TruckCard: React.FC<TruckCardProps> = ({ truck, baseUrl, onClick }) => {
  const isFinanced = truck.paymentMethod === 'Finance' || truck.paymentMethod === 'skumaLoan';

  return (
    <div
      style={cardStyle}
      onClick={() => onClick(truck)}
      role="button"
      data-aos="fade-up"
      data-aos-duration="700"
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-6px)';
        el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        // Scale image
        const img = el.querySelector('img') as HTMLImageElement;
        if (img) img.style.transform = 'scale(1.08)';
        // Show overlay
        const overlay = el.querySelector('[data-card-overlay]') as HTMLElement;
        if (overlay) overlay.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        const img = el.querySelector('img') as HTMLImageElement;
        if (img) img.style.transform = 'scale(1)';
        const overlay = el.querySelector('[data-card-overlay]') as HTMLElement;
        if (overlay) overlay.style.opacity = '0';
      }}
    >
      {/* Image Section */}
      <div style={imageContainer}>
        {truck.images && truck.images.length > 0 ? (
          <img
            src={`${baseUrl}${truck.images[0]}`}
            alt={`${truck.make} ${truck.model}`}
            style={imgStyle}
          />
        ) : (
          <div style={placeholderStyle}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span style={{ fontSize: '11px', color: '#bbb', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>No Image</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          data-card-overlay
          style={imageOverlay}
        >
          <span style={viewDetailsLabel}>View Details →</span>
        </div>

        {/* Condition badge */}
        <div style={badgeStyle(truck.truck_condition)}>
          {truck.truck_condition}
        </div>

        {/* Image count badge */}
        {truck.images && truck.images.length > 1 && (
          <div style={imageCountBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span>{truck.images.length}</span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div style={detailsStyle}>
        {/* Title row */}
        <div style={{ marginBottom: '8px' }}>
          <h3 style={titleStyle}>{truck.make} {truck.model}</h3>
          <div style={metaRow}>
            <span style={metaChip}>{truck.year}</span>
            <span style={metaDot}>•</span>
            <span style={metaText}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ marginRight: '3px', verticalAlign: '-2px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {truck.location}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div style={infoGrid}>
          <div style={infoItem}>
            <span style={labelStyle}>Plate</span>
            <span style={infoValue}>{truck.numberPlate || 'N/A'}</span>
          </div>
          <div style={infoItem}>
            <span style={labelStyle}>Payment</span>
            <span style={infoValue}>{truck.paymentMethod}</span>
          </div>
        </div>

        {/* Price Section */}
        <div style={priceSection}>
          {!isFinanced ? (
            <div>
              <span style={priceLabelStyle}>Cash Price</span>
              <span style={cashPriceStyle}>KES {parseFloat(truck.price).toLocaleString()}</span>
            </div>
          ) : (
            <div style={financeBox}>
              <div style={financeRow}>
                <span style={labelStyle}>Deposit</span>
                <span style={financeVal}>KES {parseFloat(truck.deposit).toLocaleString()}</span>
              </div>
              <div style={financeDivider} />
              <div style={financeRow}>
                <span style={{ ...labelStyle, color: BRAND_ORANGE }}>Monthly</span>
                <span style={{ ...financeVal, color: BRAND_ORANGE, fontWeight: 800 }}>
                  KES {parseFloat(truck.monthlyInstallments).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ═════════════════════════════════════════════
// STYLES — Modern Industrial Cards
// ═════════════════════════════════════════════

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '6px',
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid #e8e8e8',
  cursor: 'pointer',
  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const imageContainer: React.CSSProperties = {
  width: '100%',
  height: '200px',
  position: 'relative',
  backgroundColor: '#f0f0f0',
  overflow: 'hidden',
};

const imgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
};

const imageOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(26,26,26,0.8) 0%, transparent 50%)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingBottom: '16px',
  opacity: 0,
  transition: 'opacity 0.35s ease',
  zIndex: 2,
};

const viewDetailsLabel: React.CSSProperties = {
  color: '#fff',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  padding: '6px 16px',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '3px',
};

const placeholderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  backgroundColor: '#f5f5f5',
};

const badgeStyle = (cond: string): React.CSSProperties => ({
  position: 'absolute',
  top: '12px',
  left: '12px',
  backgroundColor: cond.toLowerCase() === 'new' ? '#10b981' : BRAND_ORANGE,
  color: cond.toLowerCase() === 'new' ? '#fff' : RICH_BLACK,
  padding: '4px 12px',
  borderRadius: '3px',
  fontSize: '10px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  zIndex: 3,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
});

const imageCountBadge: React.CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  backgroundColor: 'rgba(0,0,0,0.65)',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '3px',
  fontSize: '11px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  zIndex: 3,
  backdropFilter: 'blur(4px)',
};

const detailsStyle: React.CSSProperties = {
  padding: '18px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 800,
  color: RICH_BLACK,
  letterSpacing: '-0.3px',
  lineHeight: 1.2,
};

const metaRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '5px',
};

const metaChip: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  color: BRAND_ORANGE,
  backgroundColor: 'rgba(242, 140, 40, 0.08)',
  padding: '2px 8px',
  borderRadius: '3px',
};

const metaDot: React.CSSProperties = {
  color: '#ccc',
  fontSize: '10px',
};

const metaText: React.CSSProperties = {
  fontSize: '12px',
  color: '#888',
  display: 'flex',
  alignItems: 'center',
};

const infoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '14px',
  marginTop: '8px',
};

const infoItem: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  color: '#aaa',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const infoValue: React.CSSProperties = {
  fontSize: '12px',
  color: '#444',
  fontWeight: 600,
};

const priceSection: React.CSSProperties = {
  marginTop: 'auto',
  paddingTop: '14px',
  borderTop: '1px solid #f0f0f0',
};

const priceLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontWeight: 700,
  color: '#aaa',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '2px',
};

const cashPriceStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 900,
  color: RICH_BLACK,
  letterSpacing: '-0.5px',
};

const financeBox: React.CSSProperties = {
  backgroundColor: '#fafafa',
  padding: '10px 12px',
  borderRadius: '4px',
  border: '1px solid #f0f0f0',
};

const financeRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const financeDivider: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#eee',
  margin: '6px 0',
};

const financeVal: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '13px',
  color: '#333',
};


export default TruckCard;