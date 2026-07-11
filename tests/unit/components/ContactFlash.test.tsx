import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactFlash } from '../../../src/components/ContactFlash/ContactFlash';

// The contact celebration (BR004): appears when the contact count rises,
// suppressed under reduced motion.
describe('ContactFlash', () => {
  it('is hidden until a new contact is revealed', () => {
    const { rerender } = render(<ContactFlash contactCount={0} reducedMotion={false} />);
    expect(screen.queryByTestId('contact-flash')).toBeNull();
    rerender(<ContactFlash contactCount={1} reducedMotion={false} />);
    expect(screen.getByTestId('contact-flash')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('stays hidden under reduced motion', () => {
    const { rerender } = render(<ContactFlash contactCount={0} reducedMotion={true} />);
    rerender(<ContactFlash contactCount={1} reducedMotion={true} />);
    expect(screen.queryByTestId('contact-flash')).toBeNull();
  });

  it('does not flash when the count resets downward (a new run)', () => {
    const { rerender } = render(<ContactFlash contactCount={3} reducedMotion={false} />);
    rerender(<ContactFlash contactCount={0} reducedMotion={false} />);
    expect(screen.queryByTestId('contact-flash')).toBeNull();
  });
});
