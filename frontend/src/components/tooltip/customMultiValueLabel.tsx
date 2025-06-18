// CustomMultiValueLabel.tsx - Updated with toolType
import React from 'react';
import { components } from 'react-select';
import Tooltip from './tooltip';

const CustomMultiValueLabel = (props: any) => {
  const { data, selectProps } = props;
  const setPassedPrompt = selectProps?.setPassedPrompt;
  const name = selectProps?.name;
  const toolType = selectProps?.toolType; // Get toolType from selectProps

  const optionType = name === 'compileOptions' ? 'compiler flag' : 'executable option';

  if (!data.description) {
    return <components.MultiValueLabel {...props} />;
  }

  return (
    <Tooltip
      content={data.description}
      optionValue={data.value}
      optionType={optionType}
      toolType={toolType}
      setPassedPrompt={setPassedPrompt}
    >
      <div style={{ display: 'inline-block', borderBottom: '1px dotted #777' }}>
        <components.MultiValueLabel {...props} />
      </div>
    </Tooltip>
  );
};

export default CustomMultiValueLabel;
