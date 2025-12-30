import React, { useState, useEffect } from "react";
import { Thermometer, Lightbulb, Wind, Snowflake, User, UserMinus, Battery, Sun, DollarSign } from "lucide-react";

export default function SmartHomeDashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([[],[],[]]);

  const API = "https://dk22000-home-ai-os.hf.space/state";

  useEffect(() => {
    const tick = async () => {
      const r = await fetch(API);
      const j = await r.json();
      setData(j);
      setHistory(h=>h.map((x,i)=>[...x,j.rooms[i].temp].slice(-25)));
    };
    tick();
    const i = setInterval(tick,2000);
    return ()=>clearInterval(i);
  },[]);

  if(!data) return <div className="h-screen flex items-center justify-center bg-black text-cyan-400 font-mono animate-pulse">CONNECTING TO AI BRAIN...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <h1 className="text-center text-3xl font-black text-cyan-400 mb-6">HOME-AI OS</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <Stat icon={<Battery className="text-green-400"/>} label="Battery" val={`${data.battery}%`} />
        <Stat icon={<Sun className="text-yellow-400"/>} label="Solar" val={`${data.solar}%`} />
        <Stat icon={<DollarSign className="text-emerald-400"/>} label="Price" val={`₹${data.price}`} />
        <Stat icon={<div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping"/>} label="AI MODE" val="ACTIVE" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {data.rooms.map((r,i)=>(
          <div key={i} className="bg-slate-900/60 backdrop-blur rounded-3xl p-6 border border-cyan-400/20 shadow-cyan-400/20 shadow-xl">

            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-lg">Room {i+1}</h2>
              {r.motion ? <User className="text-cyan-400 animate-pulse"/> : <UserMinus className="text-slate-600"/>}
            </div>

            <div className="text-4xl font-mono text-cyan-300 mb-2">{r.temp}°C</div>

            {/* Thermometer Bar */}
            <div className="w-full h-2 rounded bg-slate-800 mb-4 overflow-hidden">
              <div className="h-full transition-all duration-500"
                style={{
                  width:`${Math.min(100,((r.temp-16)/24)*100)}%`,
                  background:r.temp>26?"linear-gradient(90deg,#ef4444,#f97316)":"linear-gradient(90deg,#22d3ee,#0ea5e9)"
                }}/>
            </div>

            <div className="space-y-3">
              <Device icon={<Lightbulb/>} label="Light" on={r.light}/>
              <Device icon={<Wind className={r.fan>0?"animate-spin text-cyan-400 drop-shadow-[0_0_12px_#22d3ee]":""}/>} label={`Fan Lvl ${r.fan}`} on={r.fan>0}/>
              <Device icon={<Snowflake className={r.ac?"animate-pulse text-blue-400 drop-shadow-[0_0_14px_#38bdf8]":""}/>} label={r.ac?"Cooling":"Idle"} on={r.ac}/>
            </div>

            {/* Graph */}
            <svg viewBox="0 0 100 40" className="w-full h-16 mt-5">
              <polyline fill="none" stroke="#22d3ee" strokeWidth="2"
                points={history[i].map((t,idx)=>`${idx*(100/24)},${40-(t-16)*2}`).join(" ")}/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

const Stat=({icon,label,val})=>(
  <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex gap-3 items-center">
    {icon}
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-mono text-lg">{val}</div>
    </div>
  </div>
);

const Device=({icon,label,on})=>(
  <div className={`flex justify-between items-center p-3 rounded-xl border ${on?"bg-cyan-400/10 border-cyan-400/40 text-cyan-300":"bg-slate-900 border-slate-800 text-slate-500"}`}>
    <div className="flex items-center gap-2">{icon}{label}</div>
    <div className="text-xs">{on?"ON":"OFF"}</div>
  </div>
);
