
var Models = {
  Generic: Backbone.Model.extend({
    initialize: function(key) {
      //console.log("new");
    },
    get: function(field, cback) {
      var value = Backbone.Model.prototype.get.apply(this, arguments);
      return (!cback) ? value
        : (value) ? (cback(value), value)
          : (Backbone.sync("read", this, { success: cback }));
    },
    parse: function(resp) {
      return resp.archmap_says.response[this.name];
    },
    key: function() {
      return this.name + "/" + this.get("id");
    }
  })
};

var defineModel = function(props, name) {
  Models[name] = Models.Generic.extend({
    urlRoot: name.toLowerCase(),
    type: name.toLowerCase(),
    name: name
  });
};

// generate model definitions

_.each({
  Building: {
  },
  Person: {
  },
  Image: {

  },
  CollectionItem: {
  },
  Collection: {
  }
}, defineModel);