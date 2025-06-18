// import React, {useState, useEffect, useRef} from 'react';
// import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
// import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
// import './styles.css';

// const NodeSelectedLookup = ({nodeIDIndex, handleZoomToNode, nodeIDList}: {nodeIDIndex: number, handleZoomToNode: (newNodeIDIndex: number) => void, nodeIDList: []}) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const handleFontSizeDropDown = () => {
//     setIsOpen(!isOpen);
//   }

//   // These functions allows the font size menu to be closed when the user clicks on other parts of the screen
//   const handleClickOutside = (event: MouseEvent) => {
//     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//       setIsOpen(false);
//     }
//   };

//   // Adds an event listener to listen for clicks
//   // When it listens to a click outside of the drop down menu button, it will close the menu list
//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
//   console.log('nodeIDList in the nodeSelectedLookup component', nodeIDList);

//   return (
//     <div id='font-size-menu-container' ref={menuRef}>
//         <div id='font-size-decrease' className={`font-size-incDec-button-div ${nodeIDIndex === 0 ? 'disabled' : ''}`} onClick={() => handleZoomToNode(nodeIDIndex - 1)}>
//         <TextDecreaseIcon fontSize='small'/>
//       </div>
//       <div id='font-size-drop-down-container'>
//         <button id='font-size-dropdown-btn' onClick={handleFontSizeDropDown}>
//           {nodeIDList.length > 0 ? nodeIDList[nodeIDIndex].title : 'No Nodes Selected'}
//         </button>
//         {isOpen && (
//           <div id="font-size-dropdown-menu">
//             {nodeIDList.map((i) => (
//               <div className={`font-size-drop-menu-item ${nodeIDIndex === i ? 'selected' : ''}`} onClick={() => handleZoomToNode(i)}>{nodeIDIndex[nodeIDIndex].label}</div>
//             ))}

//           </div>
//         )}
//       </div>

//       <div id='font-size-increase' className={`font-size-incDec-button-div ${nodeIDIndex === nodeIDList.length - 1 ? 'disabled' : ''}`} onClick={() => handleZoomToNode(nodeIDIndex + 1)}>
//         <TextIncreaseIcon fontSize='small'/>
//       </div>
//     </div>
//   )
// };
// export default NodeSelectedLookup;
