import fn from '../src';

describe('api.basic', () => {
  test('normal path shoud work', () => {
    const p1 = '/wxcomponents/antui/lib/tag/index';
    const p2 = 'wxcomponents/weui/tag/index';
    const res1 = fn(p1);
    const res2 = fn(p2);
    expect(res1).toEqual(['wxcomponents', 'antui/lib/tag', 'index']);
    expect(res2).toEqual(['wxcomponents', 'weui/tag', 'index']);
  });

  test('path result use array', () => {
    const p1 = '/wxcomponents/antui/lib/tag/index';
    const res1 = fn(p1, { isArray: true });
    expect(res1).toEqual(['wxcomponents', ['antui', 'lib', 'tag'], 'index']);
  });

  test('special separator `.`', () => {
    const p1 = 'wxcomponents.antui.lib.tag.index';
    const res1 = fn(p1, { separator: '.' });
    expect(res1).toEqual(['wxcomponents', 'antui.lib.tag', 'index']);
  });

  test('wrong case', ()=>{
    const p1 = '/var/abc';
    expect(()=>fn(p1)).toThrowError('path must be at least 3 parts');
  })
});
