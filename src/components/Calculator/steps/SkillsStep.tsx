import { useState, useCallback } from 'react';
import { useScorecard } from '../../../context/ScorecardContext';
import { skillsSchema } from '../../../lib/validation';
import { calcSkills } from '../../../lib/calculations';
import { formatCurrency } from '../../../lib/formatters';
import FormField from '../../UI/FormField';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert';
import ProgressBar from '../../UI/ProgressBar';
import type { SkillsData } from '../../../types/bbbee';

export default function SkillsStep() {
  const { state, dispatch } = useScorecard();
  const [form, setForm] = useState<SkillsData>(state.formData.skills);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { leviableAmount, totalEmployees } = state.formData.company;
  const live = calcSkills(form, leviableAmount, totalEmployees);

  const target6pct  = leviableAmount * 0.06;
  const target03pct = leviableAmount * 0.003;

  const handleChange = useCallback((field: keyof SkillsData, value: number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }, []);

  const handleSubmit = useCallback(() => {
    const result = skillsSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_SKILLS', payload: result.data });
    dispatch({ type: 'SET_STEP', payload: 4 });
  }, [form, dispatch]);

  return (
    <div>
      <div className="calc-form-header">
        <h2 className="calc-form-title">Skills Development (Code 300)</h2>
        <p className="calc-form-subtitle">
          <strong>Priority element</strong> — 20 points + 5 bonus. Sub-minimum: 40% of 20 pts required.
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Alert variant="info">
          Leviable amount: <strong>{formatCurrency(leviableAmount)}</strong>.
          Target spend: <strong>{formatCurrency(target6pct)}</strong> (6%) for Black skills,{' '}
          <strong>{formatCurrency(target03pct)}</strong> (0.3%) for Black disabled.
        </Alert>
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-span-2">
          <p className="form-section-title">Training Spend</p>
        </div>
        <FormField
          id="bss" label="Black Skills Spend (ZAR)" required
          type="number" min={0} step={1000}
          value={form.blackSkillsSpend || ''}
          error={errors.blackSkillsSpend}
          hint={`Target: ${formatCurrency(target6pct)} (6% of leviable)`}
          onChange={e => handleChange('blackSkillsSpend', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="bds" label="Black Disabled Skills Spend (ZAR)" required
          type="number" min={0} step={1000}
          value={form.blackDisabledSpend || ''}
          error={errors.blackDisabledSpend}
          hint={`Target: ${formatCurrency(target03pct)} (0.3% of leviable)`}
          onChange={e => handleChange('blackDisabledSpend', parseFloat(e.target.value) || 0)}
        />

        <div className="form-span-2">
          <p className="form-section-title">Learnership / Internship Programmes</p>
        </div>
        <FormField
          id="ble" label="Employed Black Learners" required
          type="number" min={0} step={1}
          value={form.blackLearnersEmployed || ''}
          error={errors.blackLearnersEmployed}
          hint={`Target: 2.5% of total staff = ${Math.round(totalEmployees * 0.025)} people`}
          onChange={e => handleChange('blackLearnersEmployed', parseInt(e.target.value) || 0)}
        />
        <FormField
          id="blu" label="Unemployed Black Learners" required
          type="number" min={0} step={1}
          value={form.blackLearnersUnemployed || ''}
          error={errors.blackLearnersUnemployed}
          hint={`Target: 2.5% of total staff = ${Math.round(totalEmployees * 0.025)} people`}
          onChange={e => handleChange('blackLearnersUnemployed', parseInt(e.target.value) || 0)}
        />

        <div className="form-span-2">
          <p className="form-section-title">Absorption (Bonus)</p>
        </div>
        <FormField
          id="abs" label="Learner Absorption Rate (%)" required
          type="number" min={0} max={100} step={1}
          value={form.absorptionRatePct || ''}
          error={errors.absorptionRatePct}
          hint="% of learners absorbed into permanent employment. Bonus 5 pts at 100%."
          onChange={e => handleChange('absorptionRatePct', parseFloat(e.target.value) || 0)}
        />
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <ProgressBar label="Skills Score" value={live.earnedPoints} max={20} />
        {!live.subMinimumMet && (
          <Alert variant="warning" title="Skills Sub-Minimum Not Met">
            You need at least {live.subMinimumRequired.toFixed(2)} pts (40% of 20). Currently {live.subMinimumEarned.toFixed(2)} pts.
          </Alert>
        )}
      </div>

      <div className="calc-form-actions">
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Next: ESD →
        </Button>
      </div>
    </div>
  );
}
