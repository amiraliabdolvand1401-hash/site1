async function test() {
  try {
    const res = await fetch("https://httpbin.org/get");
    console.log("httpbin status:", res.status);
    const json = await res.json();
    console.log("httpbin json:", json);
  } catch (err) {
    console.error("httpbin failed:", err);
  }
}
test();
