import { useState, useCallback, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScorecard } from '../../../context/ScorecardContext';
import { sedContributionSchema } from '../../../lib/validation';
import { calcSED, calculateScorecard } from '../../../lib/calculations';
import { formatCurrency } from '../../../lib/formatters';
import FormField from '../../UI/FormField';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert';
import ProgressBar from '../../UI/ProgressBar';
import type { SEDData, SEDContribution } from '../../../types/bbbee';

function newContrib(id: string): SEDContribution {
  return { id, description: '', amount: 0, blackBeneficiaryPct: 100 };
}

export default function SEDStep() {
  const { state, dispatch } = useScorecard();
  const navigate = useNavigate();
  const baseId = useId();
  const [form, setForm] = useState<SEDData>(state.formData.sed);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const npat = state.formData.company.npat;
  const live = calcSED(form, npat);

  const addContrib = useCallback(() => {
    const id = `${Date.now()}`;
    setForm(prev => ({ contributions: [...prev.contributions, newContrib(id)] }));
  }, []);

  const removeContrib = useCallback((id: string) => {
    setForm(prev => ({ contributions: prev.contributions.filter(c => c.id !== id) }));
  }, []);

  const updateContrib = useCallback((id: string, key: keyof SEDContribution, value: unknown) => {
    setForm(prev => ({
      contributions: prev.contributions.map(c => c.id === id ? { ...c, [key]: value } : c),
    }));
    setErrors(prev => {
      const e = { ...prev };
      if (e[id]) { delete e[id][key as string]; }
      return e;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const errs: Record<string, Record<string, string>> = {};
    let valid = true;
    for (const c of form.contributions) {
      const result = sedContributionSchema.safeParse(c);
      if (!result.success) {
        valid = false;
        errs[c.id] = {};
        result.error.issues.forEach(i => { errs[c.id][String(i.path[0])] = i.message; });
      }
    }
    if (!valid) { setErrors(errs); return; }

    const sedData = form;
    dispatch({ type: 'SET_SED', payload: sedData });

    const fullData = {
      ...state.formData,
      sed: sedData,
    };
    const result = calculateScorecard(fullData);
    dispatch({ type: 'SET_RESULT', payload: result });
    dispatch({ type: 'SET_STEP', payload: 6 });
    navigate('/results');
  }, [form, state.formData, dispatch, navigate]);

  return (
    <div>
      <div className="calc-form-header">
        <h2 className="calc-form-title">Socio-Economic Development (Code 500)</h2>
        <p className="calc-form-subtitle">5 points. Target: 1% of NPAT to beneficiaries with ≥75% Black beneficiaries.</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Alert variant="info">
          NPAT: <strong>{formatCurrency(npat)}</strong>.
          SED target: <strong>{formatCurrency(npat * 0.01)}</strong> (1%). Contributions with ≥75% Black beneficiaries count in full; 50–74% count at 50%; &lt;50% count as 0.
        </Alert>
      </div>

      <p className="form-section-title" style={{ marginBottom: '0.75rem' }}>SED Contributions</p>
      {form.contributions.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          No contributions added. Click &ldquo;Add Contribution&rdquo; below.
        </p>
      )}
      {form.contributions.map((c, idx) => (
        <div key={c.id} className="sed-contribution">
          <FormField
            id={`${baseId}-desc-${c.id}`} label={`Contribution ${idx + 1} — Description`}
            value={c.description} error={errors[c.id]?.description}
            onChange={e => updateContrib(c.id, 'description', e.target.value)}
            placeholder="NPO donation, community project…"
          />
          <FormField
            id={`${baseId}-amt-${c.id}`} label="Amount (ZAR)"
            type="number" min={0} step={1000}
            value={c.amount || ''} error={errors[c.id]?.amount}
            onChange={e => updateContrib(c.id, 'amount', parseFloat(e.target.value) || 0)}
          />
          <FormField
            id={`${baseId}-pct-${c.id}`} label="Black Beneficiaries (%)"
            type="number" min={0} max={100} step={1}
            value={c.blackBeneficiaryPct || ''} error={errors[c.id]?.blackBeneficiaryPct}
            hint="≥75% = full; 50–74% = 50%; <50% = excluded"
            onChange={e => updateContrib(c.id, 'blackBeneficiaryPct', parseFloat(e.target.value) || 0)}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
            <Button variant="danger" size="sm" onClick={() => removeContrib(c.id)}>Remove</Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addContrib}>+ Add Contribution</Button>

      <div style={{ marginTop: '1.5rem' }}>
        <ProgressBar label="SED Score" value={live.earnedPoints} max={5} />
      </div>

      <div className="calc-form-actions">
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}>
          ← Back
        </Button>
        <Button variant="secondary" size="lg" onClick={handleSubmit}>
          📊 Calculate Scorecard →
        </Button>
      </div>
    </div>
  );
}
