import { IModal } from "../../types";

export class ModalView implements IModal {
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(protected container: HTMLElement) {
    this.closeButton = container.querySelector('.modal__close')
    this._content = container.querySelector('.modal__content')
    this.closeButton.addEventListener('click', this.close.bind(this))
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active')
  }

  close() {
    this.container.classList.remove('modal_active')
    this.content = null
  }

}
