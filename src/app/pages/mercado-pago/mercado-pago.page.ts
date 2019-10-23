import {Component, OnInit} from '@angular/core';
declare var Mercadopago: any;
@Component({
    selector: 'app-mercado-pago',
    templateUrl: './mercado-pago.page.html',
    styleUrls: ['./mercado-pago.page.scss'],
})
export class MercadoPagoPage implements OnInit {
    cardNumber: any;

    constructor() {
        this.cardNumber = "4170068810108020"
        Mercadopago.getIdentificationTypes((status, response) => {
            if (status !== 200) {
                console.log("Error")
            } 
            console.log("Exito",response)
        });
    }
    
    pay(){
        var $form = document.querySelector('#pay');

        Mercadopago.createToken($form, (status, response) => {
            if (status !== 200) {
                console.log("Error")
            } 
            console.log("Exito",response)
        });
    }

    ngOnInit() {
    }
    getBin() {
        let cardnumber = this.cardNumber;
        return cardnumber.substring(0, 6);
    }

    guessingPaymentMethod(event) {
        var bin = this.getBin();

        if (event.type == "keyup") {
            if (bin.length >= 6) {
                Mercadopago.getPaymentMethod({
                    "bin": bin
                }).then((value) => {

                }).catch((error) => {

                });
            }
        } else {
            setTimeout(function () {
                if (bin.length >= 6) {
                    Mercadopago.getPaymentMethod({
                        "bin": bin
                    }).then((value) => {
                        console.log("value", value)
                    }).catch((error) => {
                        console.log("error", error)
                    });
                }
            }, 100);
        }
    };
    sdkResponseHandler(status, response) {
        if (status != 200 && status != 201) {
            alert("verify filled data");
        } else {
            console.log("Response", response);
            var form = document.querySelector('#pay');
            var card = document.createElement('input');
            card.setAttribute('name', 'token');
            card.setAttribute('type', 'hidden');
            card.setAttribute('value', response.id);
            form.appendChild(card);
            //            doSubmit = true;
            //            form.submit();
        }
    };

    setPaymentMethodInfo(status, response) {
        if (status == 200) {
            var form = document.querySelector('#pay');
            const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');

            if (paymentMethodElement) {
                //paymentMethodElement.value = response[0].id;
            } else {
                const input = document.createElement('input');
                input.setAttribute('name', 'paymentMethodId');
                input.setAttribute('type', 'hidden');
                input.setAttribute('value', response[0].id);

                form.appendChild(input);
            }
        } else {
            alert(`payment method info error: ${response}`);
        }
    };

}
