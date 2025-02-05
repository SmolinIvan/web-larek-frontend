import { IBasketView } from "../../types";

export interface BasketViewConstructor {
  new (basketViewTemplate: HTMLTemplateElement): IBasketView 
}

export class BasketView implements IBasketView {
  protected basketElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected handleMakeOrder: Function;
  protected _content: HTMLElement;

  constructor(basketViewTemplate: HTMLTemplateElement) {
    this.basketElement = basketViewTemplate.content.querySelector('.basket').cloneNode(true) as HTMLElement
    this.priceElement = this.basketElement.querySelector('.basket__price')
    this._content = this.basketElement.querySelector('.basket__list')
  }

  set content(items: HTMLElement[]) {
    this._content.replaceChildren(...items)
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`
  }

  setHandler(handleMakeOrder: Function): void {
    this.handleMakeOrder = handleMakeOrder
  }

  render() {
    return this.basketElement
  }
}
