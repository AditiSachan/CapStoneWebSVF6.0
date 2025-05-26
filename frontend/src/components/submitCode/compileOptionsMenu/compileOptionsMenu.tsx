// compileOptionsMenu.tsx
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomOption from '../../tooltip/customOption';
import CustomMultiValueLabel from '../../tooltip/customMultiValueLabel';
import { compileOptionDescriptions, addDescriptionsToOptions } from '../../tooltip/tooltipDescriptions';

const animatedComponents = makeAnimated();

interface CompileOption {
  value: string;
  label: string;
  description?: string;
}

interface CompileOptionsMenuProps {
  compileOptions: CompileOption[];
  setSelectedCompileOptions: (selectedCompileOptions: CompileOption[]) => void;
  selectedCompileOptions: CompileOption[];
  setPassedPrompt?: (prompt: string) => void;
}

// Create a type to extend React-Select props
type SelectPropsWithCustomProps = React.ComponentProps<typeof Select> & {
  setPassedPrompt?: (prompt: string) => void;
  name?: string;
};

const CompileOptionsMenu: React.FC<CompileOptionsMenuProps> = ({
  compileOptions,
  setSelectedCompileOptions,
  selectedCompileOptions,
  setPassedPrompt
}) => {
  // Add descriptions to options
  const optionsWithDescriptions = addDescriptionsToOptions(
    compileOptions,
    compileOptionDescriptions
  );

  // Handler for selection changes
  const handleChange = (selected: any) => {
    setSelectedCompileOptions(selected || []);
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
      MultiValueLabel: CustomMultiValueLabel
    },
    styles: customStyles,
    isMulti: true,
    options: optionsWithDescriptions,
    value: selectedCompileOptions,
    onChange: handleChange,
    menuPortalTarget: document.body,
    menuPosition: 'fixed',
    defaultValue: [
      optionsWithDescriptions[0], 
      optionsWithDescriptions[1], 
      optionsWithDescriptions[2], 
      optionsWithDescriptions[3], 
      optionsWithDescriptions[4]
    ],
    name: "compileOptions"
  };

  // Add setPassedPrompt to props if it exists
  if (setPassedPrompt) {
    // Use type assertion here to bypass TypeScript's type checking
    (selectProps as any).setPassedPrompt = setPassedPrompt;
  }

  return <Select {...selectProps} />;
};

export default CompileOptionsMenu;