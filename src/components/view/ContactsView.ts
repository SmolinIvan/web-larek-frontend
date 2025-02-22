import { IContactsView } from '../../types';
import { Component } from '../base/component';

export interface ContactsViewConstructor {
	new (contactsViewTemplate: HTMLTemplateElement): ContactsView;
}

export class ContactsView extends Component<IContactsView> {
	protected contactsElement: HTMLFormElement;
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;
	protected handleSubmitOrder: Function;
	submitButton: HTMLButtonElement;

	constructor(contactsTemplate: HTMLTemplateElement) {
		super(contactsTemplate)
		this.contactsElement = contactsTemplate.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.emailInput = this.contactsElement.querySelector('input[name="email"]');
		this.phoneInput = this.contactsElement.querySelector('input[name="phone"]');
		this.submitButton = this.contactsElement.querySelector(
			'button[type="submit"]'
		);
	}

	getEmail() {
		return this.emailInput.value;
	}

	getPhone() {
		return this.phoneInput.value;
	}

	setSubmitContacts(handleSubmitOrder: Function) {
		this.handleSubmitOrder = handleSubmitOrder;
		this.contactsElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.handleSubmitOrder(this);
		});
	}

	render(): HTMLFormElement {
		const button = this.contactsElement.querySelector(
			'.button'
		) as HTMLButtonElement;
		button.disabled = false;
		return this.contactsElement;
	}
}
