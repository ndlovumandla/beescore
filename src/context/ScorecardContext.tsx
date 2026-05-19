import {
  createContext, useContext, useReducer, useCallback,
  type ReactNode, type Dispatch,
} from 'react';
import type { ScorecardFormData, BBBEEResult } from '../types/bbbee';

interface ScorecardState {
  currentStep: number;
  formData: ScorecardFormData;
  result: BBBEEResult | null;
}

type Action =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_COMPANY'; payload: ScorecardFormData['company'] }
  | { type: 'SET_OWNERSHIP'; payload: ScorecardFormData['ownership'] }
  | { type: 'SET_MANAGEMENT'; payload: ScorecardFormData['management'] }
  | { type: 'SET_SKILLS'; payload: ScorecardFormData['skills'] }
  | { type: 'SET_ESD'; payload: ScorecardFormData['esd'] }
  | { type: 'SET_SED'; payload: ScorecardFormData['sed'] }
  | { type: 'SET_RESULT'; payload: BBBEEResult }
  | { type: 'RESET' };

const defaultMgmtCat = { total: 0, black: 0, blackWomen: 0 };

const defaultFormData: ScorecardFormData = {
  company: {
    name: '', registrationNumber: '', financialYearEnd: '',
    annualTurnover: 0, npat: 0, totalEmployees: 0, leviableAmount: 0,
    sector: 'GENERIC', size: 'GENERIC',
  },
  ownership: {
    blackVotingRightsPct: 0, blackWomenVotingRightsPct: 0,
    blackEconomicInterestPct: 0, blackWomenEconomicInterestPct: 0,
    blackEquityNetValue: 0, totalEquityValue: 0, yearsSinceShareIssue: 1,
  },
  management: {
    board: { ...defaultMgmtCat },
    execDirectors: { ...defaultMgmtCat },
    otherExecManagement: { ...defaultMgmtCat },
    seniorManagement: { ...defaultMgmtCat },
    middleManagement: { ...defaultMgmtCat },
    juniorManagement: { ...defaultMgmtCat },
    blackDisabledCount: 0,
  },
  skills: {
    blackSkillsSpend: 0, blackDisabledSpend: 0,
    blackLearnersEmployed: 0, blackLearnersUnemployed: 0,
    absorptionRatePct: 0,
  },
  esd: {
    suppliers: [], sdContributions: 0, edContributions: 0,
    hasGraduatedBeneficiary: false, hasJobsCreated: false,
  },
  sed: { contributions: [] },
};

const initialState: ScorecardState = {
  currentStep: 0,
  formData: defaultFormData,
  result: null,
};

function reducer(state: ScorecardState, action: Action): ScorecardState {
  switch (action.type) {
    case 'SET_STEP':       return { ...state, currentStep: action.payload };
    case 'SET_COMPANY':    return { ...state, formData: { ...state.formData, company: action.payload } };
    case 'SET_OWNERSHIP':  return { ...state, formData: { ...state.formData, ownership: action.payload } };
    case 'SET_MANAGEMENT': return { ...state, formData: { ...state.formData, management: action.payload } };
    case 'SET_SKILLS':     return { ...state, formData: { ...state.formData, skills: action.payload } };
    case 'SET_ESD':        return { ...state, formData: { ...state.formData, esd: action.payload } };
    case 'SET_SED':        return { ...state, formData: { ...state.formData, sed: action.payload } };
    case 'SET_RESULT':     return { ...state, result: action.payload };
    case 'RESET':          return { ...initialState };
    default:               return state;
  }
}

interface ScorecardContextType {
  state: ScorecardState;
  dispatch: Dispatch<Action>;
  goToStep: (step: number) => void;
}

const ScorecardContext = createContext<ScorecardContextType | null>(null);

export function ScorecardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const goToStep = useCallback((step: number) => dispatch({ type: 'SET_STEP', payload: step }), []);
  return (
    <ScorecardContext.Provider value={{ state, dispatch, goToStep }}>
      {children}
    </ScorecardContext.Provider>
  );
}

export function useScorecard() {
  const ctx = useContext(ScorecardContext);
  if (!ctx) throw new Error('useScorecard must be used within ScorecardProvider');
  return ctx;
}
