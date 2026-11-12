export interface NavLink { label: string; href: string }

export type ModelId = 'frontier' | 'reasoner' | 'coder' | 'open70' | 'flash'
export interface Model { id: ModelId; name: string; kind: string; color: string }

export type TaskKind = 'code' | 'extract' | 'longdoc' | 'support'
export interface Score { quality: number; cost: number; latency: number }
export interface TaskProfile {
  kind: TaskKind
  label: string
  example: string
  intent: Array<[label: string, value: string]>
  scores: Record<ModelId, Score>
}

export type Strategy = 'balanced' | 'quality' | 'cost'

export interface Outcome { title: string; body: string; proof: string }
export interface Step { title: string; body: string }
export interface ChangeLogEntry { date: string; text: string }

export type Support = 'yes' | 'no' | 'partly' | 'manual'
export interface Alternative { name: string; note: string }
export type CompareRow = [label: string, values: [Support, Support, Support, Support]]

export interface FooterColumn { title: string; links: Array<[label: string, href: string]> }
export interface FooterContent { tagline: string; columns: FooterColumn[] }

export interface Delivery {
  name: string
  summary: string
  youGet: string[]
  steps: string[]
  /** What runs where: shown as a three-part diagram */
  yourSide: { title: string; items: string[] }
  ourSide: { title: string; items: string[] }
  reaches: { title: string; items: string[] }
  code: Array<{ label: string; title: string; body: string }>
  worksWith: string[]
}
