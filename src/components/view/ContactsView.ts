import { IContactsView } from '../../types';
import { Form } from '../base/Form';

export interface ContactsViewConstructor {
	new (contactsViewTemplate: HTMLTemplateElement): ContactsView;
}

export class ContactsView extends Form<IContactsView> {
	protected contactsElement: HTMLFormElement;
	emailInput: HTMLInputElement;
	phoneInput: HTMLInputElement;

	constructor(contactsTemplate: HTMLTemplateElement) {
		super(contactsTemplate);
		this.emailInput = this.form.querySelector('input[name="email"]');
		this.phoneInput = this.form.querySelector('input[name="phone"]');
	}

	orderError() {
		this.form.querySelector('.form__errors').textContent =
			'Одно из полей на этапах оформления заказа было заполнено неверно';
	}
}
