import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { BackendAPIService } from '../../shared/services/backend-api.service';
import { GlobalService } from '../../shared/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  @ViewChild('quarterlyTabButton') quarterlyTabButton;
  @ViewChild('permissionErrorModal') permissionErrorModal;
  title = 'Ranking';

  selectedTabButton: any = null;
  activeClass = 'active';
  selectedRankignFilter: null;

  rankingsFilters = [];
  rankingResult: any[] = [];
  filteredRankingResult: any[] = [];
  criteriaFilter: any = {
    quarterlyOrYearly: 'Q', //Y
    useCurrency: false,
    rankingFilter: null
  };
  constructor(
    private modalService: ModalService,
    private backendAPIService: BackendAPIService,
    private globalService: GlobalService,
    private router: Router
  ) {}
  ngOnInit() {
    this.selectedTabButton = this.quarterlyTabButton.nativeElement;
    this.rankingsFilters = this.globalService.getAuthInfo().rankingsFilters;
    this.loadRankings();
  }
  refreshHandler() {
    this.loadRankings();
  }
  loadRankings() {
    this.backendAPIService.getRankings().then(response => {
      this.rankingResult = response.rankingResult;
      this.applyFilter();
    });
  }
  showTab(tabButton: any, quarterlyOrYearly) {
    if (this.selectedTabButton.classList.contains(this.activeClass)) {
      this.selectedTabButton.classList.remove(this.activeClass);
    }
    if (!tabButton.classList.contains(this.activeClass)) {
      tabButton.classList.add(this.activeClass);
    }

    this.selectedTabButton = tabButton;

    this.criteriaFilter.quarterlyOrYearly = quarterlyOrYearly;
    this.applyFilter();
  }
  toggleDropdownContent(dropdownContent, downArrow, upArrow) {
    if (window.getComputedStyle(dropdownContent).display == 'none') {
      dropdownContent.style.display = 'block';
      downArrow.style.display = 'none';
      upArrow.style.display = 'inline';
    } else {
      dropdownContent.style.display = 'none';
      downArrow.style.display = 'inline';
      upArrow.style.display = 'none';
    }
  }
  filterUsers(dropdownContent, downArrow, upArrow, selectedRankignFilter) {
    this.toggleDropdownContent(dropdownContent, downArrow, upArrow);

    this.criteriaFilter.rankingFilter = selectedRankignFilter;
    if (
      this.criteriaFilter.rankingFilter &&
      !this.criteriaFilter.rankingFilter.canShowCurrency
    ) {
      this.criteriaFilter.useCurrency = false;
    }
    this.applyFilter();
  }
  applyFilter() {
    this.filteredRankingResult = this.rankingResult;
    if (this.criteriaFilter.rankingFilter != null) {
      this.filteredRankingResult = this.filteredRankingResult.filter(item => {
        return (
          item.filterIDs.indexOf(this.criteriaFilter.rankingFilter.filterID) >
          -1
        );
      });
    }
    let fieldToSortBy = null;
    if (this.criteriaFilter.quarterlyOrYearly == 'Q') {
      if (this.criteriaFilter.useCurrency) {
        fieldToSortBy = 'quarterlyAchievedCurrency';
      } else {
        fieldToSortBy = 'quarterlyAchievedPercent';
      }
    } else {
      //Y
      if (this.criteriaFilter.useCurrency) {
        fieldToSortBy = 'yearlyAchievedCurrency';
      } else {
        fieldToSortBy = 'yearlyAchievedPercent';
      }
    }
    this.filteredRankingResult.forEach(item => {
      item.profile.userData.fieldToSortByValue =
        item.profile.userData[fieldToSortBy];
    });
    this.filteredRankingResult.sort((a, b) => {
      return (
        b.profile.userData.fieldToSortByValue -
        a.profile.userData.fieldToSortByValue
      );
    });
  }
  changeComparingMethod() {
    this.criteriaFilter.useCurrency = !this.criteriaFilter.useCurrency;
    this.applyFilter();
  }
  viewProfile(profile) {
    this.globalService.tempUserProfile = profile;
    this.router.navigate(['view-profile']);
  }
  showError(elementRef: ElementRef) {
    this.modalService.open(elementRef);
  }
  closeModal(elementRef: ElementRef) {
    this.modalService.close();
  }
}
