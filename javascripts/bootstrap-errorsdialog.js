/* ===========================================================
 * bootstrap-errorsdialog.js v1.0.1
 * https://github.com/vinaytech/Bootstrap-ErrorDialog.git
 * ===========================================================
 * Copyright 2013 Vinay Shankar <vinaytech09@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

	"use strict"; // jshint ;_;


 /* errorsdialog PUBLIC CLASS DEFINITION
	* =============================== */

	//var for check event at body can have only one.
	var event_body = false;

	var Errorsdialog = function (element, options) {
		var that = this;

		// remove href attribute of button
		$(element).removeAttr('href')

		this.init('errorsdialog', element, options)

		$(element).on('show', function(e) {  
			var options = that.options;
			var all = options.all_selector;
			if(options.singleton) {
				$(all).not(that.$element).errorsdialog('hide');
			}
		});

		$(element).on('shown', function(e) {
			var options = that.options;
			var all = options.all_selector;
			$(this).next('.popover').one('click.dismiss.errorsdialog', '[data-dismiss="errorsdialog"]', $.proxy(that.hide, that))
			if(that.isPopout()) {
				if(!event_body) {
					event_body = $('body').on('click', function (e) {
						if($(all).is(e.target)) return;
						if($(all).next('div').has(e.target).length) return;

						$(all).errorsdialog('hide');
						$('body').unbind(e);
						event_body = false;

						return;
					});
				}
			}
		});
	}


	/* NOTE: errorsdialog EXTENDS BOOTSTRAP-TOOLTIP.js
		 ========================================== */

	Errorsdialog.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

		constructor: Errorsdialog

		, setContent: function () {
				var $tip = this.tip()
					, title = this.getTitle()
					, $e = this.$element
					, btnOkClass = this.getBtnOkClass()
					, btnCancelClass = this.getBtnCancelClass()
					, btnOkLabel = this.getBtnOkLabel()
					, btnCancelLabel = this.getBtnCancelLabel()
					, o = this.options

				$tip.find('.popover-title').text(title);

				var btnOk = $tip.find('.popover-content > div > a:not([data-dismiss="errorsdialog"])');
				var btnCancel = $tip.find('.popover-content > div > a[data-dismiss="errorsdialog"]');

				btnOk.addClass(btnOkClass).html(btnOkLabel).on('click', o.onConfirm);
				btnCancel.addClass(btnCancelClass).html(btnCancelLabel).on('click', o.onCancel);

				$tip.removeClass('fade top bottom left right in')
			}

		, hasContent: function () {
				return this.getTitle()
			}

		, isPopout: function () {
				var popout
					, $e = this.$element
					, o = this.options

				popout = $e.attr('data-popout') || (typeof o.popout == 'function' ? o.popout.call($e[0]) :	o.popout)

				if(popout == 'false') popout = false;

				return popout
			}
			
		, getBtnOkClass: function () {
				var btnOkClass
					, $e = this.$element
					, o = this.options

				btnOkClass = $e.attr('data-btnOkClass') || (typeof o.btnOkClass == 'function' ? o.btnOkClass.call($e[0]) :	o.btnOkClass)

				return btnOkClass
			}

		, getBtnCancelClass: function () {
				var btnCancelClass
					, $e = this.$element
					, o = this.options

				btnCancelClass = $e.attr('data-btnCancelClass') || (typeof o.btnCancelClass == 'function' ? o.btnCancelClass.call($e[0]) :	o.btnCancelClass)

				return btnCancelClass
			}

		, getBtnOkLabel: function () {
				var btnOkLabel
					, $e = this.$element
					, o = this.options

				btnOkLabel = $e.attr('data-btnOkLabel') || (typeof o.btnOkLabel == 'function' ? o.btnOkLabel.call($e[0]) :	o.btnOkLabel)

				return btnOkLabel
			}

		, getBtnCancelLabel: function () {
				var btnCancelLabel
					, $e = this.$element
					, o = this.options

				btnCancelLabel = $e.attr('data-btnCancelLabel') || (typeof o.btnCancelLabel == 'function' ? o.btnCancelLabel.call($e[0]) :	o.btnCancelLabel)

				return btnCancelLabel
			}

		, tip: function () {
				this.$tip = this.$tip || $(this.options.template)
				return this.$tip
			}

		, destroy: function () {
				this.hide().$element.off('.' + this.type).removeData(this.type)
			}

	})


 /* errorsdialog PLUGIN DEFINITION
	* ======================= */

	var old = $.fn.errorsdialog

	$.fn.errorsdialog = function (option) {
		var that = this
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('errorsdialog')
				, options = typeof option == 'object' && option
			options = options || {}
			options.all_selector = that.selector
			if (!data) $this.data('errorsdialog', (data = new Errorsdialog(this, options)))
			if (typeof option == 'string') data[option]()
		})
	}

	$.fn.errorsdialog.Constructor = Errorsdialog

	$.fn.errorsdialog.defaults = $.extend({} , $.fn.tooltip.defaults, {
		placement: 'left'
		, trigger: 'click'
		, target : '_self'
		, title: 'Are you sure?'
		, template: '<div class="popover">' +
				'<div class="arrow"></div>' +   
				'<h3 class="popover-title" style="background:none;border:0px;color:red;"></h3>' +
				'</div>' +
				'</div>'
		, btnOkClass:  'btn-primary'
		, btnCancelClass:  ''
		, btnOkLabel: '<i class="icon-ok-sign icon-white"></i> Yes'
		, btnCancelLabel: 'Ok'
		, singleton: false
		, popout: false
		, onConfirm: function(){}
		, onCancel: function(){}
	})


 /* POPOVER NO CONFLICT
	* =================== */

	$.fn.errorsdialog.noConflict = function () {
		$.fn.errorsdialog = old
		return this
	}

}(window.jQuery);