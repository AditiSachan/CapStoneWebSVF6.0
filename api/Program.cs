var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Add CORS services
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowSpecificOrigin", builder =>
//         builder.WithOrigins(
//                 "http://localhost:5173",
//                 "https://websvf-comp6131.vercel.app",
//                 "https://capstonewebsvf-5-0-aditi.vercel.app"
//             )
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .AllowCredentials() // Optional: if you're using cookies or auth headers
//     );
// });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
        builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});


var app = builder.Build();


// Enable Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors("AllowSpecificOrigin"); // ✅ Called BETWEEN UseRouting and UseAuthorization
app.UseAuthorization();

app.MapControllers();
app.Run();

