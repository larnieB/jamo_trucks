import React, { useState, useEffect } from 'react';

interface TruckModalProps {
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
        
        // Quality set to 0.8 (80%) for best balance of size and clarity
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/webp', 0.8);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

const DriverModal: React.FC<TruckModalProps> = ({  onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]); // New state for images
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // New: for UI previews
    const [formData, setFormData] = useState({
    numberPlate: '',
    make: '',
    model: '',
    year: '',
    price: '',
    color: '',
    location: '',
    condition: 'New',
    paymentMethod: 'Cash',
    deposit: '',
    bankBalance: '',
    monthlyInstallments: ''
  });

  const resetForm = () => {
  setFormData({
    numberPlate: '',
    make: '',
    model: '',
    year: '',
    price: '',
    color: '',
    location: '',
    condition: 'New',
    paymentMethod: 'Cash',
    deposit: '',
    bankBalance: '',
    monthlyInstallments: ''
  });
  setImages([]);
  setImagePreviews([]);
};
  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [imagePreviews]);

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // 1. Ensure they are only images (additional JS-side check)
      const validImages = selectedFiles.filter(file => file.type.startsWith('image/'));
      
      setImages(validImages);

      // 2. Generate preview URLs
      const previewUrls = validImages.map(file => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  // --- 1. VALIDATION ---
  const inputYear = parseInt(formData.year, 10);
  const currentYear = new Date().getFullYear();
  if (inputYear > currentYear || inputYear < 1900) {
    alert("Please enter a valid year.");
    setIsLoading(false);
    return;
  }

  try {
    // --- 2. WEBP CONVERSION ---
    // Convert all selected images to WebP Blobs
    const webpBlobs = await Promise.all(images.map(file => convertToWebP(file)));

    // --- 3. PAYLOAD CREATION ---
    const data = new FormData();
    
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    
    // Append WebP Blobs as files
    webpBlobs.forEach((blob, index) => {
      data.append(`images[]`, blob, `image_${index}.webp`);
    });

    // --- 4. SUBMISSION ---
    const response = await fetch('http://localhost:8080/jamo_trucks_admin/jamo_trucks_admin/src/backend/addTruck.php', {
      method: 'POST',
      headers: { "ngrok-skip-browser-warning": "true" },
      body: data,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      
      alert("Truck added successfully!");
      resetForm();
      onClose();
    } else {
      alert(`Error: ${result.message || 'Failed to save truck'}`);
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("An error occurred during conversion or upload.");
  } finally {
    setIsLoading(false);
  }
};
const showLoanFields = formData.paymentMethod === 'Finance' || formData.paymentMethod === 'skumaLoan';
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Add New Truck</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          
          <input name="numberPlate" placeholder="Number Plate" onChange={handleChange} required />
          <input name="make" placeholder="Make (e.g. Volvo, Scania)" onChange={handleChange} required />
          <input name="model" placeholder="Model" onChange={handleChange} required />
          <input name="year" type="number" placeholder="Year" onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
          <input name="location" placeholder="location" onChange={handleChange} />
          <input name="color" placeholder="Color" onChange={handleChange} />

          <label>Truck Images:</label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
          />

          {/* PREVIEW SECTION */}
          {imagePreviews.length > 0 && (
            <div style={previewGridStyle}>
              {imagePreviews.map((url, index) => (
                <div key={index} style={previewSquareStyle}>
                  <img src={url} alt="preview" style={imgFillStyle} />
                </div>
              ))}
            </div>
          )}

          <label>Condition:</label>
          <select name="condition" onChange={handleChange}>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Refurbished">Refurbished</option>
          </select>

          <label>Payment Method:</label>
          <select name="paymentMethod" onChange={handleChange}>
            <option value="Cash">Cash</option>
            <option value="Finance">Finance</option>
            <option value="skumaLoan">Skuma Loan</option>
          </select>

          {/* --- CONDITIONAL FIELDS --- */}
          {showLoanFields && (
            <div style={loanFieldsContainer}>
              <h4 style={{ margin: '5px 0' }}>Loan Details</h4>
              <input 
                name="deposit" 
                type="number" 
                placeholder="Deposit Amount" 
                value={formData.deposit} 
                onChange={handleChange} 
                required 
              />
              <input 
                name="bankBalance" 
                type="number" 
                placeholder="Bank Balance Required" 
                value={formData.bankBalance} 
                onChange={handleChange} 
                required 
              />
              <input 
                name="monthlyInstallments" 
                type="number" 
                placeholder="Monthly Installments" 
                value={formData.monthlyInstallments} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}

          <div style={buttonContainer}>
            <button type="submit">Save Truck</button>
<button type="button" onClick={() => { resetForm(); onClose(); }}>
  Cancel
</button>          </div>
        </form>
      </div>
    </div>
  );
};

const loanFieldsContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '10px',
  backgroundColor: '#f9f9f9',
  borderLeft: '4px solid #007bff',
  borderRadius: '4px'
};

const previewGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '8px',
  marginTop: '10px',
  maxHeight: '150px',
  overflowY: 'auto',
  padding: '5px',
  border: '1px solid #eee',
  borderRadius: '4px'
};

const previewSquareStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd'
};

const imgFillStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const saveButtonStyle: React.CSSProperties = {
    padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
};

const cancelButtonStyle: React.CSSProperties = {
    padding: '10px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer'
};

// Simple inline styles for structure
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
};

const modalContentStyle: React.CSSProperties = {
  background: 'white', padding: '20px', borderRadius: '8px', width: '400px', color: 'black'
};

const formStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '10px'
};

const buttonContainer: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', marginTop: '15px'
};

export default DriverModal;