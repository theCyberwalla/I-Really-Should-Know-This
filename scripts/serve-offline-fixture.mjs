import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
let revision = 0;
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://local");
      if (url.pathname === "/advance" && req.method === "POST") {
        revision++;
        res.end(String(revision));
        return;
      }
      const file = resolve(
        root,
        "." + (url.pathname === "/" ? "/index.html" : url.pathname),
      );
      if (!file.startsWith(root + sep)) throw Error();
      let body = await readFile(file);
      if (url.pathname === "/sw.js")
        body = Buffer.from(
          body
            .toString()
            .replace(
              "'./offline-assets.js'",
              `'./offline-assets.js?fixture=${revision}'`,
            ),
        );
      if (url.pathname === "/offline-assets.js")
        body = Buffer.from(
          body
            .toString()
            .replace(
              /ATLAS_RELEASE="[^"]+"/,
              `ATLAS_RELEASE="fixture-${revision}"`,
            ),
        );
      res.writeHead(200, {
        "Content-Type":
          {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".svg": "image/svg+xml",
          }[extname(file)] ?? "text/plain",
        "Cache-Control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(4174, "127.0.0.1", () =>
    console.log("Isolated offline fixture on 4174"),
  );
