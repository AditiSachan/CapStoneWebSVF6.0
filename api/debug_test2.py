#!/usr/bin/env python3
import pysvf
import tempfile
import subprocess

# Create a simple test C code
test_code = '''
int main() {
    int x = 5;
    int *p = &x;
    return *p;
}
'''

# Write to temp file and compile
with tempfile.NamedTemporaryFile(mode='w', suffix='.c', delete=False) as f:
    f.write(test_code)
    c_file = f.name

ll_file = c_file.replace('.c', '.ll')

# Compile with clang
result = subprocess.run(f"clang -emit-llvm -S {c_file} -o {ll_file}", shell=True, capture_output=True, text=True)

if result.returncode == 0:
    # Test pysvf.run_tool
    try:
        print("Testing pysvf.run_tool...")
        result = pysvf.run_tool('svf_ex', ['-dump-pag', ll_file])
        print("Result type:", type(result))
        print("Result:", result)
        print("Result length:", len(result) if result else "N/A")
    except Exception as e:
        print("Error:", e)
        import traceback
        traceback.print_exc()
        
    # Check what functions are actually available
    print("\nAvailable functions that start with 'run':")
    for attr in dir(pysvf):
        if attr.startswith('run'):
            print(f"  {attr}: {getattr(pysvf, attr)}")
else:
    print("Compilation failed")
