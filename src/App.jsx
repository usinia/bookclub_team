import React from 'react';
import OCRWithEditableText from './components/OCRWithEditableText';
import TesseractOCR from './components/TesseractOCR';
import TesseractWithBoundingBox from './components/TesseractWithBoundingBox';
import EditableOCR from './components/EditableOCR';

function App() {

  return (
    <div className="App">
      <TesseractOCR></TesseractOCR>
      <TesseractWithBoundingBox></TesseractWithBoundingBox>
      {/* <OCRWithEditableText></OCRWithEditableText> */}
      <EditableOCR></EditableOCR>
    </div>
  );
}

export default App;
