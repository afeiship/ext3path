(function (nx, global) {

  var AjaxConfig = nx.net.AjaxConfig;
  var AjaxResponse = nx.net.AjaxResponse;
  var navigator = global.navigator;
  var location = global.location;

  var Ajax = nx.declare('nx.net.Ajax', {
    mixins: [
      nx.net.AjaxProcessor
    ],
    statics: {
      toQueryString: function (inJson) {
        return Object.keys(inJson).map(function (key) {
          return encodeURIComponent(key) + '=' +
            encodeURIComponent(inJson[key]);
        }).join('&');
      }
    },
    methods: {
      init: function () {
        this._abortTime = null;
        this._complete = false;
        this.xhr = nx.net.XMLHttpRequest.getInstance();
      },
      request: function (inUrl, inOptions) {
        this.normalizeOptions(inOptions);
        this.timeoutProcessor();
        this.headersProcessor();
        this.stateEventProcessor();
        this.requestProcessor();
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
      normalizeOptions: function (inOptions) {
        var preProcessOptions = {
          method: (inOptions.method).toUpperCase()
        };
        this.options = nx.mix(AjaxConfig.defaults, inOptions, preProcessOptions);
      },
      timeoutProcessor: function () {
        var options = this.options;
        var timeout = options.timeout;
        var xhr = this.xhr;
        if (timeout > 0) {
          this._abortTime = setTimeout(function () {
            xhr.onreadystatechange = $.noop;
            xhr.abort();
            options.error({
              code: AjaxConfig.ERROR_CODE.TIMEOUT,
              msg: 'timeout',
              data: null
            });
          }, timeout);
        }
      },
      headersProcessor: function () {
        var headers = this.options.headers;
        this.setHeaders(headers);
      },
      dataProcessor: function () {
        var data = this.options.data;
        var params = Ajax.toQueryString(data);
        this._data = params;
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
        this.setHeader('Content-Type', this.options.contentType || AjaxConfig.CONTENT_TYPE.get);
        this.xhr.open("GET", url, options.async);
        this.xhr.send(null);
      },
      doPOST: function () {
        var options = this.options;
        var url = options.url;
        this.setHeader('Content-Type', options.contentType || AjaxConfig.CONTENT_TYPE.post);
        this.xhr.open("POST", url, options.async);
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
        xhr.setRequestHeader(inKey, inValue);
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
