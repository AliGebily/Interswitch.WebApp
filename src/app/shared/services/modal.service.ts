import { Injectable } from "@angular/core";

@Injectable()
export class ModalService {
  bodyClass: string = "modal-open";
  openedModal: any = null;
  constructor() {}
  open(elementRef: any) {
    this.close();
    elementRef.style.display = "block";
    if (!document.body.classList.contains(this.bodyClass)) {
      document.body.classList.add(this.bodyClass);
    }
    this.openedModal = elementRef;
  }

  close() {
    if (document.body.classList.contains(this.bodyClass)) {
      document.body.classList.remove(this.bodyClass);
    }
    if (this.openedModal) {
      this.openedModal.style.display = "none";
    }
    this.openedModal = null;
  }
}
