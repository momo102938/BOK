import {GET,POST} from './games';
export default {
 async fetch(request:Request,env:any){
  const origin=request.headers.get('Origin');
  const allowed=(env.ALLOWED_ORIGINS||'').split(',').map((v:string)=>v.trim()).filter(Boolean);
  if(!origin||!allowed.includes(origin))return new Response('허용되지 않은 출처입니다.',{status:403});
  const cors={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};
  if(new URL(request.url).pathname!=='/api/games')return new Response('Not found',{status:404,headers:cors});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(!env.BUCKET)return new Response('저장소가 연결되지 않았어요.',{status:503,headers:cors});
  let response:Response;
  if(request.method==='GET')response=await GET(request,env);
  else if(request.method==='POST')response=await POST(request,env);
  else response=new Response('Method not allowed',{status:405});
  const headers=new Headers(response.headers);for(const [k,v] of Object.entries(cors))headers.set(k,v);
  return new Response(response.body,{status:response.status,headers});
 }
};
