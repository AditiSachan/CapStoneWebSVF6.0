// executablesOptionsMenu.tsx
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomOption from '../../tooltip/customOption';
import CustomMultiValueLabel from '../../tooltip/customMultiValueLabel';
import {
  executableOptionDescriptions,
  addDescriptionsToOptions,
} from '../../tooltip/tooltipDescriptions';

const animatedComponents = makeAnimated();

interface executableOption {
  value: string;
  label: string;
  description?: string;
}

interface ExecutableOptionsMenuProps {
  executableOptions: executableOption[];
  setSelectedExecutableOptions: (selectedExecutableOptions: executableOption[]) => void;
  selectedExecutableOptions: executableOption[];
  setPassedPrompt?: (prompt: string) => void;
}

// Create a type to extend React-Select props
type SelectPropsWithCustomProps = React.ComponentProps<typeof Select> & {
  setPassedPrompt?: (prompt: string) => void;
  name?: string;
};

const ExecutableOptionsMenu: React.FC<ExecutableOptionsMenuProps> = ({
  executableOptions,
  setSelectedExecutableOptions,
  selectedExecutableOptions,
  setPassedPrompt,
}) => {
  // Add descriptions to options
  const optionsWithDescriptions = addDescriptionsToOptions(
    executableOptions,
    executableOptionDescriptions
  );

  // Handler for selection changes
  const handleChange = (selected) => {
    setSelectedExecutableOptions(selected || []);
  };

  // Custom styles to ensure tooltips are visible
  const customStyles = {
    option: (provided) => ({
      ...provided,
      position: 'relative',
      overflow: 'visible',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (provided) => ({
      ...provided,
      overflow: 'visible',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      overflow: 'visible',
    }),
    multiValue: (provided) => ({
      ...provided,
      position: 'relative',
      overflow: 'visible',
    }),
    valueContainer: (provided) => ({
      ...provided,
      overflow: 'visible',
    }),
    control: (provided) => ({
      ...provided,
      overflow: 'visible',
    }),
  };

  // Create props that include custom props
  const selectProps: SelectPropsWithCustomProps = {
    closeMenuOnSelect: false,
    components: {
      ...animatedComponents,
      Option: CustomOption,
      MultiValueLabel: CustomMultiValueLabel,
    },
    styles: customStyles,
    isMulti: true,
    options: optionsWithDescriptions,
    value: selectedExecutableOptions,
    onChange: handleChange,
    menuPortalTarget: document.body,
    menuPosition: 'fixed',
    name: 'executableOptions',
  };

  if (setPassedPrompt) {
    selectProps.setPassedPrompt = setPassedPrompt;
  }

  return <Select {...selectProps} />;
};

export default ExecutableOptionsMenu;
