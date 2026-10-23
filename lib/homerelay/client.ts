export async function request(command?:string,args:Record<string,unknown>={}){
 const response=await fetch('/api/relay',command?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({command,args})}:{cache:'no-store'});
 let data:any;try{data=await response.json();}catch{throw new Error('The server is unavailable. Please try again.');}
 if(!response.ok)throw new Error(data.error||'Could not complete this action');return command?data.result:data;
}
export function date(value:string,options:Intl.DateTimeFormatOptions={month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}){return new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',...options}).format(new Date(value));}
export function localInput(iso:string){const d=new Date(new Date(iso).getTime()+330*60000);return d.toISOString().slice(0,16);}
export function fromInput(value:string){return new Date(value+':00+05:30').toISOString();}
