import { sleep } from "https://js.sabae.cc/sleep.js";

const port = 8081;
const host = `ws://localhost:${port}/`;
console.log(host);
const ws = new WebSocket(host);
ws.onmessage = (e) => console.log("message", e.data);

const waitOpen = async () => {
  return new Promise(resolve => {
    ws.onopen = (e) => {
      console.log("open"); // , e);
      resolve();
    };
  });
};
await waitOpen();

for (;;) {
  const s = prompt("");
  try {
    await ws.send(s);
    await sleep(100);
  } catch (e) {
    console.log(e);
  }
}
