# Install script for directory: /home/aditi/SVF/SVF/svf-llvm

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Install shared libraries without execute permission?
if(NOT DEFINED CMAKE_INSTALL_SO_NO_EXE)
  set(CMAKE_INSTALL_SO_NO_EXE "1")
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/usr/bin/objdump")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE FILE RENAME "extapi.bc" FILES "/home/aditi/SVF/SVF/Release-build/lib/extapi.bc")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  foreach(file
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfLLVM.so.3.1"
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfLLVM.so.3"
      )
    if(EXISTS "${file}" AND
       NOT IS_SYMLINK "${file}")
      file(RPATH_CHECK
           FILE "${file}"
           RPATH "")
    endif()
  endforeach()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES
    "/home/aditi/SVF/SVF/Release-build/lib/libSvfLLVM.so.3.1"
    "/home/aditi/SVF/SVF/Release-build/lib/libSvfLLVM.so.3"
    )
  foreach(file
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfLLVM.so.3.1"
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfLLVM.so.3"
      )
    if(EXISTS "${file}" AND
       NOT IS_SYMLINK "${file}")
      file(RPATH_CHANGE
           FILE "${file}"
           OLD_RPATH "/home/aditi/SVF/SVF/llvm-16.0.0.obj/lib:/home/aditi/SVF/SVF/Release-build:/home/aditi/SVF/SVF/Release-build/lib:/home/aditi/SVF/SVF/z3.obj/bin:"
           NEW_RPATH "")
      if(CMAKE_INSTALL_DO_STRIP)
        execute_process(COMMAND "/usr/bin/strip" "${file}")
      endif()
    endif()
  endforeach()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES "/home/aditi/SVF/SVF/Release-build/lib/libSvfLLVM.so")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/SVF-LLVM" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/BasicTypes.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/BreakConstantExpr.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/CHGBuilder.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/CppUtil.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/DCHG.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/GEPTypeBridgeIterator.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/ICFGBuilder.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/LLVMLoopAnalysis.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/LLVMModule.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/LLVMUtil.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/ObjTypeInference.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/SVFIRBuilder.h"
    "/home/aditi/SVF/SVF/svf-llvm/include/SVF-LLVM/SymbolTableBuilder.h"
    )
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("/home/aditi/SVF/SVF/Release-build/svf-llvm/tools/cmake_install.cmake")
endif()

