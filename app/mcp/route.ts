import { dispatch, errorResponse, identity, sameOrigin } from '../../lib/homerelay/store';
import { tools, validateTool } from '../../lib/homerelay/tools.mjs';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 let body:any;try{identity(request);sameOrigin(request);body=await request.json();}catch(e){return errorResponse(e);}
 const respond=(result:unknown)=>Response.json({jsonrpc:'2.0',id:body.id,result});
 if(body.method?.startsWith('notifications/'))return new Response(null,{status:202});
 if(body.method==='server/discover')return respond({supportedVersions:['2026-07-28','2025-11-25'],capabilities:{tools:{}},serverInfo:{name:'HomeRelay',version:'1.0.0'}});
 if(body.method==='initialize')return respond({protocolVersion:body.params?.protocolVersion==='2025-11-25'?'2025-11-25':'2026-07-28',capabilities:{tools:{}},serverInfo:{name:'HomeRelay',version:'1.0.0'}});
 if(body.method==='ping')return respond({});
 if(body.method==='tools/list')return respond({tools});
 if(body.method==='tools/call')try{const args=validateTool(body.params?.name,body.params?.arguments||{});const result=await dispatch(request,body.params.name,args);return respond({content:[{type:'text',text:JSON.stringify(result)}],isError:false});}catch(e){return respond({content:[{type:'text',text:(e as Error).message}],isError:true});}
 return Response.json({jsonrpc:'2.0',id:body.id,error:{code:-32601,message:'Method not found'}});
}
export async function GET(){return new Response('Stateless server: send JSON-RPC POST requests.',{status:405,headers:{Allow:'POST'}});}
