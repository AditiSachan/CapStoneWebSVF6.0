// optionTypes.ts - Updated with toolType utility
import { GroupBase } from 'react-select';

export interface OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

export interface CompileOption extends OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

export interface ExecutableOption extends OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

export function addDescriptionsToOptions<T extends { value: string; label: string }>(
  options: T[],
  descriptions: Record<string, string>
): (T & { description?: string })[] {
  return options.map(option => ({
    ...option,
    description: descriptions[option.value] || undefined
  }));
}

// Utility function to determine tool type from executable name
export const getToolType = (executableName: string): 'mta' | 'saber' | 'ae' | undefined => {
  if (!executableName) return undefined;
  
  const name = executableName.toLowerCase();
  if (name.includes('mta') || name.includes('multi-thread')) return 'mta';
  if (name.includes('saber')) return 'saber';
  if (name.includes('ae') || name.includes('abstract')) return 'ae';
  
  return undefined;
};