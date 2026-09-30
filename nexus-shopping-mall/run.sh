#!/usr/bin/env bash
set -e

echo "==================================================================="
echo "Shopping Mall Management System (SMMS) - Spring Boot 3"
echo "BCA Academic Final-Year Project"
echo "==================================================================="
echo ""

# 1. Check Java
if ! command -v java &> /dev/null; then
    echo "[ERROR] Java JDK is NOT detected on your computer!"
    echo "Spring Boot 3 requires Java JDK 17 or higher: https://adoptium.net/"
    exit 1
fi

echo "[OK] Java detected:"
java -version
echo ""

# 2. Check Maven
if command -v mvn &> /dev/null; then
    MAVEN_CMD="mvn"
elif [ -f "./mvnw" ]; then
    chmod +x ./mvnw
    MAVEN_CMD="./mvnw"
else
    MAVEN_CMD="mvn"
fi

echo "[OK] Starting Spring Boot 3 server on port 8080..."
echo "Opening browser as soon as server responds at http://localhost:8080/..."
echo "Press Ctrl+C to stop the server anytime."
echo ""

# Background browser opener
(
    for i in {1..40}; do
        sleep 2
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ | grep -qE "200|302"; then
            if command -v open &> /dev/null; then
                open "http://localhost:8080/"
            elif command -v xdg-open &> /dev/null; then
                xdg-open "http://localhost:8080/"
            fi
            break
        fi
    done
) &

$MAVEN_CMD clean spring-boot:run
