import {Component, OnInit} from '@angular/core';
import {GroupsService} from '../../services/groups/groups.service';
import {NavController, LoadingController, ModalController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Group} from '../../models/group';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute} from '@angular/router';
import {ParamsService} from '../../services/params/params.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
})
export class GroupDetailPage implements OnInit {
private mainGroup: Group;
    constructor(public groups: GroupsService,
        public activatedRoute: ActivatedRoute,
        public params: ParamsService,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public api: ApiService,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog
    ) {}

    ngOnInit() {
        let params = this.params.getParams();
        this.mainGroup = params.item;
    }

    leaveGroup() {
        this.showLoader();
        this.groups.leaveGroup(this.mainGroup.id).subscribe((data: any) => {
            this.navCtrl.back();
            this.dismissLoader();
        }, (err) => {
            console.log("Error leaveGroup");
            this.dismissLoader();
            this.api.handleError(err);
        });
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.create({
                spinner: 'crescent',
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show();
        }
    }
}