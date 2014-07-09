// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var passTip = "passTip",
			defaults = {
				upper_case: true,
				lower_case: true,
				numeric: true,
				special_characters: true,
				min_characters: 6,
				max_characters: 12,
				entropy: false
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = passTip;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			init: function () {
				this.setup(this.element, this.settings);
			},
			setup: function () {
				var input = this.element,
					settings = this.settings;
					$(input).after('<div id="passTip-primary" style="display:none;"></div>');
				var primary = $('#passTip-primary');

				if ( settings.max_characters < settings.min_characters ) {
					alert("Hey, this is awkard...\n\nPassTip Bot here..\n\nJust wanted to let you know the max characters is lower than the minimum characters.");
					return false;
				}
				if ( settings.upper_case )
					$(primary).append('<div id="passTip-upper_case" title="Upper Case">A-Z</div>');
				if ( settings.lower_case )
					$(primary).append('<div id="passTip-lower_case" title="Lower Case">a-z</div>');
				if ( settings.numeric )
					$(primary).append('<div id="passTip-numeric" title="Numeric">0-9</div>');
				if ( settings.special_characters )
					$(primary).append('<div id="passTip-special_characters" title="Special Characters">!&?</div>');
				if ( settings.min_characters > 0 && (typeof settings.min_characters === 'number') )
					$(primary).append('<div id="passTip-min_characters" title="Min Characters">'+settings.min_characters+'+</div>');
				if ( settings.max_characters && (typeof settings.max_characters === 'number') ) {
					$(input).attr('maxlength', settings.max_characters);
					$(primary).append('<div id="passTip-max_characters" title="Max Characters">&lt;'+settings.max_characters+'</div>');
				}
				if ( settings.entropy )
					$(primary).append('<div id="passTip-entropy" title="Entropy">Entropy</div>');

				$(input).on('focus', function(event) {
					$(primary).fadeIn();
				});

				$(input).on('focusout', function(event) {
					$(primary).fadeOut();
				});

				$(input).on('keyup', function(event) {
					event.preventDefault();
					var total_characters = $(this).val();

					var upper_regex = /(?=.*[A-Z])/g;
					if ( settings.upper_case && upper_regex.test($(this).val()) )
						$('#passTip-upper_case').addClass('success');
					else
						$('#passTip-upper_case').removeClass('success');
					var lower_regex = /(?=.*[a-z])/g;
					if ( settings.lower_case && lower_regex.test($(this).val()) )
						$('#passTip-lower_case').addClass('success');
					else
						$('#passTip-lower_case').removeClass('success');
					var numeric_regex = /(?=.*\d)/g;
					if ( settings.numeric && numeric_regex.test($(this).val()) )
						$('#passTip-numeric').addClass('success');
					else
						$('#passTip-numeric').removeClass('success');
					var special_characters_regex = /(?=.*[^a-zA-Z0-9])/g;
					if ( settings.special_characters && special_characters_regex.test($(this).val()) )
						$('#passTip-special_characters').addClass('success');
					else
						$('#passTip-special_characters').removeClass('success');
					if ( total_characters.length >= settings.min_characters )
						$('#passTip-min_characters').addClass('success');
					else
						$('#passTip-min_characters').removeClass('success');
					if ( total_characters.length >= settings.max_characters )
						$('#passTip-max_characters').addClass('success');
					else
						$('#passTip-max_characters').removeClass('success');

					if ( jQuery().passwordEntropy && settings.entropy ) {
						if ( $('#passTip-entropy_result').length === 0 )
							$(input).after('<div id="passTip-entropy_result" style="display:none;"></div>');
						$(input).passwordEntropy({
							'display':'#passTip-entropy_result',
							'colorize':false,
							'showBits':false
						});
						var entropy_result = $('#passTip-entropy_result').html();
						if ( $(input).val().length <= 0 )
							$('#passTip-entropy').removeClass('success');
						else if ( settings.entropy == 'very-weak' && ( entropy_result === 'very-weak' || entropy_result === 'weak' || entropy_result === 'medium' || entropy_result === 'strong' || entropy_result === 'very-strong' ) )
							$('#passTip-entropy').addClass('success');
						else if ( settings.entropy == 'weak' && ( entropy_result === 'weak' || entropy_result === 'medium' || entropy_result === 'strong' || entropy_result === 'very-strong' ) )
							$('#passTip-entropy').addClass('success');
						else if ( settings.entropy == 'medium' && ( entropy_result === 'medium' || entropy_result === 'strong' || entropy_result === 'very-strong' ) )
							$('#passTip-entropy').addClass('success');
						else if ( settings.entropy == 'strong' && ( entropy_result === 'strong' || entropy_result === 'very-strong' ) )
							$('#passTip-entropy').addClass('success');
						else if ( settings.entropy == 'very-strong' && entropy_result === 'very-strong' )
							$('#passTip-entropy').addClass('success');
						else
							$('#passTip-entropy').removeClass('success');
					}

					if ( $.isFunction( settings.success ) ) {
						var success = true;
						$('#passTip-primary div').each(function() {
							if ( !$(this).hasClass('success') )
								success = false;
						});
						if ( success )
							settings.success.call( this );
				    }
				});

			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ passTip ] = function ( options ) {
			this.each(function() {


				if ( !$.data( this, "plugin_" + passTip ) ) {
					$.data( this, "plugin_" + passTip, new Plugin( this, options ) );
				}
			});
			// chain jQuery functions
			return this;
		};

})( jQuery, window, document );