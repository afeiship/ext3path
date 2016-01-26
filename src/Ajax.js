(function (nx, global) {

  var supportXMLHttpRequest = !!global.XMLHttpRequest;

  var Ajax = nx.declare('nx.net.Ajax', {
    statics: {
      create: function () {
        return supportXMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      },
      onreadystatechange: function (func, _xhr) {
        _xhr.onreadystatechange = function () {
          if (_xhr.readyState == 4) {
            if (_xhr.status == 200) {
              func(_xhr.responseText);
            }
          }
        }
      }
    },
    methods: {
      init: function () {
        this.xhr = Ajax.create();
      },
      get: function (inUrl, inCallback) {
        this.xhr.open('get', inUrl);
        this.onreadystatechange(inCallback, this.xhr);
        this.xhr.send(null);
      },
      post: function (inUrl, inData, inCallback) {
        this.xhr.open('post', inUrl);
        this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        Ajax.onreadystatechange(inCallback, this.xhr);
        this.xhr.send(inData);
      }
    }
  });

}(nx, nx.GLOBAL));
