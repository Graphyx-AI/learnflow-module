import { describe, it, expect } from 'vitest';
import { SECTIONS, SECTION_FINAL_TESTS, INITIAL_PLAYER } from '../data';

describe('Data Integrity — All 10 Sections', () => {
  it('should have exactly 10 sections', () => {
    expect(SECTIONS).toHaveLength(10);
  });

  it('all sections have unique IDs', () => {
    const ids = SECTIONS.map(s => s.id);
    expect(new Set(ids).size).toBe(10);
  });

  SECTIONS.forEach((section, sIdx) => {
    describe(`Seção ${sIdx + 1}: ${section.title}`, () => {
      it('has required fields', () => {
        expect(section.id).toBeTruthy();
        expect(section.label).toBeTruthy();
        expect(section.title).toBeTruthy();
        expect(section.lessons).toBeDefined();
        expect(Array.isArray(section.lessons)).toBe(true);
      });

      it('has at least 3 lessons', () => {
        expect(section.lessons.length).toBeGreaterThanOrEqual(3);
      });

      section.lessons.forEach((lesson, lIdx) => {
        describe(`Lição ${lIdx + 1}: ${lesson.title}`, () => {
          it('has required fields', () => {
            expect(lesson.icon).toBeTruthy();
            expect(lesson.title).toBeTruthy();
            expect(lesson.description).toBeTruthy();
            expect(lesson.topics.length).toBeGreaterThanOrEqual(1);
          });

          it('has at least 4 questions', () => {
            expect(lesson.questions.length).toBeGreaterThanOrEqual(4);
          });

          lesson.questions.forEach((q, qIdx) => {
            it(`Question ${qIdx + 1} is valid`, () => {
              expect(q.text).toBeTruthy();
              expect(q.options).toHaveLength(4);
              expect(q.correctIndex).toBeGreaterThanOrEqual(0);
              expect(q.correctIndex).toBeLessThan(4);
              expect(q.explanation).toBeTruthy();
              expect(q.icon).toBeTruthy();
              expect(q.category).toBeTruthy();
              expect(['Fácil', 'Médio', 'Difícil']).toContain(q.difficulty);
            });
          });

          it('does NOT have all answers as the same index', () => {
            const indices = lesson.questions.map(q => q.correctIndex);
            const unique = new Set(indices);
            expect(unique.size).toBeGreaterThan(1);
          });
        });
      });
    });
  });
});

describe('Section Final Tests', () => {
  SECTIONS.forEach(section => {
    it(`${section.id} has a final test`, () => {
      const test = SECTION_FINAL_TESTS[section.id];
      expect(test).toBeDefined();
      expect(test.length).toBeGreaterThanOrEqual(5);
    });

    it(`${section.id} final test questions are valid`, () => {
      const test = SECTION_FINAL_TESTS[section.id];
      test.forEach(q => {
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.text).toBeTruthy();
        expect(q.explanation).toBeTruthy();
      });
    });

    it(`${section.id} final test has diverse answers`, () => {
      const test = SECTION_FINAL_TESTS[section.id];
      const indices = test.map(q => q.correctIndex);
      const unique = new Set(indices);
      expect(unique.size).toBeGreaterThan(1);
    });
  });
});

describe('Initial Player State', () => {
  it('has all required fields', () => {
    expect(INITIAL_PLAYER.xp).toBeDefined();
    expect(INITIAL_PLAYER.streak).toBeDefined();
    expect(INITIAL_PLAYER.level).toBeDefined();
    expect(INITIAL_PLAYER.levelTitle).toBeTruthy();
    expect(INITIAL_PLAYER.currentXp).toBeDefined();
    expect(INITIAL_PLAYER.nextLevelXp).toBeGreaterThan(0);
    expect(INITIAL_PLAYER.completedLessons).toEqual([]);
    expect(INITIAL_PLAYER.sectionProgress).toEqual({});
    expect(INITIAL_PLAYER.chestsOpened).toEqual({});
    expect(INITIAL_PLAYER.testsCompleted).toEqual({});
    expect(INITIAL_PLAYER.perfectLessons).toEqual({});
  });
});
