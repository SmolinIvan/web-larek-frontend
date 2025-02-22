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
import { checkInputValidity, clearValidation, enableValidation } from './base/Validation';
import { BasketModel } from './models/BasketModel';
import { CatalogModel } from './models/CatalogModel';
import { OrderModel } from './models/OrderModel';
import { BasketItemConstructor } from './view/BasketItemView';
import { BasketViewConstructor } from './view/BasketView';
import { ContactsViewConstructor } from './view/ContactsView';
import { PaymentViewConstructor } from './view/PaymentView';
import { ProductPreviewConstructor } from './view/ProdactPreview';
import { IProductConstructor } from './view/ProductView';
import { SuccessViewConstructor } from './view/SuccessView';

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
		protected successViewConstructor: SuccessViewConstructor
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
		this.viewPageContainer.setBasketButtonHandler(this.handleOpenBasketView.bind(this))
		
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

		this.viewPageContainer.locked = true
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
		// надо навесить валидацию
		this.paymentView.setCardOptionHandler(this.handleMakeOnlineOption.bind(this));
		this.paymentView.setCashOptionHandler(this.handleMakeCashOption.bind(this));

		// доделать
		clearValidation(this.paymentView.render(), '.form__input');
		enableValidation(this.paymentView.render(), '.form__input', this.paymentView.submitButton)

		
		this.paymentView.setSubmitHandler(this.handleSubmitOrder.bind(this));
		console.log(this.orderModel.orderData.payment)
		this.modal.content = this.paymentView.render();
		console.log(this.orderModel)
	}

	// validateForm = enableValidation

	handleMakeOnlineOption() {
		this.paymentView.offlineButton.classList.remove('button_alt-active')
		this.paymentView.offlineButton.classList.add('button_alt')
		this.paymentView.onlineButton.classList.remove('button_alt')
		this.paymentView.onlineButton.classList.add('button_alt-active')
		this.orderModel.orderData.payment = 'online';
	}

	handleMakeCashOption() {
		this.paymentView.onlineButton.classList.remove('button_alt-active')
		this.paymentView.onlineButton.classList.add('button_alt')
		this.paymentView.offlineButton.classList.remove('button_alt')
		this.paymentView.offlineButton.classList.add('button_alt-active')
		this.orderModel.payment = 'cash';
	}

	handleSubmitOrder() {
		if (this.orderModel.orderData.payment === 'not_selected') {
			this.paymentView.render().querySelector('.form__errors').textContent = 'Не выбран способ оплаты'
		} else {
			this.orderModel.address = this.paymentView.getInputData(this.paymentView.addressInput);
			this.contactsView.setSubmitContacts(this.handleSubmitContacts.bind(this));
			this.modal.content = this.contactsView.render();
			clearValidation(this.contactsView.render(), '.form__input');
			enableValidation(this.contactsView.render(), '.form__input', this.contactsView.submitButton)
			console.log(this.paymentView.getInputData(this.paymentView.addressInput))
		}
	}

	handleSubmitContacts() {
		this.orderModel.phone = this.contactsView.getPhone();
		this.orderModel.email = this.contactsView.getEmail();
		this.orderModel.total = this.basketModel.totalPrice;
		this.orderModel.items = Array.from(this.basketModel.items.keys());
		console.log(this.orderModel.orderData, this.orderModel.orderData.total);
		this.successView.totalPrice = this.orderModel.orderData.total;
		this.orderModel.clear();
		this.basketModel.clear();
		this.modal.content = this.successView.render();
	
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
		// this.viewPageContainer.setProductCounter((this.basketModel.getItems()).length)
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
		
		this.viewPageContainer.setProductCounter(indexCount)

		// вернуть
		// this.basketView.setDisabled(this.basketView.makeOrderButton, indexCount === 0)

		// this.basketCounter.textContent = `${this.basketModel.items.size}`;
	}
}
