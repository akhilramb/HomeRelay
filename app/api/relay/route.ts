import { actor, dispatch, errorResponse, sameOrigin, identity, load } from '../../../lib/homerelay/store';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{return Response.json(await dispatch(request,'snapshot'),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function POST(request:Request){try{
 sameOrigin(request);if(Number(request.headers.get('content-length')||0)>20000)return Response.json({error:'Request too large'},{status:413});
 const body=await request.json() as {command:string;args?:Record<string,any>};
 if(body.command==='switch_member'){
 const uid=identity(request);const {state}=await load(uid);if(!state.members.some((m:any)=>m.id===body.args?.memberId))return Response.json({error:'Unknown demo member'},{status:400});
 return Response.json({actor:body.args!.memberId},{headers:{'Set-Cookie':`relay_member=${body.args!.memberId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000${new URL(request.url).protocol==='https:'?'; Secure':''}`}});
 }
 return Response.json({result:await dispatch(request,body.command,body.args||{})},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return errorResponse(e);}}
