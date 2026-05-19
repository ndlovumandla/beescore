import { CALCULATOR_STEPS } from '../../lib/constants';

interface StepperProps {
  currentStep: number;
  onClickStep?: (step: number) => void;
}

export default function Stepper({ currentStep, onClickStep }: StepperProps) {
  return (
    <nav className="stepper" aria-label="Progress steps">
      {CALCULATOR_STEPS.map((step, idx) => {
        const state = idx < currentStep ? 'done' : idx === currentStep ? 'active' : '';
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            {idx > 0 && <div className={`stepper-connector${idx <= currentStep ? ' done' : ''}`} />}
            <div
              className={`stepper-item ${state}`}
              role="button"
              tabIndex={idx < currentStep ? 0 : -1}
              aria-current={idx === currentStep ? 'step' : undefined}
              onClick={() => idx < currentStep && onClickStep?.(idx)}
              onKeyDown={e => e.key === 'Enter' && idx < currentStep && onClickStep?.(idx)}
            >
              <div className="stepper-number">
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className="stepper-label">{step}</span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
