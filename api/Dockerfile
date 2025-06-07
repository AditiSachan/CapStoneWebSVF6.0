# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build-env
WORKDIR /App

COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:8.0@sha256:6c4df091e4e531bb93bdbfe7e7f0998e7ced344f54426b7e874116a3dc3233ff
WORKDIR /App
EXPOSE 8080

# Copy SVF tools from the SVF image
COPY --from=ghcr.io/aditisachan/svf:latest /home/SVF-tools/SVF /App/SVF

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git wget cmake gcc g++ clang libtinfo5 libz-dev libzstd-dev \
    zip libncurses5-dev xz-utils unzip make

ENV LD_LIBRARY_PATH=/App/SVF/llvm-16.0.0.obj/lib:$LD_LIBRARY_PATH

# Copy app
COPY --from=build-env /App/out .

ENTRYPOINT ["dotnet", "api.dll"]
