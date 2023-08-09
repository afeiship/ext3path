declare var wx: any;

interface Ext3PathOptions {
  separator?: string;
  isArray?: boolean;
}

type Ext3PathOptionsResult = [string, string | string[], string];

const defaults = {
  separator: '/',
  isArray: false,
};

const ext3path = (inPath: string, inOptions?: Ext3PathOptions): Ext3PathOptionsResult => {
  const options = { ...defaults, ...inOptions };
  const parts = inPath.split(options.separator).filter(Boolean);
  if (parts.length < 3) throw new Error('path must be at least 3 parts');

  const first = parts.shift()!;
  const last = parts.pop()!;
  const mid = options.isArray ? parts : parts.join(options.separator);
  return [first, mid, last];
};

// for commonjs es5 require
if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = ext3path;
}

export default ext3path;
