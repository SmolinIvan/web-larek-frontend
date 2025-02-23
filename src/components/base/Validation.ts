export function enableValidation(
	formElement: HTMLElement,
	formInput: string,
	buttonElement: HTMLButtonElement
) {
	const inputList = Array.from(
		formElement.querySelectorAll(formInput)
	) as HTMLInputElement[];
	inputList.forEach((inputElement: HTMLInputElement) => {
		inputElement.addEventListener('input', function () {
			checkInputValidity(formElement, inputElement);
			toggleButtonState(inputList, buttonElement);
		});
	});
	toggleButtonState(inputList, buttonElement);
}

function showInputError(formElement: HTMLElement, errorMessage: string) {
	const errorElement = formElement.querySelector(`.form__errors`);
	errorElement.textContent = errorMessage;
}

function hideInputError(formElement: HTMLElement) {
	const errorElement = formElement.querySelector(`.form__errors`);
	errorElement.textContent = '';
}

export function checkInputValidity(
	formElement: HTMLElement,
	inputElement: HTMLInputElement
) {
	if (inputElement.validity.patternMismatch) {
		inputElement.setCustomValidity('Неверно заполнен email и/или телефон');
	} else {
		inputElement.setCustomValidity('');
	}

	if (!inputElement.validity.valid) {
		showInputError(formElement, inputElement.validationMessage);
	} else {
		hideInputError(formElement);
	}
}

export function hasInvalidInput(inputList: HTMLInputElement[]) {
	return inputList.some((input: HTMLInputElement) => {
		return !input.validity.valid;
	});
}

function toggleButtonState(
	inputList: HTMLInputElement[],
	buttonElement: HTMLButtonElement
) {
	if (hasInvalidInput(inputList)) {
		buttonElement.disabled = true;
	} else {
		buttonElement.disabled = false;
	}
}

export function clearValidation(
	formElement: HTMLFormElement,
	formInput: string
) {
	const inputList = Array.from(
		formElement.querySelectorAll(formInput)
	) as HTMLInputElement[];
	inputList.forEach((inputElement) => {
		hideInputError(formElement);
	});
}
