# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build-env

WORKDIR /App

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

# Final Runtime Stage using your SVF base image
FROM ghcr.io/aditisachan/svf:latest

WORKDIR /App
EXPOSE 8080

# Install required packages (including clang)
RUN apt-get install -y --no-install-recommends \
    clang libtinfo6 libz-dev libzstd-dev zip libncurses5-dev xz-utils unzip make

# Set LLVM library path if needed
ENV LD_LIBRARY_PATH=/App/SVF/Release-build/lib:$LD_LIBRARY_PATH

# Copy published .NET app from build stage
COPY --from=build-env /App/out .

# Set entrypoint
ENTRYPOINT ["dotnet", "api.dll"]
