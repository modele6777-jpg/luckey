import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculateSamjaeGyoUn} from '../src/lib/divination/samjaeGyoUnEngine';
const profile={basic:{birthdate:'2000-08-16',birthtime:'04:00',gender:'female' as const,birthCity:'서울'}};
test('transition tracking preserves the actual current and future daewoon after crossing',()=>{
 const anchor=calculateSamjaeGyoUn({profile,targetYear:2026}).gyoUn.nextDaewoon!.startYear;
 for(const year of [anchor-2,anchor-1,anchor,anchor+1]){
  const report=calculateSamjaeGyoUn({profile,targetYear:year});
  const g=report.gyoUn;
  assert.equal(g.isGyoUnPeriod,true);
  assert.ok(g.currentDaewoon!.startYear<=year&&g.currentDaewoon!.endYear>=year);
  assert.ok(!g.nextDaewoon||g.nextDaewoon.startYear>year);
  assert.equal(g.transitionToDaewoon!.startYear,anchor);
 }
});
