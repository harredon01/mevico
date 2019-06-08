import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'tab1',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab1/tab1.module#Tab1PageModule'
                    }
                ]
            },
            {
                path: 'tab2',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab2/tab2.module#Tab2PageModule'
                    }
                ]
            },
            {
                path: 'tab3',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab3/tab3.module#Tab3PageModule'
                    }
                ]
            },
            {
                path: 'checkout',
                children: [
                    {
                        path: 'shipping/:merchant_id',
                        loadChildren: '../checkout-shipping/checkout-shipping.module#CheckoutShippingPageModule'
                    },
                    {
                        path: 'prepare',
                        loadChildren: '../checkout-prepare/checkout-prepare.module#CheckoutPreparePageModule'
                    },
                ]
            },
            {
                path: 'payu',
                children: [
                    {
                        path: 'credit',
                        children: [
                            {
                                path: 'buyer',
                                loadChildren: '../checkout-buyer/checkout-buyer.module#CheckoutBuyerPageModule'
                            },
                            {
                                path: 'payer',
                                loadChildren: '../checkout-payer/checkout-payer.module#CheckoutPayerPageModule'
                            },
                            {
                                path: 'card',
                                loadChildren: '../checkout-card/checkout-card.module#CheckoutCardPageModule'
                            }
                        ]
                    },
                    {
                        path: 'cash',
                        loadChildren: '../checkout-cash/checkout-cash.module#CheckoutCashPageModule'
                    },
                    {
                        path: 'banks',
                        loadChildren: '../checkout-banks/checkout-banks.module#CheckoutBanksPageModule'
                    },
                    {
                        path: 'complete',
                        loadChildren: '../payu-complete/payu-complete.module#PayuCompletePageModule'
                    },
                ]
            },
            {
                path: 'settings',
                children: [
                    {
                        path: '',
                        loadChildren: '../settings/settings.module#SettingsPageModule'
                    },
                    {
                        path: 'my-account',
                        loadChildren: '../my-account/my-account.module#MyAccountPageModule'
                    },
                    {
                        path: 'payments',
                        children: [
                            {
                                path: '',
                                loadChildren: '../payments/payments.module#PaymentsPageModule'
                            },
                            {
                                path: ':objectId',
                                loadChildren: '../payment-detail/payment-detail.module#PaymentDetailPageModule'
                            }
                        ]
                    },
                    {
                        path: 'addresses',
                        loadChildren: '../addresses/addresses.module#AddressesPageModule'
                    },
                    {
                        path: 'password',
                        loadChildren: '../password/password.module#PasswordPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/tab1',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {}
