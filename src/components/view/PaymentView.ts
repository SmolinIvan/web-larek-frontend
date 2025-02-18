import { IPaymentView } from '../../types';

export interface PaymentViewConstructor {
	new (orderViewTemplate: HTMLTemplateElement): IPaymentView;
}

export class PaymentView implements IPaymentView {
	protected orderElement: HTMLFormElement;
	protected onlineButton: HTMLButtonElement;
	protected offlineButton: HTMLButtonElement;
	addressInput: HTMLInputElement;
	submitButton: HTMLButtonElement;
	protected handleOnlineMethod: Function;
	protected handleOfflineMethod: Function;
	protected handleSubmitAddress: Function;
	protected handleValidate:Function;

	constructor(orderTemplate: HTMLTemplateElement) {
		this.orderElement = orderTemplate.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.onlineButton = this.orderElement.querySelector('button[name="card"]');
		this.offlineButton = this.orderElement.querySelector('button[name="cash"]');
		this.addressInput = this.orderElement.querySelector(
			'input[name="address"]'
		);
		this.submitButton = this.orderElement.querySelector(
			'button[type="submit"]'
		);
	}

	setCardOptionHandler(handleOnlineMethod: Function) {
		this.handleOnlineMethod = handleOnlineMethod;
		this.onlineButton.addEventListener('click', (evt) => {
			this.handleOnlineMethod(this);
		});
	}

	setCashOptionHandler(handleOfflineMethod: Function) {
		this.handleOfflineMethod = handleOfflineMethod;
		this.offlineButton.addEventListener('click', (evt) => {
			this.handleOfflineMethod(this);
		});
	}

	setSubmitOrderHandler(handleSubmitAddress: Function) {
		this.handleSubmitAddress = handleSubmitAddress;
		this.orderElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.handleSubmitAddress(this);
		});
	}

	setValidationHandle(handleValidate: Function) {
		this.handleValidate = handleValidate;
		this.orderElement.addEventListener('submit', (evt) => {
			this.handleSubmitAddress(this);
		});
	}

	getAddress() {
		return this.addressInput.value;
	}

	render(): HTMLFormElement {
		const button = this.orderElement.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		return this.orderElement;
	}
}
