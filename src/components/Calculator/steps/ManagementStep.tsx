import { useState, useCallback } from 'react';
import { useScorecard } from '../../../context/ScorecardContext';
import { managementSchema } from '../../../lib/validation';
import { calcManagement } from '../../../lib/calculations';
import Button from '../../UI/Button';
import ProgressBar from '../../UI/ProgressBar';
import type { ManagementData, ManagementCategory } from '../../../types/bbbee';

const CATEGORIES: { field: keyof ManagementData; label: string; targetBlack: number; targetWomen: number }[] = [
  { field: 'board',               label: 'Board of Directors',      targetBlack: 50, targetWomen: 25 },
  { field: 'execDirectors',       label: 'Executive Directors',     targetBlack: 50, targetWomen: 25 },
  { field: 'otherExecManagement', label: 'Other Exec Management',   targetBlack: 60, targetWomen: 30 },
  { field: 'seniorManagement',    label: 'Senior Management',       targetBlack: 60, targetWomen: 30 },
  { field: 'middleManagement',    label: 'Middle Management',       targetBlack: 75, targetWomen: 38 },
  { field: 'juniorManagement',    label: 'Junior Management',       targetBlack: 88, targetWomen: 44 },
];

export default function ManagementStep() {
  const { state, dispatch } = useScorecard();
  const [form, setForm] = useState<ManagementData>(state.formData.management);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalEmployees = state.formData.company.totalEmployees;
  const live = calcManagement(form, totalEmployees);

  const updateCat = useCallback((field: keyof ManagementData, key: keyof ManagementCategory, value: number) => {
    setForm(prev => ({
      ...prev,
      [field]: { ...(prev[field] as ManagementCategory), [key]: value },
    }));
  }, []);

  function pct(num: number, den: number): string {
    if (den === 0) return '0.0%';
    return `${((num / den) * 100).toFixed(1)}%`;
  }

  const handleSubmit = useCallback(() => {
    const result = managementSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => {
        const key = i.path.join('.');
        errs[key] = i.message;
      });
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_MANAGEMENT', payload: result.data });
    dispatch({ type: 'SET_STEP', payload: 3 });
  }, [form, dispatch]);

  return (
    <div>
      <div className="calc-form-header">
        <h2 className="calc-form-title">Management Control (Code 200)</h2>
        <p className="calc-form-subtitle">15 points + 2 bonus. Enter headcounts per management category.</p>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
              <th>Black</th>
              <th>Black Women</th>
              <th>Black %</th>
              <th>Women %</th>
              <th>Black Target</th>
              <th>Women Target</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(({ field, label, targetBlack, targetWomen }) => {
              const cat = form[field] as ManagementCategory;
              return (
                <tr key={field}>
                  <td className="table-category">{label}</td>
                  <td>
                    <input type="number" min={0} className="num-input"
                      value={cat.total || ''} onChange={e => updateCat(field, 'total', parseInt(e.target.value) || 0)} />
                  </td>
                  <td>
                    <input type="number" min={0} className="num-input"
                      value={cat.black || ''} onChange={e => updateCat(field, 'black', parseInt(e.target.value) || 0)} />
                  </td>
                  <td>
                    <input type="number" min={0} className="num-input"
                      value={cat.blackWomen || ''} onChange={e => updateCat(field, 'blackWomen', parseInt(e.target.value) || 0)} />
                  </td>
                  <td className="table-pct">{pct(cat.black, cat.total)}</td>
                  <td className="table-pct">{pct(cat.blackWomen, cat.total)}</td>
                  <td className="table-pct">{targetBlack}%</td>
                  <td className="table-pct">{targetWomen}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="field">
          <label htmlFor="disabled-count" className="field-label">
            Black Disabled Employees (Bonus — target: 2% of total staff)
          </label>
          <input
            id="disabled-count" type="number" min={0}
            className="field-control" style={{ maxWidth: '180px' }}
            value={form.blackDisabledCount || ''}
            onChange={e => setForm(prev => ({ ...prev, blackDisabledCount: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <ProgressBar label="Management Score" value={live.totalEarned} max={17} />
      </div>

      {Object.keys(errors).length > 0 && (
        <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
          ⚠️ Please fix validation errors above (e.g., Black count cannot exceed Total).
        </p>
      )}

      <div className="calc-form-actions">
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Next: Skills →
        </Button>
      </div>
    </div>
  );
}
