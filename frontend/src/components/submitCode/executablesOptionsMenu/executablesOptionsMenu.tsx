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
  const handleChange = (selected: any) => {
    setSelectedExecutableOptions(selected || []);
  };

  // Custom styles to ensure tooltips are visible
  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      position: 'relative',
      overflow: 'visible',
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (provided: any) => ({
      ...provided,
      overflow: 'visible',
      zIndex: 9999,
    }),
    menuList: (provided: any) => ({
      ...provided,
      overflow: 'visible',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      position: 'relative',
      overflow: 'visible',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      overflow: 'visible',
    }),
    control: (provided: any) => ({
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

  // Add setPassedPrompt to props if it exists
  if (setPassedPrompt) {
    // Use type assertion here to bypass TypeScript's type checking
    (selectProps as any).setPassedPrompt = setPassedPrompt;
  }

  return <Select {...selectProps} />;
};

export default ExecutableOptionsMenu;
