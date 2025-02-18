import { ISuccessView } from '../../types';

export interface SuccessViewConstructor {
	new (successViewTemplate: HTMLTemplateElement): SuccessView;
}

export class SuccessView implements ISuccessView {
	protected successElement: HTMLElement;
	protected totalPriceElement: HTMLSpanElement;
	protected _totalPrice: number;

	constructor(successTemplate: HTMLTemplateElement) {
		this.successElement = successTemplate.content
			.querySelector('.order-success')
			.cloneNode(true) as HTMLElement;
		this.totalPriceElement = this.successElement.querySelector(
			'.order-success__description'
		);
		this.successElement
			.querySelector('.button')
			.addEventListener('click', (evt) => {
				document
					.querySelector('#modal-container')
					.classList.remove('modal_active');
			});
	}

	set totalPrice(value: number) {
		this._totalPrice = value;
	}

	get totalPrice() {
		return this._totalPrice;
	}

	render() {
		this.totalPriceElement.textContent = `Списано ${this._totalPrice} синапсов`;
		return this.successElement;
	}
}
