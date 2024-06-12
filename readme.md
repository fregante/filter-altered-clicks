# filter-altered-clicks [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/filter-altered-clicks.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=filter-altered-clicks

> Filter alt-click, ctrl-click, shift-click, middle click, ...

Middle-clicking on a link should open it in a new tab. SPAs hijack normal links to load them via ajax, breaking all _altered clicks_... unless they `filter-altered-clicks` 😉

_Altered clicks_ are:

- <kbd>ALT</kbd>-click
- <kbd>CTRL</kbd>-click
- <kbd>SHIFT</kbd>-click
- <kbd>CMD</kbd>-click
- Any clicks that aren’t left-clicks
- Clicks that already received `preventDefault()`. [Note](#onlyphysical)

## Usage

`filterAlteredClicks(listener)` accepts a function and returns a function.

Simplest usage:

```js
element.addEventListener(
	'click',
	filterAlteredClicks(event => {
		console.log('Unaltered click!');
	})
);
```

jQuery usage:

```js
$(element).on(
	'click',
	filterAlteredClicks(event => {
		console.log('Unaltered click!');
	})
);
```

Ajax loading example, using jQuery for brevity, but it's not necessary:

```js
$('a.ajax-link').on(
	'click',
	filterAlteredClicks(event => {
		$('#content').load(this.href);
		event.preventDefault();
	})
);
```

## Install

```sh
npm install --save filter-altered-clicks
```

```js
import filterAlteredClick, {isAlteredClick} from 'filter-altered-clicks';
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
element.addEventListener(
	'click',
	filterAlteredClicks(event => {
		console.log('Unaltered click!');
		console.log('I’m altering this click:');
		event.preventDefault();
	})
);

element.addEventListener(
	'click',
	filterAlteredClicks(event => {
		// This will never be called because the previous one used .preventDefault
	})
);

element.addEventListener(
	'click',
	filterAlteredClicks(event => {
		console.log(
			'Unaltered click! But maybe .preventDefault was already called'
		);
	}, true)
); //<-- notice the true as the second parameter of filterAlteredClicks
```

This is called `onlyPhysical` because it refers to "only physical alterations", which is _altered by keyboard and not by code._

### `isAlteredClick(event)`

Returns true if any modifier were held while clicking, or if any button other than the main button was clicked.

#### `event`

Type: [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)

The event object received in the listener function

## Dependencies

None!

## Related

- [on-off](https://github.com/fregante/on-off/): Add and remove multiple events on multiple elements in <1KB

## License

MIT © [Federico Brigante](https://fregante.com)
