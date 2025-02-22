import { ICatalogView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

export class PageView extends Component<ICatalogView>  {
	protected productsContainer: HTMLElement;
	basketButton: HTMLButtonElement;
	protected mainPage: HTMLElement;
	protected basketCounter: HTMLElement;
	protected handleBasketOpen: Function;
	protected productsCount: number;
	protected _wrapper: HTMLElement;

	constructor() {
		super(document.querySelector('.page'))
		this.productsContainer = this.container.querySelector('.gallery');
		this.basketButton = this.container.querySelector('.header__basket');
		this.basketCounter = this.container.querySelector('.header__basket-counter')
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

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

	set locked(value: boolean) {
		if (value) {
				this._wrapper.classList.remove('page__wrapper');
				this._wrapper.classList.add('page__wrapper_locked');
		} else {
				this._wrapper.classList.remove('page__wrapper_locked');
				this._wrapper.classList.add('page__wrapper');
		}
}

	// lockPage() {
	// 	// Сохраняем текущую позицию прокрутки
	// 	const scrollPosition = window.scrollY || document.documentElement.scrollTop;
		
	// 	// Добавляем класс
		
		
	// 	// Восстанавливаем позицию прокрутки
	// 	console.log(scrollPosition)
	// 	window.scrollTo(0, scrollPosition);
	// 	this._wrapper.classList.add('page_wrapper_locked');
	// }

 	// unlockPage() {
	// 	this._wrapper.classList.remove('page__wrapper_locked');
	// }

	render() {
		return this.productsContainer;
	}
}
