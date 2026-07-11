// Education drawer (FR012, BR003): a non modal drawer with the field guide
// sections. Lazy imported so its content does not weigh on the initial bundle
// (NFR003).
import { useEffect, useRef, useState } from 'react';
import { EDUCATION } from '../../content/education';

interface Props {
  onClose(): void;
}

export function EducationDrawer({ onClose }: Props) {
  const [openId, setOpenId] = useState<string>(EDUCATION[0].id);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <aside className="drawer education" aria-labelledby="education-heading">
      <div className="drawer-head">
        <h2 id="education-heading" tabIndex={-1} ref={headingRef}>
          Field guide
        </h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="education-sections">
        {EDUCATION.map((section) => (
          <section key={section.id}>
            <h3>
              <button
                type="button"
                className="education-toggle"
                aria-expanded={openId === section.id}
                data-testid={`education-${section.id}`}
                onClick={() => setOpenId(openId === section.id ? '' : section.id)}
              >
                {section.title}
              </button>
            </h3>
            {openId === section.id
              ? section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="education-paragraph">
                    {paragraph}
                  </p>
                ))
              : null}
          </section>
        ))}
      </div>
    </aside>
  );
}
