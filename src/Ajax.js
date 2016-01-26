(function (nx, global) {

  var Ajax = nx.declare('nx.net.Ajax', {
    statics: {
      create: function () {
        return new nx.net.XMLHttpRequest();
      }
    },
    methods: {
      init: function () {
        this.xhr = Ajax.create();
      },
      get: function (inUrl, inCallback) {
        this.xhr.open('GET', inUrl);
        this.onreadystatechange(inCallback, this.xhr);
        this.xhr.send(null);
      },
      post: function (inUrl, inData, inCallback) {
        this.xhr.open('POST', inUrl);
        this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        this.onreadystatechange(inCallback);
        this.xhr.send(inData);
      },
      onreadystatechange: function (inCallback) {
        var xhr = this.xhr;
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              inCallback(xhr.responseText);
            }
          }
        }
      }
    }
  });

}(nx, nx.GLOBAL));
