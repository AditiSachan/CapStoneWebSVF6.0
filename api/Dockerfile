# Build SVF from source
FROM ubuntu:22.04

# Stop ubuntu interactive options
ENV DEBIAN_FRONTEND=noninteractive

# Define home directory
ENV HOME=/home/SVF-tools

# Install dependencies for SVF and pysvf
RUN apt-get update --fix-missing && \
    apt-get install -y \
    cmake g++ gcc git zlib1g-dev libncurses5-dev libtinfo6 \
    build-essential libssl-dev libpcre2-dev zip libzstd-dev \
    wget xz-utils tcl software-properties-common curl \
    python3.10 python3.10-dev python3-pip pybind11-dev ninja-build && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1 && \
    rm -rf /var/lib/apt/lists/*

# Build SVF from source
WORKDIR ${HOME}
RUN git clone "https://github.com/SVF-tools/SVF.git"
WORKDIR ${HOME}/SVF
RUN echo "Building SVF..." && \
    export TAR_OPTIONS="--no-same-owner" && \
    bash ./build.sh

# Clone and build SVF-Python for pysvf
WORKDIR ${HOME}
RUN git clone "https://github.com/SVF-tools/SVF-Python.git"
WORKDIR ${HOME}/SVF-Python

# Set environment variables needed for SVF-Python build
ENV SVF_DIR=${HOME}/SVF
ENV LLVM_DIR=${HOME}/SVF/llvm-16.0.0.obj
ENV Z3_DIR=${HOME}/SVF/z3.obj

# Build SVF-Python
RUN echo "Building SVF-Python..." && \
    bash ./build.sh

# Install pysvf
WORKDIR ${HOME}/SVF-Python
RUN python3 -m pip install .

# Set environment variables
ENV PATH=${HOME}/SVF/Release-build/bin:$PATH
ENV PATH=${HOME}/SVF/llvm-16.0.0.obj/bin:$PATH

# Fix Z3 library symlink
RUN ln -s ${Z3_DIR}/bin/libz3.so ${Z3_DIR}/bin/libz3.so.4

# Add Z3 library to system library path
RUN echo "${Z3_DIR}/bin" >> /etc/ld.so.conf.d/z3.conf && ldconfig

# Create additional symlinks for compatibility
RUN ln -sf ${Z3_DIR}/bin/libz3.so /usr/lib/libz3.so.4 && \
    ln -sf ${Z3_DIR}/bin/libz3.so /usr/lib/libz3.so

# Set library path for runtime
ENV LD_LIBRARY_PATH=${Z3_DIR}/bin:${LLVM_DIR}/lib:$LD_LIBRARY_PATH

# Set up working directory for the Python app
WORKDIR /app

# Copy Python API files
COPY ./app.py ./
COPY ./requirements.txt ./

# Install Python dependencies
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install -r requirements.txt

# Expose port
EXPOSE 8080

# Command to run the API
CMD ["python3", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
