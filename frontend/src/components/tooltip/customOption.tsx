// // // CustomOption.tsx - Updated to show tooltip at bottom with reduced spacing
// // import React, { useState } from 'react';
// // import { components, OptionProps, GroupBase } from 'react-select';

// // // Generic option type that works with both compile and executable options
// // interface OptionType {
// //   value: string;
// //   label: string;
// //   description?: string;
// // }

// // // Custom Option component with tooltip at the bottom
// // const CustomOption = <
// //   Option extends OptionType,
// //   IsMulti extends boolean = false,
// //   Group extends GroupBase<Option> = GroupBase<Option>
// // >(props: OptionProps<Option, IsMulti, Group>) => {
// //   const { data, isSelected } = props;
// //   const [tooltipVisible, setTooltipVisible] = useState(false);
  
// //   // Read the description from the data
// //   const tooltipContent = data.description || '';
  
// //   // Function to handle mouse actions for tooltip visibility
// //   const showTooltip = () => setTooltipVisible(true);
// //   const hideTooltip = () => setTooltipVisible(false);
  
// //   return (
// //     <div 
// //       onMouseEnter={showTooltip}
// //       onMouseLeave={hideTooltip}
// //       style={{ position: 'relative' }}
// //     >
// //       <components.Option {...props}>
// //         {tooltipContent ? (
// //           <>
// //             {data.label}
// //             {tooltipVisible && (
// //               <div 
// //                 className="fixed-tooltip"
// //                 style={{
// //                   position: 'absolute',
// //                   zIndex: 9999,
// //                   left: '0',
// //                   top: '100%', // Position at the bottom of the option
// //                   marginTop: '3px', // Reduced space between option and tooltip
// //                   backgroundColor: '#333',
// //                   color: '#fff',
// //                   padding: '6px 10px',
// //                   borderRadius: '4px',
// //                   minWidth: '250px',
// //                   maxWidth: '350px',
// //                   width: 'auto',
// //                   boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
// //                   fontFamily: 'inherit',
// //                   fontSize: '14px',
// //                   lineHeight: 1.4,
// //                   textAlign: 'left',
// //                   wordWrap: 'break-word',
// //                   whiteSpace: 'normal',
// //                   pointerEvents: 'none'
// //                 }}
// //               >
// //                 {tooltipContent}
// //                 <div 
// //                   style={{
// //                     position: 'absolute',
// //                     bottom: '100%',
// //                     left: '10px',
// //                     borderWidth: '5px',
// //                     borderStyle: 'solid',
// //                     borderColor: 'transparent transparent #333 transparent'
// //                   }}
// //                 />
// //               </div>
// //             )}
// //           </>
// //         ) : (
// //           data.label
// //         )}
// //       </components.Option>
// //     </div>
// //   );
// // };

// // export default CustomOption;

// // CustomOption.tsx - Enhanced with Ask CodeGPT button
// import React, { useState } from 'react';
// import { components, OptionProps, GroupBase } from 'react-select';

// // Generic option type that works with both compile and executable options
// interface OptionType {
//   value: string;
//   label: string;
//   description?: string;
// }

// interface CustomOptionProps<
//   Option extends OptionType,
//   IsMulti extends boolean = false,
//   Group extends GroupBase<Option> = GroupBase<Option>
// > extends OptionProps<Option, IsMulti, Group> {
//   setPassedPrompt?: (prompt: string) => void;
// }

// // Custom Option component with tooltip at the bottom and Ask CodeGPT button
// const CustomOption = <
//   Option extends OptionType,
//   IsMulti extends boolean = false,
//   Group extends GroupBase<Option> = GroupBase<Option>
// >(props: CustomOptionProps<Option, IsMulti, Group>) => {
//   const { data, isSelected, setPassedPrompt } = props;
//   const [tooltipVisible, setTooltipVisible] = useState(false);
  
//   // Read the description from the data
//   const tooltipContent = data.description || '';
  
//   // Function to handle mouse actions for tooltip visibility
//   const showTooltip = () => setTooltipVisible(true);
//   const hideTooltip = () => setTooltipVisible(false);
  
//   // Function to handle Ask CodeGPT button click
//   const handleAskCodeGPT = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent the option from being selected
//     if (setPassedPrompt) {
//       const optionType = props.selectProps.name === 'compileOptions' ? 'compiler flag' : 'executable option';
//       const prompt = `Can you explain in detail what the ${optionType} "${data.value}" does? Please provide a comprehensive explanation with examples of when and how to use it effectively. What are its benefits, potential drawbacks, and common use cases?`;
//       setPassedPrompt(prompt);
//     }
//   };
  
//   return (
//     <div 
//       onMouseEnter={showTooltip}
//       onMouseLeave={hideTooltip}
//       style={{ position: 'relative' }}
//     >
//       <components.Option {...props}>
//         {tooltipContent ? (
//           <>
//             {data.label}
//             {tooltipVisible && (
//               <div 
//                 className="fixed-tooltip"
//                 style={{
//                   position: 'absolute',
//                   zIndex: 9999,
//                   left: '0',
//                   top: '100%', // Position at the bottom of the option
//                   marginTop: '3px', // Reduced space between option and tooltip
//                   backgroundColor: '#333',
//                   color: '#fff',
//                   padding: '6px 10px',
//                   borderRadius: '4px',
//                   minWidth: '250px',
//                   maxWidth: '350px',
//                   width: 'auto',
//                   boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//                   fontFamily: 'inherit',
//                   fontSize: '14px',
//                   lineHeight: 1.4,
//                   textAlign: 'left',
//                   wordWrap: 'break-word',
//                   whiteSpace: 'normal',
//                   pointerEvents: 'all' // Change to 'all' to allow interaction
//                 }}
//                 onClick={(e) => e.stopPropagation()} // Prevent clicks inside tooltip from selecting the option
//               >
//                 {tooltipContent}
//                 {setPassedPrompt && (
//                   <div 
//                     style={{
//                       marginTop: '8px', 
//                       textAlign: 'center',
//                       borderTop: '1px solid #555',
//                       paddingTop: '6px'
//                     }}
//                   >
//                     <button
//                       onClick={handleAskCodeGPT}
//                       style={{
//                         backgroundColor: '#007BFF',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '3px',
//                         padding: '4px 8px',
//                         fontSize: '12px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         width: '100%'
//                       }}
//                     >
//                       <span style={{ marginRight: '5px' }}>💡</span>
//                       Ask CodeGPT for more details
//                     </button>
//                   </div>
//                 )}
//                 <div 
//                   style={{
//                     position: 'absolute',
//                     bottom: '100%',
//                     left: '10px',
//                     borderWidth: '5px',
//                     borderStyle: 'solid',
//                     borderColor: 'transparent transparent #333 transparent'
//                   }}
//                 />
//               </div>
//             )}
//           </>
//         ) : (
//           data.label
//         )}
//       </components.Option>
//     </div>
//   );
// };

// export default CustomOption;

/// CustomOption.tsx
import React from 'react';
import { components } from 'react-select';
import Tooltip from './tooltip';

// Custom Option component - using any type for props to avoid TypeScript issues
const CustomOption = (props: any) => {
  const { data, selectProps } = props;
  // Access the custom props from selectProps
  const setPassedPrompt = selectProps?.setPassedPrompt;
  const name = selectProps?.name;
  
  const optionType = name === 'compileOptions' ? 'compiler flag' : 'executable option';
  
  // Render the option with tooltip if there's a description
  return (
    <components.Option {...props}>
      {data.description ? (
        <Tooltip 
          content={data.description}
          optionValue={data.value}
          optionType={optionType}
          setPassedPrompt={setPassedPrompt}
        >
          {data.label}
        </Tooltip>
      ) : (
        data.label
      )}
    </components.Option>
  );
};

export default CustomOption;