@echo off
setlocal enabledelayedexpansion
title Shopping Mall Management System - Local Runner

echo ===================================================================
echo Shopping Mall Management System (SMMS) - Spring Boot 3
echo BCA Academic Final-Year Project
echo ===================================================================
echo.

:: -------------------------------------------------------------------
:: 1. Verify Java Installation
:: -------------------------------------------------------------------
echo [Step 1/4] Checking Java installation...
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ===================================================================
    echo [ERROR] Java JDK is NOT detected on your computer!
    echo ===================================================================
    echo Spring Boot 3 requires Java JDK 17 or higher to run.
    echo.
    echo Quick Solution:
    echo 1. Download free Java JDK 17: https://adoptium.net/
    echo 2. During installation, make sure to check:
    echo    - "Set JAVA_HOME variable"
    echo    - "Add to PATH"
    echo 3. After installation finishes, double-click run.bat again.
    echo ===================================================================
    echo.
    pause
    exit /b 1
)

echo [OK] Java is ready:
java -version
echo.

:: -------------------------------------------------------------------
:: 2. Check Port 8080 Availability
:: -------------------------------------------------------------------
echo [Step 2/4] Checking network port 8080...
netstat -ano | findstr :8080 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Port 8080 appears to be in use by another application.
    echo If Spring Boot fails to bind to 8080, close the other application
    echo or change server.port in src/main/resources/application.properties.
) else (
    echo [OK] Port 8080 is free.
)
echo.

:: -------------------------------------------------------------------
:: 3. Prepare Maven (Native or Auto-Downloaded Portable Maven)
:: -------------------------------------------------------------------
echo [Step 3/4] Checking Apache Maven build tool...
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Standalone Apache Maven found on PATH.
    set MAVEN_EXEC=mvn
) else (
    echo [INFO] Standalone Maven not in PATH.
    if exist ".mvn\portable-maven\bin\mvn.cmd" (
        echo [OK] Using portable Apache Maven from .mvn\portable-maven.
        set MAVEN_EXEC=".mvn\portable-maven\bin\mvn.cmd"
    ) else (
        echo [INFO] Downloading lightweight portable Maven automatically (one-time setup)...
        echo Please wait 5-10 seconds...
        if not exist ".mvn" mkdir .mvn
        powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip', '.mvn\maven.zip'); Expand-Archive -Path '.mvn\maven.zip' -DestinationPath '.mvn' -Force; Move-Item -Path '.mvn\apache-maven-3.9.6' -Destination '.mvn\portable-maven' -Force; Remove-Item '.mvn\maven.zip' -Force"
        if exist ".mvn\portable-maven\bin\mvn.cmd" (
            echo [OK] Portable Maven downloaded and configured successfully!
            set MAVEN_EXEC=".mvn\portable-maven\bin\mvn.cmd"
        ) else (
            echo [WARNING] Could not auto-download Maven via PowerShell. Falling back to mvn.
            set MAVEN_EXEC=mvn
        )
    )
)
echo.

:: -------------------------------------------------------------------
:: 4. Background Browser Auto-Opener (Waits until Spring Boot is ready)
:: -------------------------------------------------------------------
echo [Step 4/4] Starting Spring Boot 3 server on port 8080...
echo.
echo ===================================================================
echo The system will automatically launch the Public Mall Homepage:
echo   --^> http://localhost:8080/
echo as soon as the server is ready (usually 10-15 seconds).
echo Keep this command window open while testing the application!
echo (Press Ctrl+C to stop the server anytime).
echo ===================================================================
echo.

start "" /b powershell -NoProfile -Command "for ($i=0; $i -lt 45; $i++) { Start-Sleep -Seconds 2; try { $res = Invoke-WebRequest -Uri 'http://localhost:8080/' -UseBasicParsing -TimeoutSec 1; if ($res.StatusCode -eq 200 -or $res.StatusCode -eq 302) { Start-Process 'http://localhost:8080/'; break } } catch {} }"

:: Run the Spring Boot application
%MAVEN_EXEC% clean spring-boot:run

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ===================================================================
    echo [NOTICE] If running from command prompt gave an error, you can also
    echo run this project directly inside IntelliJ IDEA with 1 click:
    echo 1. Open IntelliJ IDEA
    echo 2. File -^> Open -^> Select this folder (where pom.xml is)
    echo 3. Navigate to src/main/java/com/mall/ShoppingMallApplication.java
    echo 4. Click the Green Run / Play button
    echo ===================================================================
    echo.
    pause
)
