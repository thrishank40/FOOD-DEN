const BASE_DIRECT = "http://localhost:5000/api";
const BASE_PROXY = "http://localhost:5174/api";

async function post(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, headers: res.headers };
}

async function get(url, headers = {}) {
  const res = await fetch(url, { method: "GET", headers });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, headers: res.headers };
}

async function options(url, origin) {
  const res = await fetch(url, {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Content-Type, Authorization",
    },
  });
  return {
    status: res.status,
    allowOrigin: res.headers.get("access-control-allow-origin"),
    allowMethods: res.headers.get("access-control-allow-methods"),
  };
}

async function runAuthSuite() {
  console.log("=================================================");
  console.log("  FOODDEN COMPREHENSIVE AUTH VERIFICATION SUITE  ");
  console.log("=================================================\n");

  let allPassed = true;

  const assert = (condition, title, details = "") => {
    if (condition) {
      console.log(`✅ PASS: ${title} ${details ? `(${details})` : ""}`);
    } else {
      console.error(`❌ FAIL: ${title} ${details ? `(${details})` : ""}`);
      allPassed = false;
    }
  };

  try {
    // 1. Health check
    const health = await get(`${BASE_DIRECT}/health`);
    assert(health.status === 200 && health.data.success, "1. API Health Check", health.data.message);

    // 2. CORS Preflight from Vite local origins
    const cors5173 = await options(`${BASE_DIRECT}/auth/login`, "http://localhost:5173");
    assert(cors5173.allowOrigin === "http://localhost:5173", "2a. CORS Preflight (http://localhost:5173)", `allow: ${cors5173.allowOrigin}`);

    const cors5174 = await options(`${BASE_DIRECT}/auth/login`, "http://localhost:5174");
    assert(cors5174.allowOrigin === "http://localhost:5174", "2b. CORS Preflight (http://localhost:5174)", `allow: ${cors5174.allowOrigin}`);

    const cors127 = await options(`${BASE_DIRECT}/auth/login`, "http://127.0.0.1:5173");
    assert(cors127.allowOrigin === "http://127.0.0.1:5173", "2c. CORS Preflight (http://127.0.0.1:5173)", `allow: ${cors127.allowOrigin}`);

    // 3. Signup with valid details
    const uniqueEmail = `vikram_${Date.now()}@foodden.com`;
    const regRes = await post(`${BASE_DIRECT}/auth/register`, {
      name: "Vikram Malhotra",
      email: uniqueEmail,
      phone: "9876543210",
      address: "Flat 402, Green Glen, Outer Ring Road, Bengaluru",
      password: "Password@123",
    });

    const regUser = regRes.data.user || regRes.data.data?.user;
    const regToken = regRes.data.token || regRes.data.data?.token;

    assert(
      regRes.status === 201 && regUser && regToken,
      "3. Signup with Valid Details",
      `User: ${regUser?.name}, Role: ${regUser?.role}, Token received: ${!!regToken}`
    );

    // 4. Signup with already registered email (Duplicate check)
    const dupRes = await post(`${BASE_DIRECT}/auth/register`, {
      name: "Duplicate User",
      email: uniqueEmail,
      phone: "9876543210",
      address: "Anywhere",
      password: "Password@123",
    });
    assert(
      dupRes.status === 400 && dupRes.data.message?.includes("already exists"),
      "4. Signup with Duplicate Email rejected",
      `Status: ${dupRes.status}, Message: "${dupRes.data.message}"`
    );

    // 5. Signup validation error (Password < 6 chars)
    const shortPwdRes = await post(`${BASE_DIRECT}/auth/register`, {
      name: "Short Pwd",
      email: `short_${Date.now()}@foodden.com`,
      phone: "9876543210",
      address: "Anywhere",
      password: "123",
    });
    assert(
      shortPwdRes.status === 400 && shortPwdRes.data.message?.includes("6 characters"),
      "5. Signup Password Length Validation (< 6 chars)",
      `Status: ${shortPwdRes.status}, Message: "${shortPwdRes.data.message}"`
    );

    // 6. Login with valid credentials
    const loginRes = await post(`${BASE_DIRECT}/auth/login`, {
      email: uniqueEmail,
      password: "Password@123",
    });
    const loggedUser = loginRes.data.user || loginRes.data.data?.user;
    const customerToken = loginRes.data.token || loginRes.data.data?.token;

    assert(
      loginRes.status === 200 && loggedUser && customerToken,
      "6. Login with Valid Credentials",
      `Logged in: ${loggedUser?.email}, Token: ${!!customerToken}`
    );

    // 7. Login with case-insensitive email (uppercase entered)
    const upperLoginRes = await post(`${BASE_DIRECT}/auth/login`, {
      email: uniqueEmail.toUpperCase(),
      password: "Password@123",
    });
    assert(
      upperLoginRes.status === 200,
      "7. Login with Case-Insensitive Email",
      `Status: ${upperLoginRes.status}`
    );

    // 8. Login with incorrect password
    const wrongPwdRes = await post(`${BASE_DIRECT}/auth/login`, {
      email: uniqueEmail,
      password: "WrongPassword999",
    });
    assert(
      wrongPwdRes.status === 401 && wrongPwdRes.data.message === "Invalid email or password.",
      "8. Login with Incorrect Password rejected",
      `Status: ${wrongPwdRes.status}, Message: "${wrongPwdRes.data.message}"`
    );

    // 9. Login with unregistered email
    const unknownRes = await post(`${BASE_DIRECT}/auth/login`, {
      email: "nonexistent_user_999@foodden.com",
      password: "Password@123",
    });
    assert(
      unknownRes.status === 401 && unknownRes.data.message === "Invalid email or password.",
      "9. Login with Unregistered Email rejected",
      `Status: ${unknownRes.status}, Message: "${unknownRes.data.message}"`
    );

    // 10. JWT Authentication on protected endpoint (/api/auth/me)
    const meRes = await get(`${BASE_DIRECT}/auth/me`, {
      Authorization: `Bearer ${customerToken}`,
    });
    assert(
      meRes.status === 200 && meRes.data.data?.user?.email === uniqueEmail,
      "10. JWT Protected Endpoint Authentication (/api/auth/me)",
      `Verified user: ${meRes.data.data?.user?.email}`
    );

    // 11. Admin login and role-based access
    const adminLoginRes = await post(`${BASE_DIRECT}/auth/login`, {
      email: "admin@foodden.com",
      password: "Admin@123456",
    });
    const adminUser = adminLoginRes.data.user || adminLoginRes.data.data?.user;
    const adminToken = adminLoginRes.data.token || adminLoginRes.data.data?.token;

    assert(
      adminLoginRes.status === 200 && adminUser?.role === "admin",
      "11a. Admin Login Successful",
      `Email: ${adminUser?.email}, Role: ${adminUser?.role}`
    );

    // 11b. Customer blocked from admin route
    const customerAdminAccess = await get(`${BASE_DIRECT}/admin/stats`, {
      Authorization: `Bearer ${customerToken}`,
    });
    assert(
      customerAdminAccess.status === 403,
      "11b. Role-Based Security: Customer blocked from /api/admin/*",
      `Status: ${customerAdminAccess.status} Forbidden`
    );

    // 11c. Admin allowed on admin route
    const adminAccess = await get(`${BASE_DIRECT}/admin/stats`, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(
      adminAccess.status === 200 && adminAccess.data.success,
      "11c. Admin permitted on /api/admin/stats",
      `Total Users: ${adminAccess.data.totalCustomers}, Orders: ${adminAccess.data.totalOrders}`
    );

    // 12. Frontend-to-Backend Vite proxy communication
    const proxyHealth = await get(`${BASE_PROXY}/health`);
    assert(
      proxyHealth.status === 200 && proxyHealth.data.success,
      "12. Frontend-to-Backend Communication via Vite Proxy (/api/health)",
      `Status: ${proxyHealth.status}`
    );

    console.log("\n=================================================");
    if (allPassed) {
      console.log("🎉 ALL AUTHENTICATION TESTS PASSED 100%!");
    } else {
      console.log("⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.");
    }
    console.log("=================================================");
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

runAuthSuite();

