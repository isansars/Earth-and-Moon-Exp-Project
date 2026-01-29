
import React, { useState } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Alert, Paper, Fade, LinearProgress } from '@mui/material';
import { EmojiEventsOutlined, Done } from '@mui/icons-material';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which describes the force the Moon exerts on the Earth compared to the Earth's force on the Moon?",
    options: [
      "Earth pulls harder because it is more massive.",
      "The Moon pulls harder to stay in orbit.",
      "They are equal in magnitude but opposite in direction.",
      "The force is only present when they are aligned."
    ],
    correctIndex: 2,
    explanation: "Newton's Third Law (Action-Reaction) states that forces between two interacting objects are always equal in magnitude and opposite in direction, regardless of mass difference."
  },
  {
    id: 2,
    question: "What happens to the gravitational force if the distance (r) between bodies is tripled?",
    options: [
      "The force stays the same.",
      "The force becomes three times stronger.",
      "The force becomes nine times weaker.",
      "The force becomes three times weaker."
    ],
    correctIndex: 2,
    explanation: "Gravity follows an 'inverse-square law'. Tripling the distance (3r) reduces the force by a factor of 3 squared, which is 9 (1/9th original force)."
  },
  {
    id: 3,
    question: "Gravity is scientifically categorized as which type of force?",
    options: [
      "Contact force",
      "Non-contact (Field) force",
      "Electrostatic force",
      "Frictional force"
    ],
    correctIndex: 1,
    explanation: "Gravity is a non-contact force because it acts over a distance through a gravitational field without requiring physical contact between bodies."
  }
];

const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const current = QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  const handleSubmit = () => {
    if (selected === null) return;
    if (selected === current.correctIndex) {
      setScore(s => s + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <Fade in>
        <Box className="text-center py-10 space-y-6">
          <Box className="inline-flex p-8 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <EmojiEventsOutlined sx={{ fontSize: 90, color: '#60a5fa' }} />
          </Box>
          <Box>
            <Typography variant="h5" className="font-black mb-1">EVALUATION COMPLETE</Typography>
            <Typography variant="body2" className="text-slate-500 font-bold tracking-widest uppercase">Research Proficiency Index</Typography>
          </Box>
          <Box className="py-8 px-12 glass-panel rounded-[40px] inline-block">
             <Typography className="mono text-7xl font-black text-blue-400">
               {score}<span className="text-slate-700 text-3xl mx-2">/</span>{QUESTIONS.length}
             </Typography>
          </Box>
          <Box className="pt-6">
            <Button variant="contained" color="primary" onClick={reset} className="font-black px-12 py-3 rounded-full shadow-lg shadow-blue-500/20">
              RESTART EVALUATION
            </Button>
          </Box>
        </Box>
      </Fade>
    );
  }

  return (
    <Box className="space-y-8 fade-in">
      {/* Progress Header */}
      <Box className="space-y-3">
        <Box className="flex justify-between items-end mb-1">
          <Typography variant="caption" className="text-slate-500 font-black uppercase tracking-widest">
            Checkpoint {currentIdx + 1} of {QUESTIONS.length}
          </Typography>
          <Typography variant="caption" className="text-blue-400 font-black font-mono">
            ACCURACY: {Math.round((score / QUESTIONS.length) * 100)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          className="rounded-full h-1.5 bg-white/5" 
          sx={{ '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#3b82f6' } }} 
        />
      </Box>

      {/* Question Text */}
      <Typography variant="h6" className="font-black text-slate-100 leading-tight min-h-[60px]">
        {current.question}
      </Typography>

      {/* Options */}
      <FormControl component="fieldset" className="w-full">
        <RadioGroup 
          value={selected} 
          onChange={(e) => !isSubmitted && setSelected(parseInt(e.target.value))}
        >
          {current.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <Paper 
                key={i} 
                elevation={0}
                className={`mb-4 border-2 transition-all duration-300 cursor-pointer overflow-hidden rounded-[24px] ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-500/15 shadow-[0_0_25px_rgba(37,99,235,0.2)]' 
                    : 'border-white/5 bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/10'
                } ${isSubmitted && isSelected ? (i === current.correctIndex ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10') : ''}`}
                onClick={() => !isSubmitted && setSelected(i)}
              >
                <FormControlLabel
                  value={i}
                  disabled={isSubmitted}
                  control={<Radio size="small" sx={{ display: 'none' }} />}
                  label={
                    <Box className="flex items-center gap-4 py-4 px-6">
                      <Box className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-blue-400 bg-blue-400' : 'border-slate-700'}`}>
                        {isSelected && <Done sx={{ fontSize: 12, color: '#020617', fontWeight: 900 }} />}
                      </Box>
                      <Typography variant="body2" className={`font-bold transition-colors ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {opt}
                      </Typography>
                    </Box>
                  }
                  className="w-full m-0 p-0"
                />
              </Paper>
            );
          })}
        </RadioGroup>
      </FormControl>

      {/* Action Area */}
      <Box className="pt-2 min-h-[80px]">
        {!isSubmitted ? (
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            disabled={selected === null}
            onClick={handleSubmit}
            className={`font-black rounded-2xl py-4 transition-all duration-300 ${
              selected !== null 
                ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 scale-[1.02]' 
                : 'bg-slate-800 text-slate-500 border border-white/5 opacity-50'
            }`}
          >
            {selected === null ? "CHOOSE AN OPTION" : "SUBMIT RESPONSE"}
          </Button>
        ) : (
          <Fade in>
            <Box className="space-y-6">
              <Alert 
                severity={selected === current.correctIndex ? "success" : "error"}
                icon={false}
                className={`rounded-[24px] border ${selected === current.correctIndex ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center' }}
              >
                {selected === current.correctIndex ? "VALIDATION SUCCESSFUL" : "VALIDATION FAILED"}
              </Alert>
              <Box className="p-6 bg-slate-950/80 rounded-[24px] border border-white/10 shadow-inner">
                <Typography variant="caption" className="text-slate-500 font-black block mb-2 uppercase tracking-[0.2em]">PHYSICAL ANALYSIS</Typography>
                <Typography variant="body2" className="text-slate-300 font-medium leading-relaxed">
                  {current.explanation}
                </Typography>
              </Box>
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary" 
                size="large"
                onClick={handleNext}
                className="font-black rounded-[24px] py-4 border-2 hover:bg-blue-600/5"
              >
                {currentIdx === QUESTIONS.length - 1 ? "FINALIZE REPORT" : "PROCEED TO NEXT PHASE"}
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default Quiz;
