using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Win32.SafeHandles;
using System.Net;
// using Newtonsoft.Json;
using System.Text;
using api.models;
using Microsoft.AspNetCore.Cors;

namespace api.Controllers
{
    
    [Route("api/controller")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class SvfController : ControllerBase
    {
        private readonly ILogger<SvfController> _logger;

        public SvfController(ILogger<SvfController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RequestBody requestBody)
        {
            
            // Deletes .dot files in the directory
            foreach (string f in Directory.GetFiles(Directory.GetCurrentDirectory(), "*.dot"))
            {
                System.IO.File.Delete(f);
            }
            await SetCompileOptions(requestBody);
            await WriteToCFile(requestBody.Input);
            ScriptOutput clangOutput = await LaunchScript("createLLVM.sh");
            
            // if clangOutput is empty, then it means it has successfully compiled and made llvm
            // if there is an error message, then we throw 400 error and return the compile message
            // need to test if compiled successfully and error message is a warning
            if (!string.IsNullOrEmpty(clangOutput.Error)) {
                return BadRequest(new 
                {
                    Error = clangOutput.Error, 
                    Name = "Clang Error",
                });
            }
            ScriptOutput analyzeOutput = await LaunchScript("analyzeBcFile.sh");
            var dotGraphs = GetDotGraphs();
            var llvm = await GetLLVMFile();
            var result = new api.models.SvfResult
            {
                Name = "Resultant Graphs",
                Output = analyzeOutput.Output,
                Graphs = dotGraphs,
                Error = analyzeOutput.Error,
                Llvm = llvm,
            };

            return Ok(result);
            
        }

        private static async Task<string> GetLLVMFile()
        {
            return System.IO.File.ReadAllText("example.ll");
        }

        private static async Task SetCompileOptions(RequestBody requestBody)
        {
            var clangScript = "clang " + requestBody.CompileOptions + " -emit-llvm -S example.c -o example.ll";
            var executablesScript = "/home/SVF-tools/SVF/Release-build/bin/svf-ex -dump-callgraph -dump-icfg -dump-pag -dump-vfg -dump-constraint-graph example.ll";

            if (requestBody.ExtraExecutables != null)
            {
                foreach (var executable in requestBody.ExtraExecutables)
                {
                    executablesScript += $"\n/home/SVF-tools/SVF/Release-build/bin/{executable} -dump-callgraph -dump-icfg -dump-pag -dump-vfg -dump-constraint-graph example.ll";
                }
            }

            await System.IO.File.WriteAllTextAsync("createLLVM.sh", clangScript);
            await System.IO.File.WriteAllTextAsync("analyzeBcFile.sh", executablesScript);
        }


        private async static Task<api.models.ScriptOutput> LaunchScript(string scriptFileName)
        {
            string command = "sh";
            // string argss = "analyzeBcFile.sh";
            string verb = " ";

            ProcessStartInfo procInfo = new ProcessStartInfo();
            procInfo.WindowStyle = ProcessWindowStyle.Normal;
            procInfo.UseShellExecute = false;
            procInfo.FileName = command;   // 'sh' for bash 
            procInfo.Arguments = scriptFileName;        // The Script name 
            procInfo.Verb = verb;                // ------------
            procInfo.RedirectStandardOutput = true;
            procInfo.RedirectStandardError = true;

            var p = new Process();
            p.StartInfo = procInfo;
            p.Start();
            string output = p.StandardOutput.ReadToEnd();
            string error = p.StandardError.ReadToEnd();
            p.WaitForExit();
            // await WaitForExitAsync(Process.Start(procInfo), new TimeSpan(0, 0, 30));// Start that process.
            //return !String.IsNullOrWhiteSpace(error) ? error : output;
            // return output;
            return new api.models.ScriptOutput {Output = output, Error = error};
        }

        private static Task<bool> WaitForExitAsync(Process process, TimeSpan timeout)
        {
            ManualResetEvent processWaitObject = new ManualResetEvent(false);
            processWaitObject.SafeWaitHandle = new SafeWaitHandle(process.Handle, false);

            TaskCompletionSource<bool> tcs = new TaskCompletionSource<bool>();

            RegisteredWaitHandle registeredProcessWaitHandle = null;
            registeredProcessWaitHandle = ThreadPool.RegisterWaitForSingleObject(
                processWaitObject,
                delegate (object state, bool timedOut)
                {
                    if (!timedOut)
                    {
                        registeredProcessWaitHandle.Unregister(null);
                    }

                    processWaitObject.Dispose();
                    tcs.SetResult(!timedOut);
                },
                null /* state */,
                timeout,
                true /* executeOnlyOnce */);

            return tcs.Task;
        }

        public static async Task WriteToCFile(string input)
        {
            await System.IO.File.WriteAllTextAsync("example.c", input);
        }

        private static List<api.models.DotGraph> GetDotGraphs()
        {
            var dotFiles = new List<api.models.DotGraph>();
            foreach (string file in Directory.GetFiles(Directory.GetCurrentDirectory(), "*.dot"))
            {
                dotFiles.Add(new api.models.DotGraph { Name = file.Substring(file.LastIndexOf('/') + 1), Graph = System.IO.File.ReadAllText(file) });
            }

            return dotFiles;
        }

        [HttpGet]
        public IActionResult Get()
        {
          var response = new { message = "Hello World from the SVF controller :D\n" };
          return Ok(response);        
        }
    }
}