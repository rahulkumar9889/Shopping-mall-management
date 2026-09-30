@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Startup Script
@REM ----------------------------------------------------------------------------
@echo off
setlocal
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  mvn %*
  exit /b %ERRORLEVEL%
)

echo [Maven Wrapper] Apache Maven not detected on PATH.
echo Attempting to run via Maven wrapper or installed JDK...
echo Please ensure Maven or Java 17+ is installed.
mvn %*
exit /b %ERRORLEVEL%
