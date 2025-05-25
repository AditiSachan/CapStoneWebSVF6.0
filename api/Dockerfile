# Use the .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build-env

# Set the working directory to the current folder (where the Dockerfile is located)
WORKDIR /App

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore  

# Copy everything else and build the project
COPY . ./
RUN dotnet publish -c Release -o out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0@sha256:6c4df091e4e531bb93bdbfe7e7f0998e7ced344f54426b7e874116a3dc3233ff

# Set the working directory for the runtime image
WORKDIR /App
EXPOSE 8080

# Set the environment variable to listen on port 5285
# ENV ASPNETCORE_URLS=http://+:5285

# Copy the published output from the build stage
COPY --from=build-env /App/out .

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git wget cmake gcc g++ clang libtinfo5 libz-dev libzstd-dev \
    zip libncurses5-dev xz-utils unzip make

# Clone SVF or pull the latest changes if it already exists
RUN if [ -d "SVF" ]; then \
        cd SVF && git pull; \
    else \
        git clone --depth 1 https://github.com/SVF-tools/SVF.git; \
    fi

# Build SVF
WORKDIR /App/SVF
RUN chmod +x build.sh
RUN /bin/bash -c "./build.sh"

# Optionally copy other files that may not be part of the publish output
WORKDIR /App
COPY . .  

# Set the entry point for the application
ENTRYPOINT ["dotnet", "api.dll"]