import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/models/BasketModel';
import { CatalogModel } from './components/models/CatalogModel';
import { ShopPresenter } from './components/Presenter';
import { BasketItemView } from './components/view/BasketItemView';
import { BasketView } from './components/view/BasketView';
import { ModalView } from './components/view/ModalView';
import { PageView } from './components/view/PageView';
import { ProductPreview } from './components/view/ProdactPreview';
import { ProductView } from './components/view/ProductView';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL } from './utils/constants';


const api = new Api(API_URL)

const events = new EventEmitter()
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);

const modalTemplate = document.querySelector('#modal-container') as HTMLElement; 
const modal = new ModalView(modalTemplate)

const page = new PageView(document.querySelector('.page') as HTMLElement);


api.get('/product')
    .then((data: ApiListResponse<IProduct>)=> {
        catalogModel.set_Items(data.items)
    })
    .catch(err => console.log(err))

const presenter = new ShopPresenter(catalogModel, basketModel, ProductView, page, BasketView, ProductPreview, modal, BasketItemView)

presenter.init();
presenter.renderView();


events.on('items:changed', () => {
    presenter.renderView();
})

events.on('basket:changed', () => {
    presenter.renderView();
})