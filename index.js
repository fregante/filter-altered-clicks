export default function filterAlteredClicks(callback, onlyPhysical) {
	return function (event) {
		event = event.originalEvent || event; // JQuery support
		if (
			event.which > 1
			|| event.shiftKey
			|| event.altKey
			|| event.metaKey
			|| event.ctrlKey
			|| (!onlyPhysical && event.defaultPrevented)
		) {
			return;
		}

		return callback.call(this, event);
	};
}
