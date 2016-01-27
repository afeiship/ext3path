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
