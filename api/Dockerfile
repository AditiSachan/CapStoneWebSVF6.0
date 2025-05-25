
# # Use the .NET SDK image for building the application
# FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build-env

# # Set the working directory to the current folder (where the Dockerfile is located)
# WORKDIR /App

# # Copy the project file and restore dependencies
# COPY *.csproj ./
# RUN dotnet restore  

# # Copy everything else and build the project
# COPY . ./
# RUN dotnet publish -c Release -o out

# # Create a separate stage for building SVF
# FROM ubuntu:24.04 AS svf-builder

# # Stop ubuntu interactive options
# ENV DEBIAN_FRONTEND noninteractive

# # Stop script if any individual command fails
# RUN set -e

# # Define LLVM version
# ENV llvm_version=16.0.0

# # Define home directory
# ENV HOME=/home/SVF-tools

# # Define dependencies
# ENV lib_deps="cmake g++ gcc git zlib1g-dev libncurses5-dev libtinfo6 build-essential libssl-dev libpcre2-dev zip libzstd-dev"
# ENV build_deps="wget xz-utils git tcl software-properties-common"

# # Fetch dependencies
# RUN apt-get update --fix-missing
# RUN apt-get install -y $build_deps $lib_deps

# # Add deadsnakes PPA for multiple Python versions 
# RUN add-apt-repository ppa:deadsnakes/ppa
# RUN apt-get update
# RUN set -ex; \
#     apt-get update && apt-get install -y python3.10-dev \
#             && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1;

# # Fetch and build SVF source
# WORKDIR ${HOME}
# RUN git clone "https://github.com/SVF-tools/SVF.git"
# WORKDIR ${HOME}/SVF

# # Modify build.sh to use single thread for build to reduce memory usage
# RUN sed -i 's/cmake --build .* -j .*/cmake --build "${BUILD_DIR}" -j1/g' build.sh

# # Build SVF
# RUN bash ./build.sh

# # Export SVF, llvm, z3 paths
# ENV PATH=${HOME}/SVF/Release-build/bin:$PATH
# ENV PATH=${HOME}/SVF/llvm-$llvm_version.obj/bin:$PATH
# ENV SVF_DIR=${HOME}/SVF
# ENV LLVM_DIR=${HOME}/SVF/llvm-$llvm_version.obj
# ENV Z3_DIR=${HOME}/SVF/z3.obj
# RUN ln -s ${Z3_DIR}/bin/libz3.so ${Z3_DIR}/bin/libz3.so.4

# Final runtime image - change to Ubuntu 24.04
FROM ubuntu:24.04

# Install .NET runtime on Ubuntu
RUN apt-get update && apt-get install -y \
    wget \
    apt-transport-https \
    && wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y dotnet-runtime-8.0 \
    libxml2 \
    libncurses6 \
    libzstd1 \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory for the runtime image
WORKDIR /App
EXPOSE 8080

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