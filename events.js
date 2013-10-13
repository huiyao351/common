var Events = function() {
  function ev(){
    this.list = {}
  }
  ev.prototype = {
    on : function(type, handler) {
      if(typeof handler != 'function'){
        throw new Error('invalid handler.')
      }
      this.list[type] = this.list[type] || []
      this.list[type].push(handler)
      return this
    },
    off : function(type, handler) {
      var len = arguments.length
      var list = this.list[type]
      if(len == 0){
        this.list = {}
      } else if(len == 1) {
        delete this.list[type]
      } else if(list) {
        for(len = 0; len < list.length; len ++){
          if(list[len] === handler) list.splice(len, 1)
        }
      }
      return this
    },
    trigger : function (type){
      var list = this.list[type] || []
      var args = list.slice.call(arguments, 1)
      for(var i = 0, len = list.length; i < len; i ++){
        list[i].apply(null, args)
      }
      return this
    },
    once : function (type, handler) {
      if(typeof handler != 'function'){
        throw new Error('invalid handler.')
      }
      var that = this
      var one = function(){
        handler.apply(null, arguments)
        that.off(type, one)
      }
      return this.on(type, one)
    }
  }
  return ev
}()