export default function filterAlteredClicks(callback, onlyPhysical) {
	return function (event) {
		event = event.originalEvent || event; // JQuery support
		if (isAlteredClick(event)) {
			return;
		}

		if (!onlyPhysical && event.defaultPrevented) {
			return;
		}

		return callback.call(this, event);
	};
}

export function isAlteredClick(event) {
	event = event.originalEvent || event; // JQuery support
	return (
		(event instanceof MouseEvent && event.which > 1)
		|| event.shiftKey
		|| event.altKey
		|| event.metaKey
		|| event.ctrlKey
	);
}
