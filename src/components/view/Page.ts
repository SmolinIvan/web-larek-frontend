import { ICatalogView } from '../../types';
import { Component } from '../base/component';

export class PageView extends Component<ICatalogView>  {
	protected productsContainer: HTMLElement;
	basketButton: HTMLButtonElement;
	protected mainPage: HTMLElement;
	protected basketCounter: HTMLElement;
	protected handleBasketOpen: Function;
	protected productsCount: number;

	constructor() {
		super(document.querySelector('.page'))
		this.productsContainer = this.container.querySelector('.gallery');
		this.basketButton = this.container.querySelector('.header__basket');
		this.basketCounter = this.container.querySelector('.header__basket-counter')

	}

	set products(items: HTMLElement[]) {
		this.productsContainer.replaceChildren(...items);
	}

	setProductCounter(productsCount: number) {
		this.basketCounter.textContent = `${productsCount}`
	}

	setBasketButtonHandler(handleBasketOpen: Function) {
		this.handleBasketOpen = handleBasketOpen;
		this.basketButton.addEventListener('click', (evt) => {
			this.handleBasketOpen(this);
		});
	}

	blockPage() {

	}

	render() {
		return this.productsContainer;
	}
}
