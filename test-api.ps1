# Quick Test Script for Mobile Recharge App (PowerShell)
# This script helps you test the backend API endpoints

$BACKEND_URL = "https://mobilerechargeweb.onrender.com"

Write-Host "🧪 Testing Mobile Recharge Backend API" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Check..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method Get
$response | ConvertTo-Json -Depth 10
Write-Host ""
Write-Host ""

# Test 2: Seed Plans Database
Write-Host "2️⃣ Seeding Plans Database..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/admin/seed-plans" -Method Post
    $response | ConvertTo-Json -Depth 10
    Write-Host "✅ Plans seeded successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error seeding plans: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# Test 3: Get All Plans
Write-Host "3️⃣ Fetching All Plans..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/admin/plans/all" -Method Get
    Write-Host "Total Plans: $($response.count)" -ForegroundColor Green
    Write-Host "Operators: $($response.plans.PSObject.Properties.Name -join ', ')" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error fetching plans: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

Write-Host "✅ Basic tests complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Login to https://recharge-frontend-c525.onrender.com"
Write-Host "   2. Open browser DevTools > Application > Local Storage"
Write-Host "   3. Copy the 'authToken' value"
Write-Host "   4. Test authenticated endpoints with:"
Write-Host '      $token = "YOUR_TOKEN_HERE"' -ForegroundColor Gray
Write-Host '      $headers = @{ Authorization = "Bearer $token" }' -ForegroundColor Gray
Write-Host '      Invoke-RestMethod -Uri "$BACKEND_URL/api/plans/Jio" -Headers $headers' -ForegroundColor Gray
Write-Host ""

# Bonus: Open browser to app
Write-Host "🌐 Would you like to open the app in browser? (Y/N)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq 'Y' -or $response -eq 'y') {
    Start-Process "https://recharge-frontend-c525.onrender.com"
}
