@echo off
REM Create Backend Directory Structure

echo Creating backend directory structure...

mkdir "src\config" 2>nul
mkdir "src\types" 2>nul
mkdir "src\validations" 2>nul
mkdir "src\middleware" 2>nul
mkdir "src\repositories" 2>nul
mkdir "src\services" 2>nul
mkdir "src\controllers" 2>nul
mkdir "src\routes" 2>nul
mkdir "src\utils" 2>nul
mkdir "database" 2>nul

echo.
echo Backend directory structure created successfully!
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Copy .env.example to .env and configure
echo 3. Run schema.sql in your Supabase SQL Editor
echo 4. Run seed.sql to add test data (optional)
echo 5. Run: npm run dev
