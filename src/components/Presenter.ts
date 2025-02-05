import { IProduct, IProductPreview, IBasketView, IBasketItemView, IModal, BasketItem, IProductView } from "../types";
import { BasketModel } from "./models/BasketModel";
import { CatalogModel } from "./models/CatalogModel";
import { BasketItemConstructor } from "./view/BasketItemView";
import { BasketViewConstructor } from "./view/BasketView";
import { IPage } from "./view/PageView";
import { ProductPreviewConstructor } from "./view/ProdactPreview";
import { IProductConstructor } from "./view/ProductView";

export class ShopPresenter {
  protected cardTemplate: HTMLTemplateElement;
  protected cardProduct: IProduct;
  protected previewProduct: IProductPreview;
  protected basketView: IBasketView;
  protected basketButton: HTMLButtonElement
  protected basketCounter: HTMLSpanElement;
  protected productPreviewTemplate: HTMLTemplateElement;
  protected basketTemplate: HTMLTemplateElement;
  protected basketItemView: IBasketItemView;
  protected basketItemTemplate: HTMLTemplateElement;

  constructor(
    protected catalogModel: CatalogModel,
    protected basketModel: BasketModel,
    protected viewProductConstructor: IProductConstructor,
    protected viewPageContainer: IPage,
    protected basketConstructor: BasketViewConstructor,
    protected productPreviewConstructor: ProductPreviewConstructor,
    protected modal: IModal,
    protected basketItemConstructor: BasketItemConstructor,

  ) {
    this.cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
    this.productPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    this.basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
    this.basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    this.basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
    this.basketCounter = this.basketButton.querySelector('.header__basket-counter');
  }

  init() {
    this.previewProduct = new this.productPreviewConstructor(this.productPreviewTemplate)
    this.basketView = new this.basketConstructor(this.basketTemplate)
    this.basketItemView = new this.basketItemConstructor(this.basketItemTemplate);
    this.basketButton.addEventListener('click', this.handleOpenBasketView.bind(this))
    this.basketCounter.textContent = '0'
  }

  handleBuyProduct(id: string, item: BasketItem) {
    if (!this.basketModel.items.has(id)) {
      this.basketModel.add(id,item)
      this.previewProduct.buttonText = "Убрать из корзины"
    
    } else { 
      this.basketModel.remove(id,item)
      this.previewProduct.buttonText = "Купить"
    }
  }

  handleOpenPreviewModal(product: IProductView) {
    const productPre = this.catalogModel.getItem(product.data.id)
    const basketItemData = {
      name: productPre.title,
      price: productPre.price,
      id: productPre.id
    }

    this.previewProduct.data = product.data


    this.previewProduct.setHandler(() => this.handleBuyProduct(product.data.id, basketItemData))
    this.modal.content = this.previewProduct.render()
    if (!this.basketModel.items.has(product.data.id)) {
      this.previewProduct.buttonText = "Купить"
    } else {
      this.previewProduct.buttonText = "Убрать из корзины"
    }
    this.modal.open()
  }


  handleDeleteProduct(id: string, item: BasketItem) {
    if (this.basketModel.items.has(id)) {
      this.basketModel.remove(id,item)
      this.basketView.price = this.basketModel.totalPrice;
      this.previewProduct.buttonText = "Купить"
    }
  }

  handleOpenBasketView() {
    this.basketView.price = this.basketModel.totalPrice
    this.modal.content = this.basketView.render();
    this.modal.open()
  }

  renderView() {
    const productList = this.catalogModel.getItems().map((item) => {
      const productItem = new this.viewProductConstructor(this.cardTemplate);
      productItem.setOpenModalHandler(this.handleOpenPreviewModal.bind(this))
      productItem.data = item
      const itemElement = productItem.render();
      return itemElement
    })

    let indexCount = 0
    const basketList = this.basketModel.getItems().map((item) =>
      {
        indexCount++
        const basketItem = new this.basketItemConstructor(this.basketItemTemplate)
        basketItem.data = item
        const itemElement = basketItem.render()
        basketItem.indexNumber = `${indexCount}`
        basketItem.setDeleteHandler(() => this.handleDeleteProduct(item.id, item))
        console.log(this.basketModel)
        return itemElement
      } 
    ) 
   
    this.basketView.content = basketList
    this.basketCounter.textContent = `${this.basketModel.items.size}`
    this.viewPageContainer.products = productList
  }
  
  
}


