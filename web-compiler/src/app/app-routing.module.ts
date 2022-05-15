import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdeComponent } from './components/ide/ide.component';
import { ReportsComponent } from './components/rst/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: IdeComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
