import {Component, OnInit} from '@angular/core';
import {NavController, ToastController,ModalController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {RatingsService} from '../../services/ratings/ratings.service';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ApiService} from '../../services/api/api.service';
import {ParamsService} from '../../services/params/params.service';
@Component({
    selector: 'app-comments',
    templateUrl: './comments.page.html',
    styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    items: any[] = [];
    comment: {comment: string, rating: any, object_id: number, type: string} = {
        comment: '',
        rating: '5',
        object_id: -1,
        type: ""
    };

    // Our translated text strings
    private commentErrorString: string;
    //private objectO: any;

    constructor(public navCtrl: NavController,
        public params: ParamsService,
        public api: ApiService,
        public modalCtrl:ModalController,
        public ratings: RatingsService,
        public toastCtrl: ToastController,
        public translateService: TranslateService) {
        //this.objectO = this.navParams.get('objectO');
        let paramsSent = this.params.getParams();
        this.comment.object_id = paramsSent.object_id;
        this.comment.type = paramsSent.type_object;
        this.translateService.get('COMMENTS.SAVE_RATING_ERROR').subscribe((value) => {
            this.commentErrorString = value;
        })


    }

    // Attempt to login in through our User service
    postComment() {
        this.ratings.postRating(this.comment).subscribe((resp) => {
            //this.navCtrl.push(MainPage);
            this.modalCtrl.dismiss("Close");
        }, (err) => {
            //this.navCtrl.push(MainPage);
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.commentErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    
    // Attempt to login in through our User service
    getComments() {
        let container = {
            "object_id":this.comment.object_id,
            "type":this.comment.type
        };
        let url = "object_id="+this.comment.object_id+"&type="+this.comment.type;
        this.ratings.getRatings(url).subscribe((resp) => {
            //this.navCtrl.push(MainPage);
            
        }, (err) => {
            //this.navCtrl.push(MainPage);
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.commentErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }

    ngOnInit() {
        this.getComments();
    }
    done() {
        this.modalCtrl.dismiss("Close");
    }

}
