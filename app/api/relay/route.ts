import { dispatch, errorResponse, sameOrigin, identity, load, context } from '../../../lib/homerelay/store';
import { readJSON, validateCommand } from '../../../lib/homerelay/validation.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{return Response.json(await dispatch(request,'snapshot'),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function POST(request:Request){try{
 sameOrigin(request);
 const body=validateCommand(await readJSON(request));
 if(body.command==='switch_member'){
 const ctx=await context(request);if(ctx.shared)return Response.json({error:'Signed-in members cannot switch identities.'},{status:403});const {state}=await load(ctx.key);if(!state.members.some((m:any)=>m.id===body.args?.memberId))return Response.json({error:'Unknown demo member'},{status:400});
 return Response.json({actor:body.args.memberId},{headers:{'Set-Cookie':`relay_member=${body.args.memberId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000${new URL(request.url).protocol==='https:'?'; Secure':''}`}});
 }
 const cookie=(space:string)=>`relay_space=${space}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000${new URL(request.url).protocol==='https:'?'; Secure':''}`;
 if(body.command==='switch_space'){const ctx=await context(request);if(!['demo','shared'].includes(body.args.mode)||body.args.mode==='shared'&&!ctx.hasHousehold)return Response.json({error:'Create or join a household first.'},{status:400});return Response.json({result:{switched:true}},{headers:{'Set-Cookie':cookie(body.args.mode),'Cache-Control':'no-store'}});}
 const result=await dispatch(request,body.command,body.args||{});
 return Response.json({result},{headers:{'Cache-Control':'no-store',...(['create_household','join_household'].includes(body.command)?{'Set-Cookie':cookie('shared')}:{})}});
 }catch(e){return errorResponse(e);}}
