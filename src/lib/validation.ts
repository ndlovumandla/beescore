import { z } from 'zod';

const posNum = z.number({ invalid_type_error: 'Must be a number' }).min(0, 'Must be >= 0').finite();
const pct    = z.number().min(0, 'Min 0%').max(100, 'Max 100%');
const intPos = z.number().int().min(0);

export const companyInfoSchema = z.object({
  name:               z.string().min(1, 'Company name is required').max(200).trim(),
  registrationNumber: z.string().max(100).trim(),
  financialYearEnd:   z.string().min(1, 'Financial year-end is required'),
  annualTurnover:     posNum,
  npat:               z.number().finite(),
  totalEmployees:     intPos,
  leviableAmount:     posNum,
  sector:             z.enum(['GENERIC', 'FINANCIAL', 'CONSTRUCTION', 'ICT', 'TRANSPORT', 'TOURISM']),
  size:               z.enum(['EME', 'QSE', 'GENERIC']),
});

export const ownershipSchema = z.object({
  blackVotingRightsPct:          pct,
  blackWomenVotingRightsPct:     pct,
  blackEconomicInterestPct:      pct,
  blackWomenEconomicInterestPct: pct,
  blackEquityNetValue:           posNum,
  totalEquityValue:              posNum,
  yearsSinceShareIssue:          intPos.max(50),
}).refine(d => d.blackWomenVotingRightsPct <= d.blackVotingRightsPct, {
  message: 'Black women voting rights cannot exceed total Black voting rights',
  path: ['blackWomenVotingRightsPct'],
}).refine(d => d.blackWomenEconomicInterestPct <= d.blackEconomicInterestPct, {
  message: 'Black women economic interest cannot exceed total Black economic interest',
  path: ['blackWomenEconomicInterestPct'],
});

export const managementCategorySchema = z.object({
  total:      intPos,
  black:      intPos,
  blackWomen: intPos,
}).refine(d => d.black <= d.total, { message: 'Black count cannot exceed total', path: ['black'] })
  .refine(d => d.blackWomen <= d.black, { message: 'Black women cannot exceed total Black', path: ['blackWomen'] });

export const managementSchema = z.object({
  board:               managementCategorySchema,
  execDirectors:       managementCategorySchema,
  otherExecManagement: managementCategorySchema,
  seniorManagement:    managementCategorySchema,
  middleManagement:    managementCategorySchema,
  juniorManagement:    managementCategorySchema,
  blackDisabledCount:  intPos,
});

export const skillsSchema = z.object({
  blackSkillsSpend:        posNum,
  blackDisabledSpend:      posNum,
  blackLearnersEmployed:   intPos,
  blackLearnersUnemployed: intPos,
  absorptionRatePct:       pct,
});

export const esdSchema = z.object({
  sdContributions:         posNum,
  edContributions:         posNum,
  hasGraduatedBeneficiary: z.boolean(),
  hasJobsCreated:          z.boolean(),
});

export const sedContributionSchema = z.object({
  description:         z.string().min(1, 'Description required').max(300).trim(),
  amount:              posNum,
  blackBeneficiaryPct: pct,
});
