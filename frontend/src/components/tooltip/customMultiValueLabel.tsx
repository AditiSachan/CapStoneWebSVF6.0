// // // CustomMultiValueLabel.tsx - Fixed for visibility with portal-based tooltip
// // import React, { useState, useRef, useEffect } from 'react';
// // import { components, MultiValueGenericProps, GroupBase } from 'react-select';
// // import ReactDOM from 'react-dom';

// // // Generic option type that works with both compile and executable options
// // interface OptionWithDescription {
// //   value: string;
// //   label: string;
// //   description?: string;
// // }

// // // Portal-based tooltip that renders outside the React-Select container
// // const TooltipPortal: React.FC<{
// //   content: string;
// //   targetRect: DOMRect | null;
// //   isVisible: boolean;
// // }> = ({ content, targetRect, isVisible }) => {
// //   if (!isVisible || !targetRect) return null;
  
// //   // Create styles for the portal-based tooltip
// //   const tooltipStyle: React.CSSProperties = {
// //     position: 'fixed',
// //     zIndex: 9999,
// //     left: `${targetRect.left}px`,
// //     top: `${targetRect.bottom + 3}px`, // 3px below target element
// //     backgroundColor: '#333',
// //     color: '#fff',
// //     padding: '6px 10px',
// //     borderRadius: '4px',
// //     minWidth: '250px',
// //     maxWidth: '350px',
// //     boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
// //     fontFamily: 'inherit',
// //     fontSize: '14px',
// //     lineHeight: 1.4,
// //     textAlign: 'left',
// //     wordWrap: 'break-word',
// //     whiteSpace: 'normal',
// //     pointerEvents: 'none'
// //   };
  
// //   // Arrow pointing up to the target element
// //   const arrowStyle: React.CSSProperties = {
// //     position: 'absolute',
// //     bottom: '100%',
// //     left: '10px',
// //     borderWidth: '5px',
// //     borderStyle: 'solid',
// //     borderColor: 'transparent transparent #333 transparent'
// //   };
  
// //   // Create a portal to render the tooltip in the document body
// //   return ReactDOM.createPortal(
// //     <div style={tooltipStyle}>
// //       <div style={arrowStyle} />
// //       {content}
// //     </div>,
// //     document.body
// //   );
// // };

// // // Custom MultiValueLabel component with portal-based tooltip
// // const CustomMultiValueLabel = <
// //   Option extends OptionWithDescription,
// //   IsMulti extends boolean = true,
// //   Group extends GroupBase<Option> = GroupBase<Option>
// // >(props: MultiValueGenericProps<Option, IsMulti, Group>) => {
// //   const { data } = props;
// //   const [tooltipVisible, setTooltipVisible] = useState(false);
// //   const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
// //   const targetRef = useRef<HTMLDivElement>(null);
  
// //   const tooltipContent = data.description || '';
  
// //   // Update position when tooltip becomes visible
// //   useEffect(() => {
// //     if (tooltipVisible && targetRef.current) {
// //       setTargetRect(targetRef.current.getBoundingClientRect());
// //     }
// //   }, [tooltipVisible]);
  
// //   // Don't show tooltips for options without descriptions
// //   if (!tooltipContent) {
// //     return <components.MultiValueLabel {...props} />;
// //   }
  
// //   return (
// //     <div
// //       ref={targetRef}
// //       onMouseEnter={() => setTooltipVisible(true)}
// //       onMouseLeave={() => setTooltipVisible(false)}
// //       style={{ 
// //         position: 'relative', 
// //         display: 'inline-block',
// //         cursor: 'help',
// //         borderBottom: '1px dotted #777'
// //       }}
// //     >
// //       <components.MultiValueLabel {...props} />
      
// //       <TooltipPortal 
// //         content={tooltipContent}
// //         targetRect={targetRect}
// //         isVisible={tooltipVisible}
// //       />
// //     </div>
// //   );
// // };

// // export default CustomMultiValueLabel;

// // CustomMultiValueLabel.tsx - Enhanced with Ask CodeGPT button
// import React, { useState, useRef, useEffect } from 'react';
// import { components, MultiValueGenericProps, GroupBase } from 'react-select';
// import ReactDOM from 'react-dom';

// // Generic option type that works with both compile and executable options
// interface OptionWithDescription {
//   value: string;
//   label: string;
//   description?: string;
// }

// interface CustomMultiValueLabelProps<
//   Option extends OptionWithDescription,
//   IsMulti extends boolean = true,
//   Group extends GroupBase<Option> = GroupBase<Option>
// > extends MultiValueGenericProps<Option, IsMulti, Group> {
//   setPassedPrompt?: (prompt: string) => void;
// }

// // Portal-based tooltip with Ask CodeGPT button
// const TooltipPortal: React.FC<{
//   content: string;
//   targetRect: DOMRect | null;
//   isVisible: boolean;
//   optionValue: string;
//   optionType: string;
//   setPassedPrompt?: (prompt: string) => void;
// }> = ({ content, targetRect, isVisible, optionValue, optionType, setPassedPrompt }) => {
//   if (!isVisible || !targetRect) return null;
  
//   // Function to handle Ask CodeGPT button click
//   const handleAskCodeGPT = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent bubbling
//     if (setPassedPrompt) {
//       const prompt = `Can you explain in detail what the ${optionType} "${optionValue}" does? Please provide a comprehensive explanation with examples of when and how to use it effectively. What are its benefits, potential drawbacks, and common use cases?`;
//       setPassedPrompt(prompt);
//     }
//   };
  
//   // Create styles for the portal-based tooltip
//   const tooltipStyle: React.CSSProperties = {
//     position: 'fixed',
//     zIndex: 9999,
//     left: `${targetRect.left}px`,
//     top: `${targetRect.bottom + 3}px`, // 3px below target element
//     backgroundColor: '#333',
//     color: '#fff',
//     padding: '6px 10px',
//     borderRadius: '4px',
//     minWidth: '250px',
//     maxWidth: '350px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//     fontFamily: 'inherit',
//     fontSize: '14px',
//     lineHeight: 1.4,
//     textAlign: 'left',
//     wordWrap: 'break-word',
//     whiteSpace: 'normal',
//     pointerEvents: 'all' // Enable interactions
//   };
  
//   // Arrow pointing up to the target element
//   const arrowStyle: React.CSSProperties = {
//     position: 'absolute',
//     bottom: '100%',
//     left: '10px',
//     borderWidth: '5px',
//     borderStyle: 'solid',
//     borderColor: 'transparent transparent #333 transparent'
//   };
  
//   // Button container style
//   const buttonContainerStyle: React.CSSProperties = {
//     marginTop: '8px',
//     textAlign: 'center',
//     borderTop: '1px solid #555',
//     paddingTop: '6px'
//   };
  
//   // Button style
//   const buttonStyle: React.CSSProperties = {
//     backgroundColor: '#007BFF',
//     color: 'white',
//     border: 'none',
//     borderRadius: '3px',
//     padding: '4px 8px',
//     fontSize: '12px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%'
//   };
  
//   // Create a portal to render the tooltip in the document body
//   return ReactDOM.createPortal(
//     <div style={tooltipStyle} onClick={(e) => e.stopPropagation()}>
//       <div style={arrowStyle} />
//       {content}
//       {setPassedPrompt && (
//         <div style={buttonContainerStyle}>
//           <button
//             onClick={handleAskCodeGPT}
//             style={buttonStyle}
//           >
//             <span style={{ marginRight: '5px' }}>💡</span>
//             Ask CodeGPT for more details
//           </button>
//         </div>
//       )}
//     </div>,
//     document.body
//   );
// };

// // Custom MultiValueLabel component with portal-based tooltip and Ask CodeGPT
// const CustomMultiValueLabel = <
//   Option extends OptionWithDescription,
//   IsMulti extends boolean = true,
//   Group extends GroupBase<Option> = GroupBase<Option>
// >(props: CustomMultiValueLabelProps<Option, IsMulti, Group>) => {
//   const { data, setPassedPrompt } = props;
//   const [tooltipVisible, setTooltipVisible] = useState(false);
//   const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
//   const targetRef = useRef<HTMLDivElement>(null);
  
//   const tooltipContent = data.description || '';
//   const optionType = props.selectProps.name === 'compileOptions' ? 'compiler flag' : 'executable option';
  
//   // Update position when tooltip becomes visible
//   useEffect(() => {
//     if (tooltipVisible && targetRef.current) {
//       setTargetRect(targetRef.current.getBoundingClientRect());
//     }
//   }, [tooltipVisible]);
  
//   // Don't show tooltips for options without descriptions
//   if (!tooltipContent) {
//     return <components.MultiValueLabel {...props} />;
//   }
  
//   return (
//     <div
//       ref={targetRef}
//       onMouseEnter={() => setTooltipVisible(true)}
//       onMouseLeave={() => setTooltipVisible(false)}
//       style={{ 
//         position: 'relative', 
//         display: 'inline-block',
//         cursor: 'help',
//         borderBottom: '1px dotted #777'
//       }}
//     >
//       <components.MultiValueLabel {...props} />
      
//       <TooltipPortal 
//         content={tooltipContent}
//         targetRect={targetRect}
//         isVisible={tooltipVisible}
//         optionValue={data.value}
//         optionType={optionType}
//         setPassedPrompt={setPassedPrompt}
//       />
//     </div>
//   );
// };

// export default CustomMultiValueLabel;
// // CustomMultiValueLabel.tsx
// import React from 'react';
// import { components } from 'react-select';
// import Tooltip from './tooltip';

// // Custom MultiValueLabel component with visible tooltips for selected values
// const CustomMultiValueLabel = (props: any) => {
//   const { data, selectProps } = props;
//   // Access the custom props from selectProps
//   const setPassedPrompt = selectProps?.setPassedPrompt;
//   const name = selectProps?.name;
  
//   const optionType = name === 'compileOptions' ? 'compiler flag' : 'executable option';
  
//   // Simple check to ensure we have description data
//   if (!data.description) {
//     return <components.MultiValueLabel {...props} />;
//   }
  
//   // Render with tooltip wrapper
//   return (
//     <Tooltip 
//       content={data.description}
//       optionValue={data.value}
//       optionType={optionType}
//       setPassedPrompt={setPassedPrompt}
//     >
//       <div style={{ display: 'inline-block', borderBottom: '1px dotted #777' }}>
//         <components.MultiValueLabel {...props} />
//       </div>
//     </Tooltip>
//   );
// };

// export default CustomMultiValueLabel;

// CustomMultiValueLabel.tsx
import React from 'react';
import { components } from 'react-select';
import Tooltip from './tooltip';

// Custom MultiValueLabel component with visible tooltips for selected values
const CustomMultiValueLabel = (props: any) => {
  const { data, selectProps } = props;
  // Access the custom props from selectProps
  const setPassedPrompt = selectProps?.setPassedPrompt;
  const name = selectProps?.name;
  
  const optionType = name === 'compileOptions' ? 'compiler flag' : 'executable option';
  
  // Simple check to ensure we have description data
  if (!data.description) {
    return <components.MultiValueLabel {...props} />;
  }
  
  // Render with tooltip wrapper
  return (
    <Tooltip 
      content={data.description}
      optionValue={data.value}
      optionType={optionType}
      setPassedPrompt={setPassedPrompt}
    >
      <div style={{ display: 'inline-block', borderBottom: '1px dotted #777' }}>
        <components.MultiValueLabel {...props} />
      </div>
    </Tooltip>
  );
};

export default CustomMultiValueLabel;
