./svf-ex example.ll
./SVF/Release-build/bin/mta example.ll
./SVF/Release-build/bin/saber example.ll
./SVF/Release-build/bin/ae -overflow example.ll
./SVF/Release-build/bin/ae -null-deref example.ll
# Add these:
./SVF/Release-build/bin/wpa example.ll
./SVF/Release-build/bin/cfl example.ll
./SVF/Release-build/bin/dvf example.ll