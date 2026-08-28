import { Navbar } from '../components/landing/Navbar'
import { Hero } from '../components/landing/Hero'
import { ProblemSection } from '../components/landing/ProblemSection'
import { SolutionSection } from '../components/landing/SolutionSection'
import { InvestigationSection } from '../components/landing/InvestigationSection'
import { PolicySection } from '../components/landing/PolicySection'
import { ProductShowcase } from '../components/landing/ProductShowcase'
import { HumanApprovalSection } from '../components/landing/HumanApprovalSection'
import { SafetySection } from '../components/landing/SafetySection'
import { TrueForgeSection } from '../components/landing/TrueForgeSection'
import { ExecutionTrace } from '../components/landing/ExecutionTrace'
import { AuditSection } from '../components/landing/AuditSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { CorePrinciple } from '../components/landing/CorePrinciple'
import { FinalCta } from '../components/landing/FinalCta'
import { Footer } from '../components/landing/Footer'
import './landing.css'

export function LandingPage() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <InvestigationSection />
      <PolicySection />
      <ProductShowcase />
      <HumanApprovalSection />
      <SafetySection />
      <TrueForgeSection />
      <ExecutionTrace />
      <AuditSection />
      <FeaturesSection />
      <CorePrinciple />
      <FinalCta />
      <Footer />
    </div>
  )
}
