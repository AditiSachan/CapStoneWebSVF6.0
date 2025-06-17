# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build-env

WORKDIR /App

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

# Final Runtime Stage - Build SVF from source
FROM ubuntu:24.04

# Stop ubuntu interactive options
ENV DEBIAN_FRONTEND=noninteractive

# Define home directory (matching official SVF setup)
ENV HOME=/home/SVF-tools

# Install dependencies for SVF
RUN apt-get update --fix-missing && \
    apt-get install -y \
    cmake g++ gcc git zlib1g-dev libncurses5-dev libtinfo6 \
    build-essential libssl-dev libpcre2-dev zip libzstd-dev \
    wget xz-utils tcl software-properties-common curl && \
    rm -rf /var/lib/apt/lists/*

# Add deadsnakes PPA and install Python 3.10
RUN add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.10-dev && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1 && \
    rm -rf /var/lib/apt/lists/*

# Install .NET Runtime 8.0
RUN wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    rm packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y aspnetcore-runtime-8.0 && \
    rm -rf /var/lib/apt/lists/*

# Build SVF from source
WORKDIR ${HOME}
RUN git clone "https://github.com/SVF-tools/SVF.git"
WORKDIR ${HOME}/SVF
RUN echo "Building SVF..." && \
    bash ./build.sh

# Set environment variables
ENV PATH=${HOME}/SVF/Release-build/bin:$PATH
ENV PATH=${HOME}/SVF/llvm-16.0.0.obj/bin:$PATH
ENV SVF_DIR=${HOME}/SVF
ENV LLVM_DIR=${HOME}/SVF/llvm-16.0.0.obj
ENV Z3_DIR=${HOME}/SVF/z3.obj

# Fix Z3 library symlink (critical for SVF tools to work)
RUN ln -s ${Z3_DIR}/bin/libz3.so ${Z3_DIR}/bin/libz3.so.4

# Add Z3 library to system library path
RUN echo "${Z3_DIR}/bin" >> /etc/ld.so.conf.d/z3.conf && ldconfig

# Create additional symlinks for compatibility
RUN ln -sf ${Z3_DIR}/bin/libz3.so /usr/lib/libz3.so.4 && \
    ln -sf ${Z3_DIR}/bin/libz3.so /usr/lib/libz3.so

# Set up working directory for the .NET app
WORKDIR /App
EXPOSE 8080

# Copy published .NET app from build stage
COPY --from=build-env /App/out .

# Set environment variables for .NET
ENV ASPNETCORE_URLS="http://0.0.0.0:8080"

# Set library path for runtime
ENV LD_LIBRARY_PATH=${Z3_DIR}/bin:${LLVM_DIR}/lib:$LD_LIBRARY_PATH

# Set entrypoint
ENTRYPOINT ["dotnet", "api.dll"]
