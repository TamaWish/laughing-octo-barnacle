import { getEducationCatalog } from '../src/store/educationCatalog';

describe('getEducationCatalog', () => {
  test('returns US catalog for unknown code fallback', () => {
    const c = getEducationCatalog('ZZ');
    expect(c).toBeDefined();
    expect(c.categories.length).toBeGreaterThan(0);
  });

  test('returns GB catalog when requested', () => {
    const c = getEducationCatalog('GB');
    expect(c).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });

  test('US courses require correct ages', () => {
    const usCatalog = getEducationCatalog('US');
    // Post-secondary courses (cc, uni, voc, online) should require age 18
    const postSecondaryCourses = [
      ...usCatalog.courses.cc,
      ...usCatalog.courses.uni,
      ...usCatalog.courses.voc,
      ...usCatalog.courses.online,
    ];
    postSecondaryCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // Graduate courses should require age 22
    const gradCourses = [...usCatalog.courses.grad, ...usCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });

  test('GB courses require correct ages', () => {
    const gbCatalog = getEducationCatalog('GB');
    // Post-secondary courses should require age 16 (since secondary ends at 16)
    const postSecondaryCourses = [
      ...gbCatalog.courses.uni,
      ...gbCatalog.courses.voc,
      ...gbCatalog.courses.online,
    ];
    postSecondaryCourses.forEach(course => {
      expect(course.requiredAge).toBe(16);
    });
    // Graduate courses should require age 22
    const gradCourses = [...gbCatalog.courses.grad, ...gbCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });

  test('returns CA catalog when requested', () => {
    const c = getEducationCatalog('CA');
    expect(c).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });

  test('CA courses require correct ages', () => {
    const caCatalog = getEducationCatalog('CA');
    // Post-secondary courses should require age 18
    const postSecondaryCourses = [
      ...caCatalog.courses.cc,
      ...caCatalog.courses.uni,
      ...caCatalog.courses.voc,
      ...caCatalog.courses.online,
    ];
    postSecondaryCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // Graduate courses should require age 22
    const gradCourses = [...caCatalog.courses.grad, ...caCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });

  test('returns AU catalog when requested', () => {
    const c = getEducationCatalog('AU');
    expect(c).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });

  test('AU courses require correct ages', () => {
    const auCatalog = getEducationCatalog('AU');
    // Post-secondary courses should require age 18
    const postSecondaryCourses = [
      ...auCatalog.courses.cc,
      ...auCatalog.courses.uni,
      ...auCatalog.courses.voc,
      ...auCatalog.courses.online,
    ];
    postSecondaryCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // Graduate courses should require age 22
    const gradCourses = [...auCatalog.courses.grad, ...auCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });

  test('returns JP catalog when requested', () => {
    const c = getEducationCatalog('JP');
    expect(c).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });

  test('JP courses require correct ages', () => {
    const jpCatalog = getEducationCatalog('JP');
    // Most post-secondary courses should require age 18
    const postSecondaryCourses = [
      ...jpCatalog.courses.cc,
      ...jpCatalog.courses.uni,
      ...jpCatalog.courses.online,
    ];
    postSecondaryCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // KOSEN vocational can start at 15
    const kosenCourses = jpCatalog.courses.voc.filter(course => course.id === 'voc-kosen');
    kosenCourses.forEach(course => {
      expect(course.requiredAge).toBe(15);
    });
    // Graduate courses should require age 22
    const gradCourses = [...jpCatalog.courses.grad, ...jpCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });

  test('returns IN catalog when requested', () => {
    const c = getEducationCatalog('IN');
    expect(c).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });

  test('IN courses require correct ages', () => {
    const inCatalog = getEducationCatalog('IN');
    // Polytechnic can start at 15
    const polyCourses = inCatalog.courses.cc.filter(course => course.id === 'in-polytech');
    polyCourses.forEach(course => {
      expect(course.requiredAge).toBe(15);
    });
    // University courses should require age 18
    const uniCourses = [...inCatalog.courses.uni, ...inCatalog.courses.voc, ...inCatalog.courses.online];
    uniCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // Graduate courses should require age 22
    const gradCourses = [...inCatalog.courses.grad, ...inCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });

  test('returns DE catalog when requested', () => {
    const c = getEducationCatalog('DE');
    expect(c).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });

  test('DE courses require correct ages', () => {
    const deCatalog = getEducationCatalog('DE');
    // Ausbildung can start at 15
    const ausbildungCourses = deCatalog.courses.cc.filter(course => course.id === 'de-ausbildung');
    ausbildungCourses.forEach(course => {
      expect(course.requiredAge).toBe(15);
    });
    // University courses should require age 18
    const uniCourses = [...deCatalog.courses.uni, ...deCatalog.courses.online];
    uniCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // Meister vocational requires age 18
    const meisterCourses = deCatalog.courses.voc.filter(course => course.id === 'voc-meister');
    meisterCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // Graduate courses should require age 22
    const gradCourses = [...deCatalog.courses.grad, ...deCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });

  test('returns FR catalog when requested', () => {
    const c = getEducationCatalog('FR');
    expect(c).toBeDefined();
    const ids = c.categories.map((x) => x.id);
    expect(ids).toContain('uni');
  });

  test('FR courses require correct ages', () => {
    const frCatalog = getEducationCatalog('FR');
    // Post-secondary courses should require age 18
    const postSecondaryCourses = [
      ...frCatalog.courses.cc,
      ...frCatalog.courses.uni,
      ...frCatalog.courses.voc,
      ...frCatalog.courses.online,
    ];
    postSecondaryCourses.forEach(course => {
      expect(course.requiredAge).toBe(18);
    });
    // Graduate courses should require age 22
    const gradCourses = [...frCatalog.courses.grad, ...frCatalog.courses.bus];
    gradCourses.forEach(course => {
      expect(course.requiredAge).toBe(22);
    });
  });
});
