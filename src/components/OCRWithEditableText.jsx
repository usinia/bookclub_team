import React, { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import Cropper from 'react-easy-crop';

function OCRWithEditableText() {
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [textBlocks, setTextBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedText, setSelectedText] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // base64로 변환된 이미지 데이터 URL 설정
        setImageLoaded(false); // 이미지 로드 상태 초기화
        setTextBlocks([]); // 이전 OCR 결과 초기화
        setSelectedText(''); // 선택된 텍스트 초기화
        setCroppedAreaPixels(null); // 크롭된 영역 초기화
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setImage(null);
      };
      reader.readAsDataURL(file); // 파일을 base64로 읽기 시작
    }
  };

  const handleOCR = () => {
    if (!image) return;

    setLoading(true);
    Tesseract.recognize(image, 'kor', {
      logger: (m) => console.log(m),
    })
      .then(({ data: { words } }) => {
        setTextBlocks(words);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error during OCR:', error);
        setLoading(false);
      });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const extractTextFromArea = () => {
    if (croppedAreaPixels && textBlocks.length > 0) {
      const { x, y, width, height } = croppedAreaPixels;
      const croppedTextBlocks = textBlocks.filter((block) => {
        const { bbox } = block;
        return (
          bbox.x0 >= x &&
          bbox.y0 >= y &&
          bbox.x1 <= x + width &&
          bbox.y1 <= y + height
        );
      });
      const selectedText = croppedTextBlocks.map((block) => block.text).join(' ');
      setSelectedText(selectedText);
    }
  };

  const handleImageLoaded = () => {
    setImageLoaded(true); // 이미지 로드 완료 시 상태 업데이트
  };

  return (
    <div>
      <h2>OCR with Editable Text</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleOCR} disabled={loading || !imageLoaded}>
        {loading ? 'Processing...' : 'Start OCR'}
      </button>
      {image && (
        <div style={{ position: 'relative', width: '100%', height: 400 }}>
          <Cropper
            image={image}
            cropShape="rect"
            aspect={4 / 3}
            onCropComplete={onCropComplete}
            onMediaLoaded={handleImageLoaded} // 이미지가 로드되면 콜백 호출
          />
        </div>
      )}
      <button onClick={extractTextFromArea} disabled={!croppedAreaPixels || textBlocks.length === 0}>
        Extract Text from Selected Area
      </button>
      {selectedText && (
        <div>
          <h3>Selected Text:</h3>
          <textarea
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            rows="4"
            cols="50"
          />
        </div>
      )}
    </div>
  );
}

export default OCRWithEditableText;
