# Stage 1: Build the .NET app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Runtime + SVF
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Copy SVF tools from the published image
FROM ghcr.io/aditisachan/svf:latest AS svfstage

# Target image
FROM final
WORKDIR /App

COPY --from=svfstage /home/SVF-tools/SVF /App/SVF

# Install dependencies (adjust as needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    clang cmake git wget libz-dev libzstd-dev libtinfo5 \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["dotnet", "api.dll"]
