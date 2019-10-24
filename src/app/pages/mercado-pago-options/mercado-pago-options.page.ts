import { Component, OnInit } from '@angular/core';
import {ParamsService} from '../../services/params/params.service';
import {MercadoPagoService} from '../../services/mercado-pago/mercado-pago.service';
declare var Mercadopago: any;
@Component({
  selector: 'app-mercado-pago-options',
  templateUrl: './mercado-pago-options.page.html',
  styleUrls: ['./mercado-pago-options.page.scss'],
})
export class MercadoPagoOptionsPage implements OnInit {

  constructor(private params: ParamsService,
        private mercadoServ: MercadoPagoService) { }

  ngOnInit() {
  }

}
