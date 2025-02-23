import { IPaymentView } from '../../types';
import { Form } from '../base/Form';

export interface PaymentViewConstructor {
	new (orderViewTemplate: HTMLTemplateElement): IPaymentView;
}

export class PaymentView extends Form<IPaymentView> {
	protected orderElement: HTMLFormElement;
	onlineButton: HTMLButtonElement;
	offlineButton: HTMLButtonElement;
	addressInput: HTMLInputElement;

	protected handleOnlineMethod: Function;
	protected handleOfflineMethod: Function;
	protected handleSubmitAddress: Function;
	protected handleValidate: Function;

	constructor(orderTemplate: HTMLTemplateElement) {
		super(orderTemplate);
		this.onlineButton = this.form.querySelector('button[name="card"]');
		this.offlineButton = this.form.querySelector('button[name="cash"]');
		this.addressInput = this.form.querySelector('input[name="address"]');
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

	uncheckPaymentMethod() {
		const checkedButton = this.form.querySelector('.button_alt-active');
		checkedButton.classList.remove('button_alt-active');
		checkedButton.classList.add('button_alt');
	}

	setValidationHandle(handleValidate: Function) {
		this.handleValidate = handleValidate;
		this.form.addEventListener('submit', (evt) => {
			this.handleSubmitAddress(this);
		});
	}
}
