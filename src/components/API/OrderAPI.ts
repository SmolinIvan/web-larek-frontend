import { IOrderApi, IProduct, OrderType } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export class OrderAPI extends Api implements IOrderApi {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options)
  }

  getProducts() {
    return this.get('/product').then((incoming:ApiListResponse<IProduct>) => incoming)
  }

  postOrder(data: OrderType) {
    return this.post('/order', data)
  }
  
}