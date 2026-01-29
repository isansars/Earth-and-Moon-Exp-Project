
import React, { useState, useMemo } from 'react';
import { 
  ThemeProvider, createTheme, Box, Typography, Tab, Tabs, Chip, Divider, 
  IconButton, Drawer, useMediaQuery, useTheme as useMuiTheme, Fade, Stack
} from '@mui/material';
import { 
  Science, Menu as MenuIcon, Close as CloseIcon, 
  SettingsBackupRestore
} from '@mui/icons-material';
import SimulationScene from './components/SimulationScene';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import Quiz from './components/Quiz';
import { SimulationState } from './types';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa' },
    secondary: { main: '#34d399' },
    background: { paper: '#0f172a', default: '#020617' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h6: { fontWeight: 900, letterSpacing: '-0.03em' },
    h5: { fontWeight: 900, letterSpacing: '-0.04em' },
    subtitle1: { fontWeight: 700 },
    caption: { fontWeight: 600, letterSpacing: '0.05em' },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 56,
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
        }
      }
    }
  }
});

const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    earthMass: 5.97,
    moonMass: 0.073,
    distance: 350,
    velocity: 1.0,
    showVectors: true,
    showField: true,
    showPath: true,
    isAutoOrbit: true,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const muiTheme = useMuiTheme();
  const isTablet = useMediaQuery(muiTheme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleStateChange = (updates: Partial<SimulationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const physics = useMemo(() => {
    // F = G * m1 * m2 / r^2 (Scaled for visual impact)
    const force = (state.earthMass * state.moonMass * 1000) / Math.pow(state.distance / 100, 2);
    
    // Stability is roughly state.velocity around 1.0 (balanced with distance scaling)
    const stability = Math.max(0, 100 - Math.abs(state.velocity - 1.0) * 100);
    
    let status = "DECAYING";
    let statusColor = "#ef4444"; // Red
    if (state.velocity > 1.2) {
      status = "ESCAPING";
      statusColor = "#f59e0b"; // Amber
    } else if (state.velocity >= 0.85 && state.velocity <= 1.15) {
      status = "STABLE";
      statusColor = "#10b981"; // Green
    }

    return { force, stability, status, statusColor };
  }, [state.earthMass, state.moonMass, state.distance, state.velocity]);

  const sidebarContent = (
    <Box className="flex flex-col h-full bg-[#020617] border-r border-white/5">
      <Box className="p-6 pb-4 flex justify-between items-center">
        <div>
          <Typography variant="h6" className="text-white">RESEARCH DATA</Typography>
          <Typography variant="caption" className="text-slate-500 uppercase">Interactive Physics Lab</Typography>
        </div>
        {isTablet && (
          <IconButton onClick={() => setIsDrawerOpen(false)} className="bg-white/5">
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Tabs 
        value={activeTab} 
        onChange={(_, val) => setActiveTab(val)} 
        variant="fullWidth"
        className="bg-slate-900/40 border-y border-white/5"
      >
        <Tab label="Principles" />
        <Tab label="Checkpoint" />
      </Tabs>
      <Box className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
        {activeTab === 0 ? <InfoPanel /> : <Quiz />}
      </Box>
      <Box className="p-4 bg-slate-900/20 border-t border-white/5">
         <Typography variant="caption" className="text-center block text-slate-600">
           NEWTONIAN DYNAMICS MODULE v3.2
         </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden">
        <header className="h-14 lg:h-18 px-4 lg:px-8 flex items-center justify-between border-b border-white/5 bg-slate-950/90 backdrop-blur-xl z-50">
          <div className="flex items-center gap-4">
            {isTablet && (
              <IconButton onClick={() => setIsDrawerOpen(true)} className="bg-blue-600/10 text-blue-400">
                <MenuIcon fontSize="small" />
              </IconButton>
            )}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Science className="text-white" fontSize={isMobile ? "small" : "medium"} />
              </div>
              <Box className="hidden xs:block">
                <Typography variant={isMobile ? "subtitle1" : "h6"} className="font-black leading-none uppercase tracking-tighter">
                  Gravity<span className="text-blue-500">Lab</span>
                </Typography>
                <Typography variant="caption" className="text-slate-500 font-bold block leading-none mt-1 text-[9px] lg:text-[10px]">
                  INTERACTIVE ANALYTICS ENGINE
                </Typography>
              </Box>
            </div>
          </div>

          <Box className="flex items-center gap-2 lg:gap-4">
            <IconButton 
              size="small" 
              onClick={() => setState({ ...state, earthMass: 5.97, moonMass: 0.073, distance: 350, velocity: 1.0 })}
              className="bg-white/5 hover:bg-white/10"
            >
              <SettingsBackupRestore fontSize="small" className="text-slate-400" />
            </IconButton>
          </Box>
        </header>

        <main className="flex-1 flex overflow-hidden relative">
          <Box className="flex-1 relative flex flex-col min-w-0">
            <Box className="flex-1 relative overflow-hidden bg-black">
              <SimulationScene state={state} onDistanceChange={(d) => handleStateChange({ distance: d })} />
              
              <Fade in timeout={800}>
                <Box 
                  className="absolute top-4 left-4 lg:top-8 lg:left-8 pointer-events-none origin-top-left"
                  sx={{ scale: { xs: '0.85', sm: '1' } }}
                >
                  <div className="glass-panel p-6 rounded-[32px] min-w-[300px]">
                    <Box className="flex items-center justify-between mb-4">
                      <Typography variant="caption" className="text-blue-400 font-black uppercase tracking-[0.2em]">
                        Orbital Telemetry
                      </Typography>
                      <Chip 
                        label={physics.status} 
                        size="small" 
                        sx={{ 
                          height: 20, 
                          fontSize: '9px', 
                          fontWeight: 900, 
                          bgcolor: `${physics.statusColor}20`, 
                          color: physics.statusColor,
                          border: `1px solid ${physics.statusColor}40`
                        }} 
                      />
                    </Box>
                    
                    <Box className="mb-4">
                      <Typography className="mono text-4xl font-black text-slate-100 flex items-baseline gap-2">
                        {physics.force.toFixed(2)}
                        <span className="text-[12px] text-slate-500 font-bold tracking-widest">N<sub>(s)</sub></span>
                      </Typography>
                      <Typography variant="caption" className="text-slate-500 block -mt-1 font-bold">GRAVITATIONAL MAGNITUDE</Typography>
                    </Box>

                    <Box className="space-y-4">
                      <div>
                        <Box className="flex justify-between items-center mb-1">
                          <Typography variant="caption" className="text-slate-400 font-bold text-[9px]">STABILITY INDEX</Typography>
                          <Typography variant="caption" className="mono text-[10px] text-slate-300 font-black">{physics.stability.toFixed(0)}%</Typography>
                        </Box>
                        <Box className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full transition-all duration-700 ease-out" 
                            style={{ 
                              width: `${physics.stability}%`,
                              backgroundColor: physics.statusColor,
                              boxShadow: `0 0 10px ${physics.statusColor}`
                            }}
                          />
                        </Box>
                      </div>

                      <Divider className="bg-white/5" />

                      <div className="grid grid-cols-2 gap-y-3 font-mono">
                        <Box>
                          <Typography variant="caption" className="text-slate-500 block mb-0.5 text-[9px]">RADIUS (r)</Typography>
                          <Typography variant="body2" className="text-slate-200 font-bold">{(state.distance * 1100).toLocaleString()} <span className="text-[10px] text-slate-500">KM</span></Typography>
                        </Box>
                        <Box className="text-right">
                          <Typography variant="caption" className="text-slate-500 block mb-0.5 text-[9px]">EARTH (M₁)</Typography>
                          <Typography variant="body2" className="text-blue-400 font-bold">{state.earthMass.toFixed(2)} <span className="text-[10px] text-slate-500">M⊕</span></Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" className="text-slate-500 block mb-0.5 text-[9px]">MOON (M₂)</Typography>
                          <Typography variant="body2" className="text-emerald-400 font-bold">{state.moonMass.toFixed(3)} <span className="text-[10px] text-slate-500">M⊕</span></Typography>
                        </Box>
                        <Box className="text-right">
                          <Typography variant="caption" className="text-slate-500 block mb-0.5 text-[9px]">VELOCITY</Typography>
                          <Typography variant="body2" className="text-amber-500 font-bold">{state.velocity.toFixed(2)} <span className="text-[10px] text-slate-500">v<sub>f</sub></span></Typography>
                        </Box>
                      </div>
                    </Box>
                  </div>
                </Box>
              </Fade>

              {!isMobile && (
                <Fade in timeout={1200}>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2.5 glass-panel rounded-full text-[11px] font-black text-slate-400 flex items-center gap-4 uppercase tracking-widest border border-white/10">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                    </span>
                    Manual Vector Override Enabled: Drag Entities
                  </div>
                </Fade>
              )}
            </Box>
            
            <Box className="h-auto lg:h-36 p-4 lg:p-0 bg-slate-950/95 border-t border-white/10 backdrop-blur-3xl flex items-center shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              <Controls state={state} onChange={handleStateChange} />
            </Box>
          </Box>

          {!isTablet ? (
            <aside className="w-[380px] lg:w-[420px] shrink-0 overflow-hidden">
              {sidebarContent}
            </aside>
          ) : (
            <Drawer 
              anchor="left" 
              open={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)}
              PaperProps={{ 
                sx: { 
                  width: isMobile ? '100vw' : '400px', 
                  backgroundColor: '#020617',
                  borderRight: '1px solid rgba(255,255,255,0.05)'
                } 
              }}
            >
              {sidebarContent}
            </Drawer>
          )}
        </main>
      </Box>
    </ThemeProvider>
  );
};

export default App;
