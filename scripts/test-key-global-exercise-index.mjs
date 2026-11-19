import assert from 'node:assert/strict';
import fs from 'node:fs';

const practiceSource = fs.readFileSync(new URL('../public/calm/practice-data.js', import.meta.url), 'utf8');
const dataMatch = practiceSource.match(/window\.PRACTICE_EXERCISES\s*=\s*(\[[\s\S]*?\n\]);/);
assert(dataMatch, 'Runtime Key practice catalog is present');
const exercises = JSON.parse(dataMatch[1]);

const appSource = fs.readFileSync(new URL('../public/calm/app.js', import.meta.url), 'utf8');
const helperMatch = appSource.match(/function getGlobalExerciseIndex\(chapter, index\) \{[\s\S]*?\n  \}/);
assert(helperMatch, 'Global exercise index resolver is present');
const resolveGlobalIndex = new Function(
  'window',
  `${helperMatch[0]}\nreturn getGlobalExerciseIndex;`
)({ PRACTICE_EXERCISES: exercises });

assert.equal(exercises.length, 90, 'The runtime catalog contains 90 exercises');
for (const exercise of exercises) {
  assert.equal(
    resolveGlobalIndex(exercise.chapter, exercise.index),
    exercise.globalIndex,
    `Chapter ${exercise.chapter} exercise ${exercise.index} resolves to global exercise ${exercise.globalIndex}`
  );
}
assert.equal(resolveGlobalIndex(8, 7), 87, 'Chapter 8, exercise 7 resolves to global exercise 87');
assert.equal(resolveGlobalIndex(99, 1), null, 'Unknown chapter/local index pairs do not resolve to a wrong exercise');

console.log('PASS: all 90 chapter/local indices resolve to their correct global exercise; 8/7 → 87.');
