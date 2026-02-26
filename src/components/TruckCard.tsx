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

const TruckCard: React.FC<TruckCardProps> = ({ truck, baseUrl, onClick }) => {
  const isFinanced = truck.paymentMethod === 'Finance' || truck.paymentMethod === 'skumaLoan';
  const BRAND_ORANGE = '#F28C28';

  return (
    <div 
      style={cardStyle} 
      onClick={() => onClick(truck)}
      role="button"
      data-aos="fade-up"
    >
      <div style={imageContainer}>
        {truck.images && truck.images.length > 0 ? (
          <img src={`${baseUrl}${truck.images[0]}`} alt={truck.model} style={imgStyle} />
        ) : (
          <div style={placeholderStyle}>No Image</div>
        )}
        <div style={badgeStyle(truck.truck_condition)}>{truck.truck_condition}</div>
      </div>

      <div style={detailsStyle}>
        <h3 style={titleStyle}>{truck.make} {truck.model}</h3>
        <p style={subTitleStyle}>{truck.year} • {truck.location}</p>

        <div style={infoGrid}>
          <div style={infoItem}><span style={labelStyle}>Plate:</span> {truck.numberPlate || 'N/A'}</div>
          <div style={infoItem}><span style={labelStyle}>Pay:</span> {truck.paymentMethod}</div>
        </div>

        <div style={priceSection}>
          {!isFinanced ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={labelStyle}>Cash Price</span>
              <span style={amountStyle}>KES {parseFloat(truck.price).toLocaleString()}</span>
            </div>
          ) : (
            <div style={financeBox}>
              <div style={financeRow}>
                <span style={labelStyle}>Deposit:</span>
                <span style={financeVal}>KES {parseFloat(truck.deposit).toLocaleString()}</span>
              </div>
              <div style={{ ...financeRow, borderTop: '1px solid #eee', marginTop: '5px', paddingTop: '5px' }}>
                <span style={{ ...labelStyle, color: BRAND_ORANGE }}>Monthly:</span>
                <span style={{ ...financeVal, color: BRAND_ORANGE }}>KES {parseFloat(truck.monthlyInstallments).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  border: '1px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

const imageContainer: React.CSSProperties = { width: '100%', height: '180px', position: 'relative', backgroundColor: '#f5f5f5' };
const imgStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const detailsStyle: React.CSSProperties = { padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' };
const titleStyle: React.CSSProperties = { margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 'bold' };
const subTitleStyle: React.CSSProperties = { color: '#666', fontSize: '0.85rem', marginBottom: '12px' };
const infoGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '15px' };
const infoItem: React.CSSProperties = { fontSize: '0.8rem', color: '#444' };
const labelStyle: React.CSSProperties = { fontWeight: 'bold', color: '#999', fontSize: '0.7rem', textTransform: 'uppercase' };
const priceSection: React.CSSProperties = { marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f0f0f0' };
const amountStyle: React.CSSProperties = { fontSize: '1.2rem', fontWeight: '800', color: '#059669' };
const financeBox: React.CSSProperties = { backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '6px' };
const financeRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const financeVal: React.CSSProperties = { fontWeight: 'bold', fontSize: '0.85rem' };
const badgeStyle = (cond: string): React.CSSProperties => ({
  position: 'absolute', top: '10px', right: '10px', backgroundColor: cond.toLowerCase() === 'new' ? '#059669' : '#F28C28',
  color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'
});
const placeholderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#ccc' };

export default TruckCard;