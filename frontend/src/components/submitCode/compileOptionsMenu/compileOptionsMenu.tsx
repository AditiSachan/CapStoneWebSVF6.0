// compileOptionsMenu.tsx
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomOption from '../../tooltip/customOption';
import CustomMultiValueLabel from '../../tooltip/customMultiValueLabel';
import {
  compileOptionDescriptions,
  addDescriptionsToOptions,
} from '../../tooltip/tooltipDescriptions';

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
  setPassedPrompt,
}) => {
  const optionsWithDescriptions = addDescriptionsToOptions(
    compileOptions,
    compileOptionDescriptions
  );

  const handleChange = (selected) => {
    setSelectedCompileOptions(selected || []);
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
    value: selectedCompileOptions,
    onChange: handleChange,
    menuPortalTarget: document.body,
    menuPosition: 'fixed',
    defaultValue: [
      optionsWithDescriptions[0],
      optionsWithDescriptions[1],
      optionsWithDescriptions[2],
      optionsWithDescriptions[3],
      optionsWithDescriptions[4],
    ],
    name: 'compileOptions',
  };

  if (setPassedPrompt) {
    selectProps.setPassedPrompt = setPassedPrompt;
  }

  return <Select {...selectProps} />;
};

export default CompileOptionsMenu;
