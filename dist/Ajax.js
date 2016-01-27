(function (nx, global) {

  nx.declare('nx.net.AjaxConfig', {
    statics: {
      defaults: {
        method: 'GET',
        dataType: 'json',
        async: true,
        timeout: -1,
        data: null,
        headers: {},
        contentType:null,
        error: nx.noop,
        success: nx.noop,
        complete: nx.noop
      },
      READY_STATE: {
        DONE: 4,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        OPENED: 1,
        UNSENT: 0
      },
      ERROR_CODE: {
        TIMEOUT: 1000,
        REQUEST: 1001
      },
      CONTENT_TYPE: {
        get: 'text/plain;charset=UTF-8',
        post: 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }
  });

}(nx, nx.GLOBAL));

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
        if (!this.exist()) {
          global.XMLHttpRequest = function () {
            return new global.ActiveXObject(navigator.userAgent.indexOf('MSIE 5') >= 0 ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP');
          };
        }
      },
      getInstance: function () {
        return new global.XMLHttpRequest();
      }
    }
  });

}(nx, nx.GLOBAL));

(function (nx, global) {

  var AjaxConfig = nx.net.AjaxConfig;
  var AjaxResponse = nx.net.AjaxResponse;
  var navigator = global.navigator;
  var location = global.location;

  var Ajax = nx.declare('nx.net.Ajax', {
    statics: {
      toQueryString: function (inJson) {
        return Object.keys(inJson).map(function (key) {
          return encodeURIComponent(key) + '=' +
            encodeURIComponent(inJson[key]);
        }).join('&');
      },
      request: function (inUrl, inOptions) {
        Ajax.getInstance().request(inUrl, inOptions);
      },
      get: function (inUrl, inOptions) {
        var options = nx.mix(inOptions, {
          method: 'GET'
        });
        Ajax.getInstance().request(inUrl, options);
      },
      post: function (inUrl, inOptions) {
        var options = nx.mix(inOptions, {
          method: 'POST'
        });
        Ajax.getInstance().request(inUrl, options);
      },
      getInstance: function () {
        if (!this._instance) {
          this._instance = new Ajax();
        }
        return this._instance;
      }
    },
    methods: {
      request: function (inUrl, inOptions) {
        this.xhr = nx.net.XMLHttpRequest.getInstance();
        this.normalizeOptions(inUrl, inOptions);
        this.dataProcessor();
        this.timeoutProcessor();
        this.headersProcessor();
        this.stateEventProcessor();
        this.requestProcessor();
      },
      normalizeOptions: function (inUrl, inOptions) {
        var preProcessOptions = {
          url: inUrl,
          method: (inOptions.method).toUpperCase()
        };
        this.options = nx.mix(AjaxConfig.defaults, inOptions, preProcessOptions);
      },
      timeoutProcessor: function () {
        var options = this.options;
        var timeout = options.timeout;
        var xhr = this.xhr;
        var response;
        if (timeout > 0) {
          this._abortTime = setTimeout(function () {
            response = new AjaxResponse(xhr);
            xhr.onreadystatechange = $.noop;
            xhr.abort();
            options.error({
              code: AjaxConfig.ERROR_CODE.TIMEOUT,
              msg: 'timeout',
              data: {
                response: response
              }
            });
            options.complete(response);
          }, timeout);
        }
      },
      headersProcessor: function () {
        var headers = this.options.headers;
        this.setHeaders(headers);
      },
      dataProcessor: function () {
        var data = this.options.data;
        this._data = Ajax.toQueryString(data);
      },
      stateEventProcessor: function (inCallback) {
        var xhr = this.xhr;
        var options = this.options;
        var response;
        var self = this;
        xhr.onreadystatechange = function () {
          if (xhr.readyState === AjaxConfig.READY_STATE.DONE) {
            response = new AjaxResponse(xhr, options);
            if (self.requestSuccess()) {
              options.success(response);
            } else {
              options.error({
                code: AjaxConfig.ERROR_CODE.REQUEST,
                msg: 'request',
                data: {
                  response: response
                }
              });
            }
            options.complete(response);
            self._complete = true;
            self.xhr = null;
            clearTimeout(self._abortTime);
            self._abortTime = null;
          }
        }
      },
      requestProcessor: function () {
        var method = this.options.method;
        switch (method) {
          case 'GET':
          case 'POST':
            this['do' + method].call(this);
            break;
          default:
            this.doREQUEST.call(this);
            break;
        }
      },
      doGET: function () {
        var options = this.options;
        var url = options.url;
        if (options.data) {
          url += url.indexOf('?') > -1 ? '&' : '?' + this._data;
        }
        this.xhr.open("GET", url, options.async);
        this.setHeader('Content-Type', options.contentType || AjaxConfig.CONTENT_TYPE.get);
        this.xhr.send(null);
      },
      doPOST: function () {
        var options = this.options;
        var url = options.url;
        this.xhr.open("POST", url, options.async);
        this.setHeader('Content-Type', options.contentType || AjaxConfig.CONTENT_TYPE.post);
        this.xhr.send(this._data);
      },
      doREQUEST: function () {
        var options = this.options;
        this.xhr.open(options.method, options.url, options.async);
        this.xhr.send();
      },
      requestSuccess: function () {
        var xhr = this.xhr;
        try {
          return (!xhr.status && location.protocol == "file:")
            || (xhr.status >= 200 && xhr.status < 300)
            || (xhr.status == 304)
            || (navigator.userAgent.indexOf("Safari") > -1 && typeof xhr.status == "undefined");
        } catch (e) {
        }
        return false;
      },
      setHeader: function (inKey, inValue) {
        this.xhr.setRequestHeader(inKey, inValue);
      },
      setHeaders: function (inObj) {
        var xhr = this.xhr;
        nx.each(inObj, function (inValue, inKey) {
          xhr.setRequestHeader(inKey, inValue);
        });
      }
    }
  });

}(nx, nx.GLOBAL));
