async function testAll() {
  console.log("Starting API tests using native fetch...");

  // 1. Keybit Coins API
  try {
    const res = await fetch("https://api.keybit.ir/coins/");
    console.log("Keybit Status:", res.status);
    if (res.ok) {
      const json = await res.json();
      console.log("Keybit JSON Keys:", Object.keys(json));
      console.log("Keybit coin keys:", Object.keys(json.coins || {}));
    }
  } catch (err) {
    console.error("Keybit Error:", err.message);
  }

  // 2. Nobitex USDT API
  try {
    const res = await fetch("https://api.nobitex.ir/v2/orderbook/USDTIRT");
    console.log("Nobitex Status:", res.status);
    if (res.ok) {
      const json = await res.json();
      console.log("Nobitex JSON:", JSON.stringify(json, null, 2).substring(0, 300));
    }
  } catch (err) {
    console.error("Nobitex Error:", err.message);
  }

  // 3. Tgju raw fetch
  try {
    const res = await fetch("https://www.tgju.org/");
    console.log("TGJU Status:", res.status);
    if (res.ok) {
      const html = await res.text();
      console.log("TGJU HTML Length:", html.length);
    }
  } catch (err) {
    console.error("TGJU Error:", err.message);
  }
}

testAll();
