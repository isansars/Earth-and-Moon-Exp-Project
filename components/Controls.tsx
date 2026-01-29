
import React from 'react';
import { Box, Slider, Typography, Switch, FormControlLabel, Stack, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { PlayArrow, Pause, Public, Flare, ZoomInMap, Speed, Timeline, SettingsOutlined } from '@mui/icons-material';
import { SimulationState } from '../types';

interface Props {
  state: SimulationState;
  onChange: (updates: Partial<SimulationState>) => void;
}

const Controls: React.FC<Props> = ({ state, onChange }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-12 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-6 lg:py-0 overflow-x-auto custom-scrollbar">
      
      {/* Simulation Engine Toggle */}
      <Box className="flex items-center gap-6 shrink-0">
        <Box className="relative">
          <IconButton 
            size="large"
            onClick={() => onChange({ isAutoOrbit: !state.isAutoOrbit })}
            className={`transition-all duration-300 w-14 h-14 lg:w-16 lg:h-16 ${
              state.isAutoOrbit 
                ? "bg-blue-600/20 text-blue-400 border-2 border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                : "bg-slate-800 text-slate-500 border-2 border-white/5"
            }`}
          >
            {state.isAutoOrbit ? <Pause fontSize="medium" /> : <PlayArrow fontSize="medium" />}
          </IconButton>
          {state.isAutoOrbit && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-[#020617]"></span>
            </span>
          )}
        </Box>
        <Box className="hidden sm:block">
          <Typography variant="caption" className="text-slate-500 font-black uppercase tracking-widest block leading-none mb-1">Engine Status</Typography>
          <Typography variant="body2" className={`font-black uppercase tracking-tighter ${state.isAutoOrbit ? 'text-blue-400' : 'text-slate-400'}`}>
            {state.isAutoOrbit ? "Dynamics: Running" : "Dynamics: Suspended"}
          </Typography>
        </Box>
      </Box>

      {!isTablet && <Divider orientation="vertical" className="bg-white/10 h-14" />}

      {/* Mass Control Panel */}
      <Box className="flex-1 min-w-[280px] space-y-4">
        <Box>
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="caption" className="text-blue-400 font-black uppercase tracking-widest flex items-center gap-1.5 text-[10px]">
              <Public fontSize="inherit" /> Earth Mass (M₁)
            </Typography>
            <Typography className="mono text-[11px] text-slate-400 font-bold">{state.earthMass.toFixed(2)}x</Typography>
          </Box>
          <Slider
            size="small"
            value={state.earthMass}
            min={1} max={15} step={0.01}
            onChange={(_, val) => onChange({ earthMass: val as number })}
            sx={{ color: '#3b82f6', '& .MuiSlider-thumb': { width: 14, height: 14 } }}
          />
        </Box>
        
        <Box>
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="caption" className="text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 text-[10px]">
              <Flare fontSize="inherit" /> Moon Mass (M₂)
            </Typography>
            <Typography className="mono text-[11px] text-slate-400 font-bold">{state.moonMass.toFixed(3)}x</Typography>
          </Box>
          <Slider
            size="small"
            value={state.moonMass}
            min={0.01} max={0.3} step={0.001}
            onChange={(_, val) => onChange({ moonMass: val as number })}
            sx={{ color: '#94a3b8', '& .MuiSlider-thumb': { width: 14, height: 14 } }}
          />
        </Box>
      </Box>

      {!isTablet && <Divider orientation="vertical" className="bg-white/10 h-14" />}

      {/* Spacing & Velocity Panel */}
      <Box className="flex-1 min-w-[280px] space-y-4">
        <Box>
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="caption" className={`font-black uppercase tracking-widest flex items-center gap-1.5 text-[10px] ${state.isAutoOrbit ? 'text-slate-600' : 'text-emerald-400'}`}>
              <ZoomInMap fontSize="inherit" /> Orbital Separation (r)
            </Typography>
            <Typography className="mono text-[11px] text-slate-400 font-bold">{state.distance.toFixed(0)}u</Typography>
          </Box>
          <Slider
            size="small"
            value={state.distance}
            min={120} max={500}
            onChange={(_, val) => onChange({ distance: val as number })}
            disabled={state.isAutoOrbit}
            sx={{ color: '#10b981', '& .MuiSlider-thumb': { width: 14, height: 14 } }}
          />
        </Box>
        <Box>
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="caption" className={`font-black uppercase tracking-widest flex items-center gap-1.5 text-[10px] ${!state.isAutoOrbit ? 'text-slate-600' : 'text-amber-500'}`}>
              <Speed fontSize="inherit" /> Orbital Velocity (v)
            </Typography>
            <Typography className="mono text-[11px] text-slate-400 font-bold">{state.velocity.toFixed(2)}v</Typography>
          </Box>
          <Slider
            size="small"
            value={state.velocity}
            min={0.1} max={3.0} step={0.05}
            onChange={(_, val) => onChange({ velocity: val as number })}
            disabled={!state.isAutoOrbit}
            sx={{ color: '#f59e0b', '& .MuiSlider-thumb': { width: 14, height: 14 } }}
          />
        </Box>
      </Box>

      {!isTablet && <Divider orientation="vertical" className="bg-white/10 h-14" />}

      {/* Analytics Toggles */}
      <Box className="flex flex-wrap lg:flex-nowrap gap-x-8 gap-y-2 lg:gap-y-0 min-w-[160px] items-center justify-between">
        <Stack spacing={0.5}>
          <FormControlLabel
            control={<Switch size="small" checked={state.showVectors} onChange={(e) => onChange({ showVectors: e.target.checked })} />}
            label={<Typography variant="caption" className="font-black text-slate-400 uppercase text-[9px] tracking-widest">Vector Field</Typography>}
          />
          <FormControlLabel
            control={<Switch size="small" checked={state.showPath} color="secondary" onChange={(e) => onChange({ showPath: e.target.checked })} />}
            label={<Typography variant="caption" className="font-black text-slate-400 uppercase text-[9px] tracking-widest">Orbital Trace</Typography>}
          />
        </Stack>
        <Stack spacing={0.5}>
          <FormControlLabel
            control={<Switch size="small" checked={state.showField} color="primary" onChange={(e) => onChange({ showField: e.target.checked })} />}
            label={<Typography variant="caption" className="font-black text-slate-400 uppercase text-[9px] tracking-widest">Spacetime Grid</Typography>}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default Controls;
