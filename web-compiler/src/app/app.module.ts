import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsoleLogComponent } from './components/ide/console-log/console-log.component';
import { ActionsNavComponent } from './components/ide/actions-nav/actions-nav.component';
import { AsideFilesComponent } from './components/ide/aside-files/aside-files.component';
import { FilesEditComponent } from './components/ide/files-edit/files-edit.component';
import { IdeComponent } from './components/ide/ide.component';
import { FormsModule } from '@angular/forms';
import { LoadScriptsService } from './services/load-scripts.service';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleLogComponent,
    ActionsNavComponent,
    AsideFilesComponent,
    FilesEditComponent,
    IdeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [LoadScriptsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
