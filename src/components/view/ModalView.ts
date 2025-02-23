import { IModal } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class ModalView extends Component<IModal> {
	protected _content: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this._content = container.querySelector('.modal__content');
		this.container.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;
			if (target.matches('.modal__close')) this.close();
		});
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		document.addEventListener('click', this.clickOverlayModalHandle.bind(this));
		this.toggleClass(this.container, 'modal_active');
		this.events.emit('modal:open');
	}

	close() {
		document.removeEventListener(
			'click',
			this.clickOverlayModalHandle.bind(this)
		);
		this.toggleClass(this.container, 'modal_active');
		this.events.emit('modal:close');
		this.content = null;
	}

	clickOverlayModalHandle(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.classList.contains('modal_active')) {
			this.close();
		}
	}
}
