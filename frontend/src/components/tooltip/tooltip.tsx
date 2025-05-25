// // Tooltip.tsx - Updated with position options
// import React from 'react';
// import './tooltip.css';

// type TooltipPosition = 'right' | 'bottom' | 'left' | 'top';

// interface TooltipProps {
//   content: string;
//   children: React.ReactNode;
//   position?: TooltipPosition;
// }

// const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'right' }) => {
//   return (
//     <div className={`tooltip-container tooltip-${position}`}>
//       <div className="tooltip-trigger">
//         {children}
//       </div>
//       <div className="tooltip-content">
//         {content}
//       </div>
//     </div>
//   );
// };

// export default Tooltip;
// Tooltip.tsx - Simplified for better compatibility
import React from 'react';
import './tooltip.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  optionValue?: string;
  optionType?: string;
  setPassedPrompt?: (prompt: string) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  optionValue, 
  optionType, 
  setPassedPrompt 
}) => {
  // Function to handle Ask CodeGPT button click
  const handleAskCodeGPT = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the option from being selected
    e.preventDefault();
    if (setPassedPrompt && optionValue && optionType) {
      const prompt = `Can you explain in detail what the ${optionType} "${optionValue}" does? Please provide a comprehensive explanation with examples of when and how to use it effectively. What are its benefits, potential drawbacks, and common use cases?`;
      setPassedPrompt(prompt);
    }
  };

  return (
    <div className="tooltip-container">
      <div className="tooltip-trigger">
        {children}
      </div>
      <div className="tooltip-content">
        {content}
        {setPassedPrompt && optionValue && (
          <div className="tooltip-button-container">
            <button
              onClick={handleAskCodeGPT}
              className="tooltip-button"
            >
              <span style={{ marginRight: '5px' }}>💡</span>
              Ask CodeGPT for more details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tooltip;