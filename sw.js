/* QuriOS service worker: se instala solo y se actualiza solo */
const V='1.9.0',C='qurios-'+V,CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();
 e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function nav(r){const cache=await caches.open(C);
 const net=fetch(r.url,{cache:'no-store'}).then(n=>{if(n.ok)cache.put('index.html',n.clone());return n});
 const slow=new Promise(res=>setTimeout(()=>res(null),3500));
 try{const n=await Promise.race([net,slow]);if(n)return n}catch(e){}
 const m=await cache.match('index.html')||await cache.match('./');
 if(m){net.catch(()=>{});return m}
 try{return await net}catch(e){return new Response('Sin conexión',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})}}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==='navigate'){e.respondWith(nav(r));return}
 e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(n=>{if(n&&n.ok){const c=n.clone();caches.open(C).then(x=>x.put(r,c))}return n}).catch(()=>m);return m||f}))});
