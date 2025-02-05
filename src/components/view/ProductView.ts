import { IProduct, IProductView } from "../../types";
import { CDN_URL, classes } from "../../utils/constants";

export interface IProductConstructor {
  new (template: HTMLTemplateElement) : IProductView
}

export class ProductView implements IProductView{
  protected itemElement: HTMLElement;
  protected _data: IProduct;
  protected itemTitle: HTMLElement;
  protected categoryBlock: HTMLSpanElement;
  protected imageBlock: HTMLImageElement;
  protected priceBlock: HTMLSpanElement;
  protected productDescription: string
  protected handleOpenModal: Function;
  protected button: HTMLButtonElement

  constructor(template: HTMLTemplateElement) {
    this.itemElement = template.content.querySelector('.gallery__item').cloneNode(true) as HTMLElement;
    this.itemTitle = this.itemElement.querySelector('.card__title');
    this.categoryBlock = this.itemElement.querySelector('.card__category');
    this.imageBlock = this.itemElement.querySelector('.card__image') as HTMLImageElement;
    this.priceBlock = this.itemElement.querySelector('.card__price');
  }

  set data(value: IProduct) {
      this._data = value;
  }

  get data() {
    return this._data
  }

  set description (value: string) {
    this.productDescription = value
  }

  set title (value: string) {
    this.itemTitle.textContent = value
  }

  setOpenModalHandler(handleOpenModal: Function) {
    this.handleOpenModal = handleOpenModal
    this.itemElement.addEventListener('click', (evt) => {
      this.handleOpenModal(this)
    }) 
  }

  render() {
    this.itemTitle.textContent = this.data.title
    this.priceBlock.textContent = `${this.data.price} синапсов`
    this.imageBlock.src = `${CDN_URL}/`+ this.data.image
    this.categoryBlock.textContent = this.data.category
    this.categoryBlock.classList.remove('card__category_soft')
    this.categoryBlock.classList.add(classes.get(this.data.category))
    this.description = this.data.description
    return this.itemElement
  }
}