export interface IProduct {
  category: string;
  description: string;
  id: string;
  image: string;
  price: number;
  title: string;
}

export interface IProductView {
  data: IProduct;
  render(): HTMLElement;
  setOpenModalHandler(handleOpenModal: Function): void;
}

export interface IProductPreview {
  buttonText: string;
  data: IProduct
  setHandler(handleBuyProduct:Function): void;
  render(): HTMLElement
}

export interface IModal {
  content: HTMLElement;
  open(): void;
  close(): void;
}

export interface BasketItem {
  id: string;
  price: number;
  name: string;
}

export interface IBasketItemView {
  data: BasketItem;
  indexNumber: string;
  render(): HTMLElement;
  setDeleteHandler(handleDeleteItem: Function): void;
}

export interface IBasketView {
  content: HTMLElement[]
  price: number
  setHandler(handleMakeOrder:Function): void;
  render(): HTMLElement;
}

export interface ICatalogModel {
  getItems(): IProduct[];
  getItem(id: string): IProduct;
  getTotal(): number;
  set_Items(items: IProduct[]): void;
}

export interface IBasketModel {
  totalPrice: number;
  items: Map<string,BasketItem>
  add(id: string, item: BasketItem): void;
  remove(id: string, item: BasketItem): void;
  getItems(): BasketItem[];
}


