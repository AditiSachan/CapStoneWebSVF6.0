# Install script for directory: /home/aditi/SVF/SVF/svf

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
  foreach(file
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfCore.so.3.1"
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfCore.so.3"
      )
    if(EXISTS "${file}" AND
       NOT IS_SYMLINK "${file}")
      file(RPATH_CHECK
           FILE "${file}"
           RPATH "")
    endif()
  endforeach()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES
    "/home/aditi/SVF/SVF/Release-build/lib/libSvfCore.so.3.1"
    "/home/aditi/SVF/SVF/Release-build/lib/libSvfCore.so.3"
    )
  foreach(file
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfCore.so.3.1"
      "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libSvfCore.so.3"
      )
    if(EXISTS "${file}" AND
       NOT IS_SYMLINK "${file}")
      file(RPATH_CHANGE
           FILE "${file}"
           OLD_RPATH "/home/aditi/SVF/SVF/Release-build:/home/aditi/SVF/SVF/Release-build/lib:/home/aditi/SVF/SVF/z3.obj/bin:"
           NEW_RPATH "")
      if(CMAKE_INSTALL_DO_STRIP)
        execute_process(COMMAND "/usr/bin/strip" "${file}")
      endif()
    endif()
  endforeach()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES "/home/aditi/SVF/SVF/Release-build/lib/libSvfCore.so")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/AE/Core" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/AE/Core/AbstractState.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Core/AbstractValue.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Core/AddressValue.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Core/ICFGWTO.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Core/IntervalValue.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Core/NumericValue.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Core/RelExeState.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Core/RelationSolver.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/AE/Svfexe" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/AE/Svfexe/AEDetector.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Svfexe/AbsExtAPI.h"
    "/home/aditi/SVF/SVF/svf/include/AE/Svfexe/AbstractInterpretation.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/CFL" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/CFL/CFGNormalizer.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFGrammar.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLAlias.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLBase.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLGramGraphChecker.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLGraphBuilder.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLSVFGBuilder.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLSolver.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLStat.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/CFLVF.h"
    "/home/aditi/SVF/SVF/svf/include/CFL/GrammarBuilder.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/DDA" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/DDA/ContextDDA.h"
    "/home/aditi/SVF/SVF/svf/include/DDA/DDAClient.h"
    "/home/aditi/SVF/SVF/svf/include/DDA/DDAPass.h"
    "/home/aditi/SVF/SVF/svf/include/DDA/DDAStat.h"
    "/home/aditi/SVF/SVF/svf/include/DDA/DDAVFSolver.h"
    "/home/aditi/SVF/SVF/svf/include/DDA/FlowDDA.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/FastCluster" TYPE FILE FILES "/home/aditi/SVF/SVF/svf/include/FastCluster/fastcluster.h")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/Graphs" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/Graphs/BasicBlockG.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/CDG.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/CFLGraph.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/CHG.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/CallGraph.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ConsG.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ConsGEdge.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ConsGNode.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/DOTGraphTraits.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/GenericGraph.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/GraphPrinter.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/GraphTraits.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/GraphWriter.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ICFG.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ICFGEdge.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ICFGNode.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ICFGStat.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/IRGraph.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/SCC.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/SVFG.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/SVFGEdge.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/SVFGNode.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/SVFGOPT.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/SVFGStat.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/ThreadCallGraph.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/VFG.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/VFGEdge.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/VFGNode.h"
    "/home/aditi/SVF/SVF/svf/include/Graphs/WTO.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/MSSA" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/MSSA/MSSAMuChi.h"
    "/home/aditi/SVF/SVF/svf/include/MSSA/MemPartition.h"
    "/home/aditi/SVF/SVF/svf/include/MSSA/MemRegion.h"
    "/home/aditi/SVF/SVF/svf/include/MSSA/MemSSA.h"
    "/home/aditi/SVF/SVF/svf/include/MSSA/SVFGBuilder.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/MTA" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/MTA/LockAnalysis.h"
    "/home/aditi/SVF/SVF/svf/include/MTA/MHP.h"
    "/home/aditi/SVF/SVF/svf/include/MTA/MTA.h"
    "/home/aditi/SVF/SVF/svf/include/MTA/MTAStat.h"
    "/home/aditi/SVF/SVF/svf/include/MTA/TCT.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/MemoryModel" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/AbstractPointsToDS.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/AccessPath.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/ConditionalPT.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/MutablePointsToDS.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/PersistentPointsToCache.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/PersistentPointsToDS.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/PointerAnalysis.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/PointerAnalysisImpl.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/PointsTo.h"
    "/home/aditi/SVF/SVF/svf/include/MemoryModel/SVFLoop.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/SABER" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/SABER/DoubleFreeChecker.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/FileChecker.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/LeakChecker.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/ProgSlice.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/SaberCheckerAPI.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/SaberCondAllocator.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/SaberSVFGBuilder.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/SrcSnkDDA.h"
    "/home/aditi/SVF/SVF/svf/include/SABER/SrcSnkSolver.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/SVFIR" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/SVFIR/ObjTypeInfo.h"
    "/home/aditi/SVF/SVF/svf/include/SVFIR/PAGBuilderFromFile.h"
    "/home/aditi/SVF/SVF/svf/include/SVFIR/SVFIR.h"
    "/home/aditi/SVF/SVF/svf/include/SVFIR/SVFStatements.h"
    "/home/aditi/SVF/SVF/svf/include/SVFIR/SVFType.h"
    "/home/aditi/SVF/SVF/svf/include/SVFIR/SVFValue.h"
    "/home/aditi/SVF/SVF/svf/include/SVFIR/SVFVariables.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/Util" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/Util/Annotator.h"
    "/home/aditi/SVF/SVF/svf/include/Util/BitVector.h"
    "/home/aditi/SVF/SVF/svf/include/Util/CDGBuilder.h"
    "/home/aditi/SVF/SVF/svf/include/Util/CallGraphBuilder.h"
    "/home/aditi/SVF/SVF/svf/include/Util/Casting.h"
    "/home/aditi/SVF/SVF/svf/include/Util/CommandLine.h"
    "/home/aditi/SVF/SVF/svf/include/Util/CoreBitVector.h"
    "/home/aditi/SVF/SVF/svf/include/Util/CxtStmt.h"
    "/home/aditi/SVF/SVF/svf/include/Util/DPItem.h"
    "/home/aditi/SVF/SVF/svf/include/Util/ExtAPI.h"
    "/home/aditi/SVF/SVF/svf/include/Util/GeneralType.h"
    "/home/aditi/SVF/SVF/svf/include/Util/GraphReachSolver.h"
    "/home/aditi/SVF/SVF/svf/include/Util/NodeIDAllocator.h"
    "/home/aditi/SVF/SVF/svf/include/Util/Options.h"
    "/home/aditi/SVF/SVF/svf/include/Util/PTAStat.h"
    "/home/aditi/SVF/SVF/svf/include/Util/SVFBugReport.h"
    "/home/aditi/SVF/SVF/svf/include/Util/SVFLoopAndDomInfo.h"
    "/home/aditi/SVF/SVF/svf/include/Util/SVFStat.h"
    "/home/aditi/SVF/SVF/svf/include/Util/SVFUtil.h"
    "/home/aditi/SVF/SVF/svf/include/Util/SparseBitVector.h"
    "/home/aditi/SVF/SVF/svf/include/Util/ThreadAPI.h"
    "/home/aditi/SVF/SVF/svf/include/Util/WorkList.h"
    "/home/aditi/SVF/SVF/svf/include/Util/Z3Expr.h"
    "/home/aditi/SVF/SVF/svf/include/Util/cJSON.h"
    "/home/aditi/SVF/SVF/svf/include/Util/iterator.h"
    "/home/aditi/SVF/SVF/svf/include/Util/iterator_range.h"
    )
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/WPA" TYPE FILE FILES
    "/home/aditi/SVF/SVF/svf/include/WPA/Andersen.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/AndersenPWC.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/CSC.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/FlowSensitive.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/Steensgaard.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/TypeAnalysis.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/VersionedFlowSensitive.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/WPAFSSolver.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/WPAPass.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/WPASolver.h"
    "/home/aditi/SVF/SVF/svf/include/WPA/WPAStat.h"
    )
endif()

