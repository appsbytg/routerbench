import * as c from './content'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProviderStrip } from './components/ProviderStrip'
import { Outcomes } from './components/Outcomes'
import { HowItWorks } from './components/HowItWorks'
import { Bench } from './components/Bench'
import { Savings } from './components/Savings'
import { Controls } from './components/Controls'
import { Compare } from './components/Compare'
import { Delivery } from './components/Delivery'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded-full bg-rb-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Nav links={c.nav} />
      <main id="main">
        <Hero models={c.models} tasks={c.tasks} />
        <ProviderStrip items={c.providers} />
        <Outcomes items={c.outcomes} />
        <HowItWorks steps={c.steps} />
        <Bench models={c.models} tasks={c.tasks} changelog={c.changelog} />
        <Savings />
        <Controls />
        <Compare alternatives={c.alternatives} rows={c.compareRows} />
        <Delivery content={c.delivery} />
        <Faq items={c.faqs} />
        <FinalCta />
      </main>
      <Footer content={c.footer} />
    </>
  )
}
