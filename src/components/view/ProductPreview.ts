import { IProduct, IProductPreview } from '../../types';
import { CDN_URL, classes } from '../../utils/constants';

export interface ProductPreviewConstructor {
	new (productPreviewTemplate: HTMLTemplateElement): IProductPreview;
}

export class ProductPreview implements IProductPreview {
	protected preview: HTMLElement;
	protected buyButton: HTMLButtonElement;
	protected handleBuyProduct: Function;
	protected descriptionElement: HTMLSpanElement;
	protected titleElement: HTMLHeadingElement;
	protected priceElement: HTMLSpanElement;
	protected categoryElement: HTMLSpanElement;
	protected imageElement: HTMLImageElement;
	protected _data: IProduct;

	constructor(productPreviewTemplate: HTMLTemplateElement) {
		this.preview = productPreviewTemplate.content
			.querySelector('.card')
			.cloneNode(true) as HTMLElement;
		this.categoryElement = this.preview.querySelector('.card__category');
		this.descriptionElement = this.preview.querySelector('.card__text');
		this.priceElement = this.preview.querySelector('.card__price');
		this.titleElement = this.preview.querySelector('.card__title');
		this.buyButton = this.preview.querySelector('button');
		this.imageElement = this.preview.querySelector('.card__image');
		this.buyButton.addEventListener('click', (evt) => {
			this.handleBuyProduct(this);
		});
	}

	set data(data: IProduct) {
		this._data = data;
	}

	get data() {
		return this._data;
	}

	set categoryColor(value: string) {
		const classNames = this.categoryElement.classList;
		this.categoryElement.classList.remove(classNames.value.split(' ').pop());
		this.categoryElement.textContent = value;
		this.categoryElement.classList.add(classes.get(value));
	}

	set buttonText(value: string) {
		this.buyButton.textContent = value;
	}

	setHandler(handleBuyProduct: Function) {
		this.handleBuyProduct = handleBuyProduct;
	}

	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	render() {
		this.categoryElement.textContent = this.data.category;
		this.categoryColor = this.data.category;
		this.priceElement.textContent = `${this.data.price} синапсов`;
		if (typeof this.data.price != 'number') {
			this.setDisabled(this.buyButton, true);
		} else {
			this.setDisabled(this.buyButton, false);
		}
		this.titleElement.textContent = this.data.title;
		this.descriptionElement.textContent = this.data.description
		this.imageElement.src = `${CDN_URL}/` + this.data.image;
		return this.preview;
	}
}
