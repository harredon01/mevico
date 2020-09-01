import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {ParamsService} from '../../services/params/params.service';
import {Article} from '../../models/article';
import {ApiService} from '../../services/api/api.service';
import {ArticlesService} from '../../services/articles/articles.service';
import {ActivatedRoute} from '@angular/router';
@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.page.html',
    styleUrls: ['./article-detail.page.scss'],
})
export class ArticleDetailPage implements OnInit {
    @ViewChild('slideWithNav', {static: false}) slideWithNav: IonSlides;
    activeIndex = 0;
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        autoplay: true,
    };
    item: any;
    constructor(public params: ParamsService,
    private activatedRoute: ActivatedRoute,
        public api: ApiService,
        public articles: ArticlesService) {}

    ngOnInit() {
        let loaded = false;
        let container = this.params.getParams();
        if (container) {
            if (container.item) {
                this.item = container.item;
                loaded = true;
            }
        }
        if(!loaded){
            this.getArticles();
        }
    }
    getArticles() {
        this.api.loader();
        let searchObj = null;
        let merchantId = this.activatedRoute.snapshot.paramMap.get('objectId');
        let query = "id="+merchantId+"&includes=files&order_by=category_id,asc";
        searchObj = this.articles.getArticles(query);
        searchObj.subscribe((data: any) => {
            let results = data.data;
            for (let one in results) {
                this.item = new Article(results[one]);
            }
            this.api.dismissLoader();
        }, (err) => {
            console.log("Error getArticles");
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('INPUTS.ERROR_GET');
            this.api.handleError(err);
        });
    }
    //Move to Next slide
    slideNext() {
        this.slideWithNav.slideNext();
        this.slideWithNav.getActiveIndex().then((value) => {
            this.activeIndex = value;
        });
    }

    //Move to previous slide
    slidePrev() {
        this.slideWithNav.slidePrev();
        this.slideWithNav.getActiveIndex().then((value) => {
            this.activeIndex = value;
        });
    }
    SlideDidChange() {
        this.slideWithNav.getActiveIndex().then((value) => {
            this.activeIndex = value;
        });
    }

}
