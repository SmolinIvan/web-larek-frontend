import { IModal } from '../../types';
import { IEvents } from '../base/events';

export class ModalView implements IModal {
	protected _content: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
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
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
		this.content = null;
	}
}
