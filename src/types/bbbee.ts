export type CompanySize = 'EME' | 'QSE' | 'GENERIC';
export type SectorCode = 'GENERIC' | 'FINANCIAL' | 'CONSTRUCTION' | 'ICT' | 'TRANSPORT' | 'TOURISM';

export interface CompanyInfo {
  name: string;
  registrationNumber: string;
  financialYearEnd: string;
  annualTurnover: number;
  npat: number;
  totalEmployees: number;
  leviableAmount: number;
  sector: SectorCode;
  size: CompanySize;
}

export interface OwnershipData {
  blackVotingRightsPct: number;
  blackWomenVotingRightsPct: number;
  blackEconomicInterestPct: number;
  blackWomenEconomicInterestPct: number;
  blackEquityNetValue: number;
  totalEquityValue: number;
  yearsSinceShareIssue: number;
}

export interface ManagementCategory {
  total: number;
  black: number;
  blackWomen: number;
}

export interface ManagementData {
  board: ManagementCategory;
  execDirectors: ManagementCategory;
  otherExecManagement: ManagementCategory;
  seniorManagement: ManagementCategory;
  middleManagement: ManagementCategory;
  juniorManagement: ManagementCategory;
  blackDisabledCount: number;
}

export interface SkillsData {
  blackSkillsSpend: number;
  blackDisabledSpend: number;
  blackLearnersEmployed: number;
  blackLearnersUnemployed: number;
  absorptionRatePct: number;
}

export interface ProcurementSupplier {
  id: string;
  name: string;
  spend: number;
  beeLevel: number;
  isQSE: boolean;
  isEME: boolean;
  isBlackOwned51: boolean;
  isBlackWomen30: boolean;
  isDesignatedGroup: boolean;
  isNonMeasured: boolean;
}

export interface ESDData {
  suppliers: ProcurementSupplier[];
  sdContributions: number;
  edContributions: number;
  hasGraduatedBeneficiary: boolean;
  hasJobsCreated: boolean;
}

export interface SEDContribution {
  id: string;
  description: string;
  amount: number;
  blackBeneficiaryPct: number;
}

export interface SEDData {
  contributions: SEDContribution[];
}

export interface ScoreBreakdownItem {
  label: string;
  actualValue: number;
  targetValue: number;
  maxPoints: number;
  earnedPoints: number;
  unit: string;
  isBonus: boolean;
}

export interface ElementScore {
  name: string;
  code: string;
  maxPoints: number;
  bonusMaxPoints: number;
  earnedPoints: number;
  bonusPoints: number;
  totalEarned: number;
  isPriority: boolean;
  subMinimumRequired: number;
  subMinimumEarned: number;
  subMinimumMet: boolean;
  breakdown: ScoreBreakdownItem[];
}

export interface BBBEEResult {
  ownershipScore: ElementScore;
  managementScore: ElementScore;
  skillsScore: ElementScore;
  esdScore: ElementScore;
  sedScore: ElementScore;
  totalPoints: number;
  calculatedLevel: number;
  finalLevel: number;
  recognitionPct: number;
  discountApplied: boolean;
  discountReasons: string[];
  companySize: CompanySize;
  autoLevel: number | null;
  companyName: string;
}

export interface ScorecardFormData {
  company: CompanyInfo;
  ownership: OwnershipData;
  management: ManagementData;
  skills: SkillsData;
  esd: ESDData;
  sed: SEDData;
}
