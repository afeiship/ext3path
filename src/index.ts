declare var wx: any;

const Ext3path = (): void => {
  console.log('hello');
};

// for commonjs es5 require
if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = Ext3path;
}

export default Ext3path;
