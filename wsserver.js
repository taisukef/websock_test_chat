const socks = [];

const handle = (req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response("not trying to upgrade as websocket.");
  }
  //console.log(req);
  const { websocket, response } = Deno.upgradeWebSocket(req);
  websocket.onopen = () => {
    console.log("socket opened");
    socks.push(websocket);
    console.log("n_connections: ", socks.length);
  };
  websocket.onmessage = (e) => {
    console.log("socket message:", e.data);
    for (const ws of socks) {
      ws.send(e.data);
    }
    //websocket.send(new Date().toString());
  };
  websocket.onerror = (e) => console.log("socket errored:", e.message);
  websocket.onclose = () => {
    console.log("socket closed");
    socks.splice(socks.indexOf(websocket), 1);
    console.log("n_connections: ", socks.length);
  };
  return response;
}

const port = 8081;
const listener = Deno.listen({ port });
console.log(`listening on http://localhost:${port}`);
for await (const conn of listener) {
  const httpConn = Deno.serveHttp(conn);
  for await (const e of httpConn) {
    e.respondWith(handle(e.request));
  }
}
