import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { GlobalService } from '../../shared/services/global.service';
import { BackendAPIService } from '../../shared/services/backend-api.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, OnDestroy {
  @ViewChild('quarterlyTabButton') quarterlyTabButton;

  @ViewChild('transactionSaleTabButton') transactionSaleTabButton;

  @ViewChild('calculatedIncentiveModal') calculatedIncentiveModal;

  title = 'Calculator';
  userProfile: any = null;

  selectedQuarterlyYearlyTabButton: any = null;
  selectedForecastTabButton: any = null;
  activeClass = 'active';
  salesRepInfo: any = {
    name: 'Benjo',
    avatarId: 'character_21_small.png',
    quarterlyTarget: 1000,
    quarterlyAchievment: 980,
    yearlyTarget: 4000,
    yearlyAchievment: 3240,
    team: 'Team 1',
    region: 'Region 1'
  };
  viewingOptions = {
    interval: 'Q', //Y
    saleType: 'TRANS' //ONE_OFF
  };
  salesInfo = {
    targetCurrency: 0,
    achievedCurrency: 0,
    achievedPercent: 0
  };
  forecastInfo = {
    feeInputPlaceholder: 'Flat Fee',
    feeInputValue: null,
    estimatedVolumePlaceholder: 'Estimated Volume',
    estimatedVolumeValue: null
  };
  constructor(
    private modalService: ModalService,
    private globalService: GlobalService,
    private backendAPIService: BackendAPIService
  ) {}
  ngOnInit() {
    this.userProfile = this.globalService.getAuthInfo().profile;
    this.fillData();
    this.salesRepInfo.quarterlyAchievmentPercentage = parseInt(
      (
        (100 * this.salesRepInfo.quarterlyAchievment) /
        this.salesRepInfo.quarterlyTarget
      ).toString()
    );
    this.salesRepInfo.yearlyAchievmentPercentage = parseInt(
      (
        (100 * this.salesRepInfo.yearlyAchievment) /
        this.salesRepInfo.yearlyTarget
      ).toString()
    );
    this.selectedQuarterlyYearlyTabButton = this.quarterlyTabButton.nativeElement;

    this.selectedForecastTabButton = this.transactionSaleTabButton.nativeElement;
  }
  refreshHandler() {
    this.backendAPIService.getUserProfile().then(profile => {
      var authInfo = this.globalService.getAuthInfo();
      authInfo.profile = profile;
      this.globalService.setAuthInfo(authInfo);
      this.ngOnInit();
    });
  }
  fillData() {
    if (this.viewingOptions.interval == 'Q') {
      this.salesInfo.targetCurrency = this.userProfile.userData.quarterlyTargetCurrency;
      this.salesInfo.achievedCurrency = this.userProfile.userData.quarterlyAchievedCurrency;
      this.salesInfo.achievedPercent = this.userProfile.userData.quarterlyAchievedPercent;
    } else {
      this.salesInfo.targetCurrency = this.userProfile.userData.yearlyTargetCurrency;
      this.salesInfo.achievedCurrency = this.userProfile.userData.yearlyAchievedCurrency;
      this.salesInfo.achievedPercent = this.userProfile.userData.yearlyAchievedPercent;
    }
    if (this.viewingOptions.saleType == 'TRANS') {
      this.forecastInfo.feeInputPlaceholder = 'Flat Fee';
      this.forecastInfo.feeInputValue = '';
      this.forecastInfo.estimatedVolumePlaceholder = 'Estimated Volume';
      this.forecastInfo.estimatedVolumeValue = '';
    } else {
      this.forecastInfo.feeInputPlaceholder = 'Price';
      this.forecastInfo.feeInputValue = '';
      this.forecastInfo.estimatedVolumePlaceholder = 'Cost';
      this.forecastInfo.estimatedVolumeValue = '';
    }
    let achievedPercent = this.salesInfo.achievedPercent;
    if (achievedPercent > 100) {
      achievedPercent = 100;
    }
    let step =
      Math.abs(this.salesInfo.achievedPercent - this.previousAchievedPercent) /
      20;
    if (step < 2) {
      step = 2;
    }
    this.salesInfo.achievedPercent = this.previousAchievedPercent;

    clearInterval(this.drawingCircleIntervalHandler);
    this.drawingCircleIntervalHandler = setInterval(() => {
      if (achievedPercent > this.previousAchievedPercent) {
        if (this.salesInfo.achievedPercent < achievedPercent) {
          this.salesInfo.achievedPercent =
            Math.round(100 * (this.salesInfo.achievedPercent + step)) / 100;
          this.update(this.salesInfo.achievedPercent);
        } else {
          this.previousAchievedPercent = achievedPercent;
          clearInterval(this.drawingCircleIntervalHandler);
          this.salesInfo.achievedPercent = achievedPercent;
          this.update(this.salesInfo.achievedPercent);
        }
      } else {
        if (this.salesInfo.achievedPercent > achievedPercent) {
          this.salesInfo.achievedPercent =
            Math.round(100 * (this.salesInfo.achievedPercent - step)) / 100;
          this.update(this.salesInfo.achievedPercent);
        } else {
          this.previousAchievedPercent = achievedPercent;
          clearInterval(this.drawingCircleIntervalHandler);
          this.salesInfo.achievedPercent = achievedPercent;
          this.update(this.salesInfo.achievedPercent);
        }
      }
    }, 50);
  }
  drawingCircleIntervalHandler;
  ngOnDestroy() {
    clearInterval(this.drawingCircleIntervalHandler);
  }
  center = {
    x: 125,
    y: 125
  };
  previousAchievedPercent = 0;

  update(achievedPercent: number) {
    let angle: number = (achievedPercent * 360) / 100;
    if (angle >= 360) {
      // used achieved greater than target
      angle = 355.99;
    }
    let r = 95;
    let x = 0;
    let y = 0;
    var large_arc_flag = 0;
    var sweep_flag = 1;
    var achievedPercentPathElement = document.getElementById(
      'achievedPercentPath'
    );
    if (angle == 0) {
      achievedPercentPathElement.style.display = 'none';
    } else {
      achievedPercentPathElement.style.display = 'block';
      if (angle <= 90) {
        x = this.center.x + r * Math.cos((90 - angle) * (Math.PI / 180));
        y = this.center.y - r * Math.sin((90 - angle) * (Math.PI / 180));
      } else if (angle <= 180) {
        x = this.center.x + r * Math.sin((180 - angle) * (Math.PI / 180));
        y = this.center.y + r * Math.cos((180 - angle) * (Math.PI / 180));
      } else if (angle <= 270) {
        x = this.center.x - r * Math.cos((270 - angle) * (Math.PI / 180));
        y = this.center.y + r * Math.sin((270 - angle) * (Math.PI / 180));
        large_arc_flag = 1;
      } else {
        large_arc_flag = 1;
        x = this.center.x - r * Math.sin((360 - angle) * (Math.PI / 180));
        y = this.center.y - r * Math.cos((360 - angle) * (Math.PI / 180));
      }
    }
    achievedPercentPathElement.setAttribute(
      'd',
      `M 125 30
    A 95 95 0 ${large_arc_flag} ${sweep_flag} ${x} ${y}`
    );
  }

  showQuarterlyYearlyTab(tabButton: any, interval) {
    if (
      this.selectedQuarterlyYearlyTabButton.classList.contains(this.activeClass)
    ) {
      this.selectedQuarterlyYearlyTabButton.classList.remove(this.activeClass);
    }

    if (!tabButton.classList.contains(this.activeClass)) {
      tabButton.classList.add(this.activeClass);
    }

    this.selectedQuarterlyYearlyTabButton = tabButton;
    this.viewingOptions.interval = interval;
    this.fillData();
  }
  showForecastTab(tabButton: any, saleType) {
    if (this.selectedForecastTabButton.classList.contains(this.activeClass)) {
      this.selectedForecastTabButton.classList.remove(this.activeClass);
    }

    if (!tabButton.classList.contains(this.activeClass)) {
      tabButton.classList.add(this.activeClass);
    }
    this.selectedForecastTabButton = tabButton;
    this.viewingOptions.saleType = saleType;
    this.fillData();
  }
  effectiveIncentive;
  isConnecting: Boolean = false;
  calculate() {
    let result = 0;
    if (this.viewingOptions.saleType == 'TRANS') {
      result =
        this.forecastInfo.feeInputValue *
        this.forecastInfo.estimatedVolumeValue;
    } else {
      result =
        this.forecastInfo.feeInputValue -
        this.forecastInfo.estimatedVolumeValue;
    }
    this.effectiveIncentive = result;
    this.showModal(this.calculatedIncentiveModal.nativeElement);

    // if (this.isConnecting) {
    //   return;
    // }
    // this.isConnecting = true;
    // this.backendAPIService
    //   .calculate({
    //     feeInput: this.forecastInfo.feeInputValue,
    //     estimatedVolume: this.forecastInfo.estimatedVolumeValue,
    //     saleType: this.viewingOptions.saleType
    //   })
    //   .then(calculateResponse => {
    //     this.isConnecting = false;
    //     this.effectiveIncentive = calculateResponse.addedQuarterlyPercent;
    //     this.showModal(this.calculatedIncentiveModal.nativeElement);
    //   })
    //   .catch(error => {
    //     this.isConnecting = false;
    //   });
  }

  showModal(elementRef: ElementRef) {
    this.modalService.open(elementRef);
  }
  closeModal(elementRef: ElementRef) {
    this.modalService.close();
  }
}
