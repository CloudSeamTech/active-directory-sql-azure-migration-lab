import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import * as pty from 'node-pty';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=resolve(root,'dist');
const port=4174;
const origin=`http://127.0.0.1:${port}`;
const session=randomBytes(32).toString('hex');
const cookieName='academy_terminal_session';
const shells={};
function executable(name,extra=[]){return [...extra,...(process.env.PATH||'').split(process.platform==='win32'?';':':').map(p=>resolve(p,name))].find(p=>existsSync(p));}
if(process.platform==='win32'){
 const ps=executable('pwsh.exe')||resolve(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe');
 if(existsSync(ps))shells.powershell={label:ps.toLowerCase().endsWith('pwsh.exe')?'PowerShell 7':'Windows PowerShell',file:ps,args:['-NoLogo','-NoProfile']};
 const bash=process.env.ACADEMY_BASH||executable('bash.exe',[resolve(process.env.ProgramFiles||'C:\\Program Files','Git','bin','bash.exe')]);
 if(bash&&existsSync(bash)&&!bash.toLowerCase().includes('system32'))shells.bash={label:'Bash (Git for Windows)',file:bash,args:['--noprofile','--norc','-i']};
}else{
 const ps=executable('pwsh');if(ps)shells.powershell={label:'PowerShell',file:ps,args:['-NoLogo','-NoProfile']};
 const bash=process.env.ACADEMY_BASH||executable('bash',['/bin/bash']);if(bash&&existsSync(bash))shells.bash={label:'Bash',file:bash,args:['--noprofile','--norc','-i']};
}
if(!existsSync(resolve(dist,'index.html')))throw new Error('Build the classroom first: npm run build');
function allowed(req,entry=false){const topLevel=entry&&req.headers['sec-fetch-mode']==='navigate'&&req.headers['sec-fetch-dest']==='document';return req.headers.host===`127.0.0.1:${port}`&&(!req.headers.origin||req.headers.origin===origin)&&(topLevel||!['cross-site','same-site'].includes(req.headers['sec-fetch-site']));}
function authenticated(req){const value=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';return value.length===session.length&&timingSafeEqual(Buffer.from(value),Buffer.from(session));}
function reply(res,status,body,type='text/plain'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"frame-ancestors 'none'"});res.end(body);}
const server=http.createServer((req,res)=>{
 if(!allowed(req,req.url==='/'||req.url==='/index.html'))return reply(res,403,'Local same-origin access only.');
 if(req.method!=='GET')return reply(res,405,'GET only.');
 const pathname=new URL(req.url,origin).pathname;
 if(pathname==='/api/terminal/status'){
  if(!authenticated(req))return reply(res,401,'Open the local classroom first.');
  return reply(res,200,JSON.stringify({shells:Object.entries(shells).map(([id,s])=>({id,label:s.label})),host:'This computer',cwd:root,mode:'local-companion'}),'application/json');
 }
 if(pathname==='/'||pathname==='/index.html')res.setHeader('Set-Cookie',`${cookieName}=${session}; HttpOnly; SameSite=Strict; Path=/`);
 let path;try{path=resolve(dist,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));}catch{return reply(res,400,'Invalid path.');}
 if(!path.startsWith(dist+sep)||!existsSync(path)||!statSync(path).isFile())return reply(res,404,'Not found.');
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
 reply(res,200,readFileSync(path),types[extname(path)]||'application/octet-stream');
});
const wss=new WebSocketServer({noServer:true,maxPayload:65536});
const active=new Set();
server.on('upgrade',(req,socket,head)=>{
 const url=new URL(req.url,origin);
 if(!allowed(req)||req.headers.origin!==origin||!authenticated(req)||url.pathname!=='/api/terminal/connect'||!shells[url.searchParams.get('shell')]||active.size>=4){socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');socket.destroy();return;}
 wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));
});
wss.on('connection',(ws,req)=>{
 const id=new URL(req.url,origin).searchParams.get('shell');const shell=shells[id];let proc;
 try{proc=pty.spawn(shell.file,shell.args,{name:'xterm-256color',cols:90,rows:24,cwd:root,env:{...process.env,TERM:'xterm-256color',COLORTERM:'truecolor',PS1:'\\u@\\h:\\w\\$ '},useConpty:true});}catch(error){ws.send(JSON.stringify({type:'error',message:`Shell could not start: ${error.message}`}));ws.close();return;}
 active.add(proc);const send=data=>{if(ws.readyState===1)ws.send(JSON.stringify(data));};
 send({type:'ready',shell:shell.label,cwd:root});
 proc.onData(data=>{if(ws.bufferedAmount>2*1024*1024){ws.close(1008,'Output buffer limit');return;}send({type:'output',data});});
 proc.onExit(({exitCode})=>{send({type:'exit',exitCode});active.delete(proc);ws.close();});
 ws.on('message',raw=>{let msg;try{msg=JSON.parse(raw.toString());}catch{return ws.close(1008,'Invalid message');}if(msg.type==='input'&&typeof msg.data==='string'&&msg.data.length<=16384)proc.write(msg.data);else if(msg.type==='resize'&&Number.isInteger(msg.cols)&&Number.isInteger(msg.rows)&&msg.cols>=10&&msg.cols<=300&&msg.rows>=2&&msg.rows<=100)proc.resize(msg.cols,msg.rows);else ws.close(1008,'Invalid terminal operation');});
 ws.on('close',()=>{active.delete(proc);try{proc.kill();}catch{}});
 ws.on('error',()=>{try{proc.kill();}catch{}});
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Local classroom with optional real terminals: ${origin}\nShells: ${Object.values(shells).map(s=>s.label).join(', ')||'none detected'}\nCommands run as your account on this computer. Close this process to stop the companion.`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{for(const p of active){try{p.kill();}catch{}}wss.close();server.close();process.exit(0);});
