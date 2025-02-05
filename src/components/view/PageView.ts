import { Component } from "../base/component";

export interface IPage {
    products: HTMLElement[];
}


export class PageView extends Component<IPage> {
    protected productsContainer: HTMLElement;
    protected elementTotal: HTMLElement;
    protected elementDone: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.productsContainer = container.querySelector('.gallery');
    }

    set products(items: HTMLElement[]){
        this.productsContainer.replaceChildren(...items);
    }
}