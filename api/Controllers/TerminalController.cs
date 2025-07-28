using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;

namespace api.Controllers
{
    [Route("ws/terminal")]
    public class TerminalController : ControllerBase
    {
        [HttpGet]
        public async Task Get()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();

                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "/bin/bash",
                        Arguments = "-i", // Interactive mode for proper echo
                        RedirectStandardInput = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        Environment = 
                        {
                            ["TERM"] = "xterm",
                            ["PS1"] = "$ ",
                            ["COLUMNS"] = "80",
                            ["LINES"] = "24"
                        }
                    }
                };

                process.Start();

                // Send initial command to configure terminal properly
                await Task.Delay(500); // Wait for bash to initialize
                var initCommand = "stty echo\n";
                var initBytes = Encoding.UTF8.GetBytes(initCommand);
                await process.StandardInput.BaseStream.WriteAsync(initBytes, 0, initBytes.Length);
                await process.StandardInput.BaseStream.FlushAsync();

                var cancellationTokenSource = new CancellationTokenSource();

                // Handle process output (stdout)
                var outputTask = Task.Run(async () =>
                {
                    try
                    {
                        var buffer = new byte[4096];
                        var stream = process.StandardOutput.BaseStream;
                        
                        while (!process.HasExited && webSocket.State == WebSocketState.Open)
                        {
                            var bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length, cancellationTokenSource.Token);
                            if (bytesRead > 0)
                            {
                                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, bytesRead), 
                                    WebSocketMessageType.Text, true, cancellationTokenSource.Token);
                            }
                        }
                    }
                    catch (Exception) { /* Handle quietly */ }
                });

                // Handle process errors (stderr)
                var errorTask = Task.Run(async () =>
                {
                    try
                    {
                        var buffer = new byte[4096];
                        var stream = process.StandardError.BaseStream;
                        
                        while (!process.HasExited && webSocket.State == WebSocketState.Open)
                        {
                            var bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length, cancellationTokenSource.Token);
                            if (bytesRead > 0)
                            {
                                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, bytesRead), 
                                    WebSocketMessageType.Text, true, cancellationTokenSource.Token);
                            }
                        }
                    }
                    catch (Exception) { /* Handle quietly */ }
                });

                try
                {
                    // Handle WebSocket input
                    var receiveBuffer = new byte[1024];
                    while (!webSocket.CloseStatus.HasValue && webSocket.State == WebSocketState.Open)
                    {
                        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), CancellationToken.None);
                        
                        if (result.MessageType == WebSocketMessageType.Text && !process.HasExited)
                        {
                            // Send input directly to process stdin
                            await process.StandardInput.BaseStream.WriteAsync(receiveBuffer, 0, result.Count);
                            await process.StandardInput.BaseStream.FlushAsync();
                        }
                        else if (result.MessageType == WebSocketMessageType.Close)
                        {
                            break;
                        }
                    }
                }
                catch (WebSocketException) { /* Handle quietly */ }
                finally
                {
                    cancellationTokenSource.Cancel();
                    
                    if (!process.HasExited)
                    {
                        try
                        {
                            process.Kill();
                            await process.WaitForExitAsync();
                        }
                        catch { }
                    }
                    
                    process.Dispose();

                    if (webSocket.State == WebSocketState.Open)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Session closed", CancellationToken.None);
                    }
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 400;
                await HttpContext.Response.WriteAsync("WebSocket connection required");
            }
        }
    }
}
