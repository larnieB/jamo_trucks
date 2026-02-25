import React from 'react';

const Financing: React.FC = () => {
  return (
    <div style={container}>
      {/* Visual Header */}
      <div style={heroImage}>
        <div style={overlay}>
          <h1 style={title}>Truck Financing</h1>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={card}>
        <div style={messageContainer}>
          <p style={mainText}>
            You may have found your dream truck on our site but don't have the full amount ready just yet. 
            <strong> Don't worry!</strong>
          </p>
          
          <p style={subText}>
            We offer financing options where you can partner with a bank or a micro-lending service 
            to provide the funding you need.
          </p>

          <div style={divider}></div>

          <p style={guideText}>
            If this is the best path for your situation, please feel free to contact 
            <span style={highlight}> Jamoh</span>, who will guide you through the next steps.
          </p>

          <a href="tel:+254700000000" style={contactBtn}>
            Contact Jamoh Now
          </a>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const container: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '40px 20px',
  fontFamily: "'Inter', sans-serif",
  textAlign: 'center'
};

const heroImage: React.CSSProperties = {
  height: '250px',
  backgroundImage: "url('https://images.unsplash.com/photo-1501700493717-9c99da3733dc?q=80&w=1200&auto=format&fit=crop')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '12px',
  marginBottom: '30px',
  position: 'relative',
  overflow: 'hidden'
};

const overlay: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const title: React.CSSProperties = {
  color: 'white',
  fontSize: '2.5rem',
  margin: 0,
  fontWeight: 800
};

const card: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  maxWidth: '800px',
  margin: '0 auto'
};

const messageContainer: React.CSSProperties = {
  lineHeight: '1.8',
  color: '#333'
};

const mainText: React.CSSProperties = {
  fontSize: '1.4rem',
  marginBottom: '20px'
};

const subText: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#666',
  marginBottom: '20px'
};

const divider: React.CSSProperties = {
  height: '3px',
  width: '60px',
  backgroundColor: '#F28C28', // Matches your brand orange
  margin: '30px auto'
};

const guideText: React.CSSProperties = {
  fontSize: '1.2rem',
  marginBottom: '30px'
};

const highlight: React.CSSProperties = {
  color: '#F28C28',
  fontWeight: 'bold'
};

const contactBtn: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#222',
  color: '#fff',
  padding: '15px 40px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  transition: 'background-color 0.2s'
};

export default Financing;