import assert from 'node:assert/strict';
import http from 'node:http';
import { WebSocket } from 'ws';
const base='http://127.0.0.1:4174';
const page=await fetch(base);assert.equal(page.status,200);const cookie=page.headers.get('set-cookie').split(';')[0];
assert.equal((await fetch(base+'/api/terminal/status')).status,401);
assert.equal((await fetch(base+'/api/terminal/status',{headers:{Cookie:cookie,Origin:'https://example.com'}})).status,403);
await new Promise((resolve,reject)=>{http.get(base,{headers:{Host:'attacker.example:4174'}},r=>{try{assert.equal(r.statusCode,403);r.resume();resolve();}catch(e){reject(e);}}).on('error',reject);});
const config=await (await fetch(base+'/api/terminal/status',{headers:{Cookie:cookie}})).json();
async function rejected(headers){await new Promise((resolve,reject)=>{const ws=new WebSocket('ws://127.0.0.1:4174/api/terminal/connect?shell=powershell',{headers});const timer=setTimeout(()=>{ws.terminate();reject(new Error('Rejection timeout'));},5000);ws.on('open',()=>{clearTimeout(timer);ws.close();reject(new Error('Unauthorized connection accepted'));});ws.on('unexpected-response',(_,res)=>{clearTimeout(timer);res.resume();assert.equal(res.statusCode,403);ws.terminate();resolve();});ws.on('error',()=>{});});}
await rejected({Origin:base});await rejected({Origin:'https://example.com',Cookie:cookie});
for(const shell of config.shells){
 await new Promise((resolve,reject)=>{
  const ws=new WebSocket(`ws://127.0.0.1:4174/api/terminal/connect?shell=${shell.id}`,{headers:{Origin:base,Cookie:cookie}});let output='';let sent=false;
  const timer=setTimeout(()=>{ws.close();reject(new Error(`${shell.id} output timeout: ${output.slice(-500)}`));},20000);
  ws.on('message',raw=>{const m=JSON.parse(raw);if(m.type==='ready'){ws.send(JSON.stringify({type:'resize',cols:100,rows:30}));}if(m.type==='output'){
   output+=m.data;
   if(!sent){sent=true;setTimeout(()=>ws.send(JSON.stringify({type:'input',data:shell.id==='powershell'?"$academyValue = 21; Write-Output ('ACADEMY_RESULT_' + ($academyValue * 2)); exit\r":"academy_value=21; printf 'ACADEMY_RESULT_%s\\n' \"$((academy_value * 2))\"; exit\r"})),1000);}
  }if(m.type==='exit'){clearTimeout(timer);try{assert.ok(output.includes('ACADEMY_RESULT_42'),`${shell.id} did not return evaluated output: ${JSON.stringify(output.slice(-1500))}`);assert.equal(m.exitCode,0);resolve();}catch(e){reject(e);}ws.close();}if(m.type==='error'){clearTimeout(timer);ws.close();reject(new Error(m.message));}});
  ws.on('error',e=>{clearTimeout(timer);reject(e);});
 });console.log(`PASS ${shell.label}: real evaluated output, resize, and clean exit`);
}
console.log('PASS authentication, hostile Origin, and unexpected Host rejection');
