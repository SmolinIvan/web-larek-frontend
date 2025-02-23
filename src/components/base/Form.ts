export abstract class Form<T> {
	protected form: HTMLFormElement;
	protected handleSubmit: Function;
	submitButton: HTMLButtonElement;

	constructor(formTemplate: HTMLTemplateElement) {
		this.form = formTemplate.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.submitButton = this.form.querySelector('button[type="submit"]');
	}

	setSubmitHandler(handleSubmit: Function) {
		this.handleSubmit = handleSubmit;
		this.form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.handleSubmit(this);
		});
	}

	getInputData(input: HTMLInputElement) {
		return input.value;
	}

	clearInputs() {
		const inputs = this.form.querySelectorAll('input');
		inputs.forEach((input) => (input.value = ''));
	}

	render(): HTMLFormElement {
		return this.form;
	}
}
