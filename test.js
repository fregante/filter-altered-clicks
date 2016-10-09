import test from 'ava';
import filterAlteredClicks from '.';

class Element {
	constructor() {
		this.listeners = [];
	}
	addEventListener(type, listener) {
		this.listeners.push(listener);
	}
	dispatchEvent(type, event) {
		this.listeners.forEach(listener => {
			listener(event);
		});
	}
}

class NativeEvent {
	constructor(alteration = {}) {
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
		shiftKey: true
	},

	alt: {
		altKey: true
	},

	ctrl: {
		ctrlKey: true
	},

	meta: {
		metaKey: true
	},

	middle: {
		which: 2
	},

	other: {
		which: 5
	}
};

test.beforeEach(t => {
	const element = new Element();
	t.context.addEventListener = element.addEventListener.bind(element);
	t.context.dispatchEvent = element.dispatchEvent.bind(element);
});

[NativeEvent, jQueryEvent].forEach(Event => {
	test(`${Event.name}: unaltered clicks should not be prevented`, t => {
		t.plan(1);
		t.context.addEventListener('click', filterAlteredClicks(() => t.pass()));
		t.context.dispatchEvent('click', new Event());
	});

	Object.keys(alterations).forEach(name => {
		const alteration = alterations[name];
		test(`${Event.name}: ${name} clicks should be prevented`, t => {
			t.plan(1);
			t.context.addEventListener('click', filterAlteredClicks(() => t.fail()));
			t.context.dispatchEvent('click', new Event(alteration));
			t.pass();
		});
	});

	test(`${Event.name}: defaultPrevented clicks should be prevented`, t => {
		t.plan(1);
		t.context.addEventListener('click', filterAlteredClicks(() => t.fail()));
		t.context.dispatchEvent('click', new Event({
			defaultPrevented: true
		}));
		t.pass();
	});

	test(`${Event.name}: defaultPrevented clicks should not be prevented with onlyPhysical: true`, t => {
		t.plan(1);
		t.context.addEventListener('click', filterAlteredClicks(() => t.pass(), true));
		t.context.dispatchEvent('click', new Event({
			defaultPrevented: true
		}));
	});
});

