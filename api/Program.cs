var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
        builder.WithOrigins(
                "http://localhost:5173",
                "https://websvf-comp6131.vercel.app",
                "https://capstonewebsvf-5-0-aditi.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials() // Optional: if you're using cookies or auth headers
    );
});

var app = builder.Build();

// ✅ Enable CORS early in the pipeline
app.UseCors("AllowSpecificOrigin");

// Enable Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Optional: Redirect HTTP to HTTPS if enabled
// app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
