import { describe, expect, it } from 'vitest';
import { EDUCATION } from '../../../src/content/education';

// Education content honesty and voice (FR012, BR003, UX003).
describe('education content', () => {
  it('covers the seven required topics from the packet', () => {
    const ids = EDUCATION.map((s) => s.id);
    expect(ids).toEqual([
      'fermi',
      'great-filter',
      'civilization',
      'contact',
      'assumptions',
      'sources',
      'about',
    ]);
  });

  it('never claims to solve the Fermi paradox and never states a model choice as fact (BR003)', () => {
    const all = EDUCATION.flatMap((s) => s.paragraphs)
      .join(' ')
      .toLowerCase();
    expect(all).not.toContain('proves');
    expect(all).not.toContain('this settles');
    // The assumptions section must explicitly frame the model as a model.
    const assumptions = EDUCATION.find((s) => s.id === 'assumptions');
    expect(assumptions?.paragraphs.join(' ')).toContain('a model, not a measurement');
  });

  it('uses no em or en dash anywhere (UX003)', () => {
    for (const section of EDUCATION) {
      for (const paragraph of section.paragraphs) {
        expect(paragraph).not.toMatch(/[‒-―−]/);
      }
    }
  });

  it('has substantive content in every section', () => {
    for (const section of EDUCATION) {
      expect(section.paragraphs.length).toBeGreaterThanOrEqual(2);
      for (const paragraph of section.paragraphs) {
        expect(paragraph.length).toBeGreaterThan(80);
      }
    }
  });
});
