const { getDashboardStats } = require("./src/app/actions/dashboardActions.js");

async function test() {
  const res = await getDashboardStats("SUPER_ADMIN", null, 1);
  console.dir(res, { depth: null });
}

test().catch(console.error);
