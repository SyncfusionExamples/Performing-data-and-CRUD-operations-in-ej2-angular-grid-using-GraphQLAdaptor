import { OrderData } from "./db";
import { DataUtil, Query, DataManager } from "@syncfusion/ej2-data";

DataUtil.serverTimezoneOffset = 0;

const resolvers = {
  Query: {
    getOrders: (parent, { datamanager }, context, info) => {
      console.log(datamanager);
      let orders = [...OrderData];
      const query = new Query();

      const performFiltering = (filterString) => {
        const filter = JSON.parse(filterString);
        // Iterating over each predicate
        filter[0].predicates.forEach(predicate => {
          const field = predicate.field;
          const operator = predicate.operator;
          const value = predicate.value;
          query.where(field, operator, value);
        });
      }
      const performSearching = (searchParam) => {
        const { fields, key } = JSON.parse(searchParam)[0];
        query.search(key, fields);
      }
      const performSorting = (sorted) => {
        for (let i = 0; i < sorted.length; i++) {
          const { name, direction } = sorted[i];
          query.sortBy(name, direction);
        }
      }

      // Perform filtering
      if (datamanager.where) {
        performFiltering(datamanager.where);
      }

      // Perform Searching
      if (datamanager.search) {
        performSearching(datamanager.search);
      }

      // Perform sorting
      if (datamanager.sorted) {
        performSorting(datamanager.sorted);
      }

      orders = new DataManager(orders).executeLocal(query);
      var count = orders.length;

      // Perform paging
      if (datamanager.skip && datamanager.take) {
        const pageSkip = datamanager.skip / datamanager.take + 1;
        const pageTake = datamanager.take;
        query.page(pageSkip, pageTake);
      } else if (datamanager.skip === 0 && datamanager.take) {
        query.page(1, datamanager.take);
      }

      const currentResult = new DataManager(orders).executeLocal(query);
      return { result: currentResult, count: count }; // Return result and count separately
    },
  },
  Mutation: {
    createOrder: (parent, { value }, context, info) => {
      const newOrder = value;
      OrderData.push(newOrder);
      return newOrder;
    },
    updateOrder: (parent, { key, keyColumn, value }, context, info) => {
      let updatedOrder = OrderData.find(order => order.OrderID === parseInt(key));
      updatedOrder.CustomerID = value.CustomerID;
      updatedOrder.EmployeeID = value.EmployeeID;
      updatedOrder.Freight = value.Freight;
      updatedOrder.ShipCity = value.ShipCity;
      updatedOrder.ShipCountry = value.ShipCountry;
      return updatedOrder; // Make sure to return the updated order.
    },
    deleteOrder: (parent, { key, keyColumn, value }, context, info) => {
      const orderIndex = OrderData.findIndex(order => order.OrderID === parseInt(key));
      if (orderIndex === -1) throw new Error("Order not found." + value);
      const deletedOrders = OrderData.splice(orderIndex, 1);
      return deletedOrders[0];
    }
  }

};

export default resolvers;