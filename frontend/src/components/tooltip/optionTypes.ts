// optionTypes.ts - Extended option types with description property
import { GroupBase } from 'react-select';

// Extend the base option type to include descriptions
export interface OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

// Type for compile options with descriptions
export interface CompileOption extends OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

// Type for executable options with descriptions
export interface ExecutableOption extends OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

// Helper function to add descriptions to options
export function addDescriptionsToOptions<T extends { value: string; label: string }>(
  options: T[],
  descriptions: Record<string, string>
): (T & { description?: string })[] {
  return options.map(option => ({
    ...option,
    description: descriptions[option.value] || undefined
  }));
}