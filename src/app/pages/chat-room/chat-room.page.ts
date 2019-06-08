import {Component, OnInit,ViewChild, ChangeDetectorRef} from '@angular/core';
import {Friend} from "../../models/friend";
import {Message} from "../../models/message";
import {NavController, ToastController, LoadingController,Events,AlertController, IonContent} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {UserDataService} from '../../services/user-data/user-data.service';
import {ChatService} from '../../services/chat/chat.service';
import {ParamsService} from '../../services/params/params.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-chat-room',
    templateUrl: './chat-room.page.html',
    styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

    @ViewChild(IonContent) content: IonContent;
    private friend: Friend = new Friend({});
    private messages: Message[] = [];
    private tabBarElement: any;
    private input: string = '';
    loading: any;
    private type: string = '';
    private targetId: string = '';
    private objectId: string = '';
    private lastId: any = null;
    private isNew: boolean = true;
    paymentsGetStartString = '';
    avatar = 'assets/avatar/Dylan.png';
    paymentsErrorString = '';
    private page = 0;
    private messagemore = false;

    constructor(public chats: ChatService,
        private spinnerDialog: SpinnerDialog,
        public loadingCtrl: LoadingController,
        private cdr: ChangeDetectorRef,
        public toastCtrl: ToastController,
        public navCtrl: NavController,
        public router:Router,
        public userData: UserDataService,
        public params: ParamsService,
        public events: Events) {
        this.tabBarElement = document.querySelector('#tabs .tabbar');
        let paramSent = this.params.getParams();
        this.friend = paramSent.friend;
    }
    ionViewWillEnter() {
        console.log("onPageWillEnter");
        this.events.subscribe('notification:received', (message) => {
            if (message.type == "user_message") {
                this.receiveMessage(message);
            }
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
        //this.tabBarElement.style.display = 'none';

    }
    ionViewDidEnter() {
        this.page = 0;
        console.log("using ionViewDidEnter", this.lastId);
        console.log("Friend", this.friend);
        if (this.friend) {
            this.type = "user_message";
            if (this.targetId == this.friend.id) {
                this.isNew = false;
            } else {
                this.isNew = true;
                this.lastId = null;
            }
            this.targetId = this.friend.id;
            this.objectId = this.friend.id;
            this.getMessages(true);
        } else {
            let typeObject = "platform";
            let objectId = "food";
            this.getSupportAgent(typeObject, objectId);
        }

    }

    ionViewWillLeave() {
        console.log("onPageWillLeave");
        //this.tabBarElement.style.display = 'flex';
        this.events.unsubscribe('notification:received');
    }

    ionViewDidLoad() {

    }
    checkAddMessage(id) {
        for (let item in this.messages) {
            if (id == this.messages[item].id) {
                return false;
            }
        }
        return true;
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    getMessages(scroll) {
        this.page++;
        this.showLoader();
        let where = "";
        if (this.lastId) {
            console.log("using id", this.lastId);
            where = "type=user&to_id=" + this.objectId + "&page=" + this.page + "&id_after=" + this.lastId;
        } else {
            where = "type=user&to_id=" + this.objectId + "&page=" + this.page;
        }

        this.chats.getServerChatDetail(where).subscribe((results: any) => {
            this.dismissLoader();
            let data = results.data;
            for (let msg in data) {
                let check = this.checkAddMessage(data[msg].id);
                if (check) {
                    let message: Message = new Message({});
                    message.id = data[msg].id;
                    message.to = 'me';
                    message.to_id = data[msg].messageable_id;
                    message.from_id = data[msg].user_id;
                    message.from = this.friend.username;
                    message.content = data[msg].message;
                    if (this.lastId) {
                        if (this.lastId < data[msg].id) {
                            this.lastId = data[msg].id;
                            this.messages.push(message);
                        } else {
                            this.messages.unshift(message);
                        }
                    } else {
                        this.lastId = data[msg].id;
                        this.messages.unshift(message);
                    }
                }
            }
            if (results.page < results.last_page) {
                this.messagemore = true;
            } else {
                this.messagemore = false;
            }
            if (scroll) {
                this.scrollToBottom();
            }
            console.log(JSON.stringify(data));
            console.log("Messages", this.messages);
            console.log("result last id:", this.lastId);
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.paymentsErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
    getSupportAgent(typeObject, objectId) {
        this.showLoader();
        this.chats.getSupportAgent(typeObject, objectId).subscribe((results: any) => {
            console.log('getSupportAgent', results);
            this.dismissLoader();
            if (results.id) {
                this.friend = results;
                this.friend.avatar = "assets/avatar/Bentley.png";
                if (this.targetId == this.friend.id) {
                    this.isNew = false;
                } else {
                    this.isNew = true;
                    this.lastId = null;
                }
                this.targetId = this.friend.id;
                this.objectId = this.friend.id;
                this.getMessages(true);
            }
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.paymentsErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
    doInfinite(infiniteScroll) {
        console.log('Begin async operation', this.messagemore);
        if (this.messagemore) {
            this.messagemore = false;
            setTimeout(() => {
                this.getMessages(false);
                console.log('Async operation has ended');
                infiniteScroll.complete();
            }, 500);
        } else {
            infiniteScroll.complete();
        }

    }

    scrollToBottom() {
        setTimeout(() => {
            this.content.scrollToBottom(300);
        }, 400);
    }

    receiveMessage(notification: any) {
        console.log("Notification Received", notification);
        notification.from_id = notification.trigger_id;
        notification.to_id = notification.user_id;
        console.log("Notification Received", notification.from_id);
        console.log("Notification Received", this.friend.id);
        console.log("Notification Received", (notification.from_id == this.friend.id));

        let activeView = this.router.url;
        console.log("getActive", activeView);
        if (activeView == "tabs/chat") {
            if (notification.from_id == this.friend.id) {
                let message: Message = new Message({});
                message.to = 'me';
                message.to_id = notification.user_id;
                message.from_id = notification.from_id;
                message.from = this.friend.name;
                message.content = notification.message;
                console.log("Correct", message);
                console.log("Correct messages", this.messages);
                this.messages.push(message);
                this.scrollToBottom();
                this.cdr.detectChanges();
            }
        }
    }


    doSend() {
        if (this.input.length > 0) {
            let message: Message = new Message({});
            message.to = this.friend.username;
            message.from = 'me';
            message.to_id = this.friend.id;
            message.from_id = this.userData._user.id;
            message.content = this.input;
            let formData = {
                type: "user_message",
                name: this.userData._user.name,
                message: this.input,
                from_id: this.userData._user.id,
                to_id: this.friend.id,
                status: "unread",
                target_id: this.friend.id,
                created_at: new Date()
            };
            this.chats.sendMessage(formData);
            this.messages.push(message);
            this.scrollToBottom();
            this.input = '';
        }
    }
    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loading = this.loadingCtrl.create({
                spinner: 'crescent',
                message: this.paymentsGetStartString,
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show(null, this.paymentsGetStartString);
        }
    }

    ngOnInit() {
    }

}
