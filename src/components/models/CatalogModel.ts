import { IEvents } from "../base/events";
import { ICatalogModel, IProduct } from "../../types";

export class CatalogModel implements ICatalogModel{
    protected _items: IProduct[] = [];

    constructor(protected events: IEvents ) {}

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct {   
        return this._items.find(item => item.id === id);
    }

    getTotal() {
        return this._items.length
    }

    set_Items(_items: IProduct[]) {
        this._items = _items;
        this.events.emit('items:changed');
    }
}