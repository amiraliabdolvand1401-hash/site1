const r = await fetch('https://api.sms.ir/v1/send', {
  method: 'POST',
  headers: { 'X-API-KEY': 'ElG9VMvlLrXF8ySVagrElt7O8MuVhXI2s6Nc3coveN4k18lz', 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ messageText: 'test', mobiles: ['09123456789'] })
});
console.log(await r.json());
