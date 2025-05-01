import React, { useState } from 'react';
import { ApiResponse } from '../types';

interface ResultDisplayProps {
  result: ApiResponse | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copyText, setCopyText] = useState('Copy to Clipboard');
  
  if (!result) return null;
  
  const handleCopy = () => {
    if (result.code) {
      navigator.clipboard.writeText(result.code)
        .then(() => {
          setCopyText('Copied!');
          setTimeout(() => setCopyText('Copy to Clipboard'), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  return (
    <>
      <div className="result-container visible">
        {result.success && result.code ? (
          <>
            <p>Access code generated successfully:</p>
            <p className="access-code">{result.code}</p>
          </>
        ) : (
          <p className="error">Error: {result.error || 'Failed to generate code'}</p>
        )}
      </div>
      
      {result.success && result.code && (
        <button onClick={handleCopy} className="btn copy-btn visible">
          {copyText}
        </button>
      )}
    </>
  );
};

export default ResultDisplay;