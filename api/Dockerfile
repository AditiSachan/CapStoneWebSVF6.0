# 




# Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 8080

# Copy published app
COPY --from=build /out .

# ✅ Copy local prebuilt SVF files
COPY ./SVF-prebuilt /app/SVF

# Start API
ENTRYPOINT ["dotnet", "api.dll"]
