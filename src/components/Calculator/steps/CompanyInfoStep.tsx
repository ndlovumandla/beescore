import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScorecard } from '../../../context/ScorecardContext';
import { companyInfoSchema } from '../../../lib/validation';
import { deriveCompanySize } from '../../../lib/calculations';
import { formatCurrency } from '../../../lib/formatters';
import { COMPANY_SIZE_THRESHOLDS } from '../../../lib/constants';
import FormField from '../../UI/FormField';
import Button from '../../UI/Button';
import Alert from '../../UI/Alert';
import type { CompanyInfo } from '../../../types/bbbee';

function sizeLabel(size: string): string {
  if (size === 'EME') return `EME (Turnover < ${formatCurrency(COMPANY_SIZE_THRESHOLDS.EME)})`;
  if (size === 'QSE') return `QSE (Turnover ${formatCurrency(COMPANY_SIZE_THRESHOLDS.EME)}–${formatCurrency(COMPANY_SIZE_THRESHOLDS.QSE)})`;
  return `Generic Enterprise (Turnover ≥ ${formatCurrency(COMPANY_SIZE_THRESHOLDS.QSE)})`;
}

export default function CompanyInfoStep() {
  const { state, dispatch } = useScorecard();
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanyInfo>(state.formData.company);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const derivedSize = deriveCompanySize(form.annualTurnover);

  const handleChange = useCallback((field: keyof CompanyInfo, value: string | number) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      updated.size = deriveCompanySize(typeof value === 'number' && field === 'annualTurnover' ? value : updated.annualTurnover);
      return updated;
    });
    setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }, []);

  const handleSubmit = useCallback(() => {
    const result = companyInfoSchema.safeParse({ ...form, size: derivedSize });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_COMPANY', payload: result.data });
    dispatch({ type: 'SET_STEP', payload: 1 });
    navigate('/calculator');
  }, [form, derivedSize, dispatch, navigate]);

  return (
    <div>
      <div className="calc-form-header">
        <h2 className="calc-form-title">Company Information</h2>
        <p className="calc-form-subtitle">Basic details used to determine your entity type and applicable scorecard.</p>
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-span-2">
          <p className="form-section-title">Entity Details</p>
        </div>
        <FormField
          id="company-name" label="Company / Entity Name" required
          value={form.name} error={errors.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Acme (Pty) Ltd"
        />
        <FormField
          id="reg-number" label="Registration Number"
          value={form.registrationNumber} error={errors.registrationNumber}
          onChange={e => handleChange('registrationNumber', e.target.value)}
          placeholder="2021/000000/07"
        />
        <FormField
          id="fye" label="Financial Year-End" required
          type="date" value={form.financialYearEnd}
          error={errors.financialYearEnd}
          onChange={e => handleChange('financialYearEnd', e.target.value)}
        />
        <FormField
          id="sector" label="Sector Code" as="select"
          value={form.sector} error={errors.sector}
          onChange={e => handleChange('sector', e.target.value as CompanyInfo['sector'])}
        >
          <option value="GENERIC">Generic</option>
          <option value="FINANCIAL">Financial &amp; Intermediary Services</option>
          <option value="CONSTRUCTION">Construction</option>
          <option value="ICT">ICT</option>
          <option value="TRANSPORT">Transport &amp; Logistics</option>
          <option value="TOURISM">Tourism &amp; Hospitality</option>
        </FormField>

        <div className="form-span-2">
          <p className="form-section-title">Financial Metrics</p>
        </div>
        <FormField
          id="turnover" label="Annual Turnover (ZAR)" required
          type="number" min={0} step={1000}
          value={form.annualTurnover || ''}
          error={errors.annualTurnover}
          hint="Used to determine entity size (EME / QSE / Generic)"
          onChange={e => handleChange('annualTurnover', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="npat" label="Net Profit After Tax (NPAT) (ZAR)" required
          type="number" step={1000}
          value={form.npat || ''}
          error={errors.npat}
          hint="Used for ESD and SED contribution targets"
          onChange={e => handleChange('npat', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="leviable" label="Leviable Amount (ZAR)" required
          type="number" min={0} step={1000}
          value={form.leviableAmount || ''}
          error={errors.leviableAmount}
          hint="Skills levy payroll (typically ~80% of total payroll)"
          onChange={e => handleChange('leviableAmount', parseFloat(e.target.value) || 0)}
        />
        <FormField
          id="employees" label="Total Employees" required
          type="number" min={0} step={1}
          value={form.totalEmployees || ''}
          error={errors.totalEmployees}
          onChange={e => handleChange('totalEmployees', parseInt(e.target.value) || 0)}
        />
      </div>

      {form.annualTurnover > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <Alert variant="info" title={`Entity Size: ${derivedSize}`}>
            {sizeLabel(derivedSize)}. {derivedSize !== 'GENERIC' && 'Note: EME/QSE entities may qualify for automatic levels based on Black ownership.'}
          </Alert>
        </div>
      )}

      <div className="calc-form-actions">
        <span />
        <Button variant="primary" onClick={handleSubmit}>
          Next: Ownership →
        </Button>
      </div>
    </div>
  );
}
