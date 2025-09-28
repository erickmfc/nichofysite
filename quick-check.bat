@echo off
echo 🔍 Verificando pasta do projeto...
cd /d "C:\Users\Mathe\vscode tranalhos\nichofysite"

echo 📅 Timestamp: %date% %time%
echo 📁 Pasta atual: %cd%

echo.
echo 📊 Status dos arquivos principais:
if exist "app\page.tsx" echo ✅ app\page.tsx
if exist "components\ui\HowItWorksSection.tsx" echo ✅ components\ui\HowItWorksSection.tsx
if exist "components\ui\InfiniteContentFlow.tsx" echo ✅ components\ui\InfiniteContentFlow.tsx
if exist "package.json" echo ✅ package.json

echo.
echo 🔄 Verificando mudanças recentes...
forfiles /m *.tsx /s /c "cmd /c echo 📄 @path - @fdate @ftime" 2>nul | findstr /i "2024"

echo.
echo 🚀 Verificando processos Node.js...
tasklist | findstr /i "node.exe"

echo.
echo ✅ Verificação concluída!
timeout /t 60 /nobreak > nul
