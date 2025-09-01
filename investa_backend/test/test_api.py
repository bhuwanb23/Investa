#!/usr/bin/env python
"""
Script to test the API authentication
"""

import requests
import json

def test_api():
    base_url = "http://127.0.0.1:8000/api"
    
    print("🔍 Testing API endpoints...")
    
    # Test 1: Check if API is accessible
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ API Root: {response.status_code}")
        if response.status_code == 200:
            print(f"   Available endpoints: {list(response.json().keys())}")
    except Exception as e:
        print(f"❌ API Root failed: {e}")
        return
    
    # Test 2: Test login
    try:
        login_data = {
            "username": "test@example.com",
            "password": "test123"
        }
        response = requests.post(f"{base_url}/auth/login/", json=login_data)
        print(f"✅ Login: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"   Token received: {token[:20]}..." if token else "   No token received")
            return token
        else:
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return None

def test_profile_api(token):
    if not token:
        print("❌ No token available for profile test")
        return
    
    base_url = "http://127.0.0.1:8000/api"
    
    # Test 3: Test profile API with token
    try:
        headers = {
            "Authorization": f"Token {token}",
            "Content-Type": "application/json"
        }
        response = requests.get(f"{base_url}/profiles/my_profile/", headers=headers)
        print(f"✅ Profile API: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Profile data received: {len(str(data))} characters")
            print(f"   User: {data.get('user', {}).get('username', 'Unknown')}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Profile API failed: {e}")

if __name__ == "__main__":
    print("🚀 Starting API tests...")
    token = test_api()
    if token:
        test_profile_api(token)
    print("🏁 API tests completed!")
