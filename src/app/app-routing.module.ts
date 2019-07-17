import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
    {path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule'},
    {path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule'},
  { path: 'checkout-buyer', loadChildren: './pages/checkout-buyer/checkout-buyer.module#CheckoutBuyerPageModule' },
  { path: 'checkout-cash', loadChildren: './pages/checkout-cash/checkout-cash.module#CheckoutCashPageModule' },
  { path: 'checkout-banks', loadChildren: './pages/checkout-banks/checkout-banks.module#CheckoutBanksPageModule' },
  { path: 'checkout-payer', loadChildren: './pages/checkout-payer/checkout-payer.module#CheckoutPayerPageModule' },
  { path: 'checkout-card', loadChildren: './pages/checkout-card/checkout-card.module#CheckoutCardPageModule' },
  { path: 'checkout-prepare', loadChildren: './pages/checkout-prepare/checkout-prepare.module#CheckoutPreparePageModule' },
  { path: 'buyer-select', loadChildren: './pages/buyer-select/buyer-select.module#BuyerSelectPageModule' },
  { path: 'payu-complete', loadChildren: './pages/payu-complete/payu-complete.module#PayuCompletePageModule' },
  { path: 'map', loadChildren: './pages/map/map.module#MapPageModule' },
  { path: 'cart', loadChildren: './pages/cart/cart.module#CartPageModule' },
  { path: 'chat-room', loadChildren: './pages/chat-room/chat-room.module#ChatRoomPageModule' },
  { path: 'comments', loadChildren: './pages/comments/comments.module#CommentsPageModule' },
  { path: 'merchant-categories', loadChildren: './pages/merchant-categories/merchant-categories.module#MerchantCategoriesPageModule' },
  { path: 'merchant-listing', loadChildren: './pages/merchant-listing/merchant-listing.module#MerchantListingPageModule' },
  { path: 'merchant-detail', loadChildren: './pages/merchant-detail/merchant-detail.module#MerchantDetailPageModule' },
  { path: 'search-filtering', loadChildren: './pages/search-filtering/search-filtering.module#SearchFilteringPageModule' },
  { path: 'merchant-products', loadChildren: './pages/merchant-products/merchant-products.module#MerchantProductsPageModule' },
  { path: 'booking', loadChildren: './pages/booking/booking.module#BookingPageModule' },
  { path: 'booking-list', loadChildren: './pages/booking-list/booking-list.module#BookingListPageModule' },
  { path: 'booking-detail', loadChildren: './pages/booking-detail/booking-detail.module#BookingDetailPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'routes', loadChildren: './pages/routes/routes.module#RoutesPageModule' },
  { path: 'route-detail', loadChildren: './pages/route-detail/route-detail.module#RouteDetailPageModule' },
  { path: 'medical', loadChildren: './pages/medical/medical.module#MedicalPageModule' },
  { path: 'codes', loadChildren: './pages/codes/codes.module#CodesPageModule' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
