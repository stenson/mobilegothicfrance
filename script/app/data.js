var capitalize = function(str) {
  return str[0].toUpperCase() + str.slice(1);
};

var Data = (function(){

  var cache = {};
  var loading = {};
  var waiting = {};

  var waitForResponse = function(key, cback) {
    loading[key] = true;
    var waiters = waiting[key];
    _.isArray(waiters)
      ? waiters.push(cback)
      : waiting[key] = [cback];
  };

  var addToCache = function(key, waitingKey, model) {
    cache[key] = model;
    loading[waitingKey] = false;
    _.each(waiting[waitingKey], function(cback) {
      cback(model);
    });
    waiting[waitingKey] = [];
  };

  var requestResponse = function(key, cback) {
    waitForResponse(key, cback);

    var info = key.split("/");
    var type = Models[capitalize(info[0])];
    var id = info[1];

    var model = new type({ id: info[1] }).fetch({
      success: function(model, response) {
        addToCache(model.key(), key, model);
      },
      error: function() {
        console.log("could not fetch "+key+" from server");
      }
    });
  };

  return {
    get: function(key, cback) {
      (loading[key]) ? waitForResponse(key, cback)
        : (cache[key]) ? cback(cache[key])
          : requestResponse(key, cback);
    },

    cull: function(response) {}
  };
})();

(function(){

  Backbone.sync = function(method, model, options) {

    var url = "http://mappinggothicfrance.org/api/"
      + model.url()
      + (options.field ? ("/" + options.field) : "")
      + ".jsonp?callback=?";

    $.ajax(_.extend({
      url: url,
      dataType: "jsonp"
    },options));
  };

})();