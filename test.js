import test from 'ava';
import filterAlteredClicks, {isAlteredClick} from './index.js';

class Element {
	constructor() {
		this.listeners = [];
	}

	addEventListener(type, listener) {
		this.listeners.push(listener);
	}

	dispatchEvent(type, event) {
		for (const listener of this.listeners) {
			listener(event);
		}
	}
}

globalThis.MouseEvent = class {};

class NativeEvent extends MouseEvent {
	constructor(alteration = {}) {
		super();
		this.type = 'click';
		this.which = 1;
		this.shiftKey = false;
		this.altKey = false;
		this.metaKey = false;
		this.ctrlKey = false;
		this.defaultPrevented = false;
		Object.assign(this, alteration);
	}

	preventDefault() {
		this.defaultPrevented = true;
	}
}

class jQueryEvent {
	constructor(alteration = {}) {
		this.originalEvent = new NativeEvent(alteration);
	}

	preventDefault() {
		this.originalEvent.preventDefault();
	}
}

const alterations = {
	shift: {
		shiftKey: true,
	},

	alt: {
		altKey: true,
	},

	ctrl: {
		ctrlKey: true,
	},

	meta: {
		metaKey: true,
	},

	middle: {
		which: 2,
	},

	other: {
		which: 5,
	},
};

test.beforeEach(t => {
	const element = new Element();
	t.context.addEventListener = element.addEventListener.bind(element);
	t.context.dispatchEvent = element.dispatchEvent.bind(element);
});

for (const Event of [NativeEvent, jQueryEvent]) {
	test(`${Event.name}: unaltered clicks should not be prevented`, t => {
		t.plan(1);
		t.context.addEventListener('click', filterAlteredClicks(() => t.pass()));
		t.context.dispatchEvent('click', new Event());
	});

	for (const name of Object.keys(alterations)) {
		const alteration = alterations[name];
		test(`${Event.name}: ${name} clicks should be prevented`, t => {
			t.plan(1);
			t.context.addEventListener('click', filterAlteredClicks(() => t.fail()));
			t.context.dispatchEvent('click', new Event(alteration));
			t.pass();
		});
	}

	test(`${Event.name}: defaultPrevented clicks should be prevented`, t => {
		t.plan(1);
		t.context.addEventListener('click', filterAlteredClicks(() => t.fail()));
		t.context.dispatchEvent('click', new Event({
			defaultPrevented: true,
		}));
		t.pass();
	});

	test(`${Event.name}: defaultPrevented clicks should not be prevented with onlyPhysical: true`, t => {
		t.plan(1);
		t.context.addEventListener('click', filterAlteredClicks(() => t.pass(), true));
		t.context.dispatchEvent('click', new Event({
			defaultPrevented: true,
		}));
	});

	for (const name of Object.keys(alterations)) {
		const alteration = alterations[name];
		test(`${Event.name}: isAlteredClick should return true for ${name} clicks`, t => {
			t.is(isAlteredClick(new Event(alteration)), true);
		});
	}

	test(`${Event.name}: isAlteredClick should return false for unaltered clicks`, t => {
		t.is(isAlteredClick(new Event()), false);
	});
}
