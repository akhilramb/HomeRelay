const str={type:'string'};const ver={type:'integer',minimum:1};
const specs=[
 ['list_tasks','List the current household tasks.',{},[]],
 ['get_task','Read a task in the current household.',{taskId:str},['taskId']],
 ['create_task','Create a household responsibility with an owner and future deadline.',{title:str,description:str,requestId:str,owner:{type:'string',enum:['akhil','priya','ravi']},due:str,category:{type:'string',enum:['Deliveries','Groceries','Household chores','Appointments and errands','Shared administration','Custom']},priority:{type:'string',enum:['normal','high']}},['title','owner','due','category','priority']],
 ['update_task','Update an open task. Requires its current version.',{taskId:str,version:ver,title:str,description:str,due:str,category:str,priority:str},['taskId','version','title','due','category','priority']],
 ['get_household_availability','Read manually entered household availability.',{},[]],
 ['suggest_handoff_candidates','Suggest available members; does not send a request.',{taskId:str},['taskId']],
 ['request_handoff','Send an explicit handoff request; owner stays unchanged until acceptance.',{taskId:str,version:ver,memberId:{type:'string',enum:['akhil','priya','ravi']},reason:str},['taskId','version','memberId']],
 ['withdraw_handoff','Withdraw a pending request without changing task ownership.',{taskId:str,version:ver,handoffId:str},['taskId','version','handoffId']],
 ['respond_to_handoff','Accept or decline an invitation addressed to the active demo member.',{taskId:str,version:ver,handoffId:str,response:{type:'string',enum:['accepted','declined']}},['taskId','version','handoffId','response']],
 ['complete_task','Record member-confirmed completion. Not independent verification.',{taskId:str,version:ver,note:str},['taskId','version']],
 ['get_task_history','Read the responsibility timeline for a task.',{taskId:str},['taskId']]
];
export const tools=specs.map(([name,description,properties,required])=>({name,description,inputSchema:{type:'object',properties,required,additionalProperties:false}}));
export function validateTool(name,args){const tool=tools.find(t=>t.name===name);if(!tool)throw new Error('Unknown tool');if(!args||typeof args!=='object'||Array.isArray(args))throw new Error('Arguments must be an object');for(const k of tool.inputSchema.required)if(args[k]===undefined)throw new Error(`Missing ${k}`);for(const [k,v] of Object.entries(args)){const p=tool.inputSchema.properties[k];if(!p)throw new Error(`Unknown argument ${k}`);if(p.type==='integer'?!Number.isInteger(v):typeof v!==p.type)throw new Error(`Invalid ${k}`);if(p.minimum!==undefined&&v<p.minimum)throw new Error(`Invalid ${k}`);if(typeof v==='string'&&((tool.inputSchema.required.includes(k)&&!v.trim())||v.length>2000))throw new Error(`Invalid ${k}`);if(p.enum&&!p.enum.includes(v))throw new Error(`Invalid ${k}`);}return args;}
