import type {
  OwnershipData, ManagementData, SkillsData, ESDData, SEDData,
  ElementScore, ScoreBreakdownItem, BBBEEResult, CompanySize, ScorecardFormData,
} from '../types/bbbee';
import {
  BEE_LEVEL_THRESHOLDS, NET_VALUE_TIME_FACTORS,
  SUPPLIER_RECOGNITION, COMPANY_SIZE_THRESHOLDS,
} from './constants';

function clamp(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max);
}

function r2(value: number): number {
  return Math.round(value * 100) / 100;
}

function pts(actual: number, target: number, max: number): number {
  if (target === 0) return 0;
  return clamp((actual / target) * max, max);
}

function item(
  label: string, actualValue: number, targetValue: number,
  maxPoints: number, earnedPoints: number, unit = '%', isBonus = false,
): ScoreBreakdownItem {
  return { label, actualValue, targetValue, maxPoints, earnedPoints: r2(earnedPoints), unit, isBonus };
}

export function deriveCompanySize(turnover: number): CompanySize {
  if (turnover < COMPANY_SIZE_THRESHOLDS.EME) return 'EME';
  if (turnover < COMPANY_SIZE_THRESHOLDS.QSE) return 'QSE';
  return 'GENERIC';
}

export function calcAutoLevel(size: CompanySize, blackOwnershipPct: number): number | null {
  if (size === 'EME') {
    if (blackOwnershipPct >= 100) return 1;
    if (blackOwnershipPct >= 51) return 2;
    return 4;
  }
  if (size === 'QSE') {
    if (blackOwnershipPct >= 100) return 1;
    if (blackOwnershipPct >= 51) return 2;
  }
  return null;
}

export function calcOwnership(data: OwnershipData): ElementScore {
  const bd: ScoreBreakdownItem[] = [];

  const blackVoting    = pts(data.blackVotingRightsPct, 51, 3);
  bd.push(item('Black Exercisable Voting Rights', data.blackVotingRightsPct, 51, 3, blackVoting));

  const womenVoting    = pts(data.blackWomenVotingRightsPct, 25, 2);
  bd.push(item('Black Women Voting Rights', data.blackWomenVotingRightsPct, 25, 2, womenVoting));

  const blackEcon      = pts(data.blackEconomicInterestPct, 51, 4);
  bd.push(item('Black Economic Interest', data.blackEconomicInterestPct, 51, 4, blackEcon));

  const womenEcon      = pts(data.blackWomenEconomicInterestPct, 25, 2);
  bd.push(item('Black Women Economic Interest', data.blackWomenEconomicInterestPct, 25, 2, womenEcon));

  const yearIdx        = Math.min(Math.max(Math.round(data.yearsSinceShareIssue), 0), 10);
  const timeFactor     = NET_VALUE_TIME_FACTORS[yearIdx] ?? 1.0;
  let netValueScore    = 0;
  if (data.totalEquityValue > 0 && timeFactor > 0) {
    const deemedPct = (data.blackEquityNetValue / data.totalEquityValue) * 100;
    const scoreA    = clamp((deemedPct / (25 * timeFactor)) * 8, 8);
    const scoreB    = clamp((data.blackEconomicInterestPct / 25) * 8, 8);
    netValueScore   = Math.min(scoreA, scoreB);
  } else {
    netValueScore   = clamp((data.blackEconomicInterestPct / 25) * 8, 8);
  }
  bd.push(item('Net Value (Priority Sub-element)', data.blackEconomicInterestPct, 25, 8, netValueScore));

  const fulfillment    = pts(data.blackEconomicInterestPct, 51, 4);
  bd.push(item('Ownership Fulfillment', data.blackEconomicInterestPct, 51, 4, fulfillment));

  const subMinReq      = 8 * 0.4;
  const earned         = r2(clamp(blackVoting + womenVoting + blackEcon + womenEcon + netValueScore + fulfillment, 25));

  return {
    name: 'Ownership', code: 'Code 100',
    maxPoints: 25, bonusMaxPoints: 0,
    earnedPoints: earned, bonusPoints: 0, totalEarned: earned,
    isPriority: true,
    subMinimumRequired: subMinReq, subMinimumEarned: r2(netValueScore),
    subMinimumMet: netValueScore >= subMinReq,
    breakdown: bd,
  };
}

export function calcManagement(data: ManagementData, totalEmployees: number): ElementScore {
  const bd: ScoreBreakdownItem[] = [];
  let total = 0;

  function catPts(
    label: string,
    cat: { total: number; black: number; blackWomen: number },
    targetBlack: number, maxBlack: number,
    targetWomen: number, maxWomen: number,
  ) {
    const bPct = cat.total > 0 ? (cat.black / cat.total) * 100 : 0;
    const wPct = cat.total > 0 ? (cat.blackWomen / cat.total) * 100 : 0;
    const bPts = pts(bPct, targetBlack, maxBlack);
    const wPts = pts(wPct, targetWomen, maxWomen);
    bd.push(item(`${label} — Black`, bPct, targetBlack, maxBlack, bPts));
    bd.push(item(`${label} — Black Women`, wPct, targetWomen, maxWomen, wPts));
    total += bPts + wPts;
  }

  catPts('Board',                    data.board,                50, 2, 25, 1);
  catPts('Executive Directors',      data.execDirectors,        50, 2, 25, 1);
  catPts('Other Exec Management',    data.otherExecManagement,  60, 2, 30, 1);
  catPts('Senior Management',        data.seniorManagement,     60, 2, 30, 1);
  catPts('Middle Management',        data.middleManagement,     75, 2, 38, 1);
  catPts('Junior Management',        data.juniorManagement,     88, 1, 44, 1);

  const disabledPct = totalEmployees > 0 ? (data.blackDisabledCount / totalEmployees) * 100 : 0;
  const bonus       = r2(pts(disabledPct, 2, 2));
  bd.push(item('Black Disabled Employees (Bonus)', disabledPct, 2, 2, bonus, '%', true));

  const earned = r2(clamp(total, 15));
  return {
    name: 'Management Control', code: 'Code 200',
    maxPoints: 15, bonusMaxPoints: 2,
    earnedPoints: earned, bonusPoints: bonus, totalEarned: r2(earned + bonus),
    isPriority: false,
    subMinimumRequired: 0, subMinimumEarned: earned, subMinimumMet: true,
    breakdown: bd,
  };
}

export function calcSkills(data: SkillsData, leviableAmount: number, totalEmployees: number): ElementScore {
  const bd: ScoreBreakdownItem[] = [];
  let total = 0;

  const spendPct = leviableAmount > 0 ? (data.blackSkillsSpend / leviableAmount) * 100 : 0;
  const spendScore = pts(spendPct, 6, 8);
  total += spendScore;
  bd.push(item('Black Skills Spend (6% of leviable)', spendPct, 6, 8, spendScore));

  const disPct = leviableAmount > 0 ? (data.blackDisabledSpend / leviableAmount) * 100 : 0;
  const disScore = pts(disPct, 0.3, 4);
  total += disScore;
  bd.push(item('Black Disabled Spend (0.3% of leviable)', disPct, 0.3, 4, disScore));

  const empPct = totalEmployees > 0 ? (data.blackLearnersEmployed / totalEmployees) * 100 : 0;
  const empScore = pts(empPct, 2.5, 4);
  total += empScore;
  bd.push(item('Employed Black Learners (2.5% of staff)', empPct, 2.5, 4, empScore));

  const unempPct = totalEmployees > 0 ? (data.blackLearnersUnemployed / totalEmployees) * 100 : 0;
  const unempScore = pts(unempPct, 2.5, 4);
  total += unempScore;
  bd.push(item('Unemployed Black Learners (2.5% of staff)', unempPct, 2.5, 4, unempScore));

  const bonus = data.absorptionRatePct >= 100 ? 5 : 0;
  bd.push(item('Absorption Rate Bonus (100% target)', data.absorptionRatePct, 100, 5, bonus, '%', true));

  const subMinReq = 20 * 0.4;
  const earned    = r2(clamp(total, 20));
  return {
    name: 'Skills Development', code: 'Code 300',
    maxPoints: 20, bonusMaxPoints: 5,
    earnedPoints: earned, bonusPoints: bonus, totalEarned: r2(earned + bonus),
    isPriority: true,
    subMinimumRequired: subMinReq, subMinimumEarned: r2(total),
    subMinimumMet: total >= subMinReq,
    breakdown: bd,
  };
}

export function calcESD(data: ESDData, npat: number): ElementScore {
  const bd: ScoreBreakdownItem[] = [];
  let ppScore = 0;
  let bonusPoints = 0;

  const totalSpend = data.suppliers.filter(s => !s.isNonMeasured).reduce((s, x) => s + x.spend, 0);

  if (totalSpend > 0) {
    let allEmpSpend = 0, qseSpend = 0, emeSpend = 0;
    let black51Spend = 0, women30Spend = 0, desigSpend = 0;

    for (const sup of data.suppliers) {
      if (sup.isNonMeasured) continue;
      const recog = SUPPLIER_RECOGNITION[sup.beeLevel] ?? 0;
      const weighted = sup.spend * recog;
      if (recog > 0) allEmpSpend  += weighted;
      if (sup.isQSE) qseSpend     += weighted;
      if (sup.isEME) emeSpend     += weighted;
      if (sup.isBlackOwned51) black51Spend += sup.spend;
      if (sup.isBlackWomen30) women30Spend += sup.spend;
      if (sup.isDesignatedGroup) desigSpend += sup.spend;
    }

    const p = (v: number) => (v / totalSpend) * 100;
    const s1 = pts(p(allEmpSpend), 80, 5);
    const s2 = pts(p(qseSpend), 15, 3);
    const s3 = pts(p(emeSpend), 15, 4);
    const s4 = pts(p(black51Spend), 40, 9);
    const s5 = pts(p(women30Spend), 12, 4);
    ppScore   = s1 + s2 + s3 + s4 + s5;

    bd.push(item('All Empowering Suppliers (80% target)',    p(allEmpSpend),  80, 5, s1));
    bd.push(item('Empowering QSE Suppliers (15% target)',   p(qseSpend),     15, 3, s2));
    bd.push(item('Empowering EME Suppliers (15% target)',   p(emeSpend),     15, 4, s3));
    bd.push(item('>=51% Black-Owned (40% target)',          p(black51Spend), 40, 9, s4));
    bd.push(item('>=30% Black Women (12% target)',          p(women30Spend), 12, 4, s5));

    const ppBonus = pts(p(desigSpend), 2, 2);
    bonusPoints  += ppBonus;
    bd.push(item('Designated Group Suppliers - Bonus (2%)', p(desigSpend), 2, 2, ppBonus, '%', true));
  }

  const sdPct  = npat > 0 ? (data.sdContributions / npat) * 100 : 0;
  const sdScore = pts(sdPct, 2, 10);
  bd.push(item('Supplier Development (2% NPAT)', sdPct, 2, 10, sdScore));

  const edPct  = npat > 0 ? (data.edContributions / npat) * 100 : 0;
  const edScore = pts(edPct, 1, 5);
  bd.push(item('Enterprise Development (1% NPAT)', edPct, 1, 5, edScore));

  const edBonus = (data.hasGraduatedBeneficiary ? 1 : 0) + (data.hasJobsCreated ? 1 : 0);
  bonusPoints  += edBonus;
  if (edBonus > 0) bd.push(item('ED Graduated + Jobs Created (Bonus)', 0, 0, 2, edBonus, 'pts', true));

  const baseTotal   = ppScore + sdScore + edScore;
  const ppSubMin    = ppScore  >= 25 * 0.4;
  const sdSubMin    = sdScore  >= 10 * 0.4;
  const edSubMin    = edScore  >=  5 * 0.4;
  const subMinMet   = ppSubMin && sdSubMin && edSubMin;

  const earned = r2(clamp(baseTotal, 40));
  const bpts   = r2(clamp(bonusPoints, 4));
  return {
    name: 'Enterprise & Supplier Development', code: 'Code 400',
    maxPoints: 40, bonusMaxPoints: 4,
    earnedPoints: earned, bonusPoints: bpts, totalEarned: r2(earned + bpts),
    isPriority: true,
    subMinimumRequired: r2(40 * 0.4),
    subMinimumEarned: r2(baseTotal),
    subMinimumMet: subMinMet,
    breakdown: bd,
  };
}

export function calcSED(data: SEDData, npat: number): ElementScore {
  const bd: ScoreBreakdownItem[] = [];

  function benefitFactor(pct: number): number {
    if (pct >= 75) return 1.0;
    if (pct >= 50) return 0.5;
    return 0.0;
  }

  const adjusted = data.contributions.reduce(
    (sum, c) => sum + c.amount * benefitFactor(c.blackBeneficiaryPct), 0,
  );

  const sedPct  = npat > 0 ? (adjusted / npat) * 100 : 0;
  const sedScore = r2(pts(sedPct, 1, 5));
  bd.push(item('SED Contributions (1% NPAT target)', sedPct, 1, 5, sedScore));

  return {
    name: 'Socio-Economic Development', code: 'Code 500',
    maxPoints: 5, bonusMaxPoints: 0,
    earnedPoints: sedScore, bonusPoints: 0, totalEarned: sedScore,
    isPriority: false,
    subMinimumRequired: 0, subMinimumEarned: sedScore, subMinimumMet: true,
    breakdown: bd,
  };
}

function determineLevel(totalPoints: number): number {
  for (const t of BEE_LEVEL_THRESHOLDS) {
    if (totalPoints >= t.minPoints) return t.level;
  }
  return 9;
}

export function calculateScorecard(data: ScorecardFormData): BBBEEResult {
  const size      = deriveCompanySize(data.company.annualTurnover);
  const autoLevel = calcAutoLevel(size, data.ownership.blackEconomicInterestPct);

  const ownershipScore   = calcOwnership(data.ownership);
  const managementScore  = calcManagement(data.management, data.company.totalEmployees);
  const skillsScore      = calcSkills(data.skills, data.company.leviableAmount, data.company.totalEmployees);
  const esdScore         = calcESD(data.esd, data.company.npat);
  const sedScore         = calcSED(data.sed, data.company.npat);

  const totalPoints = r2(
    ownershipScore.totalEarned + managementScore.totalEarned +
    skillsScore.totalEarned + esdScore.totalEarned + sedScore.totalEarned,
  );

  const calculatedLevel = determineLevel(totalPoints);
  const discountReasons: string[] = [];

  if (!ownershipScore.subMinimumMet)  discountReasons.push('Ownership Net Value sub-minimum not met (<40% of 8 pts)');
  if (!skillsScore.subMinimumMet)     discountReasons.push('Skills Development sub-minimum not met (<40% of 20 pts)');
  if (!esdScore.subMinimumMet)        discountReasons.push('ESD sub-minimum not met in one or more sub-categories');

  const discountApplied = discountReasons.length > 0;
  const finalLevel      = discountApplied ? Math.min(calculatedLevel + 1, 9) : calculatedLevel;
  const levelData       = BEE_LEVEL_THRESHOLDS.find(l => l.level === finalLevel);

  const effectiveLevel  = autoLevel !== null ? autoLevel : finalLevel;

  return {
    ownershipScore, managementScore, skillsScore, esdScore, sedScore,
    totalPoints,
    calculatedLevel,
    finalLevel: effectiveLevel,
    recognitionPct: levelData?.recognition ?? 0,
    discountApplied,
    discountReasons,
    companySize: size,
    autoLevel,
    companyName: data.company.name,
  };
}
