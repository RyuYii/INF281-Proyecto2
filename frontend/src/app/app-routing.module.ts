import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormularioEdicionProyectoComponent } from './components/formulario-edicion-proyecto/formulario-edicion-proyecto.component';
import { FormularioProyectoComponent } from './components/formulario-proyecto/formulario-proyecto.component';
import { FormularioRegistroComponent } from './components/formulario-registro/formulario-registro.component';
import { PanelProyectosComponent } from './components/panel-proyectos/panel-proyectos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { LoginComponent } from './components/shared/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RootGuard } from './services/guards/root.guard'

const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'ingreso', component: LoginComponent},
  { path: 'welcome', component: WelcomeComponent, canActivate: [RootGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [RootGuard] },
  { path: 'signin', component: FormularioRegistroComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [RootGuard]},
  { path: 'panel', component: PanelProyectosComponent},
  { path: 'about', component: AboutComponent},
  { path: 'admin', component: AdminComponent, canActivate: [RootGuard]},
  { path: 'formRegistroProy', component: FormularioProyectoComponent, canActivate: [RootGuard]},
  { path: 'proyecto/:idProyecto', component: ProyectoComponent, canActivate: [RootGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
