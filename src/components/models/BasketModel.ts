import { IBasketModel, BasketItem } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketModel implements IBasketModel {
	constructor(protected events: EventEmitter) {}
	items: Map<string, BasketItem> = new Map();
	totalPrice: number = 0;

	add(id: string, item: BasketItem): void {
		if (!this.items.has(id)) {
			this.items.set(id, item);
			this.totalPrice += item.price;
		}
		this.events.emit('basket:changed');
	}

	remove(id: string, item: BasketItem): void {
		if (this.items.has(id)) {
			this.items.delete(id);
			this.totalPrice -= item.price;
		}
		this.events.emit('basket:changed');
	}

	getItems(): BasketItem[] {
		return Array.from(this.items.values());
	}

	clear() {
		this.items = new Map();
		this.totalPrice = 0;
		this.events.emit('basket:changed');
	}
}
