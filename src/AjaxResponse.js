(function (nx, global) {

  nx.declare('nx.net.AjaxResponse', {
    properties: {
      responseText: {
        get: function () {
          if (this._dataType === 'text') {
            return this.xhr.responseText;
          }
        }
      },
      responseJSON: {
        get: function () {
          if (this._dataType === 'json') {
            var respText = this.xhr.responseText;
            return JSON.parse(respText);
          }
        }
      },
      responseXML: {
        get: function () {
          if (this._dataType === 'xml') {
            return this.xhr.responseXML;
          }
        }
      }
    },
    methods: {
      init: function (inXhr, inOptions) {
        this.xhr = inXhr;
        this.options = inOptions;
        this._dataType = this.options.dataType;
      }
    }
  });

}(nx, nx.GLOBAL));
