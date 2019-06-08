import {Component, OnInit} from '@angular/core';
import {NavController, ToastController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {RatingsService} from '../../services/ratings/ratings.service';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
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
    comment: {comment: string, rating: any, object_id: number, type: string} = {
        comment: 'Dejanos tu comentario de la entrega',
        rating: '5',
        object_id: -1,
        type: ""
    };

    // Our translated text strings
    private commentErrorString: string;
    //private objectO: any;

    constructor(public navCtrl: NavController,
        public params: ParamsService,
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
            this.navCtrl.pop();
        }, (err) => {
            //this.navCtrl.push(MainPage);
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.commentErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }

    ngOnInit() {
    }

}
