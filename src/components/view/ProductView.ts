import { IProduct, IProductView } from '../../types';
import { CDN_URL, classes } from '../../utils/constants';
import { Component } from '../base/component';

export interface IProductConstructor {
	new (template: HTMLTemplateElement): IProductView;
}

export class ProductView extends Component<IProductView> {
	protected itemElement: HTMLElement;
	protected _data: IProduct;
	protected itemTitle: HTMLElement;
	protected categoryBlock: HTMLSpanElement;
	protected imageBlock: HTMLImageElement;
	protected priceBlock: HTMLSpanElement;
	protected handleOpenModal: Function;
	protected button: HTMLButtonElement;
	protected id: string;

	constructor(template: HTMLTemplateElement) {
		super(template)
		this.itemElement = template.content
			.querySelector('.gallery__item')
			.cloneNode(true) as HTMLElement;
		this.itemTitle = this.itemElement.querySelector('.card__title');
		this.categoryBlock = this.itemElement.querySelector('.card__category');
		this.imageBlock = this.itemElement.querySelector(
			'.card__image'
		) as HTMLImageElement;
		this.priceBlock = this.itemElement.querySelector('.card__price');
	}

	set data(value: IProduct) {
		this._data = value;
	}

	get data() {
		return this._data;
	}

	setOpenModalHandler(handleOpenModal: Function) {
		this.handleOpenModal = handleOpenModal;
		this.itemElement.addEventListener('click', (evt) => {
			this.handleOpenModal(this);
		});
	}

	render() {
		this.itemTitle.textContent = this._data.title;
		this.priceBlock.textContent = `${this._data.price} синапсов`;
		this.imageBlock.src = `${CDN_URL}/` + this._data.image;
		this.categoryBlock.textContent = this._data.category;
		this.categoryBlock.classList.remove('card__category_soft');
		this.categoryBlock.classList.add(classes.get(this._data.category));
		return this.itemElement;
	}
}
