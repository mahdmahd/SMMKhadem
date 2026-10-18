import type { ReactNode } from 'react'
import { useId, useState } from 'react'

export type AccordionItem = {
  /** Stable id, unique within the accordion — used for the aria wiring. */
  id: string
  /** Display number, zero-padded (`01`, `02`, …). */
  index: string
  title: string
  content: ReactNode
}

export type AccordionProps = {
  items: AccordionItem[]
  /** Item open on first render. Omit to start fully collapsed. */
  defaultOpenId?: string
  /** Accessible name for the group of rows. */
  label?: string
}

/**
 * Numbered accordion with a single open row.
 *
 * The trigger is a real `<button>` carrying `aria-expanded`/`aria-controls`,
 * and every panel is a labelled `region` that is `hidden` while collapsed, so
 * the rows work with a keyboard and a screen reader without extra ARIA. Clicking
 * the open row collapses it; opening another closes the previous one.
 */
export default function Accordion({ items, defaultOpenId, label }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null)
  const groupId = useId()

  return (
    <div className="accordion" role="group" aria-label={label}>
      {items.map((item) => {
        const open = item.id === openId
        const triggerId = `${groupId}-${item.id}-trigger`
        const panelId = `${groupId}-${item.id}-panel`

        return (
          <div key={item.id} className="accordion__item" data-open={open ? '' : undefined}>
            <h3 className="accordion__heading">
              <button
                type="button"
                id={triggerId}
                className="accordion__trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => {
                  setOpenId(open ? null : item.id)
                }}
              >
                <span className="accordion__index">{item.index}</span>
                <span className="accordion__title">{item.title}</span>
                <span className="accordion__marker" aria-hidden="true">
                  {open ? '−' : '+'}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              className="accordion__panel"
              role="region"
              aria-labelledby={triggerId}
              hidden={!open}
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
