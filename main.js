var PilarModel, PillarsCollection, SubcategoryModel, SubcategoriesCollection, SubcategoryView, SubcategoriesView, PillarView, PillarsView;
var main_const = {
	pillarItemTmplId: "#pillarItem-template",
	subcategoryItemTmplId: "#subcategoryItem-template",
	pillarsWrapperId: "#wr",
	subcategoriesWrapperId: "#ct"
};
function backbonePrepare () {
	if (typeof riskPillars == 'undefined' || 
		typeof riskPillarsCheck == 'undefined' || 
		typeof subCategories == 'undefined' || 
		typeof subCategoriesCheck == 'undefined' || 
		typeof groupCategories == 'undefined') {
		return false;
	};
	(function ($) {
		PillarModel = Backbone.Model.extend({
			defaults: function(){return {title:'(none)', checked:false}},
			toggle: function() {this.set({checked: !this.get("checked")});}
		});
		PillarsCollection = Backbone.Collection.extend({
			model: PillarModel,
			initialize: function () {
				this.add(_.map(riskPillarsCheck, function(o,i){return {title:i, checked:o};}));
			}
		});
		SubcategoryModel = Backbone.Model.extend({
			defaults: function(){return {title:'(none)', checked:false, visible: true, pillar: null}},
			groupByPillar: groupCategories,
			toggle: function() {(visible)&&(this.set({checked: !this.get("checked")}));},
			setVisible: function (visible) {
				this.set({checked: visible?this.get("checked"):false, visible:visible});
			}
		});
		SubcategoriesCollection = Backbone.Collection.extend({
			model: SubcategoryModel,
			initialize: function () {
				this.add(_.map(riskPillarsCheck, function(o,i){return {title:i, checked:o, visible: true, pillar: null};}));
			}
		});
		SubcategoryView = Backbone.View.extend({
			template: _.template($(main_const.subcategoryItemTmplId).html()),
			events: {
				"click .check": "toggleCheck"
			},
			initialize: function () {
				_.bindAll(this, 'render');
				this.listenTo(this.model, 'change', this.render);
			},
			render: function () {
				this.$el.html(this.template(this.model.toJSON()));
				console.log('r');
				return this;
			},
			toggleCheck: function () {
				this.model.toggle();
			}
		});
		SubcategoriesView = Backbone.View.extend({
			collection: new PillarsCollection(),
			el: $(main_const.pillarsWrapperId),
			initialize: function () {
				_.bindAll(this, 'render');
				//this.listenTo(this.collection, 'all', this.render);
				this.collection.bind('all', this.render);
				this.render();
			},
			render: function () {
				this.$el.empty();
				this.collection.each(function(o){this.$el.append(new PillarView({model:o}).el);}, this);
				console.log(JSON.stringify(_(this.collection.where({checked:true})).map(function(o){return o.get('title');})));
				return this;
			},
		});
		PillarView = Backbone.View.extend({
			template: _.template($(main_const.pillarItemTmplId).html()),
			events: {
				"click .check": "toggleCheck"
			},
			initialize: function () {
				_.bindAll(this, 'render', 'toggleCheck');
				this.listenTo(this.model, 'change', this.render);
				this.render();
			},
			render: function () {
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			},
			toggleCheck: function () {
				this.model.toggle();
			}
		});
		PillarsView = Backbone.View.extend({
			collection: new PillarsCollection(),
			el: $(main_const.pillarsWrapperId),
			initialize: function () {
				_.bindAll(this, 'render');
				//this.listenTo(this.collection, 'all', this.render);
				this.collection.bind('all', this.render);
				this.render();
			},
			render: function () {
				this.$el.empty();
				this.collection.each(function(o){this.$el.append(new PillarView({model:o}).el);}, this);
				console.log(JSON.stringify(_(this.collection.where({checked:true})).map(function(o){return o.get('title');})));
				return this;
			},
		});
	})(jQuery);
	return true;
}