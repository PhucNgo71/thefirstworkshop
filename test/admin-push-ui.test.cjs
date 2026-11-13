const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const code=fs.readFileSync(require.resolve('../dist/admin-push.js'),'utf8');
function browser(standalone){
 const nodes=new Map(),events={},calls={fetch:0,permission:0,register:0};
 const element=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,disabled:true,textContent:'',listeners:{},addEventListener(n,f){this.listeners[n]=f;},scrollIntoView(){this.scrolled=true;},focus(){this.focused=true;}});return nodes.get(id);};
 const registration={pushManager:{async getSubscription(){return null;}}};
 const context={document:{getElementById:element,addEventListener(n,f){events[n]=f;}},navigator:{userAgent:'iPhone',platform:'iPhone',maxTouchPoints:5,standalone,serviceWorker:{async register(){calls.register++;return registration;},ready:Promise.resolve(registration)}},matchMedia:()=>({matches:standalone}),window:{PushManager:function(){},Notification:{}},Notification:{permission:'default',requestPermission(){calls.permission++;return Promise.resolve('default');}},fetch:async()=>{calls.fetch++;return{ok:true,status:200,json:async()=>({configured:true,publicKey:'test-public-key'})};}};
 vm.runInNewContext(code,context);return{element,events,calls};
}
test('iPhone Safari shows a clickable installation guide instead of a dead notification button',async()=>{
 const b=browser(false);await b.events['admin-ready']();assert.equal(b.element('enablePush').disabled,false);assert.equal(b.element('enablePush').textContent,'Cách bật trên iPhone');assert.equal(b.element('testPush').disabled,true);await b.element('enablePush').listeners.click();assert.equal(b.element('pushInstall').scrolled,true);assert.equal(b.element('pushInstall').focused,true);assert.match(b.element('pushMessage').textContent,/Màn hình chính/);assert.equal(b.calls.permission,0);assert.equal(b.calls.register,0);
});
test('installed iPhone app keeps actual enable action and does not prompt until tapped',async()=>{
 const b=browser(true);await b.events['admin-ready']();assert.equal(b.element('pushInstall').hidden,true);assert.equal(b.element('enablePush').textContent,'Bật thông báo');assert.equal(b.element('enablePush').disabled,false);assert.equal(b.calls.register,1);assert.equal(b.calls.permission,0);await b.element('enablePush').listeners.click();assert.equal(b.calls.permission,1);assert.match(b.element('pushMessage').textContent,/chưa cho phép/);
});
