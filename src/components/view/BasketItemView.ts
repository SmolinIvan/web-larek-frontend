import { BasketItem, IBasketItemView } from '../../types';
import { Component } from '../base/component';

export interface BasketItemConstructor {
	new (template: HTMLTemplateElement): IBasketItemView;
}

export class BasketItemView extends Component<IBasketItemView> {
	protected itemElement: HTMLElement;
	protected _data: BasketItem;
	protected itemTitle: HTMLElement;
	protected priceBlock: HTMLSpanElement;
	protected handleDeleteItem: Function;
	protected button: HTMLButtonElement;
	protected index: HTMLSpanElement;

	constructor(template: HTMLTemplateElement) {
		super(template)
		this.itemElement = template.content
			.querySelector('.card_compact')
			.cloneNode(true) as HTMLElement;
		this.itemTitle = this.itemElement.querySelector('.card__title');
		this.priceBlock = this.itemElement.querySelector('.card__price');
		this.index = this.itemElement.querySelector('.basket__item-index');
		this.button = this.itemElement.querySelector('.basket__item-delete');
	}

	set data(data: BasketItem) {
		this._data = data;
	}

	get data() {
		return this._data;
	}

	set title(value: string) {
		this.itemTitle.textContent = value;
	}

	set indexNumber(value: string) {
		this.index.textContent = `${value}`;
	}

	setDeleteHandler(handleDeleteItem: Function) {
		this.handleDeleteItem = handleDeleteItem;
		this.button.addEventListener('click', (evt) => {
			this.handleDeleteItem(this);
		});
	}

	render() {
		this.itemTitle.textContent = this.data.name;
		this.priceBlock.textContent = `${this.data.price}`;
		return this.itemElement;
	}
}
