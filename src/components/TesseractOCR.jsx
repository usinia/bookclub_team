import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function TesseractOCR() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleOCR = () => {
    if (image) {
      setLoading(true);
      Tesseract.recognize(
        image,
        'kor', // 한국어 설정
        {
          logger: (m) => console.log(m),
        }
      )
        .then(({ data: { text } }) => {
          setText(text);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <h2>Tesseract.js OCR</h2>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleOCR}>Start OCR</button>
      {loading && <p>Processing...</p>}
      {text && (
        <div>
          <h3>Recognized Text:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default TesseractOCR;
