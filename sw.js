/* Soumission MAS - fonctionnement hors ligne. Changer VERSION à chaque mise à jour de l'app. */
const VERSION="soumission-mas-v3";
const SHELL=["./","index.html","manifest.webmanifest","jspdf.umd.min.js","jspdf.plugin.autotable.min.js","icon-192.png","icon-512.png","apple-touch-icon.png","favicon-32.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET")return;
  const url=new URL(req.url);
  /* Page de l'app : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne */
  if(req.mode==="navigate"){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put("index.html",c));return r}).catch(()=>caches.match("index.html")));return}
  /* Polices Google et fichiers de l'app : cache d'abord */
  if(url.origin===location.origin||url.hostname.endsWith("fonts.googleapis.com")||url.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==="opaque"){const c=r.clone();caches.open(VERSION).then(x=>x.put(req,c))}return r})));
  }
});
