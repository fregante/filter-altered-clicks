export default function filterAlteredClicks(callback, onlyPhysical) {
	return function (e) {
		e = e.originalEvent || e; // jQuery support
		if (
			e.which > 1 ||
			e.shiftKey ||
			e.altKey ||
			e.metaKey ||
			e.ctrlKey ||
			(!onlyPhysical && e.defaultPrevented)
		) {
			return;
		}
		return callback.call(this, e);
	};
}
