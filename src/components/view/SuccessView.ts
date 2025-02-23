import { ISuccessView } from '../../types';

export interface SuccessViewConstructor {
	new (successViewTemplate: HTMLTemplateElement): SuccessView;
}

export class SuccessView implements ISuccessView {
	protected successElement: HTMLElement;
	protected totalPriceElement: HTMLSpanElement;
	protected _totalPrice: number;
	protected successButton: HTMLButtonElement;
	protected handleSuccess: Function;

	constructor(successTemplate: HTMLTemplateElement) {
		this.successElement = successTemplate.content
			.querySelector('.order-success')
			.cloneNode(true) as HTMLElement;
		this.totalPriceElement = this.successElement.querySelector(
			'.order-success__description'
		);
		this.successButton = this.successElement.querySelector('.button');
	}

	set totalPrice(value: number) {
		this._totalPrice = value;
	}

	get totalPrice() {
		return this._totalPrice;
	}

	setHandleSuccess(handleSuccess: Function) {
		this.handleSuccess = handleSuccess;
		this.successButton.addEventListener('click', (evt) => {
			this.handleSuccess(this);
		});
	}

	render() {
		this.totalPriceElement.textContent = `Списано ${this._totalPrice} синапсов`;
		return this.successElement;
	}
}
