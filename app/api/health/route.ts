import { env } from 'cloudflare:workers';
export async function GET(){try{if(!env.DB)throw new Error('Database unavailable');await env.DB.prepare('SELECT 1').first();return Response.json({status:'ok',database:'connected'});}catch{return Response.json({status:'unavailable'},{status:503});}}
