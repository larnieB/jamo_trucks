import React, { useState, useEffect } from 'react';

interface DriverModalProps {
  onClose: () => void;
}

const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/webp', 0.8);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

const DriverModal: React.FC<DriverModalProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    licenseClass: 'BCE',
    experienceYears: '',
    currentLocation: '',
    expectedSalary: '',
    availability: 'Immediate'
  });

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      licenseClass: 'BCE',
      experienceYears: '',
      currentLocation: '',
      expectedSalary: '',
      availability: 'Immediate'
    });
    setImages([]);
    setImagePreviews([]);
  };

  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      setImages(selectedFiles);
      const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const webpBlobs = await Promise.all(images.map(file => convertToWebP(file)));
      const data = new FormData();
      
      // Append driver details
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      
      // Append profile photos/license scans
      webpBlobs.forEach((blob, index) => {
        data.append(`documents[]`, blob, `doc_${index}.webp`);
      });

      // UPDATE THIS URL to your driver registration endpoint
      const response = await fetch('http://localhost:8080/jamo_trucks/jamo_trucks/src/backend/addDriver.php', {
        method: 'POST',
        headers: { "ngrok-skip-browser-warning": "true" },
        body: data,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Registration submitted successfully!");
        resetForm();
        onClose();
      } else {
        alert(`Error: ${result.message || 'Failed to register'}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred during submission.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={{ borderBottom: '2px solid #F28C28', paddingBottom: '10px' }}>Driver Registration</h2>
        <p style={{ fontSize: '13px', color: '#666' }}>Fill in your details to be found by truck owners.</p>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
          <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required style={inputStyle} />
          <input name="email" type="email" placeholder="Email Address" onChange={handleChange} style={inputStyle} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>License Class:</label>
              <select name="licenseClass" onChange={handleChange} style={inputStyle}>
                <option value="BCE">BCE (Heavy Commercial)</option>
                <option value="CE">CE (Trailer/Articulated)</option>
                <option value="D">D (Light Vehicle)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Experience (Yrs):</label>
              <input name="experienceYears" type="number" placeholder="Years" onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <input name="currentLocation" placeholder="Current Location (e.g. Mombasa)" onChange={handleChange} required style={inputStyle} />
          <input name="expectedSalary" type="number" placeholder="Expected Monthly Salary (KES)" onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>Profile Photo / License Document:</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />

          {imagePreviews.length > 0 && (
            <div style={previewGridStyle}>
              {imagePreviews.map((url, index) => (
                <div key={index} style={previewSquareStyle}>
                  <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          <div style={buttonContainer}>
            <button type="submit" style={submitBtnStyle} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Register Now'}
            </button>
            <button type="button" onClick={() => { resetForm(); onClose(); }} style={cancelBtnStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle: React.CSSProperties = {
  background: 'white', padding: '30px', borderRadius: '12px', width: '450px', maxHeight: '90vh', overflowY: 'auto'
};

const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px' };

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box'
};

const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '4px', display: 'block' };

const previewGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '10px' };

const previewSquareStyle: React.CSSProperties = { width: '100%', aspectRatio: '1/1', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' };

const buttonContainer: React.CSSProperties = { display: 'flex', gap: '10px', marginTop: '20px' };

const submitBtnStyle: React.CSSProperties = {
  flex: 2, padding: '12px', backgroundColor: '#F28C28', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
};

const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: '12px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer'
};

export default DriverModal;