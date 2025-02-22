import { IBasketView } from '../../types';
import { Component } from '../base/component';

export interface BasketViewConstructor {
	new (basketViewTemplate: HTMLTemplateElement): IBasketView;
}

export class BasketView extends Component<IBasketView> {
	protected basketElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected handleMakeOrder: Function;
	protected _content: HTMLElement;
	protected kek: HTMLElement
	makeOrderButton: HTMLButtonElement;

	constructor(basketViewTemplate: HTMLTemplateElement) {
		super(basketViewTemplate)
		this.basketElement = basketViewTemplate.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		// this.basketElement = this.container;
		this.priceElement = this.basketElement.querySelector('.basket__price');
		this._content = this.basketElement.querySelector('.basket__list');
		this.makeOrderButton = this.basketElement.querySelector('.basket__button');
	}

	set content(items: HTMLElement[]) {
		this._content.replaceChildren(...items);
	}

	set price(value: number) {
		this.priceElement.textContent = `${value} синапсов`;
	}

	setHandler(handleMakeOrder: Function): void {
		this.handleMakeOrder = handleMakeOrder;
		this.makeOrderButton.addEventListener('click', (evt) => {
			this.handleMakeOrder(this);
		});
	}

	render() {
		return this.basketElement;
	}
}
