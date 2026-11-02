const BASE = "http://localhost:5000/api";

async function post(url, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function get(url, token) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "GET", headers });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function patch(url, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function runTests() {
  console.log("=== FOODDEN END-TO-END VERIFICATION SUITE ===\n");

  try {
    // 1. Health check
    const health = await get(`${BASE}/health`);
    console.log("✅ 1. Health Check:", health.message);

    // 2. Register new customer
    const email = `priya_${Date.now()}@foodden.com`;
    const regRes = await post(`${BASE}/auth/register`, {
      name: "Priya Patel",
      email,
      phone: "9812345678",
      address: "Villa 14, Palm Meadows, Whitefield, Bengaluru",
      password: "Password@123",
    });
    console.log("✅ 2. Customer Registered:", regRes.data.user.name, `(${regRes.data.user.email})`);

    // 3. Login customer
    const loginRes = await post(`${BASE}/auth/login`, {
      email,
      password: "Password@123",
    });
    const token = loginRes.data.token;
    console.log("✅ 3. Customer Logged In: JWT token received");

    // 4. Fetch foods list
    const foodsRes = await get(`${BASE}/foods`);
    const foods = foodsRes.data.foods;
    console.log(`✅ 4. Food Menu Loaded: ${foods.length} items across categories`);

    const pizza = foods.find((f) => f.name === "Margherita Pizza");
    const burger = foods.find((f) => f.name === "Loaded Cheese Chicken Burger");
    const shake = foods.find((f) => f.name === "Chocolate Milkshake");

    console.log(`   - ${pizza.name} | ₹${pizza.price} | Veg: ${pizza.isVeg}`);
    console.log(`   - ${burger.name} | ₹${burger.price} | Veg: ${burger.isVeg}`);
    console.log(`   - ${shake.name} | ₹${shake.price} | Veg: ${shake.isVeg}`);

    // 5. Place order with customizations
    const orderRes = await post(
      `${BASE}/orders`,
      {
        items: [
          {
            food: pizza._id,
            quantity: 2,
            price: 359,
            customization: "Medium (10 inch), Extra Mozzarella Cheese",
          },
          {
            food: shake._id,
            quantity: 2,
            price: 169,
            customization: "Large (500 ml), Flavour Burst Shot",
          },
        ],
        deliveryAddress: "Villa 14, Palm Meadows, Whitefield, Bengaluru",
        paymentMethod: "COD",
        totalAmount: 1056,
      },
      token
    );
    const order = orderRes.data.order;
    console.log(`✅ 5. Order Placed! ID: #${order._id.slice(-8).toUpperCase()} | Total: ₹${order.totalAmount} | Status: ${order.orderStatus}`);

    // 6. Fetch customer orders
    const myOrdersRes = await get(`${BASE}/orders`, token);
    console.log(`✅ 6. Customer Orders Fetched: ${myOrdersRes.data.orders.length} order(s) listed`);

    // 7. Admin login
    const adminRes = await post(`${BASE}/auth/login`, {
      email: "admin@foodden.com",
      password: "Admin@123456",
    });
    const adminToken = adminRes.data.token;
    console.log("✅ 7. Admin Logged In: admin@foodden.com");

    // 8. Admin fetch orders
    const adminOrdersRes = await get(`${BASE}/admin/orders`, adminToken);
    console.log(`✅ 8. Admin Orders Fetched: ${adminOrdersRes.data.orders.length} order(s) on dashboard`);

    // 9. Admin update order status
    const statusUpdate = await patch(
      `${BASE}/admin/orders/${order._id}/status`,
      { orderStatus: "delivered" },
      adminToken
    );
    console.log(`✅ 9. Admin Status Updated: Order marked as '${statusUpdate.data.order.orderStatus}'`);

    // 10. Admin stats
    const statsRes = await get(`${BASE}/admin/stats`, adminToken);
    const stats = statsRes.data;
    console.log(`✅ 10. Admin Stats: Total Customers: ${stats.totalCustomers} | Orders: ${stats.totalOrders} | Revenue: ₹${stats.revenue?.totalRevenue}`);

    console.log("\n🎉 ALL 10 E2E WORKFLOW TESTS PASSED 100%!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

runTests();
