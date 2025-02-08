import { ICatalogView } from '../../types';
import { Component } from '../base/component';

export class CatalogView implements ICatalogView {
	protected productsContainer: HTMLElement;
	constructor(container: HTMLElement) {
		this.productsContainer = container.querySelector('.gallery');
	}

	set products(items: HTMLElement[]) {
		this.productsContainer.replaceChildren(...items);
	}

	render() {
		return this.productsContainer;
	}
}
