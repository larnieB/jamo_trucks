import React, { useState, useEffect } from 'react';

// Define the Driver interface based on your registration form
interface Driver {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  license_class: string;
  experience_years: number;
  current_location: string;
  expected_salary: string;
  availability: string;
  documents: string[];
}

const BASE_URL = "http://localhost:8080/jamo_trucks/jamo_trucks/"; // Update to your actual path

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from the backend script created in Step 1
    fetch(`${BASE_URL}src/backend/getDrivers.php`, {
      headers: { "ngrok-skip-browser-warning": "true" }
    })
      .then(res => res.json())
      .then(data => {
        setDrivers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={centerText}><p>Loading available drivers...</p></div>;

  return (
    <div style={container}>
      <header style={header}>
        <h2 style={{ margin: 0 }}>Available Drivers</h2>
        <p style={{ color: '#666' }}>Found {drivers.length} registered professionals</p>
      </header>

      <div style={driverGrid}>
        {drivers.map(driver => (
          <div key={driver.id} style={driverCard}>
            {/* Driver Profile Image (using the first uploaded document) */}
            <div style={imageWrapper}>
              {driver.documents.length > 0 ? (
                <img 
                  src={`${BASE_URL}${driver.documents[0]}`} 
                  alt={driver.full_name} 
                  style={profileImg} 
                />
              ) : (
                <div style={placeholderImg}>No Photo</div>
              )}
              <div style={badgeStyle}>{driver.availability}</div>
            </div>

            <div style={content}>
              <h3 style={nameText}>{driver.full_name}</h3>
              <p style={locationText}>📍 {driver.current_location}</p>
              
              <div style={detailsGrid}>
                <div style={detailBox}>
                  <span style={label}>License</span>
                  <span style={value}>{driver.license_class}</span>
                </div>
                <div style={detailBox}>
                  <span style={label}>Experience</span>
                  <span style={value}>{driver.experience_years} Years</span>
                </div>
              </div>

              <div style={salaryRow}>
                <span style={label}>Expected Salary:</span>
                <span style={salaryText}>KES {parseFloat(driver.expected_salary).toLocaleString()}</span>
              </div>

              <a href={`tel:${driver.phone_number}`} style={contactBtn}>
                Contact Driver
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const container: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' };
const header: React.CSSProperties = { marginBottom: '30px', borderBottom: '2px solid #F28C28', paddingBottom: '15px' };
const driverGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const driverCard: React.CSSProperties = { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #eee' };
const imageWrapper: React.CSSProperties = { width: '100%', height: '220px', backgroundColor: '#f9f9f9', position: 'relative' };
const profileImg: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const placeholderImg: React.CSSProperties = { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' };
const badgeStyle: React.CSSProperties = { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#059669', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
const content: React.CSSProperties = { padding: '20px' };
const nameText: React.CSSProperties = { margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 'bold' };
const locationText: React.CSSProperties = { margin: '0 0 15px 0', fontSize: '14px', color: '#666' };
const detailsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' };
const detailBox: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
const label: React.CSSProperties = { fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold' };
const value: React.CSSProperties = { fontSize: '14px', fontWeight: 'bold' };
const salaryRow: React.CSSProperties = { borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '20px' };
const salaryText: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 'bold', color: '#F28C28', marginLeft: '8px' };
const contactBtn: React.CSSProperties = { display: 'block', textAlign: 'center', backgroundColor: '#222', color: '#fff', textDecoration: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold' };
const centerText: React.CSSProperties = { textAlign: 'center', padding: '50px' };

export default Drivers;