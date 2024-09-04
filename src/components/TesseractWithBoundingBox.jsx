import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

function TesseractWithBoundingBox() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
      };
    }
  };

  const handleOCR = () => {
    if (!image) return;

    setLoading(true);
    const img = new Image();
    img.src = image;
    img.onload = () => {
      // Create a canvas to draw the image and bounding boxes
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Perform OCR with Tesseract.js
      Tesseract.recognize(img, 'kor', {
        logger: (m) => console.log(m),
      })
        .then(({ data: { words } }) => {
          words.forEach((word) => {
            const { bbox, text } = word;
            // Draw bounding box
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);

            // Optionally, draw the recognized text near the bounding box
            ctx.font = '12px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(text, bbox.x0, bbox.y0 > 10 ? bbox.y0 - 5 : 10);
          });

          setLoading(false);
        })
        .catch((error) => {
          console.error('Error during OCR:', error);
          setLoading(false);
        });
    };
  };

  return (
    <div>
      <h2>Tesseract.js OCR with Bounding Box</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleOCR} disabled={loading}>
        {loading ? 'Processing...' : 'Start OCR'}
      </button>
      <div>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid black' }}></canvas>
      </div>
    </div>
  );
}

export default TesseractWithBoundingBox;
