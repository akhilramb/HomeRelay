import {RelayError,iso} from './service.mjs';
const fail=(ok,message,status=400)=>{if(!ok)throw new RelayError(message,status);};
const name=(value,label)=>{fail(typeof value==='string'&&value.trim().length>=2&&value.trim().length<=60,`${label} must be 2–60 characters.`);return value.trim();};
export async function membership(db,uid){return db.prepare('SELECT household_id, member_id FROM memberships WHERE user_id = ?').bind(uid).first();}
export async function createHousehold(db,uid,args,now=Date.now()){
 fail(!await membership(db,uid),'You already belong to a household. Open it from Household.',409);
 const memberId=crypto.randomUUID(),householdId=`home_${crypto.randomUUID()}`;
 const state={name:name(args.name,'Household name'),timezone:'Asia/Kolkata',mode:'shared',ownerId:memberId,members:[{id:memberId,name:name(args.displayName,'Your name'),color:'#dfeae4',preferences:[],availability:[]}],tasks:[],handoffs:[],events:[],messages:[]};
 await db.batch([db.prepare('INSERT INTO memberships (user_id,household_id,member_id) VALUES (?,?,?)').bind(uid,householdId,memberId),db.prepare('INSERT INTO households (id,revision,data) VALUES (?,0,?)').bind(householdId,JSON.stringify(state))]);
 return {created:true,name:state.name};
}
async function hash(value){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function inviteMember(db,uid,now=Date.now()){
 const m=await membership(db,uid);fail(m,'Create a shared household first.',403);
 const row=await db.prepare('SELECT data FROM households WHERE id = ?').bind(m.household_id).first();const state=JSON.parse(row.data);
 fail(state.ownerId===m.member_id,'Only the household creator can issue invitations.',403);
 fail(state.members.length<12,'This household has reached its 12-member limit.');
 const code=crypto.randomUUID().replaceAll('-',''),expiresAt=now+86400000;
 await db.batch([db.prepare('DELETE FROM invitations WHERE household_id = ?').bind(m.household_id),db.prepare('INSERT INTO invitations (token_hash,household_id,expires_at) VALUES (?,?,?)').bind(await hash(code),m.household_id,expiresAt)]);
 return {code,expiresAt:iso(expiresAt)};
}
export async function revokeInvite(db,uid){const m=await membership(db,uid);fail(m,'No shared household.',403);const row=await db.prepare('SELECT data FROM households WHERE id = ?').bind(m.household_id).first();fail(JSON.parse(row.data).ownerId===m.member_id,'Only the household creator can revoke invitations.',403);await db.prepare('DELETE FROM invitations WHERE household_id = ?').bind(m.household_id).run();return {revoked:true};}
export async function joinHousehold(db,uid,args,now=Date.now()){
 const displayName=name(args.displayName,'Your name');fail(typeof args.code==='string'&&/^[a-f0-9]{32}$/i.test(args.code.trim()),'Enter the complete invitation code.');
 const token=await hash(args.code.trim().toLowerCase());
 fail(!await membership(db,uid),'You already belong to a household.',409);
 const invite=await db.prepare('SELECT household_id,expires_at FROM invitations WHERE token_hash = ?').bind(token).first();
 fail(invite&&invite.expires_at>now,'This invitation expired, was revoked, or has already been used.',410);
 const row=await db.prepare('SELECT revision,data FROM households WHERE id = ?').bind(invite.household_id).first();fail(row,'Household no longer exists.',404);
 const state=JSON.parse(row.data);fail(state.members.length<12,'This household is full.');
 const memberId=crypto.randomUUID();state.members.push({id:memberId,name:displayName,color:'#e4e2f0',preferences:[],availability:[]});state.events.push({id:crypto.randomUUID(),actor:memberId,taskId:null,type:'joined',detail:`${displayName} joined the household.`,at:iso(now)});
 // D1 batch is transactional. The update gates membership and consumption on the same valid, unused invite and revision.
 const results=await db.batch([
 db.prepare('UPDATE households SET data = ?, revision = revision + 1 WHERE id = ? AND revision = ? AND EXISTS (SELECT 1 FROM invitations WHERE token_hash = ? AND expires_at > ?) AND NOT EXISTS (SELECT 1 FROM memberships WHERE user_id = ?)').bind(JSON.stringify(state),invite.household_id,row.revision,token,now,uid),
 db.prepare("INSERT INTO memberships (user_id,household_id,member_id) SELECT ?,?,? WHERE EXISTS (SELECT 1 FROM households,json_each(households.data,'$.members') WHERE households.id = ? AND json_extract(json_each.value,'$.id') = ?)").bind(uid,invite.household_id,memberId,invite.household_id,memberId),
 db.prepare('DELETE FROM invitations WHERE token_hash = ? AND EXISTS (SELECT 1 FROM memberships WHERE user_id = ? AND member_id = ?)').bind(token,uid,memberId)
 ]);
 fail(results[0].meta.changes===1,'The invitation or household changed. Try joining again.',409);
 return {joined:true,name:state.name};
}
