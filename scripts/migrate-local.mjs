import {readdirSync,existsSync} from 'node:fs';import {spawnSync} from 'node:child_process';
if(!existsSync('dist/server/wrangler.json')){console.error('Run pnpm build before applying local migrations.');process.exit(1);}
const base=['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state'];
function query(sql){const r=spawnSync(process.execPath,[...base,'--command',sql,'--json'],{encoding:'utf8'});if(r.status!==0){process.stderr.write(r.stderr||r.stdout);process.exit(r.status||1);}const start=r.stdout.indexOf('[\n');return JSON.parse(start>=0?r.stdout.slice(start):r.stdout)[0].results;}
query('CREATE TABLE IF NOT EXISTS _homerelay_local_migrations (name TEXT PRIMARY KEY)');
const tables=new Set(query("SELECT name FROM sqlite_master WHERE type='table'").map(r=>r.name));
const applied=new Set(query('SELECT name FROM _homerelay_local_migrations').map(r=>r.name));
for(const file of readdirSync('drizzle').filter(f=>/^\d+_[a-zA-Z0-9_]+\.sql$/.test(f)).sort()){
 if(applied.has(file))continue;
 // Adopt legacy local databases whose schema was created by the original setup script.
 const legacy=(file.startsWith('0000_')&&tables.has('households'))||(file==='0001_eager_overlord.sql'&&tables.has('invitations')&&tables.has('memberships'));
 if(!legacy){const r=spawnSync(process.execPath,[...base,'--file',`drizzle/${file}`],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
 query(`INSERT INTO _homerelay_local_migrations (name) VALUES ('${file}')`);console.log(`${legacy?'Recognized existing':'Applied'} local migration ${file}`);
}
console.log('Local database is up to date. Hosted migrations are managed separately by Sites.');
