import {candidates} from './service.mjs';
export function insights(s,actor,now=Date.now()){
 const open=s.tasks.filter(t=>t.status==='open'),completed=s.tasks.filter(t=>t.status==='completed');
 const risks=open.filter(t=>t.owner===actor||t.creator===actor).filter(t=>Date.parse(t.due)<now+86400000).map(t=>{
  const pending=s.handoffs.find(h=>h.taskId===t.id&&h.status==='pending'&&Date.parse(h.expiresAt)>now),late=Date.parse(t.due)<=now;
  const options=late?[]:candidates(s,t.id,now);
  return {taskId:t.id,title:t.title,level:late?'overdue':pending?'waiting':'due-soon',reason:late?'The deadline has passed. Agree on a new deadline or confirm completion.':pending?'A replacement has not accepted. The current owner is still responsible.':options.length?`${options[0].name} could help based on entered availability.`:'No other member has entered suitable availability.',candidateCount:options.length};
 }).sort((a,b)=>(a.level==='overdue'?0:1)-(b.level==='overdue'?0:1));
 const accepted=s.handoffs.filter(h=>h.status==='accepted');
 return {risks,metrics:{completed:completed.length,onTime:completed.filter(t=>t.completedAt&&Date.parse(t.completedAt)<=Date.parse(t.due)).length,acceptedHandoffs:accepted.length,completedAfterHandoff:completed.filter(t=>accepted.some(h=>h.taskId===t.id)).length},workload:s.members.map(m=>({memberId:m.id,name:m.name,open:open.filter(t=>t.owner===m.id).length,completed:completed.filter(t=>t.owner===m.id).length}))};
}
