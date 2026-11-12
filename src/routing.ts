import type { Model, ModelId, Strategy, TaskKind, TaskProfile } from './types'

/**
 * Demo routing logic for the hero console only. It picks from the illustrative scores in content.ts.
 * balanced: cheapest model within 2 quality points of the best
 * quality:  highest quality
 * cost:     cheapest model within 8 quality points of the best
 */
export function pickModel(task: TaskProfile, models: Model[], strategy: Strategy): ModelId {
  const entries = models.map((m) => ({ id: m.id, ...task.scores[m.id] }))
  const best = Math.max(...entries.map((e) => e.quality))
  if (strategy === 'quality') {
    return entries.reduce((a, b) => (b.quality > a.quality || (b.quality === a.quality && b.cost < a.cost) ? b : a)).id
  }
  const slack = strategy === 'balanced' ? 2 : 8
  const ok = entries.filter((e) => e.quality >= best - slack)
  return ok.reduce((a, b) => (b.cost < a.cost ? b : a)).id
}

/** Very small keyword guesser so visitors can type their own task into the demo. */
export function guessKind(text: string): TaskKind {
  const t = text.toLowerCase()
  if (/(test|bug|code|function|typescript|python|refactor|compile|stack trace|sql)/.test(t)) return 'code'
  if (/(extract|pdf|invoice|field|json|parse|table|receipt|csv|classify|tag)/.test(t)) return 'extract'
  if (/(contract|summar|report|paper|document|pages|policy|review|clause|research)/.test(t)) return 'longdoc'
  return 'support'
}

export const formatCost = (usd: number): string =>
  usd >= 0.1 ? `$${usd.toFixed(2)}` : usd >= 0.01 ? `$${usd.toFixed(3)}` : `$${usd.toFixed(4)}`
