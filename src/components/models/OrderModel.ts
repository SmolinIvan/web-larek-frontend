import { OrderType, paymentTypes } from '../../types';
import { IEvents } from '../base/events';

export class OrderModel {
	protected _orderData: OrderType = {
		payment: 'not_selected',
		email: null,
		phone: null,
		address: null,
		total: 0,
		items: [],
	};

	constructor(protected events: IEvents) {}

	set payment(value: paymentTypes) {
		this._orderData.payment = value;
	}

	set email(value: string) {
		this._orderData.email = value;
	}

	set phone(value: string) {
		this._orderData.phone = value;
	}

	set address(value: string) {
		this._orderData.address = value;
	}

	set items(values: string[]) {
		this._orderData.items = values;
	}

	set total(value: number) {
		this._orderData.total = value;
	}

	get orderData() {
		return this._orderData;
	}

	clear() {
		this._orderData = {
			payment: 'not_selected',
			email: null,
			phone: null,
			address: null,
			total: 0,
			items: [],
		};

		this.events.emit('order:changed');
	}
}
