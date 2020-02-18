import {Component} from '@angular/core';
import {Router, RouterEvent, NavigationEnd} from '@angular/router';
import {Platform, Events, MenuController, NavController, AlertController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {TranslateService} from '@ngx-translate/core';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {LanguageService} from './services/language/language.service';
import {AlertsService} from './services/alerts/alerts.service';
import {ParamsService} from './services/params/params.service'
import {Friend} from './models/friend'
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    items: any[] = [];
    page = 0;
    alertsmore = false;
    alertLoaded = false;
    activeLanguage = "es";
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private translate: TranslateService,
        private oneSignal: OneSignal,
        private events: Events,
        private alertsCtrl: AlertController,
        private params: ParamsService,
        private nav: NavController,
        private statusBar: StatusBar,
        private menuCtrl: MenuController,
        private alerts: AlertsService,
        private languageService: LanguageService,
        private router: Router
    ) {
        this.initializeApp();
    }
    ngOnInit() {
        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd && event.url === '/login') {
                this.menuCtrl.enable(false);
            }
        });
    }
    initTranslate(lang) {

        // Set the default language for translation strings, and the current language.
        console.log("Initializing language with: ", lang);
        this.translate.setDefaultLang(lang);
        const browserLang = this.translate.getBrowserLang();
        console.log("Browser lang", browserLang);
        this.translate.use(lang);

        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            //this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.languageService.setInitialAppLanguage();
            this.handlerNotifications();
            this.events.subscribe('authenticated', () => {
                this.getAlerts();
                // user and time are the same arguments passed in `events.publish(user, time)`
            });
            this.events.subscribe('notifsOpen', () => {
                if (this.items.length == 0) {
                    this.getAlerts();
                }
            });
        });
        this.alerts.getLanguage().then((value) => {
            console.log("getLanguage");
            console.log(value);
            if (value) {
                this.initTranslate(value);
            } else {
                this.initTranslate("es");
                this.alerts.setLanguage("es");
            }
        }, (reason) => {
            this.initTranslate("es");
            this.alerts.setLanguage("es");
        });
        this.platform.resume.subscribe(() => {
            if (this.items.length > 0) {
                let last_notif = this.items[0].notification_id;
                this.updateAlerts(1, last_notif);
            } else {
                this.getAlerts();
            }
            console.log('****UserdashboardPage RESUMED****');
            this.oneSignal.clearOneSignalNotifications();
            //this.performManualUpdate();
        });
    }
    private handlerNotifications() {
        this.oneSignal.startInit('339fd4b1-61d2-4fbe-abe7-ebd5fb433a02', 'petcare-a539b');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationOpened()
            .subscribe(jsonData => {
                this.events.publish('notification:opened', jsonData, Date.now());
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                this.sortNotificationType(jsonData, false);
            });
        this.oneSignal.handleNotificationReceived()
            .subscribe(jsonData => {
                let message = jsonData.payload.additionalData;
                console.log("Notification received", message);
                message.subject_es = message.subject;
                if (message.created_at.date) {
                    message.created_at.date = message.created_at.date.replace(" ", "T");
                    message.created_at = new Date(message.created_at.date);
                }
                if (message.type == "user_message") {
                    message.id = message.payload.message_id;
                    message.to_id = message.user_id;
                    message.from_id = message.trigger_id;
                    message.target_id = message.user_id;
                    //this.chats.saveMessage(message);
                }
                this.items.unshift(message);
                this.cleanResults();
                console.log('notification received: ', message);
                this.events.publish('notification:received', message, Date.now());
                this.sortNotificationType(jsonData, true);

                console.log('notificationOpenedCallback: ' + JSON.stringify(message));
            });
        this.oneSignal.endInit();
        this.oneSignal.clearOneSignalNotifications();
    }
    openPage(pageUrl) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.navigateRoot(pageUrl);
    }
    openNotification(notification) {
        console.log("openNotification", notification);
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (notification.type == "order_status" || notification.type == "payment_status" || notification.type == "split_order_payment" || notification.type == "payment_successful") {
            let parms = {
                objectId: notification.payload.payment_id
            };
            this.params.setParams(parms);
            this.nav.navigateForward('tabs/settings/payments/' + notification.payload.payment_id);
        } else if (notification.type == "user_message") {
            let friend = new Friend({
                "id": notification.trigger_id,
                "name": notification.payload.first_name + " " + notification.payload.last_name,
                "avatar": "assets/avatar/Bentley.png",
                "created_at": new Date(notification.created_at)
            });
            console.log("Chat room container", friend);
            this.params.setParams({friend});
            this.nav.navigateForward('tabs/settings/chat');
        } else if (notification.type == "support_message" || notification.type == "program_reminder") {
            let destinyUrl = notification.payload.utl;
            let destinyPayload = notification.payload.page_payload;
            console.log("Opening destiny notification", destinyUrl);
            console.log("Opening destiny payload", destinyPayload);
            this.params.setParams(destinyPayload);
            this.nav.navigateForward(destinyUrl);
        } else if (notification.type == "booking_starting" || notification.type == "booking_waiting") {
            let destinyUrl = notification.payload.utl;
            let destinyPayload = notification.payload;
            console.log("Opening destiny notification", destinyUrl);
            console.log("Opening destiny payload", destinyPayload);
            this.params.setParams(destinyPayload);
            this.nav.navigateForward('tabs/opentok');
        }
    }
    sortNotificationType(data, prompt) {
        console.log("sortnotificationType", data);
        let message = data.payload.additionalData;
        if (message.type == "payment_status"
            || message.type == "split_order_payment") {
            let typePage = '';
            let objectId = message.payload.payment_id;
            typePage = "PaymentDetailPage";
            if (prompt) {
                this.showPrompt("handlePage", typePage, objectId, message.subject_es);
            } else {
                this.handlePage(typePage, objectId);
            }
        }
        if (message.type == "order_status" || message.type == "user_message") {
            this.showSimplePrompt(message.subject_es, message.type);
        }
    }
    showSimplePrompt(messageData, alertType: any) {
        //        let activeView = this.navController.getActive();
        //        console.log("getActive",activeView.id );
        //        if (activeView.id == "ChatRoomPage" && alertType == "user_message") {
        //            return;
        //        }
        //        let title = ""
        //        let message = messageData;
        //        const prompt = this.alertCtrl.create({
        //            title: title,
        //            message: message,
        //            inputs: [],
        //            buttons: [
        //                {
        //                    text: 'OK',
        //                    handler: data => {
        //                    }
        //                }
        //            ]
        //        });
        //        prompt.present();
    }
    handlePage(urlPage, objectId) {
        let parms = {
            objectId: objectId
        };
        this.params.setParams(parms);
        this.nav.navigateForward(urlPage);
    }
    handleResults(results: any, triggerEvent, language) {
        console.log("getLanguage");
        console.log(language);
        if (!language) {
            language = "es";
        }
        let more = false;
        let data = results.data;
        for (let msg in data) {
            data[msg].created_at = data[msg].created_at.replace(" ", "T");
            data[msg].created_at = new Date(data[msg].created_at);
            data[msg].payload = JSON.parse(data[msg].payload);
            if (language == "es") {
                data[msg].subject = data[msg].subject_es;
            }
            if (triggerEvent) {
                this.events.publish('notification:received', data[msg], Date.now());
            }
            this.items.unshift(data[msg]);
        }
        if (results.page < results.last_page) {
            more = true;
        } else {
            more = false;
        }
        this.cleanResults();
        return more;

    }
    cleanResults() {
        this.items.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
        this.items = this.items.filter(function (a) {
            var key = a.type + '|' + a.trigger_id;
            if (!this[key]) {
                this[key] = true;
                return true;
            }
        }, Object.create(null));
    }
    getAlerts() {
        this.page++;
        let where = "page=" + this.page + "&limit=20";
        this.alerts.getLanguage().then((value) => {
            console.log("getToken");
            console.log(value);
            if (!value) {
                value = "es";
            }
            this.alerts.getAlerts(where).subscribe((results: any) => {
                this.alertLoaded = true;
                this.alertsmore = this.handleResults(results, false, value);
                if (this.items.length < 9 && this.alertsmore) {
                    this.getAlerts();
                }
            }, (err) => {

            });
        }, (reason) => {
            let value = "es";
            this.alerts.getAlerts(where).subscribe((results: any) => {
                this.alertLoaded = true;
                this.alertsmore = this.handleResults(results, false, value);
                if (this.items.length < 9 && this.alertsmore) {
                    this.getAlerts();
                }
            }, (err) => {

            });
        });
    }
    updateAlerts(page, last_notif) {
        this.alerts.getLanguage().then((value) => {
            console.log("getToken");
            console.log(value);
            if (!value) {
                value = "es";
            }
            let where = "page=" + page + "&notification_id>" + last_notif + "&limit=20";
            this.alerts.getAlerts(where).subscribe((results: any) => {
                if (results.total > 0) {
                    let more = this.handleResults(results, true, value);
                    if (more) {
                        page++
                        this.updateAlerts(page, last_notif);
                    }
                }
            }, (err) => {

            });
        });
    }

    async showPrompt(funcname, alertType, objectId, messageData) {
        let activeUrl = this.router.url;
        console.log("getActive", activeUrl);
        if (activeUrl.includes("chat")) {
            return;
        }
        let title = ""
        let message = messageData;
        const alert = await this.alertsCtrl.create({
            header: title,
            message: message,
            inputs: [],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                    }
                }, {
                    text: 'OK',
                    handler: data => {
                        this[funcname](alertType, objectId);
                    }
                }
            ]
        });
        await alert.present();
    }
}
