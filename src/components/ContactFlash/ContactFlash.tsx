// Contact celebration (BR004, UX002): when two civilizations make contact,
// the rarest event in the model, a glowing notice rises and fades. Contact is
// rare enough to feel consequential. Suppressed in reduced motion, where the
// live region and ledger carry the moment instead (FR029, ACC003).
import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Rising count of confirmed contacts revealed so far. */
  contactCount: number;
  reducedMotion: boolean;
}

export function ContactFlash({ contactCount, reducedMotion }: Props) {
  const [visible, setVisible] = useState(false);
  const seen = useRef(contactCount);

  useEffect(() => {
    if (contactCount > seen.current && !reducedMotion) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3200);
      seen.current = contactCount;
      return () => clearTimeout(timer);
    }
    seen.current = contactCount;
    return undefined;
  }, [contactCount, reducedMotion]);

  if (!visible) return null;

  return (
    <div className="contact-flash" data-testid="contact-flash" aria-hidden="true">
      <div className="contact-flash-glow" />
      <p className="contact-flash-title">Contact</p>
      <p className="contact-flash-sub">Two civilizations found each other across the dark.</p>
    </div>
  );
}
