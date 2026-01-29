
export interface SimulationState {
  earthMass: number; 
  moonMass: number;  
  distance: number;  
  velocity: number;   // Tangential velocity factor
  showVectors: boolean;
  showField: boolean;
  showPath: boolean;  // Historical trace
  isAutoOrbit: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
