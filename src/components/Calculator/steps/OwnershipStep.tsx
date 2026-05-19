import { useState, useCallback } from 'react';
import { useScorecard } from '../../../context/ScorecardContext';
import { ownershipSchema } from '../../../lib/validation';
import { calcOwnership, calcAutoLevel } from '../../../lib/calculations';
import FormField from '../../UI/FormField';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert';
import ProgressBar from '../../UI/ProgressBar';
import type { OwnershipData } from '../../../types/bbbee';

export default function OwnershipStep() {
  const { state, dispatch } = useScorecard();
  const [form, setForm] = useState<OwnershipData>(state.formData.ownership);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((field: keyof OwnershipData, value: number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }, []);

  const live = calcOwnership(form);
  const autoLevel = calcAutoLevel(state.formData.company.size, form.blackEconomicInterestPct);

  const handleSubmit = useCallback(() => {
    const result = ownershipSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_OWNERSHIP', payload: result.data });
    dispatch({ type: 'SET_STEP', payload: 2 });
  }, [form, dispatch]);

  return (
    <div>
      <div className="calc-form-header">
        <h2 className="calc-form-title">Ownership (Code 100)</h2>
        <p className="calc-form-subtitle">
          <strong>Priority element</strong> — 25 points. Net Value sub-minimum: 40% of 8 pts required.
        </p>
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-span-2">
          <p className="form-section-title">Voting Rights</p>
        </div>
        <FormField
          id="bvr" label="Black Exercisable Voting Rights (%)" required
          type="number" min={0} max={100} step={0.01}
          value={form.blackVotingRightsPct || ''}
          error={errors.blackVotingRightsPct}
          hint="Target: 51%"
          onChange={e => handleChange('blackVotingRightsPct', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="bwvr" label="Black Women Voting Rights (%)" required
          type="number" min={0} max={100} step={0.01}
          value={form.blackWomenVotingRightsPct || ''}
          error={errors.blackWomenVotingRightsPct}
          hint="Target: 25% — cannot exceed total Black voting rights"
          onChange={e => handleChange('blackWomenVotingRightsPct', parseFloat(e.target.value) || 0)}
        />

        <div className="form-span-2">
          <p className="form-section-title">Economic Interest</p>
        </div>
        <FormField
          id="bei" label="Black Economic Interest (%)" required
          type="number" min={0} max={100} step={0.01}
          value={form.blackEconomicInterestPct || ''}
          error={errors.blackEconomicInterestPct}
          hint="Target: 51%"
          onChange={e => handleChange('blackEconomicInterestPct', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="bwei" label="Black Women Economic Interest (%)" required
          type="number" min={0} max={100} step={0.01}
          value={form.blackWomenEconomicInterestPct || ''}
          error={errors.blackWomenEconomicInterestPct}
          hint="Target: 25%"
          onChange={e => handleChange('blackWomenEconomicInterestPct', parseFloat(e.target.value) || 0)}
        />

        <div className="form-span-2">
          <p className="form-section-title">Net Value</p>
        </div>
        <FormField
          id="benev" label="Black Equity Net Value (ZAR)" required
          type="number" min={0} step={1000}
          value={form.blackEquityNetValue || ''}
          error={errors.blackEquityNetValue}
          hint="Market value of Black-owned equity less associated debt"
          onChange={e => handleChange('blackEquityNetValue', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="tev" label="Total Equity Value (ZAR)" required
          type="number" min={0} step={1000}
          value={form.totalEquityValue || ''}
          error={errors.totalEquityValue}
          hint="Total market value of the enterprise"
          onChange={e => handleChange('totalEquityValue', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="years" label="Years Since Share Issue" required
          type="number" min={0} max={50} step={1}
          value={form.yearsSinceShareIssue || ''}
          error={errors.yearsSinceShareIssue}
          hint="Used for the Net Value time-based factor (0–10 years)"
          onChange={e => handleChange('yearsSinceShareIssue', parseInt(e.target.value) || 0)}
        />
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <ProgressBar label="Ownership Score" value={live.earnedPoints} max={25} />
        {!live.subMinimumMet && (
          <Alert variant="warning" title="Net Value Sub-Minimum Not Met">
            You need at least {live.subMinimumRequired.toFixed(2)} pts from Net Value (40% of 8).
            Currently earning {live.subMinimumEarned.toFixed(2)} pts. A discount of 1 level will apply.
          </Alert>
        )}
        {autoLevel !== null && (
          <Alert variant="info" title={`Auto B-BBEE Level ${autoLevel} may apply`}>
            {state.formData.company.size} entities with {'>='} 51% Black ownership may qualify for automatic Level {autoLevel}.
          </Alert>
        )}
      </div>

      <div className="calc-form-actions">
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_STEP', payload: 0 })}>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Next: Management →
        </Button>
      </div>
    </div>
  );
}
