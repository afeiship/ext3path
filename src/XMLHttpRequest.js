(function (nx, global) {

  nx.declare('nx.net.XMLHttpRequest', {
    statics: {
      init: function () {
        this.normalize();
      },
      exist: function () {
        return !!global.XMLHttpRequest;
      },
      normalize: function () {
        if (this.exist()) {
          global.XMLHttpRequest = function () {
            return new global.ActiveXObject(navigator.userAgent.indexOf('MSIE 5') >= 0 ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP');
          };
        }
      }
    },
    methods: {
      init: function () {
        return new global.XMLHttpRequest();
      }
    }
  });

}(nx, nx.GLOBAL));
