var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins(
            "http://localhost:5173",
            "https://capstonewebsvf-5-0-aditi.vercel.app/",
            "https://capstonewebsvf-5-0-aditi-git-aditisachan-aditisachans-projects.vercel.app/",
            "https://capstonewebsvf-5-0-aditi-aditisachans-projects.vercel.app/",
            "https://capstonewebsvf-5-0-aditi-git-main-aditisachans-projects.vercel.app/"

            ) // Change this to your frontend's URL
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// if (!app.Environment.IsDevelopment())
// {
//     app.UseHttpsRedirection();
// }

app.UseRouting();

// Enable CORS
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
