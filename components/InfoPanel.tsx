
import React from 'react';
import { Typography, Box, Paper, Stack } from '@mui/material';
import { Speed, SyncAlt, BlurOn, Public, Science } from '@mui/icons-material';

const InfoPanel: React.FC = () => {
  return (
    <Box className="space-y-10 fade-in">
      <header className="relative">
        <Box className="w-12 h-1 bg-blue-600 mb-4 rounded-full" />
        <Typography variant="overline" className="text-blue-500 font-black tracking-[0.3em] block mb-2">Theoretical Base</Typography>
        <Typography variant="h5" className="text-white font-black leading-tight mb-4">Gravitational Interaction</Typography>
        <Typography variant="body2" className="text-slate-400 leading-relaxed font-medium">
          Gravity is a <span className="text-blue-400 font-bold">non-contact force</span> that manifests as the curvature of spacetime. In a two-body system, stability is achieved through a precise equilibrium between central pull and tangential inertia.
        </Typography>
      </header>

      <Paper className="bg-white/5 border border-white/10 p-7 rounded-[24px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
          <Science sx={{ fontSize: 80 }} />
        </div>
        <Typography variant="caption" className="text-slate-500 font-black uppercase block mb-6 tracking-widest">Core Axioms</Typography>
        <Stack spacing={5}>
          <div className="flex gap-5">
            <Box className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <BlurOn className="text-blue-400" fontSize="medium" />
            </Box>
            <div>
              <Typography variant="subtitle2" className="text-slate-100 font-bold leading-tight">Spacetime Curvature</Typography>
              <Typography variant="caption" className="text-slate-500 block mt-1.5 leading-relaxed font-medium">Mass bends the cosmic fabric. The 'Spacetime Grid' visualization shows the magnitude of this local deformation.</Typography>
            </div>
          </div>
          <div className="flex gap-5">
            <Box className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <SyncAlt className="text-emerald-400" fontSize="medium" />
            </Box>
            <div>
              <Typography variant="subtitle2" className="text-slate-100 font-bold leading-tight">Newtonian Reciprocity</Typography>
              <Typography variant="caption" className="text-slate-500 block mt-1.5 leading-relaxed font-medium">Force pairs (F<sub>G</sub>) are symmetrical. The Moon pulls Earth with the exact same magnitude as Earth pulls the Moon.</Typography>
            </div>
          </div>
        </Stack>
      </Paper>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Speed className="text-amber-500" fontSize="small" />
          <Typography variant="subtitle2" className="text-slate-100 font-black uppercase tracking-wider">Dynamic Equilibrium</Typography>
        </div>
        <Typography variant="body2" className="text-slate-400 leading-relaxed font-medium">
          The <span className="text-amber-500 font-bold">Inertial Vector (V<sub>f</sub>)</span> prevents orbital collapse. Increasing primary mass without adjusting velocity will lead to a decaying spiral into the gravity well.
        </Typography>
        <Box className="p-5 bg-slate-950/50 border-l-4 border-amber-600 rounded-r-2xl text-slate-300 text-xs font-bold font-mono tracking-tighter uppercase leading-relaxed">
          Real-time Tip: Decrease orbital velocity below 0.8v while mass is at 10x to observe gravitational capture.
        </Box>
      </section>

      <Box className="p-8 bg-gradient-to-br from-blue-600/20 via-blue-900/10 to-transparent rounded-[32px] border border-blue-500/10 shadow-2xl">
        <Typography variant="caption" className="text-blue-400 font-black block mb-2 uppercase tracking-[0.2em]">Lab Experiment 01</Typography>
        <Typography variant="body1" className="text-slate-200 font-black italic leading-snug">
          "Analyze the relationship between distance (r) and Force (F). Is the decay linear or exponential?"
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoPanel;
