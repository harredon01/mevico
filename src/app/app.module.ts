import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Contacts } from '@ionic-native/contacts/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite/ngx';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {AppComponent} from './app.component';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {AppRoutingModule} from './app-routing.module';
import {CartPageModule} from './pages/cart/cart.module'
import {CommentsPageModule} from './pages/comments/comments.module'
import {BookingDetailPageModule} from './pages/booking-detail/booking-detail.module'
import {AddressCreatePageModule} from './pages/address-create/address-create.module'
import {AvailabilityCreatePageModule} from './pages/availability-create/availability-create.module'
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
        CartPageModule,
        AddressCreatePageModule,
        BookingDetailPageModule,
        CommentsPageModule,
        AvailabilityCreatePageModule],
    providers: [
        StatusBar,
        SplashScreen,
        Contacts,
        FileTransfer,
        SpinnerDialog,
        Geolocation,
        OneSignal,
        ImagePicker,
        SQLite,
        InAppBrowser,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
