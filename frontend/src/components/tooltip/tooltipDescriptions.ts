// // TooltipDescriptions.ts
// // Centralized file for tooltip descriptions

// export const compileOptionDescriptions: Record<string, string> = {
//     '-g': 'Generate debug information. This includes variable names, line numbers, and other information that helps with debugging.',
//     '-c': 'Compile without linking. Produces object files (.o) that can be linked separately.',
//     '-S': 'Generate assembly code. Outputs the assembly representation instead of binary object code.',
//     '-fno-discard-value-names': 'Preserves variable names in LLVM IR, making the IR more readable for humans.',
//     '-emit-llvm': 'Generate LLVM Intermediate Representation (IR) instead of native assembly or object code.',
//     '-E': 'Preprocess only. Runs the preprocessor but doesn\'t compile, assemble, or link.',
//     '-v': 'Verbose mode. Shows commands executed by the compiler and additional information.',
//     '-pipe': 'Use pipes rather than temporary files for communication between compiler stages.',
//     '--help': 'Display available options and exit.',
//   };
  
//   export const executableOptionDescriptions: Record<string, string> = {
//     'mta': 'Multi-Thread Analysis. Analyzes concurrent programs to detect potential thread-related issues like race conditions and deadlocks.',
//     'saber': 'Memory Leak Detector. Identifies memory that is allocated but never freed, causing memory leaks in your program.',
//     'ae -overflow': 'Buffer Overflow Detector. Identifies potential buffer overflow vulnerabilities where a program writes data beyond the allocated memory buffer.'
//   };
  
//   export const graphDescriptions: Record<string, string> = {
//     'callgraph': 'Call Graph visualizes the calling relationships between functions in your program. Each node represents a function, and edges show which functions call other functions.',
//     'icfg': 'Interprocedural Control Flow Graph represents control flow across function boundaries, showing how control transfers between different functions and basic blocks.',
//     'svfg': 'Static Value Flow Graph represents the data flow between program variables and statements, helping track how values propagate through the program.',
//     'vfg': 'Value Flow Graph tracks the flow of values through variables in your program, showing dependencies between variables.',
//     'pag': 'Program Assignment Graph represents pointer assignments between variables in the program, used for pointer analysis.',
//     'ptacg': 'Points-To and Call Graph combines pointer analysis with call graph, showing how function pointers might affect the call graph.'
//   };


// TooltipDescriptions.ts
// Contains all tooltip descriptions for compiler flags and executable options

export const compileOptionDescriptions: Record<string, string> = {
    '-g': 'Generate debug information. This includes variable names, line numbers, and other information that helps with debugging.',
    '-c': 'Compile without linking. Produces object files (.o) that can be linked separately.',
    '-S': 'Generate assembly code. Outputs the assembly representation instead of binary object code.',
    '-fno-discard-value-names': 'Preserves variable names in LLVM IR, making the IR more readable for humans.',
    '-emit-llvm': 'Generate LLVM Intermediate Representation (IR) instead of native assembly or object code.',
    '-E': 'Preprocess only. Runs the preprocessor but doesn\'t compile, assemble, or link.',
    '-v': 'Verbose mode. Shows commands executed by the compiler and additional information.',
    '-pipe': 'Use pipes rather than temporary files for communication between compiler stages.',
    '--help': 'Display available options and exit.',
  };
  
  export const executableOptionDescriptions: Record<string, string> = {
    'mta': 'Multi-Thread Analysis. Analyzes concurrent programs to detect potential thread-related issues like race conditions and deadlocks.',
    'saber': 'Memory Leak Detector. Identifies memory that is allocated but never freed, causing memory leaks in your program.',
    'ae -overflow': 'Buffer Overflow Detector. Identifies potential buffer overflow vulnerabilities where a program writes data beyond the allocated memory buffer.'
  };
  
  // Helper function to add descriptions to option objects
  export const addDescriptionsToOptions = <T extends { value: string; label: string }>(
    options: T[],
    descriptions: Record<string, string>
  ): (T & { description?: string })[] => {
    return options.map(option => ({
      ...option,
      description: descriptions[option.value]
    }));
  };