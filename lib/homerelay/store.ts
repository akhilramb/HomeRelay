import { env } from 'cloudflare:workers';
import { seed, expire, execute, demoAssistant, RelayError } from './service.mjs';
import { summarizeWithAI } from './ai.mjs';
export function identity(request:Request) {
 const uid=request.headers.get('oai-authenticated-user-id');
 if(uid)return uid;
 if(import.meta.env.DEV)return 'local-demo';
 throw new RelayError('Please sign in to open your household.',401);
}
export function actor(request:Request){const a=(request.headers.get('cookie')||'').match(/(?:^|;\s*)relay_member=(akhil|priya|ravi)(?:;|$)/)?.[1];return a||'akhil';}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)throw new RelayError('Cross-origin actions are not allowed',403);}
export async function load(uid:string){
 if(!env.DB)throw new RelayError('Database is not connected. Please try again shortly.',503);
 let row=await env.DB.prepare('SELECT revision, data FROM households WHERE id = ?').bind(uid).first<{revision:number;data:string}>();
 if(!row){await env.DB.prepare('INSERT OR IGNORE INTO households (id, revision, data) VALUES (?, 0, ?)').bind(uid,JSON.stringify(seed())).run();row=await env.DB.prepare('SELECT revision,data FROM households WHERE id = ?').bind(uid).first<{revision:number;data:string}>();}
 if(!row)throw new RelayError('Could not load household',503);
 return {revision:row.revision,state:JSON.parse(row.data)};
}
export async function save(uid:string,revision:number,state:unknown){const r=await env.DB!.prepare('UPDATE households SET data = ?, revision = revision + 1 WHERE id = ? AND revision = ?').bind(JSON.stringify(state),uid,revision).run();if(r.meta.changes!==1)throw new RelayError('Another action updated this household. Refresh and try again.',409);}
export async function dispatch(request:Request,command:string,args:Record<string,any>={}){
 const uid=identity(request),who=actor(request);const {revision,state}=await load(uid);const before=JSON.stringify(state);expire(state);
 let result;
 if(command==='snapshot'){if(JSON.stringify(state)!==before)await save(uid,revision,state);return {...state,actor:who,assistantMode:(env as any).AI_API_KEY&&(env as any).AI_BASE_URL&&(env as any).AI_MODEL?'live':'demo',revision};}
 if(command==='reset'){if(args.confirm!==true)throw new RelayError('Confirm the demo reset');const fresh=seed();await save(uid,revision,fresh);return {reset:true};}
 if(command==='assistant'){
 result=demoAssistant(state,who,args.message);
 result=await summarizeWithAI(args.message,result,env);
 state.messages.push({id:crypto.randomUUID(),actor:who,question:args.message,...result,at:new Date().toISOString()});state.messages=state.messages.slice(-60);
 }else result=execute(state,who,command,args);
 await save(uid,revision,state);return result;
}
export function errorResponse(error:unknown){const e=error as any;return Response.json({error:e instanceof RelayError?e.message:'Something went wrong. Please retry.'},{status:e.status||500,headers:{'Cache-Control':'no-store'}});}
