export class RelayError extends Error { constructor(message, status = 400) { super(message); this.status = status; } }
const fail = (ok, message, status) => { if (!ok) throw new RelayError(message, status); };
export const categories = ['Deliveries','Groceries','Household chores','Appointments and errands','Shared administration','Custom'];
export const iso = (n = Date.now()) => new Date(n).toISOString();
const id = () => crypto.randomUUID();
export function seed(now = Date.now()) {
 const s = {name:'The Maple House', timezone:'Asia/Kolkata', members:[
 {id:'akhil',name:'Akhil',color:'#dfeae4',preferences:['Deliveries','Shared administration'],availability:[{start:iso(now),end:iso(now+86400000)}]},
 {id:'priya',name:'Priya',color:'#f1e5d4',preferences:['Deliveries','Groceries'],availability:[{start:iso(now),end:iso(now+86400000)}]},
 {id:'ravi',name:'Ravi',color:'#e4e2f0',preferences:['Household chores'],availability:[{start:iso(now+3600000),end:iso(now+172800000)}]}],tasks:[],handoffs:[],events:[],messages:[]};
 const rows=[['Collect the parcel','Deliveries','akhil',4,'high','Reception closes tonight. Ask for parcel #MR-204.'],['Pick up groceries','Groceries','priya',7,'normal','Milk, tomatoes, and whole wheat bread.'],['Water the balcony plants','Household chores','ravi',26,'normal','A little water for the herbs; check the soil first.'],['Book the AC service','Appointments and errands','akhil',30,'normal','Choose a slot that works for the household.'],['Pay the internet bill','Shared administration','ravi',48,'high','Use the shared household account.'],['Take out the recycling','Household chores','priya',-1,'normal','Paper and dry packaging in the blue bin.']];
 for (const [title,category,owner,hours,priority,description] of rows) { const task={id:id(),title,category,owner,creator:'akhil',due:iso(now+hours*3600000),priority,description,status:'open',version:1,createdAt:iso(now),updatedAt:iso(now),completedAt:null,completionNote:''};s.tasks.push(task);event(s,'akhil',task.id,'created',`${title} assigned to ${s.members.find(m=>m.id===owner).name}`,now); }
 return s;
}
function member(s, actor) {const m=s.members.find(m=>m.id===actor);fail(m,'Unknown household member',403);return m;}
export function taskById(s, taskId) { const t=s.tasks.find(t=>t.id===taskId);fail(t,'Task not found in this household',404);return t; }
function event(s, actor, taskId, type, detail, now) {s.events.push({id:id(),actor,taskId,type,detail,at:iso(now)});}
function ownerOnly(s,t,actor){member(s,actor);fail(t.owner===actor||t.creator===actor,'Only the owner or creator can do this',403);}
function open(t){fail(t.status==='open','This task is already closed',409);}
function version(t, v){fail(Number.isInteger(v)&&v===t.version,'This task changed. Refresh and try again.',409);}
function touch(t,now){t.version++;t.updatedAt=iso(now);}
function text(v, name, max=500){fail(typeof v==='string'&&v.trim().length>0&&v.trim().length<=max,`${name} is required (maximum ${max} characters)`);return v.trim();}
function due(v,now){const n=Date.parse(v);fail(Number.isFinite(n)&&n>now,'Choose a future deadline');return iso(n);}
export function candidates(s, taskId, now=Date.now()) {
 const t=taskById(s,taskId);open(t);
 return s.members.filter(m=>m.id!==t.owner&&!s.handoffs.some(h=>h.taskId===t.id&&h.memberId===m.id&&h.status==='declined')&&m.availability.some(w=>Date.parse(w.start)<Date.parse(t.due)&&Date.parse(w.end)>now)).map(m=>{
 const workload=s.tasks.filter(t=>t.owner===m.id&&t.status==='open').length;const preference=m.preferences.includes(t.category);const window=m.availability.find(w=>Date.parse(w.start)<Date.parse(t.due)&&Date.parse(w.end)>now);
 return {memberId:m.id,name:m.name,workload,preference,window,score:workload-(preference?3:0),reason:`${m.name} has an availability window before the deadline, ${workload} open task${workload===1?'':'s'}${preference?`, and prefers ${t.category.toLowerCase()}`:''}.`};
 }).sort((a,b)=>a.score-b.score||a.name.localeCompare(b.name));
}
export function expire(s,now=Date.now()){for(const h of s.handoffs)if(h.status==='pending'&&Date.parse(h.expiresAt)<=now){h.status='expired';h.respondedAt=iso(now);event(s,'system',h.taskId,'expired','Handoff expired; original owner remains responsible.',now);}}
export function execute(s, actor, command, args={}, now=Date.now()) {
 member(s,actor);expire(s,now);
 if(command==='list_tasks')return s.tasks;
 if(command==='get_household_availability')return s.members;
 if(command==='get_task')return taskById(s,args.taskId);
 if(command==='get_task_history'){taskById(s,args.taskId);return s.events.filter(e=>e.taskId===args.taskId);}
 if(command==='suggest_handoff_candidates')return candidates(s,args.taskId,now);
 if(command==='create_task'){
 fail(s.tasks.length<500,'Demo limit reached. Reset the household to continue.');member(s,args.owner);fail(categories.includes(args.category),'Choose a valid category');fail(['normal','high'].includes(args.priority),'Choose a valid priority');
 const t={id:id(),title:text(args.title,'Title',120),description:typeof args.description==='string'?args.description.trim().slice(0,1000):'',category:args.category,priority:args.priority,owner:args.owner,creator:actor,due:due(args.due,now),status:'open',version:1,createdAt:iso(now),updatedAt:iso(now),completedAt:null,completionNote:''};
 s.tasks.push(t);event(s,actor,t.id,'created',`${t.title} assigned to ${member(s,t.owner).name}`,now);return t;
 }
 if(command==='set_availability'){
 fail(args.memberId===actor,'Switch to this demo member to edit their availability',403);fail(Array.isArray(args.windows)&&args.windows.length<=10,'Maximum 10 availability windows');
 const windows=args.windows.map(w=>{const start=Date.parse(w.start),end=Date.parse(w.end);fail(Number.isFinite(start)&&Number.isFinite(end)&&end>start,'Availability end must be after start');return {start:iso(start),end:iso(end)};});
 const m=member(s,actor);m.availability=windows;event(s,actor,null,'availability','Updated availability',now);return m;
 }
 const t=taskById(s,args.taskId);version(t,args.version);
 if(command==='update_task'){
 ownerOnly(s,t,actor);open(t);t.title=text(args.title,'Title',120);t.description=String(args.description||'').slice(0,1000);t.due=due(args.due,now);fail(categories.includes(args.category),'Choose a valid category');t.category=args.category;fail(['normal','high'].includes(args.priority),'Invalid priority');t.priority=args.priority;touch(t,now);event(s,actor,t.id,'edited','Updated task details and deadline',now);return t;
 }
 if(command==='request_handoff'){
 ownerOnly(s,t,actor);open(t);fail(!s.handoffs.some(h=>h.taskId===t.id&&h.status==='pending'),'A handoff is already waiting for a response',409);
 const c=candidates(s,t.id,now).find(c=>c.memberId===args.memberId);fail(c,'This member is no longer eligible. Check availability or choose another person.',409);
 const h={id:id(),taskId:t.id,memberId:c.memberId,requestedBy:actor,status:'pending',reason:text(args.reason||'The current owner needs a little help.','Reason',500),createdAt:iso(now),expiresAt:t.due,respondedAt:null};s.handoffs.push(h);touch(t,now);event(s,actor,t.id,'requested',`Asked ${c.name} to take over. ${member(s,t.owner).name} remains responsible until acceptance.`,now);return h;
 }
 if(command==='respond_to_handoff'){
 const h=s.handoffs.find(h=>h.id===args.handoffId&&h.taskId===t.id);fail(h,'Handoff not found',404);fail(h.memberId===actor,'Only the invited member can respond',403);fail(h.status==='pending','This handoff is no longer pending',409);open(t);fail(['accepted','declined'].includes(args.response),'Choose accept or decline');
 if(args.response==='accepted'){fail(candidates(s,t.id,now).some(c=>c.memberId===actor),'Your availability changed. Update it before accepting.',409);t.owner=actor;}
 h.status=args.response;h.respondedAt=iso(now);touch(t,now);event(s,actor,t.id,args.response,`${member(s,actor).name} ${args.response} the handoff${args.response==='accepted'?'; ownership transferred.':'; original owner remains responsible.'}`,now);return t;
 }
 if(command==='complete_task'||command==='cancel_task'){
 ownerOnly(s,t,actor);open(t);t.status=command==='complete_task'?'completed':'cancelled';t.completionNote=String(args.note||'').slice(0,1000);t.completedAt=t.status==='completed'?iso(now):null;touch(t,now);
 for(const h of s.handoffs)if(h.taskId===t.id&&h.status==='pending'){h.status='withdrawn';h.respondedAt=iso(now);}
 event(s,actor,t.id,t.status,t.status==='completed'?`Completion confirmed by ${member(s,actor).name}${t.completionNote?`: ${t.completionNote}`:''}`:'Task cancelled; pending requests withdrawn.',now);return t;
 }
 throw new RelayError('Unknown operation',404);
}
export function demoAssistant(s,actor,message,now=Date.now()){
 member(s,actor);const q=text(message,'Message',2000).toLowerCase();const trace=['Read household tasks'];
 const pending=s.handoffs.filter(h=>h.status==='pending'&&Date.parse(h.expiresAt)>now);
 if(/waiting|pending|acceptance/.test(q))return {text:pending.length?`${pending.length} handoff${pending.length===1?' is':'s are'} waiting for acceptance. Original owners remain responsible.`:'No handoffs are waiting for acceptance.',taskIds:pending.map(h=>h.taskId),trace};
 if(/attention|today|overview/.test(q)){const tasks=s.tasks.filter(t=>t.status==='open'&&t.owner===actor);return {text:`You have ${tasks.length} open tasks, including ${tasks.filter(t=>Date.parse(t.due)<now).length} overdue. Open a task to act on it.`,taskIds:tasks.map(t=>t.id),trace};}
 let tasks=s.tasks.filter(t=>t.status==='open'&&(q.includes(t.title.toLowerCase())||t.title.toLowerCase().split(' ').some(w=>w.length>4&&q.includes(w))));
 if(!tasks.length&&/available|priya|handoff|help|cannot|can't/.test(q))tasks=s.tasks.filter(t=>t.status==='open'&&t.owner===actor);
 if(tasks.length>1)return {text:'Which task do you mean? Choose one below so I can check the right deadline.',taskIds:tasks.map(t=>t.id),trace};
 if(tasks.length===1){const t=tasks[0];const cs=candidates(s,t.id,now);trace.push('Checked entered availability','Ranked preference and workload');return {text:cs.length?`${cs[0].reason} Review the suggestion below. No request has been sent yet.`:'No suitable replacement found. Keep the current owner, edit the deadline, or update member availability.',taskIds:[t.id],candidates:cs,trace};}
 return {text:'I can check tasks and propose a handoff. Try “I cannot collect the parcel” or “What needs my attention today?” Use Create task for a new responsibility.',taskIds:[],trace};
}
