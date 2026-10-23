import { RelayError } from './service.mjs';
const commands = new Set(['snapshot','reset','assistant','switch_member','list_tasks','get_task','get_task_history','get_household_availability','suggest_handoff_candidates','create_task','update_task','request_handoff','withdraw_handoff','respond_to_handoff','complete_task','cancel_task','set_availability']);
export function validateCommand(body) {
 if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RelayError('Send a JSON object with command and args.');
 if (typeof body.command !== 'string' || !commands.has(body.command)) throw new RelayError('Choose a supported operation.');
 const args = body.args ?? {};
 if (!args || typeof args !== 'object' || Array.isArray(args)) throw new RelayError('Arguments must be a JSON object.');
 if ('actor' in args || 'householdId' in args) throw new RelayError('The active household and member come from your session.',403);
 return {command:body.command,args};
}
export async function readJSON(request,limit=20000){
 const raw=await request.text();
 if(new TextEncoder().encode(raw).length>limit)throw new RelayError('Request too large.',413);
 try{return JSON.parse(raw);}catch{throw new RelayError('Invalid JSON. Please send a valid JSON object.');}
}
