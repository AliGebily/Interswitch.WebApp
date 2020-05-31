import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { MEDALS, MEDALS_DICT } from '../../shared/models/medals';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-medals',
  templateUrl: './medals.component.html',
  styleUrls: ['./medals.component.scss']
})
export class MedalsComponent implements OnInit {
  title = 'Medals Overview';
  medals: any[] = [];
  currentMedal: any = null;
  constructor(
    private modalService: ModalService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    var userMedals: any[] =
      this.globalService.getAuthInfo().profile.userData.medals || [];
    this.medals = MEDALS.filter(item => item.isGolden).map(item => {
      let tempItem: any = JSON.parse(JSON.stringify(item));
      tempItem.userWonIt =
        userMedals.findIndex(um => um.id == tempItem.id) > -1;
      return tempItem;
    });
  }

  openMedalDetails(medal: any, elementRef: ElementRef) {
    this.currentMedal = medal;
    this.modalService.open(elementRef);
  }
  closeModal(elementRef: ElementRef) {
    this.currentMedal = null;
    this.modalService.close();
  }
}
