import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormularioRegistroComponent } from './components/formulario-registro/formulario-registro.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/shared/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RootGuard } from './services/guards/root.guard'

const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'ingreso', component: LoginComponent},
  { path: 'welcome', component: WelcomeComponent, canActivate: [RootGuard] },
  { path: 'perfil', component: PerfilComponent },
  { path: 'signin', component: FormularioRegistroComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
