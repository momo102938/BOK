export type DialogueSource={text:string;dialogues?:{low?:string;mid?:string;high?:string}};
export function chooseDialogue(source:DialogueSource,affinity:number,previous?:string,random= Math.random):string{
 const key=affinity<30?'low':affinity<70?'mid':'high';
 const split=(value:string)=>[...new Set(value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean))];
 let lines=split(source.dialogues?.[key]||'');
 if(!lines.length)lines=split(source.text||'');
 if(!lines.length)return '…';
 const choices=lines.length>1?lines.filter(s=>s!==previous):lines;
 return choices[Math.min(choices.length-1,Math.max(0,Math.floor(random()*choices.length)))];
}
export function formatName(line:string,name:string):string{return line.split('{name}').join(name.trim()||'친구')}
