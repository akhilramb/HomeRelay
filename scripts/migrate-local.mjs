import { readdirSync,existsSync } from 'node:fs';import {spawnSync} from 'node:child_process';
if(!existsSync('dist/server/wrangler.json')){console.error('Run pnpm build before applying local migrations.');process.exit(1);}
// Safe initial setup only. After adding migrations, use Wrangler migration tracking instead of replaying these files.
for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){const result=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--file',`drizzle/${file}`],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
