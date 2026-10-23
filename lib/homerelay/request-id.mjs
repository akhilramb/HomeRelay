// An idempotency key is not a credential. getRandomValues also works on HTTP local previews.
export function creationRequestId(source=globalThis.crypto){
 if(typeof source?.randomUUID==='function')return source.randomUUID();
 const bytes=new Uint8Array(16);
 if(typeof source?.getRandomValues==='function'){source.getRandomValues(bytes);return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
 return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}
