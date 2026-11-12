import { useState, type ReactNode } from 'react'
import { cx } from '../shared/cx'
import { Section, SectionHeading } from '../ui'
import { trackDemo } from '../shared/analytics'

type Lang = 'Python' | 'TypeScript' | 'curl'

const K = ({ children }: { children: string }) => <span className="text-[#C3A6FF]">{children}</span>
const S = ({ children }: { children: string }) => <span className="text-[#7EE2C9]">{children}</span>
const C = ({ children }: { children: ReactNode }) => <span className="text-white/40">{children}</span>

const snippets: Record<Lang, ReactNode> = {
  Python: (
    <>
      <K>from</K> openai <K>import</K> OpenAI{'\n\n'}
      client = OpenAI(base_url=ROUTEBENCH_URL, api_key=ROUTEBENCH_KEY){'\n\n'}
      reply = client.chat.completions.create({'\n'}
      {'    '}model=<S>"auto"</S>,{'                 '}<C># RouteBench picks</C>{'\n'}
      {'    '}messages=[{'{'}<S>"role"</S>: <S>"user"</S>, <S>"content"</S>: task{'}'}],{'\n'}
      {'    '}extra_headers={'{'}<S>"x-quality-floor"</S>: <S>"2"</S>{'}'},{'\n'}
      ){'\n'}
      print(reply.model)<C>{'             '}# e.g. "coder-pro"</C>
    </>
  ),
  TypeScript: (
    <>
      <K>import</K> OpenAI <K>from</K> <S>'openai'</S>{'\n\n'}
      <K>const</K> client = <K>new</K> OpenAI({'{'} baseURL: ROUTEBENCH_URL, apiKey: ROUTEBENCH_KEY {'}'}){'\n\n'}
      <K>const</K> reply = <K>await</K> client.chat.completions.create({'{'}{'\n'}
      {'  '}model: <S>'auto'</S>,{'                  '}<C>// RouteBench picks</C>{'\n'}
      {'  '}messages: [{'{'} role: <S>'user'</S>, content: task {'}'}],{'\n'}
      {'}'}, {'{'} headers: {'{'} <S>'x-quality-floor'</S>: <S>'2'</S> {'}'} {'}'}){'\n'}
    </>
  ),
  curl: (
    <>
      curl $ROUTEBENCH_URL/chat/completions \{'\n'}
      {'  '}-H <S>"Authorization: Bearer $ROUTEBENCH_KEY"</S> \{'\n'}
      {'  '}-H <S>"x-quality-floor: 2"</S> \{'\n'}
      {'  '}-d <S>{`'{"model":"auto","messages":[{"role":"user","content":"..."}]}'`}</S>
    </>
  ),
}

export function CodeSnippet() {
  const [lang, setLang] = useState<Lang>('Python')
  return (
    <Section id="code" label="Integration">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <div>
          <SectionHeading eyebrow="Two-line switch" title="Change your base URL. Set the model to auto." lede="RouteBench speaks the OpenAI API, so the SDKs and frameworks you already use keep working. Every response tells you which model answered and what it cost." />
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl bg-rb-night shadow-[0_30px_70px_-30px_rgba(12,14,20,.7)]">
          <div role="tablist" aria-label="Language" className="flex gap-1 border-b border-white/10 p-2">
            {(Object.keys(snippets) as Lang[]).map((l) => (
              <button key={l} role="tab" type="button" aria-selected={lang === l} onClick={() => { setLang(l); trackDemo('code_tab', { language: l }) }}
                className={cx('rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition', lang === l ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white')}>{l}</button>
            ))}
          </div>
          <pre className="overflow-x-auto p-6 font-mono text-[13.5px] leading-7 text-white/90"><code>{snippets[lang]}</code></pre>
        </div>
      </div>
    </Section>
  )
}
