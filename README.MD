#next-net-ajax

##description:
+ Ajax mini library based on next toolkit.

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

