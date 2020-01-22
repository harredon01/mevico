import {Component, OnInit} from '@angular/core';
import {ParamsService} from '../../services/params/params.service';
import {MercadoPagoService} from '../../services/mercado-pago/mercado-pago.service';
import {NavController} from '@ionic/angular';
import {Payment} from '../../models/payment'
declare var Mercadopago: any;
@Component({
    selector: 'app-mercado-pago-options',
    templateUrl: './mercado-pago-options.page.html',
    styleUrls: ['./mercado-pago-options.page.scss'],
})
export class MercadoPagoOptionsPage implements OnInit {
    paymentMethods: any[] = [];
    payment: Payment;
    constructor(private params: ParamsService,
        private navCtrl: NavController,
        private mercadoServ: MercadoPagoService) {
        let container = this.params.getParams();
        this.payment = new Payment({"id":12,"total":50000});
    }

    ngOnInit() {
        this.getPaymentMethods();
    }
    getPaymentMethods() {
        this.mercadoServ.getPaymentMethods().subscribe((resp: any) => {
            console.log("Register connection result", resp);
            this.paymentMethods = resp;
        }, (err) => {

        });
    }
    openItem(item: any) {
        let container = this.params.getParams();
        container.paymentMethodId = item.id;
        this.params.setParams(container);
        if (item.payment_type_id == "QUICK") {
            //this.quickPay();
        } else if (item.payment_type_id == "ticket") {
            this.navCtrl.navigateForward('tabs/mercado-pago-options/mercado-pago-cash');
        } else if (item.payment_type_id == "credit_card") {
            this.navCtrl.navigateForward('tabs/mercado-pago-options/mercado-pago');
        }else if (item.payment_type_id == "bank_transfer") {
            this.navCtrl.navigateForward('tabs/mercado-pago-options/mercado-pago-pse');
        }
    }

}
