const esc=s=>String(s).replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(';','\\;').replaceAll(',','\\,').replaceAll('\r','');
const stamp=s=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z');
export function calendarExport(tasks,now=Date.now()){
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//HomeRelay//Responsibilities//EN','CALSCALE:GREGORIAN'];
 for(const t of tasks.filter(t=>t.status==='open'))lines.push('BEGIN:VEVENT',`UID:${esc(t.id)}@homerelay`,`DTSTAMP:${stamp(now)}`,`DTSTART:${stamp(t.due)}`,`DTEND:${stamp(Date.parse(t.due)+900000)}`,`SUMMARY:${esc(t.title)}`,`DESCRIPTION:${esc(t.description+'\nDeadline exported from HomeRelay. Changes do not automatically sync.')}`,'BEGIN:VALARM','TRIGGER:-PT30M','ACTION:DISPLAY',`DESCRIPTION:${esc(t.title)}`,'END:VALARM','END:VEVENT');
 lines.push('END:VCALENDAR');return lines.map(line=>{const chunks=[];let chunk='',length=0;for(const char of line){const n=new TextEncoder().encode(char).length;if(length+n>73){chunks.push(chunk);chunk=' ';length=1;}chunk+=char;length+=n;}chunks.push(chunk);return chunks.join('\r\n');}).join('\r\n')+'\r\n';
}
