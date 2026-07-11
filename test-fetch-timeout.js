async function testWithTimeout(url, label) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    console.log(`Fetching ${label}...`);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    console.log(`${label} Status:`, res.status);
    if (res.ok) {
      const json = await res.json();
      console.log(`${label} Keys:`, Object.keys(json));
      if (json.coins) {
        console.log(`${label} Coins Keys:`, Object.keys(json.coins));
        console.log(`${label} sample:`, JSON.stringify(json.coins, null, 2).substring(0, 300));
      } else {
        console.log(`${label} sample:`, JSON.stringify(json, null, 2).substring(0, 300));
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`${label} Error:`, err.message);
  }
}

async function main() {
  await testWithTimeout("https://api.keybit.ir/coins/", "Keybit Coins");
  await testWithTimeout("https://api.nobitex.ir/v2/orderbook/USDTIRT", "Nobitex USDT");
}

main();
