@echo off
setlocal
title PriceHunter AI - Full Stack Starter
cd /d "%~dp0"

echo --------------------------------------------------
echo 🔥 PriceHunter AI Baslatiliyor... Lutfen bekleyin.
echo --------------------------------------------------
echo.

:: Backend
echo [1/3] Backend servisi baslatiliyor...
cd backend
start "PriceHunter Backend" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak > nul

:: Frontend (production mode - webpack)
echo [2/3] Frontend uygulamasi baslatiliyor...
cd frontend
if exist ".next" rmdir /s /q ".next"
start "PriceHunter Frontend" cmd /k "npm run build && npx next start -p 3000"
cd ..

echo.
echo [3/3] Tarayici http://localhost:3000 adresinde aciliyor...
echo.
echo --------------------------------------------------
echo ✅ Sistem Hazir!
echo 💡 Backend: http://localhost:5000
echo 💡 Frontend: http://localhost:3000
echo --------------------------------------------------

timeout /t 5 /nobreak > nul
start http://localhost:3000
pause