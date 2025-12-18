#!/bin/bash

# Quick Test Script for Mobile Recharge App
# This script helps you test the backend API endpoints

BACKEND_URL="https://mobilerechargeweb.onrender.com"

echo "🧪 Testing Mobile Recharge Backend API"
echo "======================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
curl -s "$BACKEND_URL/health" | python -m json.tool
echo ""
echo ""

# Test 2: Seed Plans Database
echo "2️⃣ Seeding Plans Database..."
curl -s -X POST "$BACKEND_URL/api/admin/seed-plans" | python -m json.tool
echo ""
echo ""

# Test 3: Get All Plans
echo "3️⃣ Fetching All Plans..."
curl -s "$BACKEND_URL/api/admin/plans/all" | python -m json.tool
echo ""
echo ""

# Test 4: Get Jio Plans
echo "4️⃣ Fetching Jio Plans (requires auth token)..."
echo "⚠️  This will fail without authentication token"
echo "To test with token, update the script with: -H 'Authorization: Bearer YOUR_TOKEN'"
echo ""
echo ""

echo "✅ Basic tests complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Login to https://recharge-frontend-c525.onrender.com"
echo "   2. Open browser DevTools > Application > Local Storage"
echo "   3. Copy the 'authToken' value"
echo "   4. Test authenticated endpoints with:"
echo "      curl -H 'Authorization: Bearer YOUR_TOKEN' $BACKEND_URL/api/plans/Jio"
echo ""
