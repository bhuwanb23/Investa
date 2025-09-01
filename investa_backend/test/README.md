# 🧪 **TEST SCRIPTS FOR INVESTA BACKEND**

This directory contains all testing and verification scripts for the Investa backend. These scripts help ensure data integrity, API functionality, and system reliability.

---

## **📋 TEST SCRIPTS OVERVIEW**

### **🔍 Data Verification Scripts**

#### **`verify_data_connectivity.py`**
- **Purpose**: Verifies that all sample data is properly connected
- **What it checks**:
  - User relationships (profiles, security, privacy, learning progress, portfolios)
  - Learning ecosystem connections (courses → lessons → quizzes → questions → answers)
  - Trading data relationships (stocks → prices → market data → technical indicators)
  - Portfolio and holding relationships
  - Badge and achievement assignments
  - Data consistency across related models
- **Usage**: `python test/verify_data_connectivity.py`
- **Output**: Detailed report of all relationships and any missing connections

### **🔐 Authentication & User Management Scripts**

#### **`create_test_user.py`**
- **Purpose**: Creates a test user for API testing
- **Creates**:
  - User account with email: `test@example.com`
  - Password: `test123`
  - Complete user profile with default settings
- **Usage**: `python test/create_test_user.py`
- **When to use**: Before running API tests

#### **`reset_test_user.py`**
- **Purpose**: Resets the test user's password
- **Action**: Sets password back to `test123`
- **Usage**: `python test/reset_test_user.py`
- **When to use**: If you forget the test user password

### **🌐 API Testing Scripts**

#### **`test_api.py`**
- **Purpose**: Basic API functionality testing
- **Tests**:
  - API root endpoint accessibility
  - Login functionality
  - Profile API with authentication
- **Usage**: `python test/test_api.py`
- **Requirements**: Django server running on `http://127.0.0.1:8000`

#### **`test_auth_flow.py`**
- **Purpose**: Comprehensive authentication flow testing
- **Tests**:
  - API root endpoint
  - Login endpoint (GET and POST)
  - Profile endpoint with and without authentication
  - Auth/me endpoint
  - Invalid token handling
  - Wrong token format handling
- **Usage**: `python test/test_auth_flow.py`
- **Requirements**: Django server running on `http://127.0.0.1:8000`

---

## **🚀 QUICK START GUIDE**

### **1. Set Up Test Environment**
```bash
cd investa_backend

# Create test user
python test/create_test_user.py

# Populate sample data
python populate_sample_data.py

# Verify data connectivity
python test/verify_data_connectivity.py
```

### **2. Start Django Server**
```bash
python manage.py runserver
```

### **3. Run API Tests**
```bash
# Test basic API functionality
python test/test_api.py

# Test complete authentication flow
python test/test_auth_flow.py
```

---

## **📊 TEST CREDENTIALS**

### **Default Test User**
- **Email**: `test@example.com`
- **Password**: `test123`

### **Sample Data Users**
- **Email**: `john@example.com`
- **Password**: `testpass123`

*Note: All sample users created by `populate_sample_data.py` use the password `testpass123`*

---

## **🔧 TESTING WORKFLOW**

### **Complete Testing Process**

1. **Setup Phase**
   ```bash
   python test/create_test_user.py
   python populate_sample_data.py
   python test/verify_data_connectivity.py
   ```

2. **Server Phase**
   ```bash
   python manage.py runserver
   ```

3. **API Testing Phase**
   ```bash
   python test/test_api.py
   python test/test_auth_flow.py
   ```

4. **Verification Phase**
   ```bash
   python test/verify_data_connectivity.py
   ```

### **Troubleshooting**

#### **If Test User Password is Forgotten**
```bash
python test/reset_test_user.py
```

#### **If Data Connectivity Issues Found**
```bash
# Re-populate data
python populate_sample_data.py

# Re-verify
python test/verify_data_connectivity.py
```

#### **If API Tests Fail**
1. Ensure Django server is running
2. Check server is on `http://127.0.0.1:8000`
3. Verify test user exists
4. Check sample data is populated

---

## **📈 EXPECTED TEST RESULTS**

### **`verify_data_connectivity.py` Expected Output**
```
🔍 Starting Data Connectivity Verification...

🔍 Verifying User Relationships...
   Found 10 users
   ✅ john@example.com has profile (risk: moderate)
   ✅ john@example.com has security settings (2FA: True)
   ✅ john@example.com has privacy settings
   ✅ john@example.com has learning progress (2 modules)
   ✅ john@example.com has portfolio (₹15000.00)
   ✅ john@example.com has trading performance (5 trades)

📚 Verifying Learning Relationships...
   Found 4 courses
   📖 Stock Market Fundamentals has 5 lessons
      📝 Lesson 1: Stock Fundamentals has 2 quizzes
         ❓ Quiz 1: Lesson 1: Stock Fundamentals has 2 questions
            ✅ What is the main topic of Lesson 1: Stock... has 4 answers (1 correct)

📊 Verifying Trading Relationships...
   Found 5 stocks
   📈 RELIANCE has 30 price records
   💹 RELIANCE has market data (₹1100.00)
   📊 RELIANCE has 5 technical indicators

✅ Data Connectivity Verification Complete!
📊 All relationships should be properly established.
🔗 You can now test the API endpoints with confidence.
```

### **`test_api.py` Expected Output**
```
🚀 Starting API tests...
🔍 Testing API endpoints...
✅ API Root: 200
   Available endpoints: ['auth', 'profiles', 'courses', 'trading', ...]
✅ Login: 200
   Token received: 9944b09199c62bcf9...
✅ Profile API: 200
   Profile data received: 1250 characters
   User: john@example.com
🏁 API tests completed!
```

### **`test_auth_flow.py` Expected Output**
```
🔍 Testing complete authentication flow...
============================================================
1️⃣ Testing API root...
   Status: 200
   Available endpoints: ['auth', 'profiles', 'courses', 'trading', ...]

2️⃣ Testing login endpoint...
   GET request status: 405
   GET response: {"detail": "Method \"GET\" not allowed."}...
   POST request status: 200
   ✅ Login successful!
   Token: 9944b09199c62bcf9...
   User ID: 1
   Username: john@example.com
   Email: john@example.com

3️⃣ Testing profile endpoint without token...
   Status: 401
   Response: {"detail": "Authentication credentials were not provided."}...

4️⃣ Testing profile endpoint with token...
   Status: 200
   ✅ Profile API successful!
   User: john@example.com
   Level: intermediate
   XP: 150

5️⃣ Testing auth/me endpoint...
   Status: 200
   ✅ Auth/me successful!
   User: john@example.com
   Email: john@example.com

6️⃣ Testing with wrong token format...
   Status: 401
   Response: {"detail": "Authentication credentials were not provided."}...

7️⃣ Testing with invalid token...
   Status: 401
   Response: {"detail": "Invalid token."}...

============================================================
🏁 Authentication flow test completed!
```

---

## **🛠️ CUSTOMIZATION**

### **Adding New Test Scripts**

1. Create your test script in the `test/` directory
2. Add it to `__init__.py` in the `__all__` list
3. Update this README with documentation
4. Follow the naming convention: `test_*.py` for API tests, `*_test.py` for other tests

### **Modifying Test Credentials**

Edit the test scripts to change:
- Test user email/password
- API base URL
- Expected response formats

### **Extending API Tests**

Add new test functions to `test_api.py` or `test_auth_flow.py`:
```python
def test_new_endpoint():
    """Test new API endpoint"""
    response = requests.get(f"{base_url}/new-endpoint/")
    print(f"✅ New Endpoint: {response.status_code}")
    # Add assertions as needed
```

---

## **📝 NOTES**

- All test scripts assume Django server is running on `http://127.0.0.1:8000`
- Test scripts are designed to be run independently
- Data verification should be run after any data changes
- API tests require a running Django server
- Test user creation is idempotent (safe to run multiple times)

---

## **🎯 CONCLUSION**

These test scripts provide comprehensive coverage for:
- ✅ Data integrity verification
- ✅ API functionality testing
- ✅ Authentication flow validation
- ✅ User management testing

Use these scripts to ensure your Investa backend is working correctly before deployment! 🚀
