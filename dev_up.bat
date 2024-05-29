@echo off
REM Ensure Node.js and MongoDB are installed and running
echo Please ensure that Node.js and MongoDB are installed and running on your machine. Without these, the project won't run correctly.
pause

REM Navigate to the project root directory
cd /d "%~dp0"
echo Navigated to the project root directory "%~dp0"
pause

echo Now dependencies will be installed and the project will be run. Client will run at http://localhost:5173. Server will run at http://localhost:3000. Socket server will run at http://localhost:3001.
pause

REM Install dependencies using pnpm or npm
echo Installing dependencies and running the project...
pnpm install & pnpm dev
