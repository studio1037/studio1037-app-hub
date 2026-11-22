import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const registry = JSON.parse(readFileSync(new URL('../apps.json', import.meta.url), 'utf8'));
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const allowed = new Set(['Verified','In Development','Not Deployed','Needs Verification','Archived']);
const expected = ['phaze','morning-timer','life-in-weeks','class-project-room','cs-class-timer'];
function httpsUrl(value){if(value===null)return true;try{return new URL(value).protocol==='https:'}catch{return false}}
test('exactly five unique apps',()=>{assert.deepEqual(registry.apps.map(x=>x.id),expected);assert.equal(new Set(registry.apps.map(x=>x.id)).size,5)});
test('all statuses from declared enum',()=>{assert.deepEqual(new Set(registry.statusValues),allowed);for(const x of registry.apps){for(const s of [x.status,x.production.status,x.development.status])assert.ok(allowed.has(s),x.id+': '+s)}});
test('all display fields and URLs follow shape',()=>{for(const x of registry.apps){assert.ok(x.name&&x.description&&x.stableVersion);assert.ok(httpsUrl(x.production.url)&&httpsUrl(x.development.url)&&httpsUrl(x.github));assert.ok(x.production.url||x.production.status==='Not Deployed');assert.ok(x.development.url||['Not Deployed','Needs Verification'].includes(x.development.status));if(x.production.checkedAt)assert.match(x.production.checkedAt,/^\d{4}-\d{2}-\d{2}$/);if(x.production.status==='Verified')assert.ok(x.production.checkedAt&&x.production.verification)}});
test('DEV is never invented from a branch',()=>{for(const x of registry.apps)if(x.development.status==='Verified')assert.ok(x.development.url)});
test('index loads canonical registry without hardcoding app cards',()=>{assert.match(html,/fetch\(["']\.\/apps\.json/);assert.match(html,/renderCard\(app\)/);assert.ok(!html.includes('https://studio1037.github.io/studio1037-phaze/'));assert.match(html,/navigator\.clipboard/);assert.match(html,/aria-live="polite"/)});
