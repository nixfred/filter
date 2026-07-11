// Share dialog (FR008, INTERACTION_SPEC section 9): the link reproduces the
// exact run. Copy action plus native share where available.
import { useEffect, useRef, useState } from 'react';
import { COPY } from '../../content/copy';

interface Props {
  url: string;
  onClose(): void;
  onCopied(): void;
}

export function ShareDialog({ url, onClose, onCopied }: Props) {
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onCopied();
    } catch {
      // Clipboard unavailable: the input below stays selectable by hand.
    }
  }

  return (
    <div className="dialog-scrim" role="dialog" aria-modal="true" aria-labelledby="share-heading">
      <div className="dialog share-dialog">
        <h2 id="share-heading" tabIndex={-1} ref={headingRef}>
          {COPY.share.heading}
        </h2>
        <p>{COPY.share.body}</p>
        <input
          type="text"
          readOnly
          value={url}
          data-testid="share-url"
          aria-label="Share link"
          onFocus={(event) => event.target.select()}
        />
        <div className="report-actions">
          <button type="button" data-testid="copy-share" onClick={copy}>
            {copied ? COPY.share.copied : COPY.share.copy}
          </button>
          <button type="button" onClick={onClose}>
            {COPY.report.close}
          </button>
        </div>
      </div>
    </div>
  );
}
