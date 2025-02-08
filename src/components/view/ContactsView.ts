import { IContactsView } from '../../types';

export interface ContactsViewConstructor {
	new (contactsViewTemplate: HTMLTemplateElement): ContactsView;
}

export class ContactsView implements IContactsView {
	protected contactsElement: HTMLFormElement;
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;
	protected handleSubmitOrder: Function;

	constructor(contactsTemplate: HTMLTemplateElement) {
		this.contactsElement = contactsTemplate.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.emailInput = this.contactsElement.querySelector('input[name="email"]');
		this.phoneInput = this.contactsElement.querySelector('input[name="phone"]');
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
