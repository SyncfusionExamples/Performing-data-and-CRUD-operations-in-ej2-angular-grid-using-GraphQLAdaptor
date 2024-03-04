import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import the GridModule for the Grid component
import { EditService, FilterService, GridModule, GroupService, PageService, ToolbarService, SortService } from '@syncfusion/ej2-angular-grids';
import { AppComponent } from './app.component';

@NgModule({
  //declaration of ej2-angular-grids module into NgModule
  imports: [BrowserModule, GridModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [PageService, GroupService, EditService, FilterService, ToolbarService, SortService]
})
export class AppModule { }