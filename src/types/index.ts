import { ApiListResponse } from '../components/base/api';

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
	locked: boolean;
	basketButton: HTMLButtonElement;
	setProductCounter(productsCount: number): void;
	setDisabled(element: HTMLElement, state: boolean): void;
	setBasketButtonHandler(handleBasketOpen: Function): void;
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
	makeOrderButton: HTMLButtonElement;
	setDisabled(element: HTMLElement, state: boolean): void;
	setHandler(handleMakeOrder: Function): void;
	render(): HTMLElement;
}

export interface IPaymentView {
	onlineButton: HTMLButtonElement;
	offlineButton: HTMLButtonElement;
	submitButton: HTMLButtonElement;
	addressInput: HTMLInputElement;
	getInputData(input: HTMLInputElement): string;
	setSubmitHandler(handleSubmit: Function): void;
	setCardOptionHandler(handleOnlineMethod: Function): void;
	setCashOptionHandler(handleOfflineMethod: Function): void;
	setValidationHandle(handleValidate: Function): void;
	uncheckPaymentMethod(): void;
	clearInputs(): void;
	render(): HTMLFormElement;
}

export interface IContactsView {
	emailInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
	submitButton: HTMLButtonElement;
	orderError(): void;
	getInputData(input: HTMLInputElement): string;
	setSubmitHandler(handleSubmit: Function): void;
	clearInputs(): void;
	render(): HTMLFormElement;
}

export interface ISuccessView {
	totalPrice: number;
	setHandleSuccess(handleSuccess: Function): void;
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

export interface IOrderApi {
	getProducts(): Promise<ApiListResponse<IProduct>>;
	postOrder(data: OrderType): any;
}

export type paymentTypes = 'not_selected' | 'cash' | 'online';

export type OrderType = {
	payment: paymentTypes;
	email: string | null;
	phone: string | null;
	address: string | null;
	total: number | null;
	items: string[];
};
