# filter-altered-clicks

> Filter alt-click, ctrl-click, shift-click, middle click, ...

[![gzipped size][badge-gzip]](#no-link)
[![Travis build status][badge-travis]][link-travis]
[![npm version][badge-version]][link-npm]

  [badge-gzip]: https://badges.herokuapp.com/size/github/bfred-it/filter-altered-clicks/master/dist/filter-altered-clicks.browser.js?gzip=true&label=gzipped%20size
  [badge-travis]: https://api.travis-ci.org/bfred-it/filter-altered-clicks.svg
  [badge-version]: https://img.shields.io/npm/v/filter-altered-clicks.svg
  [link-travis]: https://travis-ci.org/bfred-it/filter-altered-clicks
  [link-npm]: https://www.npmjs.com/package/filter-altered-clicks

Middle-clicking on a link should open it in a new tab. SPAs hijack normal links to load them via ajax, breaking all _altered clicks_... unless they `filter-altered-clicks` 😉

_Altered clicks_ are:
- <kbd>ALT</kbd>-click
- <kbd>CTRL</kbd>-click
- <kbd>SHIFT</kbd>-click
- <kbd>CMD</kbd>-click
- Any clicks that aren’t left-clicks
- Clicks that already received `preventDefault()`. [Note]()

## Usage

`filterAlteredClicks(listener)` accepts a function and returns a function.

Simplest usage:

```js
element.addEventListener('click', filterAlteredClicks(function (e) {
	console.log('Unaltered click!');
}));
```

jQuery usage:

```js
$(element).on('click', filterAlteredClicks(function (e) {
	console.log('Unaltered click!');
}));
```

Ajax loading example, using jQuery for brevity, but it's not necessary:

```js
$('a.ajax-link').on('click', filterAlteredClicks(function (e) {
	$('#content').load(this.href);
	e.preventDefault();
}));
```

## Install

Pick your favorite:

```html
<script src="dist/filter-altered-clicks.browser.js"></script>
```

```sh
npm install --save filter-altered-clicks
```

```js
var filterAlteredClicks = require('filter-altered-clicks');
```

```js
import filterAlteredClicks from 'filter-altered-clicks';
```

## API

### `filterAlteredClicks(listener, [onlyPhysical])`

Returns a [`listener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Syntax) function that is called by `addEventListener` or `jQuery.on`. Receives the `Event` as the first parameter.

#### `listener`

Type: `function`

The same listener function you would pass to `addEventListener(type, listener)` and `.on(type, listener)`.

#### `onlyPhysical`

Type: `boolean`, defaults to `false`

Once filtered, `listener` is normally not called if the event has already been `defaultPrevented`. Set this parameter to true to avoid this behavior.

Example:

```js
el.addEventListener('click', filterAlteredClicks(function (e) {
	console.log('Unaltered click!');
	console.log('I’m altering this click:');
	e.preventDefault();
}));

el.addEventListener('click', filterAlteredClicks(function (e) {
	// This will never be called because the previous one used .preventDefault
}));

el.addEventListener('click', filterAlteredClicks(function (e) {
	console.log('Unaltered click! But maybe .preventDefault was already called');
}, true)); //<-- notice the true as the second parameter of filterAlteredClicks
```

## Dependencies

None!

## Related

* [on-off](https://github.com/bfred-it/on-off/): Add and remove multiple events on multiple elements in <1KB

## License

MIT © [Federico Brigante](http://twitter.com/bfred_it)
