import { getCountryMeta, getEducationCatalog } from '../src/store/educationCatalog';

describe('education catalog helpers', () => {
  test('getCountryMeta returns UK meta', () => {
    const meta = getCountryMeta('GB');
    expect(meta).toBeDefined();
    expect(meta.name).toMatch(/United Kingdom/);
    expect(meta.flag).toBe('🇬🇧');
  });

  test('GB catalog has uni category and config', () => {
    const c = getEducationCatalog('GB');
    expect(c).toBeDefined();
    expect(c.config).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });
});
