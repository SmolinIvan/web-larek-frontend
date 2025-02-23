import {
	IProduct,
	IProductPreview,
	IBasketView,
	IBasketItemView,
	IModal,
	BasketItem,
	IProductView,
	ICatalogView,
	IPaymentView,
	IContactsView,
	ISuccessView,
} from '../types';

import { clearValidation, enableValidation } from './base/Validation';
import { BasketModel } from './models/BasketModel';
import { CatalogModel } from './models/CatalogModel';
import { OrderModel } from './models/OrderModel';
import { BasketItemConstructor } from './view/BasketItemView';
import { BasketViewConstructor } from './view/BasketView';
import { ContactsViewConstructor } from './view/ContactsView';
import { PaymentViewConstructor } from './view/PaymentView';
import { ProductPreviewConstructor } from './view/ProductPreview';
import { IProductConstructor } from './view/ProductView';
import { SuccessViewConstructor } from './view/SuccessView';
import { OrderAPI } from './API/OrderAPI';

export class ShopPresenter {
	protected cardTemplate: HTMLTemplateElement;
	protected cardProduct: IProduct;
	protected previewProduct: IProductPreview;
	protected basketView: IBasketView;
	protected basketButton: HTMLButtonElement;
	protected basketCounter: HTMLSpanElement;
	protected productPreviewTemplate: HTMLTemplateElement;
	protected basketTemplate: HTMLTemplateElement;
	protected basketItemView: IBasketItemView;
	protected basketItemTemplate: HTMLTemplateElement;
	protected paymentTemplate: HTMLTemplateElement;
	protected paymentView: IPaymentView;
	protected contactsTemplate: HTMLTemplateElement;
	protected contactsView: IContactsView;
	protected successTemplate: HTMLTemplateElement;
	protected successView: ISuccessView;

	constructor(
		protected catalogModel: CatalogModel,
		protected basketModel: BasketModel,
		protected orderModel: OrderModel,
		protected viewProductConstructor: IProductConstructor,
		protected viewPageContainer: ICatalogView,
		protected basketConstructor: BasketViewConstructor,
		protected productPreviewConstructor: ProductPreviewConstructor,
		protected modal: IModal,
		protected basketItemConstructor: BasketItemConstructor,
		protected paymentViewConstructor: PaymentViewConstructor,
		protected contactsViewConstructor: ContactsViewConstructor,
		protected successViewConstructor: SuccessViewConstructor,
		protected api: OrderAPI
	) {
		this.cardTemplate = document.querySelector(
			'#card-catalog'
		) as HTMLTemplateElement;
		this.productPreviewTemplate = document.querySelector(
			'#card-preview'
		) as HTMLTemplateElement;
		this.basketTemplate = document.querySelector(
			'#basket'
		) as HTMLTemplateElement;
		this.basketItemTemplate = document.querySelector(
			'#card-basket'
		) as HTMLTemplateElement;
		this.basketButton = document.querySelector(
			'.header__basket'
		) as HTMLButtonElement;
		this.paymentTemplate = document.querySelector(
			'#order'
		) as HTMLTemplateElement;
		this.contactsTemplate = document.querySelector(
			'#contacts'
		) as HTMLTemplateElement;
		this.successTemplate = document.querySelector(
			'#success'
		) as HTMLTemplateElement;
	}

	init() {
		this.previewProduct = new this.productPreviewConstructor(
			this.productPreviewTemplate
		);
		this.basketView = new this.basketConstructor(this.basketTemplate);
		this.basketItemView = new this.basketItemConstructor(
			this.basketItemTemplate
		);
		this.paymentView = new this.paymentViewConstructor(this.paymentTemplate);
		this.contactsView = new this.contactsViewConstructor(this.contactsTemplate);
		this.successView = new this.successViewConstructor(this.successTemplate);
		this.viewPageContainer.setBasketButtonHandler(
			this.handleOpenBasketView.bind(this)
		);
		this.api
			.getProducts()
			.then((incomingData) => {
				this.catalogModel.set_Items(incomingData.items);
			})
			.catch((err) => console.log(err));
	}

	handleBuyProduct(id: string, item: BasketItem) {
		if (!this.basketModel.items.has(id)) {
			this.basketModel.add(id, item);
			this.previewProduct.buttonText = 'Убрать из корзины';
		} else {
			this.basketModel.remove(id, item);
			this.previewProduct.buttonText = 'Купить';
		}
	}

	handleOpenPreviewModal(product: IProductView) {
		const productPre = this.catalogModel.getItem(product.data.id);
		const basketItemData = {
			name: productPre.title,
			price: productPre.price,
			id: productPre.id,
		};

		this.previewProduct.data = product.data;
		this.previewProduct.setHandler(() =>
			this.handleBuyProduct(product.data.id, basketItemData)
		);
		this.modal.content = this.previewProduct.render();
		if (!this.basketModel.items.has(product.data.id)) {
			this.previewProduct.buttonText = 'Купить';
		} else {
			this.previewProduct.buttonText = 'Убрать из корзины';
		}
		this.modal.open();
	}

	handleDeleteProduct(id: string, item: BasketItem) {
		if (this.basketModel.items.has(id)) {
			this.basketModel.remove(id, item);
			this.basketView.price = this.basketModel.totalPrice;
			this.previewProduct.buttonText = 'Купить';
		}
	}

	handleOpenBasketView() {
		this.basketView.price = this.basketModel.totalPrice;
		this.basketView.setHandler(this.handleOpenPayment.bind(this));
		this.modal.content = this.basketView.render();
		this.modal.open();
	}

	handleOpenPayment() {
		this.paymentView.setCardOptionHandler(
			this.handleMakeOnlineOption.bind(this)
		);
		this.paymentView.setCashOptionHandler(this.handleMakeCashOption.bind(this));
		clearValidation(this.paymentView.render(), '.form__input');
		enableValidation(
			this.paymentView.render(),
			'.form__input',
			this.paymentView.submitButton
		);
		this.paymentView.setSubmitHandler(this.handleSubmitOrder.bind(this));
		this.modal.content = this.paymentView.render();
	}

	handleMakeOnlineOption() {
		this.paymentView.offlineButton.classList.remove('button_alt-active');
		this.paymentView.offlineButton.classList.add('button_alt');
		this.paymentView.onlineButton.classList.remove('button_alt');
		this.paymentView.onlineButton.classList.add('button_alt-active');
		this.orderModel.orderData.payment = 'online';
	}

	handleMakeCashOption() {
		this.paymentView.onlineButton.classList.remove('button_alt-active');
		this.paymentView.onlineButton.classList.add('button_alt');
		this.paymentView.offlineButton.classList.remove('button_alt');
		this.paymentView.offlineButton.classList.add('button_alt-active');
		this.orderModel.payment = 'cash';
	}

	handleSubmitOrder() {
		if (this.orderModel.orderData.payment === 'not_selected') {
			this.paymentView.render().querySelector('.form__errors').textContent =
				'Не выбран способ оплаты';
		} else {
			this.orderModel.address = this.paymentView.getInputData(
				this.paymentView.addressInput
			);
			this.contactsView.setSubmitHandler(this.handleSubmitContacts.bind(this));
			this.modal.content = this.contactsView.render();
			clearValidation(this.contactsView.render(), '.form__input');
			enableValidation(
				this.contactsView.render(),
				'.form__input',
				this.contactsView.submitButton
			);
		}
	}

	handleSubmitContacts() {
		this.orderModel.phone = this.contactsView.getInputData(
			this.contactsView.phoneInput
		);
		this.orderModel.email = this.contactsView.getInputData(
			this.contactsView.emailInput
		);
		this.orderModel.total = this.basketModel.totalPrice;
		this.orderModel.items = Array.from(this.basketModel.items.keys());
		if (this.checkOrderData()) {
			this.successView.totalPrice = this.orderModel.orderData.total;
			this.api
				.postOrder(this.orderModel.orderData)
				.catch((err) => console.log(err));
			this.orderModel.clear();
			this.basketModel.clear();
			this.paymentView.clearInputs();
			this.paymentView.uncheckPaymentMethod();
			this.contactsView.clearInputs();
			this.successView.setHandleSuccess(this.handleCloseSuccess.bind(this));
			this.modal.content = this.successView.render();
		} else {
			this.contactsView.orderError();
		}
	}

	handleCloseSuccess() {
		this.modal.close();
	}

	checkOrderData(): boolean {
		const checkNulls = Object.values(this.orderModel.orderData).some(
			(value) => value === null
		);
		const checkEmptyItems =
			JSON.stringify(this.orderModel.orderData.items) === JSON.stringify([]);
		const checkPayment = this.orderModel.orderData.payment === 'not_selected';
		return !(checkNulls || checkEmptyItems || checkPayment);
	}

	renderCatalogView() {
		const productList = this.catalogModel.getItems().map((item) => {
			const productItem = new this.viewProductConstructor(this.cardTemplate);
			productItem.data = item;
			productItem.setOpenModalHandler(this.handleOpenPreviewModal.bind(this));
			const itemElement = productItem.render();
			return itemElement;
		});
		this.viewPageContainer.products = productList;
	}

	renderBasketView() {
		let indexCount = 0;
		const basketList = this.basketModel.getItems().map((item) => {
			indexCount++;
			const basketItem = new this.basketItemConstructor(
				this.basketItemTemplate
			);
			basketItem.data = item;
			const itemElement = basketItem.render();
			basketItem.indexNumber = `${indexCount}`;
			basketItem.setDeleteHandler(() =>
				this.handleDeleteProduct(item.id, item)
			);
			console.log(this.basketModel);
			return itemElement;
		});

		this.basketView.content = basketList;
		this.viewPageContainer.setProductCounter(indexCount);
		this.basketView.setDisabled(
			this.basketView.makeOrderButton,
			indexCount === 0
		);
	}
}
