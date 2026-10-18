import Accordion from '../components/Accordion'
import Reveal from '../components/Reveal'
import { researchAreas } from '../data/portfolio'

/**
 * "Research": the five research areas as a numbered accordion, over a giant
 * dim billboard word. The billboard is texture, not content — the eyebrow `<h2>`
 * is what names the section for assistive technology.
 */
export default function Research() {
  return (
    <section id="research" className="shell section research">
      <Reveal>
        <h2 className="eyebrow">Research areas</h2>
      </Reveal>

      <div className="research__stage">
        <p className="display research__billboard" aria-hidden="true">
          Research
        </p>

        <Reveal className="research__rows" delay={60}>
          <Accordion
            label="Research areas"
            defaultOpenId={researchAreas[0].id}
            items={researchAreas.map((area) => ({
              id: area.id,
              index: area.index,
              title: area.title,
              content: (
                <ul className="research__bullets">
                  {area.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ),
            }))}
          />
        </Reveal>
      </div>
    </section>
  )
}
