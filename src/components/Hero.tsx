import { Container } from '../shared/Container'
import type { Model, TaskProfile } from '../types'
import { Button } from '../ui'
import { RouterConsole } from './RouterConsole'

export function Hero({ models, tasks }: { models: Model[]; tasks: TaskProfile[] }) {
  return (
    <section id="top" aria-labelledby="rb-h1" className="relative overflow-x-clip">
      <div aria-hidden className="rb-graph pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,#000_40%,transparent_85%)]" />
      {/* decorative route lines sweeping in from the edges */}
      <svg aria-hidden className="pointer-events-none absolute left-0 top-0 hidden h-[560px] w-full lg:block" viewBox="0 0 1440 560" preserveAspectRatio="none" fill="none">
        <path d="M-20 120 C 180 120, 220 300, 420 300" stroke="#6A4BFF" strokeWidth="3" strokeOpacity=".22" />
        <path d="M-20 420 C 160 420, 230 340, 420 340" stroke="#00A38C" strokeWidth="3" strokeOpacity=".22" />
        <path d="M1460 90 C 1260 90, 1220 280, 1020 280" stroke="#F2B400" strokeWidth="3" strokeOpacity=".3" />
        <path d="M1460 460 C 1280 460, 1210 330, 1020 330" stroke="#E5487D" strokeWidth="3" strokeOpacity=".22" />
      </svg>
      <Container className="relative pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-[980px] text-center">
          <p className="inline-flex animate-rise items-center gap-2.5 rounded-full border border-rb-line bg-white py-1 pl-1 pr-4 text-[13px] font-medium text-rb-muted shadow-sm motion-reduce:animate-none">
            <span className="shrink-0 whitespace-nowrap rounded-full bg-rb-orange px-2.5 py-0.5 text-[12px] font-semibold text-white">Private beta</span>
            Smart model routing for AI teams
          </p>
          <h1 id="rb-h1" className="mt-8 animate-rise font-display text-[clamp(2.9rem,7.6vw,6rem)] font-bold leading-[0.95] tracking-tightest text-rb-ink [animation-delay:80ms] motion-reduce:animate-none">
            Send the task.<br />
            <span className="relative inline-block">
              We pick the model.
              <svg aria-hidden viewBox="0 0 600 24" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full md:-bottom-3 md:h-4"><path d="M4 14 C 150 4, 300 22, 596 8" stroke="#FF5B1F" strokeWidth="6" fill="none" strokeLinecap="round" /></svg>
            </span>
          </h1>
          <p className="mx-auto mt-9 max-w-[42rem] animate-rise text-[18.5px] leading-relaxed text-rb-muted [animation-delay:160ms] motion-reduce:animate-none">
            RouteBench reads what each request is trying to do and runs it on the model that does that job best, for the least money. We benchmark every model behind the scenes, so the choice stays right as new ones ship.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap justify-center gap-3 [animation-delay:240ms] motion-reduce:animate-none">
            <Button href="#beta" size="lg" variant="orange">Request beta access</Button>
            <Button href="#demo" size="lg" variant="ghost">Try the router</Button>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] font-medium text-rb-ink2">
            {['One OpenAI-compatible endpoint', 'You set the quality floor', 'Free during the beta'].map((t) => (
              <li key={t} className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rb-orange" />{t}</li>
            ))}
          </ul>
        </div>
        <div id="demo" className="mx-auto mt-14 max-w-[1120px] scroll-mt-24 animate-rise [animation-delay:340ms] motion-reduce:animate-none md:mt-16">
          <RouterConsole models={models} tasks={tasks} />
        </div>
      </Container>
    </section>
  )
}
