const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const B='https://nabe0096.github.io/portfolio/tmp-yahoo/';
window.__build=async function(A){
 const ta=document.querySelector('textarea');
 Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(ta,A.title);
 ta.dispatchEvent(new Event('input',{bubbles:true})); await sleep(600);
 const ed=document.querySelector('.ProseMirror').editor;
 const P=t=>({type:'paragraph',content:[{type:'text',text:t}]});
 const H=(t,l)=>({type:'heading',attrs:{level:l},content:[{type:'text',text:t}]});
 const L=arr=>{const c=[];arr.forEach((t,i)=>{if(i)c.push({type:'hardBreak'});c.push({type:'text',text:t});});return{type:'paragraph',content:c};};
 ed.commands.setContent([...A.lead.map(P),H(A.matHead,2),P(A.matNote),H('材料',3),L(A.mat),H('調味料',3),L(A.cond),H('作り方',2)]);
 await sleep(600);
 const inp=[...document.querySelectorAll('input[type=file]')][1];
 const k=Object.keys(inp).find(x=>x.startsWith('__reactProps'));
 const cnt=()=>{let c=0; ed.state.doc.descendants(n=>{if(n.type.name==='image')c++;}); return c;};
 for(let i=1;i<=A.nsteps;i++){
  const blob=await fetch(B+A.slug+'_s'+i+'.jpg',{mode:'cors'}).then(r=>r.blob());
  const f=new File([blob],'s.jpg',{type:'image/jpeg',lastModified:Date.now()});
  ed.commands.focus('end'); const b=cnt();
  const dt=new DataTransfer(); dt.items.add(f); inp.files=dt.files;
  inp[k].onChange({target:inp,currentTarget:inp,preventDefault(){},stopPropagation(){}});
  let t=0; while(cnt()===b&&t<30){await sleep(500);t++;}
 }
 const imgs=[]; ed.state.doc.descendants((n,p)=>{if(n.type.name==='image')imgs.push({p,src:n.attrs.src});});
 const S=imgs.map(i=>i.src);
 ed.commands.deleteRange({from:imgs[0].p,to:ed.state.doc.content.size});
 const IM=s=>({type:'image',attrs:{src:s,caption:'',credit:''}});
 const body=[];
 A.steps.forEach((t,i)=>{body.push(P(t)); if(S[i]) body.push(IM(S[i]));});
 body.push(H('おいしく作るコツ',2));
 A.tips.forEach(x=>{body.push(H(x[0],3)); body.push(P(x[1]));});
 if(A.yt){ body.push(H('動画でも確認できます',2)); body.push(P('手順は動画でも公開しています。火加減や手の動きは動画のほうが伝わりやすいので、初めて作る方はこちらもご覧ください。')); body.push({type:'youtube',attrs:{id:A.yt,url:'https://www.youtube.com/watch?v='+A.yt,query:''}}); }
 body.push(P(A.close));
 ed.commands.insertContentAt(ed.state.doc.content.size, body);
 await sleep(700);
 const seq=[]; ed.state.doc.forEach((n,off)=>seq.push({t:n.type.name,pos:off,end:off+n.nodeSize,txt:n.textContent}));
 const em=seq.filter(x=>x.t==='paragraph'&&x.txt==='');
 for(let i=em.length-1;i>=0;i--) ed.commands.deleteRange({from:em[i].pos,to:em[i].end});
 await sleep(400);
 const ti=[...document.querySelectorAll('input[type=file]')][0];
 const tk=Object.keys(ti).find(x=>x.startsWith('__reactProps'));
 const tb=await fetch(B+A.slug+'_thumb.jpg',{mode:'cors'}).then(r=>r.blob());
 const tf=new File([tb],'t.jpg',{type:'image/jpeg',lastModified:Date.now()});
 const dt2=new DataTransfer(); dt2.items.add(tf); ti.files=dt2.files;
 ti[tk].onChange({target:ti,currentTarget:ti,preventDefault(){},stopPropagation(){}});
 let t2=0,m=null; while(t2<30){await sleep(500); m=document.querySelector('.sd-modal.is-shown'); if(m)break; t2++;}
 window.scrollTo(0,0); await sleep(700);
 return {date:A.date,title:ta.value.slice(0,16), imgs:cnt(), modal:!!m};
};
window.__finish=async function(dateStr){
  const save=[...document.querySelectorAll('button')].find(b=>/^(下書き保存|更新)$/.test(b.innerText.trim()));
  save.click(); await sleep(3500);
  let m=document.querySelector('.sd-modal.is-shown');
  if(m && /使用できない|不足/.test(m.innerText)){ return {error:m.innerText.slice(0,120)}; }
  if(m && /更新しますが|保存しますが/.test(m.innerText)){ const ok=[...m.querySelectorAll('button')].find(b=>/^(更新|保存)$/.test(b.innerText.trim())); if(ok) ok.click(); await sleep(5000); }
  await sleep(2500);
  m=document.querySelector('.sd-modal.is-shown');
  if(m){ const c=[...m.querySelectorAll('button')].find(b=>b.innerText.trim()==='編集を続ける'); if(c){c.click(); await sleep(4000);} }
  const pub=[...document.querySelectorAll('button')].find(b=>b.innerText.trim()==='公開設定'); if(!pub) return {error:'no pub'};
  pub.click(); await sleep(2800);
  m=document.querySelector('.sd-modal.is-shown');
  const res=[...m.querySelectorAll('button')].find(b=>b.innerText.trim()==='公開日時を予約'); res.click(); await sleep(2800);
  const m2=document.querySelector('.sd-modal.is-shown');
  const inp=m2.querySelector('input[type=text]');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(inp,dateStr);
  inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new Event('change',{bubbles:true})); inp.blur();
  await sleep(1000);
  const btn=[...m2.querySelectorAll('button')].find(b=>b.innerText.trim()==='公開予約');
  if(!btn.disabled) btn.click();
  await sleep(6500);
  const idx=parseInt(sessionStorage.getItem('YA_IDX')); sessionStorage.setItem('YA_IDX',String(idx+1));
  return {url:location.pathname, result:document.querySelector('.sd-modal.is-shown')?.innerText.slice(0,50)||null};
};
'lib-ready'
