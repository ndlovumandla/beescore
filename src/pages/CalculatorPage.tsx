import { useScorecard } from '../context/ScorecardContext';
import Stepper from '../components/UI/Stepper';
import ScoreSidebar from '../components/Calculator/ScoreSidebar';
import CompanyInfoStep from '../components/Calculator/steps/CompanyInfoStep';
import OwnershipStep from '../components/Calculator/steps/OwnershipStep';
import ManagementStep from '../components/Calculator/steps/ManagementStep';
import SkillsStep from '../components/Calculator/steps/SkillsStep';
import ESDStep from '../components/Calculator/steps/ESDStep';
import SEDStep from '../components/Calculator/steps/SEDStep';

const STEPS = [
  <CompanyInfoStep />,
  <OwnershipStep />,
  <ManagementStep />,
  <SkillsStep />,
  <ESDStep />,
  <SEDStep />,
];

export default function CalculatorPage() {
  const { state, goToStep } = useScorecard();
  const { currentStep } = state;

  return (
    <>
      <Stepper currentStep={currentStep} onClickStep={goToStep} />
      <div className="calc-page">
        <div className="calc-grid">
          <div className="calc-form-area">
            <div className="calc-form-card">
              {STEPS[currentStep] ?? <p>Unknown step.</p>}
            </div>
          </div>
          <div>
            <ScoreSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
