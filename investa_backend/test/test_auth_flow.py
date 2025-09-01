#!/usr/bin/env python
"""
Comprehensive authentication flow test
"""

import requests
import json
import time

def test_auth_flow():
    base_url = "http://127.0.0.1:8000/api"
    
    print("🔍 Testing complete authentication flow...")
    print("=" * 60)
    
    # Step 1: Test API root
    print("1️⃣ Testing API root...")
    try:
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            endpoints = response.json()
            print(f"   Available endpoints: {list(endpoints.keys())}")
        else:
            print(f"   Error: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Failed: {e}")
        return
    
    print()
    
    # Step 2: Test login endpoint
    print("2️⃣ Testing login endpoint...")
    try:
        # Test GET request (should fail)
        response = requests.get(f"{base_url}/auth/login/")
        print(f"   GET request status: {response.status_code}")
        print(f"   GET response: {response.text[:100]}...")
        
        # Test POST request (should work)
        login_data = {
            "username": "test@example.com",
            "password": "test123"
        }
        response = requests.post(f"{base_url}/auth/login/", json=login_data)
        print(f"   POST request status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"   ✅ Login successful!")
            print(f"   Token: {token[:20]}..." if token else "   No token received")
            print(f"   User ID: {data.get('user_id')}")
            print(f"   Username: {data.get('username')}")
            print(f"   Email: {data.get('email')}")
        else:
            print(f"   ❌ Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"   ❌ Login test failed: {e}")
        return None
    
    print()
    
    # Step 3: Test profile endpoint without token
    print("3️⃣ Testing profile endpoint without token...")
    try:
        response = requests.get(f"{base_url}/profiles/my_profile/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   ❌ Failed: {e}")
    
    print()
    
    # Step 4: Test profile endpoint with token
    print("4️⃣ Testing profile endpoint with token...")
    if token:
        try:
            headers = {
                "Authorization": f"Token {token}",
                "Content-Type": "application/json"
            }
            response = requests.get(f"{base_url}/profiles/my_profile/", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Profile API successful!")
                print(f"   User: {data.get('user', {}).get('username', 'Unknown')}")
                print(f"   Level: {data.get('level', 'Unknown')}")
                print(f"   XP: {data.get('experience_points', 'Unknown')}")
            else:
                print(f"   ❌ Profile API failed: {response.text}")
        except Exception as e:
            print(f"   ❌ Profile test failed: {e}")
    else:
        print("   ❌ No token available")
    
    print()
    
    # Step 5: Test auth/me endpoint
    print("5️⃣ Testing auth/me endpoint...")
    if token:
        try:
            headers = {
                "Authorization": f"Token {token}",
                "Content-Type": "application/json"
            }
            response = requests.get(f"{base_url}/auth/me/", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Auth/me successful!")
                print(f"   User: {data.get('username', 'Unknown')}")
                print(f"   Email: {data.get('email', 'Unknown')}")
            else:
                print(f"   ❌ Auth/me failed: {response.text}")
        except Exception as e:
            print(f"   ❌ Auth/me test failed: {e}")
    else:
        print("   ❌ No token available")
    
    print()
    
    # Step 6: Test with wrong token format
    print("6️⃣ Testing with wrong token format...")
    try:
        headers = {
            "Authorization": "Bearer invalid-token",
            "Content-Type": "application/json"
        }
        response = requests.get(f"{base_url}/profiles/my_profile/", headers=headers)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   ❌ Failed: {e}")
    
    print()
    
    # Step 7: Test with invalid token
    print("7️⃣ Testing with invalid token...")
    try:
        headers = {
            "Authorization": "Token invalid-token",
            "Content-Type": "application/json"
        }
        response = requests.get(f"{base_url}/profiles/my_profile/", headers=headers)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   ❌ Failed: {e}")
    
    print("=" * 60)
    print("🏁 Authentication flow test completed!")

if __name__ == "__main__":
    # Wait a moment for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(2)
    test_auth_flow()
