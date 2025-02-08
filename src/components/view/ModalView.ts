import { IModal } from '../../types';

export class ModalView implements IModal {
	protected _content: HTMLElement;

	constructor(protected container: HTMLElement) {
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
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
	}
}
