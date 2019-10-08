import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'home',
                children: [
                    {
                        path: '',
                        loadChildren: '../home/home.module#HomePageModule'
                    }
                ]
            },
            {
                path: 'map',
                children: [
                    {
                        path: '',
                        loadChildren: '../map/map.module#MapPageModule'
                    }
                ]
            },
            {
                path: 'opentok',
                children: [
                    {
                        path: '',
                        loadChildren: '../opentok/opentok.module#OpentokPageModule'
                    }
                ]
            },
            {
                path: 'routes',
                children: [
                    {
                        path: '',
                        loadChildren: '../routes/routes.module#RoutesPageModule'
                    },
                    {
                        path: ':objectId',
                        loadChildren: '../route-detail/route-detail.module#RouteDetailPageModule'
                    }
                ]
            },
            {
                path: 'contacts',
                children: [
                    {
                        path: '',
                        loadChildren: '../contacts/contacts.module#ContactsPageModule'
                    },
                    {
                        path: 'import',
                        loadChildren: '../import-contacts/import-contacts.module#ImportContactsPageModule'
                    },
                    {
                        path: ':objectId',
                        children: [
                            {
                                path: '',
                                loadChildren: '../contact-detail/contact-detail.module#ContactDetailPageModule'
                            },
                            {
                                path: 'chat',
                                loadChildren: '../chat-room/chat-room.module#ChatRoomPageModule'
                            }
                        ]
                    },

                ]
            }, {
                path: 'groups',
                children: [
                    {
                        path: '',
                        loadChildren: '../groups/groups.module#GroupsPageModule'
                    },
                    {
                        path: ':objectId',
                        children: [
                            {
                                path: '',
                                loadChildren: '../group-detail/group-detail.module#GroupDetailPageModule'
                            },
                            {
                                path: 'chat',
                                loadChildren: '../chat-room/chat-room.module#ChatRoomPageModule'
                            }
                        ]
                    }
                ]
            },
            {
                path: 'categories',
                children: [
                    {
                        path: '',
                        loadChildren: '../merchant-categories/merchant-categories.module#MerchantCategoriesPageModule'
                    },
                    {
                        path: ':categoryId',
                        children: [
                            {
                                path: '',
                                loadChildren: '../merchant-listing/merchant-listing.module#MerchantListingPageModule',
                            },
                            {
                                path: 'merchant/:objectId',
                                children: [
                                    {
                                        path: '',
                                        loadChildren: '../merchant-detail/merchant-detail.module#MerchantDetailPageModule',
                                    },
                                    {
                                        path: 'products',
                                        loadChildren: '../merchant-products/merchant-products.module#MerchantProductsPageModule',
                                    },
                                    {
                                        path: 'chat',
                                        loadChildren: '../chat-room/chat-room.module#ChatRoomPageModule'
                                    },
                                    {
                                        path: 'book',
                                        loadChildren: '../booking/booking.module#BookingPageModule',
                                    },
                                    {
                                        path: 'bookings',
                                        children: [
                                            {
                                                path: '',
                                                loadChildren: '../booking-list/booking-list.module#BookingListPageModule',
                                            },
                                            {
                                                path: ':bookingId',
                                                loadChildren: '../booking-detail/booking-detail.module#BookingDetailPageModule',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'items',
                                        children: [
                                            {
                                                path: '',
                                                loadChildren: '../items/items.module#ItemsPageModule',
                                            },
                                            {
                                                path: ':itemId',
                                                loadChildren: '../item-detail/item-detail.module#ItemDetailPageModule',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'ratings',
                                        loadChildren: '../comments/comments.module#CommentsPageModule',
                                    }
                                ]
                            }
                        ]
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
                        path: 'items',
                        children: [
                            {
                                path: '',
                                loadChildren: '../items/items.module#ItemsPageModule'
                            },
                            {
                                path: ':objectId',
                                loadChildren: '../item-detail/item-detail.module#ItemDetailPageModule'
                            }
                        ]
                    },
                    {
                        path: 'addresses',
                        loadChildren: '../addresses/addresses.module#AddressesPageModule'
                    },
                    {
                        path: 'medical',
                        loadChildren: '../medical/medical.module#MedicalPageModule'
                    },
                    {
                        path: 'codes',
                        loadChildren: '../codes/codes.module#CodesPageModule'
                    },
                    {
                        path: 'chat',
                        loadChildren: '../chat-room/chat-room.module#ChatRoomPageModule'
                    },
                    {
                        path: 'password',
                        loadChildren: '../password/password.module#PasswordPageModule'
                    },
                    {
                        path: 'bookings',
                        children: [
                            {
                                path: '',
                                loadChildren: '../booking-list/booking-list.module#BookingListPageModule',
                            },
                            {
                                path: ':bookingId',
                                loadChildren: '../booking-detail/booking-detail.module#BookingDetailPageModule',
                            }
                        ]
                    },
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/categories',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/categories',
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
