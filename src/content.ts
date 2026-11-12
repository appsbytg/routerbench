import type { FaqItem } from './shared/Accordion'
import type { Alternative, ChangeLogEntry, CompareRow, Delivery, FooterContent, Model, NavLink, Outcome, Step, TaskProfile } from './types'

// All copy and demo data for RouteBench. Model names and benchmark numbers are illustrative
// placeholders: swap in real catalogue data before launch.

export const nav: NavLink[] = [
  { label: 'What you get', href: '#get' },
  { label: 'How it works', href: '#how' },
  { label: 'The bench', href: '#bench' },
  { label: 'Savings', href: '#savings' },
  { label: 'How to use it', href: '#delivery' },
]

export const models: Model[] = [
  { id: 'frontier', name: 'Frontier XL', kind: 'Largest general model', color: '#6A4BFF' },
  { id: 'reasoner', name: 'Reasoner', kind: 'Long-context reasoning', color: '#1D8CF0' },
  { id: 'coder', name: 'Coder Pro', kind: 'Code specialist', color: '#00A38C' },
  { id: 'open70', name: 'Open 70B', kind: 'Open-weights, multilingual', color: '#F2B400' },
  { id: 'flash', name: 'Flash Mini', kind: 'Small and fast', color: '#E5487D' },
]

export const BASELINE: Model['id'] = 'frontier'

export const tasks: TaskProfile[] = [
  {
    kind: 'code', label: 'Fix a failing test', example: 'Fix the failing TypeScript test in our checkout service',
    intent: [['Task', 'Code repair'], ['Difficulty', 'High'], ['Context', '18k tokens'], ['Needs', 'Correctness over speed']],
    scores: {
      frontier: { quality: 95, cost: 0.042, latency: 9.8 }, reasoner: { quality: 91, cost: 0.018, latency: 7.1 },
      coder: { quality: 96, cost: 0.009, latency: 4.2 }, open70: { quality: 78, cost: 0.003, latency: 3.0 }, flash: { quality: 61, cost: 0.0008, latency: 1.1 },
    },
  },
  {
    kind: 'extract', label: 'Extract invoice fields', example: 'Pull the invoice number, total and due date from 3,000 PDFs',
    intent: [['Task', 'Structured extraction'], ['Difficulty', 'Low'], ['Volume', '3,000 requests'], ['Needs', 'Valid JSON, low cost']],
    scores: {
      frontier: { quality: 98, cost: 0.015, latency: 3.9 }, reasoner: { quality: 97, cost: 0.007, latency: 3.1 },
      coder: { quality: 93, cost: 0.004, latency: 2.2 }, open70: { quality: 95, cost: 0.0012, latency: 1.6 }, flash: { quality: 97, cost: 0.0003, latency: 0.6 },
    },
  },
  {
    kind: 'longdoc', label: 'Review a contract', example: 'Summarise a 60-page vendor contract and flag risky clauses',
    intent: [['Task', 'Long-document analysis'], ['Difficulty', 'Medium-high'], ['Context', '92k tokens'], ['Needs', 'Careful reading']],
    scores: {
      frontier: { quality: 93, cost: 0.31, latency: 24 }, reasoner: { quality: 92, cost: 0.11, latency: 19 },
      coder: { quality: 80, cost: 0.07, latency: 12 }, open70: { quality: 74, cost: 0.03, latency: 10 }, flash: { quality: 55, cost: 0.008, latency: 4 },
    },
  },
  {
    kind: 'support', label: 'Answer a customer', example: 'Reply to a customer asking about a late refund, in Spanish',
    intent: [['Task', 'Support reply'], ['Language', 'Spanish'], ['Difficulty', 'Low'], ['Needs', 'Fast, friendly tone']],
    scores: {
      frontier: { quality: 94, cost: 0.009, latency: 3.2 }, reasoner: { quality: 92, cost: 0.005, latency: 2.8 },
      coder: { quality: 84, cost: 0.003, latency: 1.9 }, open70: { quality: 93, cost: 0.0011, latency: 1.2 }, flash: { quality: 86, cost: 0.0003, latency: 0.5 },
    },
  },
]

export const providers: string[] = [
  'Anthropic', 'OpenAI', 'Google Gemini', 'Meta Llama', 'Mistral', 'DeepSeek', 'Qwen', 'Cohere', 'xAI', 'Amazon Nova', 'Microsoft Phi', 'AI21',
]

export const outcomes: Outcome[] = [
  { title: 'A smaller bill for the same answers', body: 'Most requests don’t need your most expensive model. RouteBench sends each one to the cheapest model that meets your quality bar, and keeps the big models for the work that needs them.', proof: 'Code repair example: 79% cheaper, +1 quality' },
  { title: 'No more picking models', body: 'Stop rewriting prompts and configs every time a new model ships. Send the task; the choice of model is ours to keep right.', proof: 'model: "auto"' },
  { title: 'Always the current best', body: 'We benchmark every model in the catalogue on real task types, all the time. When a better or cheaper model appears, your traffic moves to it without a deploy.', proof: 'Catalogue re-benchmarked weekly' },
  { title: 'One endpoint, every provider', body: 'A single OpenAI-compatible API with automatic fallback when a provider is slow or down. Change one line to switch over.', proof: '1 base URL · 12+ providers' },
]

export const steps: Step[] = [
  { title: 'Send the task', body: 'Call one endpoint the way you already call an LLM, with model set to auto. Add a quality floor or a cost ceiling if you want one.' },
  { title: 'We read what it is', body: 'RouteBench works out what the request is trying to do, how hard it is and what matters most, in a few milliseconds.' },
  { title: 'The best fit answers', body: 'The request runs on the model that scores best for that kind of task at the lowest cost, with a fallback ready if it fails.' },
]

export const changelog: ChangeLogEntry[] = [
  { date: 'Nov 7', text: 'Flash Mini v2 added. Now first pick for extraction: same accuracy, 40% cheaper.' },
  { date: 'Nov 4', text: 'Coder Pro overtook Frontier XL on code repair after its latest update.' },
  { date: 'Oct 30', text: 'Open 70B moved up for Spanish and Portuguese support replies.' },
  { date: 'Oct 26', text: 'Reasoner context window raised to 200k; long-document routes updated.' },
]

export const alternatives: Alternative[] = [
  { name: 'Always the top model', note: 'One big model for everything' },
  { name: 'Hand-written rules', note: '“If it’s short, use the small one”' },
  { name: 'Plain gateway', note: 'One API, you pick the model' },
  { name: 'RouteBench', note: 'Picks per task from live benchmarks' },
]

export const compareRows: CompareRow[] = [
  ['Chooses a model for every request', ['no', 'partly', 'no', 'yes']],
  ['Based on fresh benchmark results', ['no', 'no', 'no', 'yes']],
  ['Cuts cost without losing quality', ['no', 'partly', 'no', 'yes']],
  ['Moves to new models automatically', ['no', 'no', 'no', 'yes']],
  ['One API across providers', ['no', 'no', 'yes', 'yes']],
  ['Fallback when a provider fails', ['no', 'manual', 'yes', 'yes']],
  ['Nothing for your team to maintain', ['yes', 'no', 'partly', 'yes']],
]

export const faqs: FaqItem[] = [
  { q: 'How does RouteBench decide which model to use?', a: 'It reads each request, works out what kind of task it is, and checks our latest benchmark results for that task type against your quality and cost settings. We share the details of our method with beta teams.' },
  { q: 'Will quality drop?', a: 'You set the floor. By default RouteBench only picks a cheaper model when it scores within two points of the best one for that task. You can raise the floor, or pin a model for any route.' },
  { q: 'Which models are in the catalogue?', a: 'Frontier and open-weights models from the major providers. We add new models as they ship, benchmark them, and only route to them once they’ve earned it.' },
  { q: 'Does it add latency?', a: 'Choosing a route takes a few milliseconds. Because smaller models are often faster, many requests come back sooner than they did before.' },
  { q: 'Do you store my prompts?', a: 'Not by default. Requests pass through to the chosen provider and aren’t kept or used for training. Logging is opt-in, per project.' },
  { q: 'Can I try it without changing production?', a: 'Yes. Point a test environment, or a small slice of your traffic, at RouteBench first. Every response says which model answered and what it cost, so you can compare before you switch everything.' },
  { q: 'Do I keep my own provider accounts?', a: 'Yes. Add your provider keys and pay them directly at list price, or let us handle billing across providers. Either way, every response says which model answered and what it cost.' },
  { q: 'What does the beta cost?', a: 'Routing is free during the beta. We’ll set pricing with beta teams before general availability.' },
]

export const footer: FooterContent = {
  tagline: 'Send the task. We pick the model.',
  columns: [
    { title: 'Product', links: [['What you get', '#get'], ['How it works', '#how'], ['The bench', '#bench'], ['How to use it', '#delivery']] },
    { title: 'Beta', links: [['Join the beta', '#beta'], ['FAQ', '#faq']] },
    { title: 'Company', links: [['About', '#top'], ['Contact', '#beta']] },
  ],
}

export const delivery: Delivery = {
  name: 'Hosted API',
  summary: 'RouteBench runs as a service on our servers. Your app calls one OpenAI-compatible endpoint; we pick the model, call the provider and send the answer back.',
  youGet: [
    'One API key and one endpoint for every provider in the catalogue',
    'Works with the OpenAI SDKs and any HTTP client',
    'Automatic fallback when a provider is slow or down',
    'Quality floors, cost caps and pinned models per route',
    'A dashboard with spend, savings and the model behind every request',
  ],
  steps: [
    'Create an API key, then add your provider keys or use our unified billing',
    'Point your client’s base URL at RouteBench',
    'Set model to "auto". Every response says which model answered and what it cost',
  ],
  yourSide: { title: 'Your side', items: ['Your app or agent', 'OpenAI SDK or any HTTP client'] },
  ourSide: { title: 'RouteBench (our cloud)', items: ['Reads the task', 'Picks the model from live benchmarks', 'Calls it, with fallback', 'Logs cost and savings'] },
  reaches: { title: 'Model providers', items: ['Anthropic', 'OpenAI', 'Google', 'Mistral', 'and more'] },
  code: [
    {
      label: 'Python',
      title: 'app.py (OpenAI SDK)',
      body: `from openai import OpenAI

client = OpenAI(base_url=ROUTEBENCH_URL, api_key=ROUTEBENCH_KEY)

reply = client.chat.completions.create(
    model="auto",                     # RouteBench picks
    messages=[{"role": "user", "content": task}],
    extra_headers={"x-quality-floor": "2"},
)
print(reply.model)                    # e.g. "coder-pro"`,
    },
    {
      label: 'TypeScript',
      title: 'app.ts (OpenAI SDK)',
      body: `import OpenAI from 'openai'

const client = new OpenAI({ baseURL: ROUTEBENCH_URL, apiKey: ROUTEBENCH_KEY })

const reply = await client.chat.completions.create({
  model: 'auto',                      // RouteBench picks
  messages: [{ role: 'user', content: task }],
}, { headers: { 'x-quality-floor': '2' } })`,
    },
    {
      label: 'curl',
      title: 'any HTTP client',
      body: `curl $ROUTEBENCH_URL/chat/completions \\
  -H "Authorization: Bearer $ROUTEBENCH_KEY" \\
  -H "x-quality-floor: 2" \\
  -d '{"model":"auto","messages":[{"role":"user","content":"..."}]}'`,
    },
  ],
  worksWith: ['OpenAI SDK (Python, Node)', 'Vercel AI SDK', 'LangChain', 'LlamaIndex', 'any HTTP client'],
}
