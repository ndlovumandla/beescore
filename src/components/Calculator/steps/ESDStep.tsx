import { useState, useCallback, useId } from 'react';
import { useScorecard } from '../../../context/ScorecardContext';
import { esdSchema } from '../../../lib/validation';
import { calcESD } from '../../../lib/calculations';
import { formatCurrency } from '../../../lib/formatters';
import FormField from '../../UI/FormField';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert';
import ProgressBar from '../../UI/ProgressBar';
import type { ESDData, ProcurementSupplier } from '../../../types/bbbee';

function newSupplier(id: string): ProcurementSupplier {
  return {
    id, name: '', spend: 0, beeLevel: 4,
    isQSE: false, isEME: false,
    isBlackOwned51: false, isBlackWomen30: false,
    isDesignatedGroup: false, isNonMeasured: false,
  };
}

export default function ESDStep() {
  const { state, dispatch } = useScorecard();
  const baseId = useId();
  const [form, setForm] = useState<ESDData>(state.formData.esd);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const npat = state.formData.company.npat;
  const live = calcESD(form, npat);

  const addSupplier = useCallback(() => {
    const id = `${Date.now()}`;
    setForm(prev => ({ ...prev, suppliers: [...prev.suppliers, newSupplier(id)] }));
  }, []);

  const removeSupplier = useCallback((id: string) => {
    setForm(prev => ({ ...prev, suppliers: prev.suppliers.filter(s => s.id !== id) }));
  }, []);

  const updateSupplier = useCallback((id: string, key: keyof ProcurementSupplier, value: unknown) => {
    setForm(prev => ({
      ...prev,
      suppliers: prev.suppliers.map(s => s.id === id ? { ...s, [key]: value } : s),
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const { suppliers, ...rest } = form;
    const result = esdSchema.safeParse(rest);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_ESD', payload: form });
    dispatch({ type: 'SET_STEP', payload: 5 });
  }, [form, dispatch]);

  return (
    <div>
      <div className="calc-form-header">
        <h2 className="calc-form-title">Enterprise &amp; Supplier Development (Code 400)</h2>
        <p className="calc-form-subtitle">
          <strong>Priority element</strong> — 40 points + 4 bonus. Three sub-categories each have a 40% sub-minimum.
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Alert variant="info">
          NPAT: <strong>{formatCurrency(npat)}</strong>. SD target: <strong>{formatCurrency(npat * 0.02)}</strong> (2%). ED target: <strong>{formatCurrency(npat * 0.01)}</strong> (1%).
        </Alert>
      </div>

      <p className="form-section-title" style={{ marginBottom: '0.75rem' }}>Preferential Procurement Suppliers</p>
      {form.suppliers.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          No suppliers added yet. Click &ldquo;Add Supplier&rdquo; to begin.
        </p>
      )}
      {form.suppliers.map((sup, idx) => (
        <div key={sup.id} className="supplier-card">
          <div className="supplier-card-header">
            <span className="supplier-card-title">Supplier {idx + 1}</span>
            <Button variant="danger" size="sm" onClick={() => removeSupplier(sup.id)}>Remove</Button>
          </div>
          <FormField
            id={`${baseId}-sname-${sup.id}`} label="Supplier Name"
            value={sup.name}
            onChange={e => updateSupplier(sup.id, 'name', e.target.value)}
          />
          <FormField
            id={`${baseId}-sspend-${sup.id}`} label="Annual Spend (ZAR)"
            type="number" min={0} step={1000}
            value={sup.spend || ''}
            onChange={e => updateSupplier(sup.id, 'spend', parseFloat(e.target.value) || 0)}
          />
          <FormField
            id={`${baseId}-slevel-${sup.id}`} label="B-BBEE Level" as="select"
            value={sup.beeLevel}
            onChange={e => updateSupplier(sup.id, 'beeLevel', parseInt(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8].map(l => <option key={l} value={l}>Level {l}</option>)}
            <option value={0}>Non-Compliant</option>
          </FormField>
          <div className="supplier-flags">
            {([
              ['isQSE', 'QSE'], ['isEME', 'EME'],
              ['isBlackOwned51', '\u226551% Black Owned'],
              ['isBlackWomen30', '\u226530% Black Women'],
              ['isDesignatedGroup', 'Designated Group'],
              ['isNonMeasured', 'Non-Measured (exclude)'],
            ] as [keyof ProcurementSupplier, string][]).map(([key, lbl]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={!!sup[key]}
                  onChange={e => updateSupplier(sup.id, key, e.target.checked)}
                />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="supplier-add-btn" onClick={addSupplier}>
        + Add Supplier
      </Button>

      <div className="form-grid form-grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="form-span-2">
          <p className="form-section-title">SD / ED Contributions</p>
        </div>
        <FormField
          id="sd-contrib" label="Supplier Development Contributions (ZAR)" required
          type="number" min={0} step={1000}
          value={form.sdContributions || ''}
          error={errors.sdContributions}
          hint={`Target: ${formatCurrency(npat * 0.02)} (2% NPAT)`}
          onChange={e => setForm(prev => ({ ...prev, sdContributions: parseFloat(e.target.value) || 0 }))}
        />
        <FormField
          id="ed-contrib" label="Enterprise Development Contributions (ZAR)" required
          type="number" min={0} step={1000}
          value={form.edContributions || ''}
          error={errors.edContributions}
          hint={`Target: ${formatCurrency(npat * 0.01)} (1% NPAT)`}
          onChange={e => setForm(prev => ({ ...prev, edContributions: parseFloat(e.target.value) || 0 }))}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input
            type="checkbox" checked={form.hasGraduatedBeneficiary}
            onChange={e => setForm(prev => ({ ...prev, hasGraduatedBeneficiary: e.target.checked }))}
          />
          ED programme had a graduated beneficiary (Bonus +1 pt)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input
            type="checkbox" checked={form.hasJobsCreated}
            onChange={e => setForm(prev => ({ ...prev, hasJobsCreated: e.target.checked }))}
          />
          ED programme created net new jobs (Bonus +1 pt)
        </label>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <ProgressBar label="ESD Score" value={live.earnedPoints} max={40} />
        {!live.subMinimumMet && (
          <div style={{ marginTop: '0.75rem' }}>
            <Alert variant="warning" title="ESD Sub-Minimum Not Met">
              One or more sub-categories (PP / SD / ED) is below 40% of its maximum. A level discount will apply.
            </Alert>
          </div>
        )}
      </div>

      <div className="calc-form-actions">
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Next: SED →
        </Button>
      </div>
    </div>
  );
}
