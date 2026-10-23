import { dispatch, errorResponse, sameOrigin, identity, load } from '../../../lib/homerelay/store';
import { readJSON, validateCommand } from '../../../lib/homerelay/validation.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{return Response.json(await dispatch(request,'snapshot'),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function POST(request:Request){try{
 sameOrigin(request);
 const body=validateCommand(await readJSON(request));
 if(body.command==='switch_member'){
 const uid=identity(request);const {state}=await load(uid);if(!state.members.some((m:any)=>m.id===body.args?.memberId))return Response.json({error:'Unknown demo member'},{status:400});
 return Response.json({actor:body.args.memberId},{headers:{'Set-Cookie':`relay_member=${body.args.memberId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000${new URL(request.url).protocol==='https:'?'; Secure':''}`}});
 }
 return Response.json({result:await dispatch(request,body.command,body.args||{})},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return errorResponse(e);}}
