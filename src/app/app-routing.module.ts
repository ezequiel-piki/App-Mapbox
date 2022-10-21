import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'mapas',
    loadChildren: ()=> import ('./mapas/mapas.module').then(modulo =>modulo.MapasModule)
  },
  {
    path:'**',redirectTo:'mapas'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
