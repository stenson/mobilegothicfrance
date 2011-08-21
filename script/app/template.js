
var Views = {
  Base: Backbone.View.extend({
    render: function() {
      var div = $("<div/>", { html: this.template });
      _.each(div.querySelectorAll("*[key]"), function(el) {
        console.log(el.getAttribute("key"));
      });
      //var html = $(this.template).find("[key=*]");
      //console.log(html);
    }
  }, {
    defineTemplate: function(el) {
      var $el = $(el);
      var name = $el.attr("name");
      Views[capitalize(name)] = Views.Base.extend({
        template: $el.html()
      });
    }
  })
};

// make views from inlined html
_.each($(".template"), Views.Base.defineTemplate);