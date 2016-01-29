#next-net-ajax

##description:
+ Ajax mini library based on next toolkit.
+ configClass/responseClass configurable.

##usage:
+ request:
```javascript
  var Ajax=nx.net.Ajax;
  Ajax.request('test.php',{
    method:'GET',
    data:{
      name:'test'
    }
  });
```

+ post:
```javascript
  var Ajax=nx.net.Ajax;
  Ajax.post('test.php',{
    data:{
      name:'test'
    }
  });
```

+ get:
```javascript
  var Ajax=nx.net.Ajax;
  Ajax.get('test.php',{
    data:{
      name:'test'
    },
    success:function(inResp){
      console.log(inResp);
    }
  });
```

+ customize your response:
  + 1.get Ajax && define your owen config class(extends system class):
  ```javascript
    var Ajax = nx.net.Ajax;
    nx.declare('demo.MyResponseClass', {
      extend: nx.net.AjaxResponse,
      methods: {
        response: function () {
          var base = this.base();
          if (base.flag == 1) {
            return base.data;
          } else {
            console.log(base.msg);
          }
        }
      }
    });
  ```
  + 2.config your project ajax response class:
  ```javascript
    Ajax.responseClass = demo.MyResponseClass;
  ```
  + 3.send request:
  ```javascript
    var url1 = 'data.php';
    Ajax.post(url1, {
      data: {
        id: 1
      },
      success: function (resp) {
        console.log('first:->', resp.response());
      }
    });
  ```
