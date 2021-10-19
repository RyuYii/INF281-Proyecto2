import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/shared/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RootGuard } from './services/guards/root.guard'

const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'ingreso', component: LoginComponent},
  { path: 'welcome', component: WelcomeComponent, canActivate: [RootGuard] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
