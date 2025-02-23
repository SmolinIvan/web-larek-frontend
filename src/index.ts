import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/models/BasketModel';
import { CatalogModel } from './components/models/CatalogModel';
import { ShopPresenter } from './components/Presenter';
import { BasketItemView } from './components/view/BasketItemView';
import { BasketView } from './components/view/BasketView';
import { ModalView } from './components/view/ModalView';
import { PageView } from './components/view/Page';
import { ProductPreview } from './components/view/ProductPreview';
import { ProductView } from './components/view/ProductView';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { PaymentView } from './components/view/PaymentView';
import { OrderModel } from './components/models/OrderModel';
import { ContactsView } from './components/view/ContactsView';
import { SuccessView } from './components/view/SuccessView';
import { OrderAPI } from './components/API/OrderAPI';

const orderApi = new OrderAPI(API_URL);
const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const modalTemplate = document.querySelector('#modal-container') as HTMLElement;
const modal = new ModalView(modalTemplate, events);

const page = new PageView();

const presenter = new ShopPresenter(
	catalogModel,
	basketModel,
	orderModel,
	ProductView,
	page,
	BasketView,
	ProductPreview,
	modal,
	BasketItemView,
	PaymentView,
	ContactsView,
	SuccessView,
	orderApi
);

presenter.init();
presenter.renderBasketView();

events.on('items:changed', () => {
	presenter.renderCatalogView();
});

events.on('basket:changed', () => {
	presenter.renderBasketView();
});

events.on('order:changed', () => {
	presenter.renderBasketView();
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
