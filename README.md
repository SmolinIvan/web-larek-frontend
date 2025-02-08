# Проектная работа "Веб-ларек" (сдача документации)

(К сожалению, я запутался в описании задания и чек-листе к проектной работе 8-ого спринта, и начал реализовывать функционал, пока не дошел до валидации форм, и понял, что задание слишком объемное. Я перечитал задание и начал писать документацию в READ.me Прошу считать эту итерацию как попытку сдать документацию, если это возможно, спасибо)
Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проект "Веб-ларёк" реализует пример типового интернет-магазина. Пользователь может ознакомиться с каталогом товаров, добавлять и убирать товары из корзины, произвести оплату продуктов, лежащих в корзине. Проект реализован на TypeScript с использованием MVP-паттерна. Для получения данных используется API

## Описание интерфейса

Интерфейс можно условно разделить на 3 процесса:

1. Просмотр каталога товаров на странице (Page) и выбор продукта (ProductPreview). Здесь можно добавить в корзину товар, или убрать его от туда
2. Просмотр корзины (BasketView). Из корзины товары можно только удалить или перейти к оплате товаров
3. Оформление заказа (PayOptionsView, UserDataView, SuccessView)

Просмотр товаров, корзины и оформление заказа происходит внутри модального окна: содержимое форм, корзины и карточек отображается внутри одного и того же модального окна

## Структура проекта

.
├── src/
│ ├── common.blocks/ [Стили компонент верстки]
│ ├── components/ [Реализация]
│ │ ├── base/ [Базовый код]
│ │ ├── model/ [Модели данных]
│ │ ├── view/ [Отображения]
│ ├── pages/
│ │ ├── index.html [Основная страница и шаблоны компонент]
│ ├── types/ [Типизация]
│ │ ├── index.ts [Модели данных и отображения]
│ ├── utils/
│ │ ├── constants.ts [Константы для проекта]
│ │ ├── utils.ts [Утилиты для работы с DOM]
├── api.yaml [Спецификация API]

## Архитектура проекта (MVP)

Реализовано 3 модели данных: CatalogModel, BasketModel, и OrderModel (`src/components/model/СatalogModel.ts`, `src/components/model/BasketModel.ts`, `src/components/model/OrderModel.ts`). После получения ответа от сервера, данные о продуктах хранятся в CatalogModel, при выборе определенных продуктов соответствущие данные добавляются в BasketModel (или удаляются от туда соответствующим методом). После выбора продуктов на этапе оформления заказа данные о продуктах из корзины добавляются в OrderModel, туда же добавляются данные о плательщике. После оплаты CatalogModel очищается. Все изменения данных происходят через методы соответствующих моделей, а они в свою очередь уведомляют об изменениях через метод настроек `on(items: changed)` и `on(basket: changed)`.

Экземпляры моделей, экземпляр модального окна, экземпляр основной страницы и классы отвечающие за отображение элементов на странице передаются в Презентер (`src/components/model/Presenter.ts`). Презентер обрабатывает действия пользователя, отображает актуальное состояние страницы в зависимости от моделей и обновляет состояния моделей через их методы
которые по факту являются обработчиками пользовательских действий и обновляют состояние модели через ее методы.

Пример взаимодействия:

1. С сервера приходят данные и сохраняются в CatalogModel
2. При сохранении данных в модель вызывается событие отрисовки карточек товаров
3. При клике на карточку срабатывает событие открывающее модальное окно, в модальное окно отрисовываются данные выбранного товара (ProductPreview)
4. При добавлении товара в корзину данные о товаре добавлю.тся в BasketModel, содержимое корзины отрисовывается (BasketPreview)
5. При клике на "Оформить" вызывается событие открывающее модальное окно с содержимым формы для выбора способа оплаты (PaymentView)
6. При заполнении формы в OrderModel сохраняется выбранные данных, которые хранились в BasketModel и данные веденные с формы. Срабатывает событие вызывающее открытие модального окна с способом оплаты (ContactsView)
7. При сохранении данных с этой формы в OrderModel добавляются данные введенный в форме и отправляется запрос на сервер с данными хранящимися в OrderModel. BasketModel очищается, BasketView очищается, OrderModel очищается, отображается модального окно об успешной операции (SuccessView)

## Базовый код

### Отображения

#### Класс CatalogView отвечает за отрисовку карточек на странице

```typescript
class CatalogView {
	// свойства класса
	protected productsContainer: HTMLElement;

	// в конструктор передаем контейнер, внутри которого будут отрисовываться карточки
	constructor(container: HTMLElement) {
		this.productsContainer = container.querySelector('.gallery');
	}

	//методы

	//устанавливаем массив элементом который будет отрисован
	set products(items: HTMLElement[]) {
		this.productsContainer.replaceChildren(...items);
	}

	// отрисовываем контент
	render() {
		return this.productsContainer;
	}
}
```

#### Класс ProductView - отображает карточку каталога. В карточке есть картинка, цена, название товара и категория

```typescript
class ProductView {
	// свойства класса
	protected itemElement: HTMLElement; // сам HTML элемент (карточка)
	protected _data: IProduct; // данные карточки
	protected itemTitle: HTMLElement; // Заголовок
	protected categoryBlock: HTMLSpanElement; // категория
	protected imageBlock: HTMLImageElement; // картинка
	protected priceBlock: HTMLSpanElement; // цена
	protected handleOpenModal: Function; // событие, которое будет происходить при нажатии на карточку (открытие модалки)
	protected button: HTMLButtonElement; // кнопка карточки, вся карточка является кнопкой

	// в конструктор передаем шаблон
	constructor(template: HTMLTemplateElement) {
		this.itemElement = template.content
			.querySelector('.gallery__item')
			.cloneNode(true) as HTMLElement;
		this.itemTitle = this.itemElement.querySelector('.card__title');
		this.categoryBlock = this.itemElement.querySelector('.card__category');
		this.imageBlock = this.itemElement.querySelector(
			'.card__image'
		) as HTMLImageElement;
		this.priceBlock = this.itemElement.querySelector('.card__price');
	}

	// методы класса

	// сохраняем данные
	set data(value: IProduct) {
		this._data = value;
	}

	// получаем доступ к ним
	get data() {
		return this._data;
	}

	// устанавливаем слушатель события на кнопку
	setOpenModalHandler(handleOpenModal: Function) {
		this.handleOpenModal = handleOpenModal;
		this.itemElement.addEventListener('click', (evt) => {
			this.handleOpenModal(this);
		});
	}

	// отрисовываем карточку
	render() {
		this.itemTitle.textContent = this.data.title;
		this.priceBlock.textContent = `${this.data.price} синапсов`;
		this.imageBlock.src = `${CDN_URL}/` + this.data.image;
		this.categoryBlock.textContent = this.data.category;
		this.categoryBlock.classList.remove('card__category_soft');
		this.categoryBlock.classList.add(classes.get(this.data.category));
		return this.itemElement;
		return this.itemElement;
	}
}
```

#### Класс ProductPreview - отображает более подробную информацию о товаре. Инфо о карточке отображается внутри модального окна ModalView

```typescript
class ProductPreview {
	// свойства класса
	protected preview: HTMLElement; // сам элемент, который будет отображаться внутри модального окна
	protected buyButton: HTMLButtonElement; // кнопка для добавления товара
	protected handleBuyProduct: Function; // событие, которое будет происходить при нажатии на кнопку
	protected descriptionElement: HTMLSpanElement; // элемент с описанием карточки
	protected titleElement: HTMLHeadingElement; // элемент с названием товара
	protected priceElement: HTMLSpanElement; // цена
	protected categoryElement: HTMLSpanElement; // категория
	protected imageElement: HTMLImageElement; // картинка
	protected _data: IProduct; // данные, необходимые для отрисовки превью продукта

	// в конструктор класса передаем шаблон
	constructor(productPreviewTemplate: HTMLTemplateElement) {
		this.preview = productPreviewTemplate.content
			.querySelector('.card')
			.cloneNode(true) as HTMLElement;
		this.categoryElement = this.preview.querySelector('.card__category');
		this.descriptionElement = this.preview.querySelector('.card__text');
		this.priceElement = this.preview.querySelector('.card__price');
		this.titleElement = this.preview.querySelector('.card__title');
		this.buyButton = this.preview.querySelector('button');
		this.imageElement = this.preview.querySelector('.card__image');
		this.buyButton.addEventListener('click', (evt) => {
			this.handleBuyProduct(this);
		});
	}

	// сохраняем данные
	set data(data: IProduct) {
		this._data = data;
	}

	// получаем доступ к данным
	get data() {
		return this._data;
	}

	// метод для установки нужного класса для элемента categoryElement
	set categoryColor(value: string) {
		const classNames = this.categoryElement.classList;
		this.categoryElement.classList.remove(classNames.value.split(' ').pop());
		this.categoryElement.textContent = value;
		this.categoryElement.classList.add(classes.get(value));
	}

	// устанавливаем нужный текст в кнопке
	set buttonText(value: string) {
		this.buyButton.textContent = value;
	}

	// устанавливаем нужный слушатель события на кнопку
	setHandler(handleBuyProduct: Function) {
		this.handleBuyProduct = handleBuyProduct;
	}

	// отрисовываем превью карточки
	render() {
		this.categoryElement.textContent = this.data.category;
		this.categoryColor = this.data.category;
		this.priceElement.textContent = `${this.data.price} синапсов`;
		this.titleElement.textContent = this.data.title;
		this.imageElement.src = `${CDN_URL}/` + this.data.image;
		return this.preview;
	}
}
```

#### Класс BasketItemView - отображает добавленный товар, который можно удалить из корзины. Товары отрисовываются внутри корзины BasketView

```typescript
class BasketItemView {
	protected itemElement: HTMLElement; // сам элемент
	protected _data: BasketItem; // данные товара
	protected itemTitle: HTMLElement; // элемент заголовка
	protected priceBlock: HTMLSpanElement; // элемент с ценой
	protected handleDeleteItem: Function; // событие происходящее при клике на кнопку удаления (удалить товар из корзины)
	protected button: HTMLButtonElement; // кнопка удаления (Корзинка)
	protected index: HTMLSpanElement; // элемент где будет отображаться номер товара в корзине

	// в конструктор передаем шаблон
	constructor(template: HTMLTemplateElement) {
		this.itemElement = template.content
			.querySelector('.card_compact')
			.cloneNode(true) as HTMLElement;
		this.itemTitle = this.itemElement.querySelector('.card__title');
		this.priceBlock = this.itemElement.querySelector('.card__price');
		this.index = this.itemElement.querySelector('.basket__item-index');
		this.button = this.itemElement.querySelector('.basket__item-delete');
	}

	// устанавливаем данные
	set data(data: BasketItem) {
		this._data = data;
	}

	// получаем к ним доступ
	get data() {
		return this._data;
	}

	// устанавливаем заголовок
	set title(value: string) {
		this.itemTitle.textContent = value;
	}

	// устанавливаем порядковый номер
	set indexNumber(value: string) {
		this.index.textContent = `${value}`;
	}

	// устанавливаем слушатель события на кнопку
	setDeleteHandler(handleDeleteItem: Function) {
		this.handleDeleteItem = handleDeleteItem;
		this.button.addEventListener('click', (evt) => {
			this.handleDeleteItem(this);
		});
	}

	// отрисовываем товар в корзине
	render() {
		this.itemTitle.textContent = this.data.name;
		this.priceBlock.textContent = `${this.data.price}`;
		return this.itemElement;
	}
}
```

#### Класс BasketView - отображает все товары, которые находятся в корзине. Отсюда, при начале оформления оплаты, пользователь попадает на модальное окно с формой для заполнения данных для оплаты

```typescript
class BasketView {
	protected basketElement: HTMLElement; // сам элемент корзины
	protected priceElement: HTMLElement; // элемент с ценой
	protected handleMakeOrder: Function; // событие при оформлении заказа (клик на "Оформить")
	protected _content: HTMLElement; // содержимое элемента корзины, сюда "Кладем" товары BasketItemView
	protected makeOrderButton: HTMLButtonElement; // кнопка "Оформить"

	// в конструктор передаем товары
	constructor(basketViewTemplate: HTMLTemplateElement) {
		this.basketElement = basketViewTemplate.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		this.priceElement = this.basketElement.querySelector('.basket__price');
		this._content = this.basketElement.querySelector('.basket__list');
	}

	// в контент передаем жлементы, которые надо будет отрисовать (товары BasketItemView)
	set content(items: HTMLElement[]) {
		this._content.replaceChildren(...items);
	}

	// установим итоговую сумму
	set price(value: number) {
		this.priceElement.textContent = `${value} синапсов`;
	}

	// событие при клике на оформить (переход к модальному окну с выбором способа оплаты)
	setHandler(handleMakeOrder: Function): void {
		this.handleMakeOrder = handleMakeOrder;
		this.makeOrderButton.addEventListener('click', (evt) => {
			this.handleMakeOrder(this);
		});
	}

	// отрисовка элемента
	render() {
		return this.basketElement;
	}
}
```

#### Класс ModalView - модальное окно, внутри которого отображаются другие компоненты (корзина, просмотр карточки, этапы оплаты, окно об успехе)

```typescript
class ModalView {
	protected _content: HTMLElement; // содержимое модального окна

	//в конструктор передаем элемент модального окна
	constructor(protected container: HTMLElement) {
		this._content = container.querySelector('.modal__content');

		// на модальное окно устанавливаем слушатель -  событие (закрытие модального окна) должно срабатывать при клике на крестик или на область вне модального окна
		this.container.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;
			if (
				target.matches('.modal__close') ||
				!target.closest('.modal__container')
			)
				this.close();
		});
	}

	// устанавливаем содержимое внутри модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// делаем модальное окно видимым
	open() {
		this.container.classList.add('modal_active');
	}

	// закрываем
	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
	}
}
```

#### Класс PaymentView - форма выбора способа оплаты и ввода адреса. Форма отображается внутри модального окна. При успешном заполнении формы пользователь попадает на следующее окно c формой для заполнения контактных данных (ContactsView)

```typescript
class PaymentView {
	protected orderElement: HTMLFormElement; // элемент формы
	protected onlineButton: HTMLButtonElement; // кнопка выбора онлайн оплаты
	protected offlineButton: HTMLButtonElement; // кнопка выбора оплаты наличными
	protected addressInput: HTMLInputElement; // поле ввода адреса
	protected handleOnlineMethod: Function; // событие срабатывающее при выборе онлайн метода
	protected handleOfflineMethod: Function; // событие срабатывающее при выборе метода оплаты наличными
	protected handleSubmitAddress: Function; // событие при отправке формы

	// в конструктор передаем шаблон формы
	constructor(orderTemplate: HTMLTemplateElement) {
		this.orderElement = orderTemplate.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.onlineButton = this.orderElement.querySelector('button[name="card"]');
		this.offlineButton = this.orderElement.querySelector('button[name="cash"]');
		this.addressInput = this.orderElement.querySelector(
			'input[name="address"]'
		);
	}

	// установить событие на кнопку "Онлайн"
	setCardOptionHandler(handleOnlineMethod: Function) {
		this.handleOnlineMethod = handleOnlineMethod;
		this.onlineButton.addEventListener('click', (evt) => {
			this.handleOnlineMethod(this);
		});
	}

	// установить событие на кнопку "Наличными"
	setCashOptionHandler(handleOfflineMethod: Function) {
		this.handleOfflineMethod = handleOfflineMethod;
		this.offlineButton.addEventListener('click', (evt) => {
			this.handleOfflineMethod(this);
		});
	}

	// Установить событие на отправку формы
	setSubmitOrderHandler(handleSubmitAddress: Function) {
		this.handleSubmitAddress = handleSubmitAddress;
		this.orderElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.handleSubmitAddress(this);
		});
	}

	// Получить адрес (значение поля для ввода адреса)
	getAddress() {
		return this.addressInput.value;
	}

	// отрисовать форму
	render(): HTMLFormElement {
		const button = this.orderElement.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		button.disabled = false;
		return this.orderElement;
	}
}
```

#### Класс ContactsView - форма добавления данных плательщика. При успешном заполнении данных, пользователь попадает на окно с уведомлением (SuccessView)

```typescript
class ContactsView {
	protected contactsElement: HTMLFormElement; // форма с контактными данными
	protected emailInput: HTMLInputElement; // поле ввода email
	protected phoneInput: HTMLInputElement; // поле ввода номера телефона
	protected handleSubmitOrder: Function; // событие, срабатывающее при отправке формы

	// в конструктор передаем шаблон формы
	constructor(contactsTemplate: HTMLTemplateElement) {
		this.contactsElement = contactsTemplate.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.emailInput = this.contactsElement.querySelector('input[name="email"]');
		this.phoneInput = this.contactsElement.querySelector('input[name="phone"]');
	}

	// получить данные с поля ввода (email)
	getEmail() {
		return this.emailInput.value;
	}

	// получить данные с поля ввода (номер телефона)
	getPhone() {
		return this.phoneInput.value;
	}

	// установить, которое будет срабатывать при отправке формы
	setSubmitContacts(handleSubmitOrder: Function) {
		this.handleSubmitOrder = handleSubmitOrder;
		this.contactsElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.handleSubmitOrder(this);
		});
	}

	// отрисовать форму
	render(): HTMLFormElement {
		const button = this.contactsElement.querySelector(
			'.button'
		) as HTMLButtonElement;
		button.disabled = false;
		return this.contactsElement;
	}
}
```

#### Класс SuccessView - отображает окно с сообщением об успехе оформления заказа и стоимости заказа

```typescript
class SuccessView {
	protected successElement: HTMLElement; // окно об успехе
	protected totalPriceElement: HTMLSpanElement; // элемент с информацией о цене заказа
	protected _totalPrice: number; // стоимость заказа

	// в конструктор передаем шаблон окна
	constructor(successTemplate: HTMLTemplateElement) {
		this.successElement = successTemplate.content
			.querySelector('.order-success')
			.cloneNode(true) as HTMLElement;
		this.totalPriceElement = this.successElement.querySelector(
			'.order-success__description'
		);
		this.successElement
			.querySelector('.button')
			.addEventListener('click', (evt) => {
				document
					.querySelector('#modal-container')
					.classList.remove('modal_active');
			});
	}

	// установить цену заказа
	set totalPrice(value: number) {
		this._totalPrice = value;
	}

	// получить цену заказа
	get totalPrice() {
		return this._totalPrice;
	}

	// отрисовать окно
	render() {
		this.totalPriceElement.textContent = `Списано ${this._totalPrice} синапсов`;
		return this.successElement;
	}
}
```

### Модели

В классе три модели, которые хранят в себе данные и оперируют ими:

1. `CatalogModel` хранит в себе информацию о товарах, которые пришли с сервера
2. `BasketModel` хранит в себе информацию о добавленные товарах. В модель можно добавлять товары из `CatalogModel` и удалять, после отправки заказа данные очищаются
3. `OrderModel` - сюда добавляются товары из `BasketModel` на последнем этапе оформления заказа, и добавляются данные на этапе оформления заказа, после подтверждения заказа данные очищаются

##### CatalogModel - класс используется для хранения в себе данных о продуктах, которые пришли с сервера

```typescript
class CatalogModel {
	protected _items: IProduct[] = []; // список продуктов (товаров)

	// в конструктор передаем брокер событий
	constructor(protected events: IEvents) {}

	// получить все продукты
	getItems(): IProduct[] {
		return this._items;
	}

	// получить определенный продукт
	getItem(id: string): IProduct {
		return this._items.find((item) => item.id === id);
	}

	// получить количество продуктов
	getTotal() {
		return this._items.length;
	}

	// установить продукты (сохранить товары)
	set_Items(_items: IProduct[]) {
		this._items = _items;
		this.events.emit('items:changed');
	}
}
```

##### BasketModel - класс используется для хранения данных о товарах, которые выбрал пользователь (добавил в корзину)

```typescript
class BasketModel {
	// в конструктор передаем брокер событий
	constructor(protected events: EventEmitter) {}
	items: Map<string, BasketItem> = new Map(); // количество продуктов изначально пустой массив
	totalPrice: number = 0; // цена всех продуктов изначально равна 0

	// добавить товар
	add(id: string, item: BasketItem): void {
		if (!this.items.has(id)) {
			this.items.set(id, item);
			this.totalPrice += item.price;
		}
		this.events.emit('basket:changed');
	}

	//удалить товар
	remove(id: string, item: BasketItem): void {
		if (this.items.has(id)) {
			this.items.delete(id);
			this.totalPrice -= item.price;
		}
		this.events.emit('basket:changed');
	}

	// получить все товары
	getItems(): BasketItem[] {
		return Array.from(this.items.values());
	}

	// очистить данные в корзине
	clear() {
		this.items = new Map();
		this.totalPrice = 0;
		this.events.emit('basket:changed');
	}
}
```

##### OrderModel - класс используется для хранения данных о товарах, которые выбрал пользователь и данных, которые он ввел при оформлении заказа

```typescript
class OrderModel {
	// хранит всю информацию о заказа (данные в таком типе понадобятся для отправки на сервер)
	protected _orderData: OrderType = {
		payment: 'not_selected',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};

	// в конструктор передается брокер событий
	constructor(protected events: IEvents) {}

	// установить цену
	set payment(value: paymentTypes) {
		this._orderData.payment = value;
	}

	// установить почту
	set email(value: string) {
		this._orderData.email = value;
	}

	// установить телефон
	set phone(value: string) {
		this._orderData.phone = value;
	}

	// установить адрес
	set address(value: string) {
		this._orderData.address = value;
	}

	// установить товары
	set items(values: string[]) {
		this._orderData.items = values;
	}

	//установить итоговую цену
	set total(value: number) {
		this._orderData.total = value;
	}

	// получить данные о заказе
	get orderData() {
		return this._orderData;
	}

	// очистить данные о заказе
	clear() {
		this._orderData = {
			payment: 'not_selected',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};

		this.events.emit('order:changed');
	}
}
```

### Презентер (Presenter)

Класс `Presenter` связь между интерфейсом и моделями данных:

1.  При взаимодействии пользователя с интерфейсом, презентер реагирует на это и передает необходимые данные в модели (получение данных с сервера, передача данных с форм, передача данных из модели в модель)
2.  При определенных событиях связанных с данными в моделя, презентер реагирует на это и вызывает изменения в интерфейсе (отрисовку элементов)

```typescript
class ShopPresenter {
	protected cardTemplate: HTMLTemplateElement; // шаблон карточки с товаром
	protected cardProduct: IProduct; // товар (продукт)
	protected previewProduct: IProductPreview; // экземпляр класса
	protected basketView: IBasketView; // экземпляр класса
	protected basketButton: HTMLButtonElement; // кнопка "Корзина"
	protected basketCounter: HTMLSpanElement; // счетчик товаров над корзиной
	protected productPreviewTemplate: HTMLTemplateElement; // шаблон элемента отображения подробной информации продукта
	protected basketTemplate: HTMLTemplateElement; // шаблон элемента корзины
	protected basketItemView: IBasketItemView; // экземпляр класса
	protected basketItemTemplate: HTMLTemplateElement; //шаблон элемента товара в козине
	protected paymentTemplate: HTMLTemplateElement; // шаблон формы выбора оплаты
	protected paymentView: IPaymentView; // экземпляр класса
	protected contactsTemplate: HTMLTemplateElement; // шаблон формы для ввода данных пользователя
	protected contactsView: IContactsView; // экземпляр класса
	protected successTemplate: HTMLTemplateElement; // шаблон окна об успехе операции
	protected successView: ISuccessView; // экземпляр класса

  // в конструктор передаем модели, конструкторы классов и экземпляр класса модального окна
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
		this.basketCounter = this.basketButton.querySelector(
			'.header__basket-counter'
		);
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

  // инициализация презентера с необходимыми данными
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
		this.basketButton.addEventListener(
			'click',
			this.handleOpenBasketView.bind(this)
		);
		this.basketCounter.textContent = '0';
	}

  // слушатель события, срабатывающий при добавлении товара в корзину. При клике на кнопку Добавить в корзине, товар добавляется в BasketModel, при клике на Убрать из корзины - удаляется
	handleBuyProduct(id: string, item: BasketItem) {
    ...
	}

  // слушатель события, открытие модального окна
	handleOpenPreviewModal(product: IProductView) {
    ...
	}

  // слушатель события, удаление товара из BasketModel
	handleDeleteProduct(id: string, item: BasketItem) {
    ...
	}

  // слушатель события, передача данных из basketModel в интерфейс, открывается окно, которое видит пользователь, содержащее товары, хранящиеся в basketModel, и итоговую стоимость
	handleOpenBasketView() {
    ...
	}

  // слушатель события, отображается окно с выбором оплаты, на кнопки и поля ввода навешиваются слушатели
	handleOpenPayment() {
		// надо навесить валидацию
    ...
	}

  // слушатель на кнопку Онлайн в форме выбора оплата
	handleMakeOnlineOption() {
    ...
	}

  // слушатель на кнопку Картой в форме выбора оплата
	handleMakeCashOption() {
    ...
	}

  // слушатель на отправку данных с формы, данные с формы передаются в OrderModel, отображается форма с данными пользователи и на новую форму навешивается слушатель
	handleSubmitOrder() {
    ...
	}

  // слушатель на отправку данных с формы, данные с формы и список товаров из (BasketModel) передаются в OrderModel, отображается форма с данными пользователи, данные моделей очищаются
	handleSubmitContacts() {
    ...
	}

  // отрисовка продуктов на странице
	renderCatalogView() {
    ...
	}

  // отрисовка товаров в корзине
	renderBasketView() {
    ...
  }
}
```
