export interface IProduct {
	category: string;
	description: string;
	id: string;
	image: string;
	price: number;
	title: string;
}

export interface ICatalogView {
	products: HTMLElement[];
	render(): HTMLElement;
}

export interface IProductView {
	data: IProduct;
	render(): HTMLElement;
	setOpenModalHandler(handleOpenModal: Function): void;
}

export interface IProductPreview {
	buttonText: string;
	data: IProduct;
	setHandler(handleBuyProduct: Function): void;
	render(): HTMLElement;
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
	content: HTMLElement[];
	price: number;
	setHandler(handleMakeOrder: Function): void;
	render(): HTMLElement;
}

export interface IPaymentView {
	getAddress(): string;
	setCardOptionHandler(handleOnlineMethod: Function): void;
	setCashOptionHandler(handleOfflineMethod: Function): void;
	setSubmitOrderHandler(handleSubmitAddress: Function): void;
	render(): HTMLFormElement;
}

export interface IContactsView {
	getEmail(): string;
	getPhone(): string;
	setSubmitContacts(handleSubmitContacts: Function): void;
	render(): HTMLFormElement;
}

export interface ISuccessView {
	totalPrice: number;
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
	items: Map<string, BasketItem>;
	add(id: string, item: BasketItem): void;
	remove(id: string, item: BasketItem): void;
	getItems(): BasketItem[];
	clear(): void;
}

export interface IOrderModel {
	clear(): void;
}

export type paymentTypes = 'not_selected' | 'cash' | 'online';

export type OrderType = {
	payment: paymentTypes;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
};
