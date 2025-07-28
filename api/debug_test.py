#!/usr/bin/env python3
import pysvf
import tempfile

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
import subprocess
result = subprocess.run(f"clang -emit-llvm -S {c_file} -o {ll_file}", shell=True, capture_output=True, text=True)
print("Compilation result:", result.returncode)
print("Compilation stdout:", result.stdout)
print("Compilation stderr:", result.stderr)

if result.returncode == 0:
    # Test pysvf.run_svf_tool
    try:
        print("Testing pysvf.run_svf_tool...")
        result = pysvf.run_svf_tool('svf_ex', ['-dump-pag', ll_file])
        print("Result type:", type(result))
        print("Result:", result)
    except Exception as e:
        print("Error:", e)
        import traceback
        traceback.print_exc()
else:
    print("Compilation failed")
