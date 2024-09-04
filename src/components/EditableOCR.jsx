import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function EditableOCR() {
  const [image, setImage] = useState(null);
  const [textBlocks, setTextBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      // 기존 onload 이벤트는 파일을 다 읽은 후 실행
      reader.onload = () => {
        setImage(reader.result);
        setTextBlocks([]);  // OCR 결과 초기화
        setSelectedBlockIndex(null);  // 선택된 텍스트 초기화
        setEditText('');  // 편집 중인 텍스트 초기화
      };
      
      // FileReader가 사용 중이 아닐 때만 파일을 읽음
      if (!reader.reading) {
        reader.readAsDataURL(file);
      }
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

  const handleTextClick = (index) => {
    setSelectedBlockIndex(index);
    setEditText(textBlocks[index].text);
  };

  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };

  const handleTextSave = () => {
    const updatedBlocks = [...textBlocks];
    updatedBlocks[selectedBlockIndex].text = editText;
    setTextBlocks(updatedBlocks);
    setSelectedBlockIndex(null);
    setEditText('');
  };

  return (
    <div>
      <h2>Editable OCR</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleOCR} disabled={loading || !image}>
        {loading ? 'Processing...' : 'Start OCR'}
      </button>
      <div style={{ position: 'relative' }}>
        {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />}
        {textBlocks.map((block, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${block.bbox.x0}px`,
              top: `${block.bbox.y0}px`,
              width: `${block.bbox.x1 - block.bbox.x0}px`,
              height: `${block.bbox.y1 - block.bbox.y0}px`,
              border: '1px solid red',
              cursor: 'pointer',
            }}
            onClick={() => handleTextClick(index)}
          >
            {block.text}
          </div>
        ))}
      </div>
      {selectedBlockIndex !== null && (
        <div>
          <textarea value={editText} onChange={handleTextChange} rows="4" cols="50" />
          <button onClick={handleTextSave}>Save</button>
        </div>
      )}
    </div>
  );
}

export default EditableOCR;
