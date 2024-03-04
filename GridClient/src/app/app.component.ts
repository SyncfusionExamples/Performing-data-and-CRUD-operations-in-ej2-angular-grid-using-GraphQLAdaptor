import { Component, OnInit } from '@angular/core';
import { EditSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, GraphQLAdaptor } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  template: `<h1>Syncfusion Grid - GraphQLAdaptor</h1>
  <ejs-grid [dataSource]='data' [allowPaging]="true" [allowSorting]="true" [allowFiltering]="true"
  [pageSettings]="pageSettings" [editSettings]="editSettings" [toolbar]="toolbar">
  <e-columns>
      <e-column field='OrderID' headerText='Order ID' textAlign='Right' width=90 isPrimaryKey='true'></e-column>
      <e-column field='CustomerID' headerText='Customer ID' width=120></e-column>
      <e-column field='ShipCity' headerText='Ship City' textAlign='Right' width=90></e-column>
      <e-column field='ShipCountry' headerText='Ship Country' width=120></e-column>
  </e-columns>
</ejs-grid>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public data!: DataManager;
  public pageSettings!: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  public toolbar?: string[];

  ngOnInit(): void {
    this.data = new DataManager({
      url: "http://localhost:4205/", adaptor: new GraphQLAdaptor({
        response: {
          result: 'getOrders.result',
          count: 'getOrders.count'
        },
        query: `query getOrders($datamanager: DataManager) {
        getOrders(datamanager: $datamanager) {
         count,
         result{
          OrderID, CustomerID, ShipCity, ShipCountry}
         }
        }`,
        // mutation for performing CRUD
        getMutation: function (action: any): string {
          if (action === 'insert') {
            return `mutation CreateOrderMutation($value: OrderInput!){
           createOrder(value: $value){
            OrderID, CustomerID, ShipCity, ShipCountry
           }}`;
          }
          if (action === 'update') {
            return `mutation UpdateOrderMutation($key: Int!, $keyColumn: String,$value: OrderInput){
           updateOrder(key: $key, keyColumn: $keyColumn, value: $value) {
            OrderID, CustomerID, ShipCity, ShipCountry
           }
         }`;
          } else {
            return `mutation RemoveOrderMutation($key: Int!, $keyColumn: String, $value: OrderInput){
           deleteOrder(key: $key, keyColumn: $keyColumn, value: $value) {
            OrderID, CustomerID, ShipCity, ShipCountry
           }
          }`;
          }
        }
      })
    });
    this.pageSettings = { pageSize: 12 };
    this.editSettings = { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Normal' };
    this.toolbar = ['Search', 'Add', 'Delete', 'Update', 'Cancel'];
  }
}
