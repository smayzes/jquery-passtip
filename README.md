# jQuery PassTip

### Inline password criteria display

The inspiration for creating this plugin came from a blog I follow. [Paul Lewis](http://aerotwist.com/blog/) wrote on his blog about [Better password form fields](http://aerotwist.com/blog/better-password-form-fields/) and I really liked his design for an inline approach to password verification.

I also decided to add an entropy option where this plugin can be combined with a second party plugin by [xero](https://github.com/xero/passwordEntropy.js).

## Usage

1. Include jQuery:

	```html
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	```

2. Include plugin's code and CSS:

	```html
	<script src="/js/jquery.passtip.min.js"></script>
	<link href="/css/jquery.passtip.css" rel="stylesheet" type="text/css">
	```

3. Call the plugin:

	```javascript
	$('input[type=password]').passTip();
	```

## Demo

* [Working Demo](http://www.shawnmayzes.com/code/jquery/passtip)
* [Code Demo](https://github.com/smayzes/jquery-passtip/tree/master/demo)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)