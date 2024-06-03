import { createContext } from 'react';

// Experiment Context
type ContextType = any;

const StudyContext = createContext<ContextType>(null);

export default StudyContext;
