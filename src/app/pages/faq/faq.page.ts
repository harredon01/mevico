import {Component, OnInit} from '@angular/core';
import {Article} from '../../models/article';
import {ApiService} from '../../services/api/api.service';
import {ArticlesService} from '../../services/articles/articles.service';
@Component({
    selector: 'app-faq',
    templateUrl: './faq.page.html',
    styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
    currentItems = [];
    constructor(
        public articles: ArticlesService,
        public api: ApiService,
    ) {}

    ngOnInit() {
        this.getArticles();
    }
    showMoreItem(cat: any) {
        if (cat.more) {
            cat.more = false;
        } else {
            cat.more = true;
        }
    }
    getArticles() {
        this.api.loader();
        let searchObj = null;
        this.currentItems = [];
        let query = "category_id=27,10&includes=files&order_by=category_id,asc";
        searchObj = this.articles.getArticles(query);
        searchObj.subscribe((data: any) => {
            let results = data.data;
            for (let one in results) {
                let container = new Article(results[one]);
                this.currentItems.push(container);
            }
            this.api.dismissLoader();
        }, (err) => {
            console.log("Error getArticles");
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('CATEGORIES.ERROR_GET');
            this.api.handleError(err);
        });
    }

}
