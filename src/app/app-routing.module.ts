import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'signup', loadChildren: './signup/signup.module#SignupPageModule'},
    {path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule'},
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'my-account', loadChildren: './my-account/my-account.module#MyAccountPageModule' },
  { path: 'addresses', loadChildren: './addresses/addresses.module#AddressesPageModule' },
  { path: 'payments', loadChildren: './payments/payments.module#PaymentsPageModule' },
  { path: 'password', loadChildren: './password/password.module#PasswordPageModule' },
  { path: 'payment-detail', loadChildren: './payment-detail/payment-detail.module#PaymentDetailPageModule' },
  { path: 'address-create', loadChildren: './address-create/address-create.module#AddressCreatePageModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
