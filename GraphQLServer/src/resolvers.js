import { productDetails } from "./data";
import { DataUtil, Query, DataManager, Predicate } from "@syncfusion/ej2-data";

DataUtil.serverTimezoneOffset = 0;

const resolvers = {
  Query: {
    // Main query used by the grid (supports paging, sorting, filtering, searching)
    getProducts: (parent, { datamanager }, context, info) => {
      console.log('getProducts called with:', datamanager);

      let orders = [...productDetails];
      const query = new Query();
      // 1. Filtering
      const performFiltering = (filterString) => {
        const parsed = JSON.parse(filterString);

        // Some filter UIs send an array of predicates; commonly you want the first group
        // Adjust this if your payload is different
        const predicateCollection = Array.isArray(parsed) ? parsed[0] : parsed;

        // Guard
        if (!predicateCollection || !Array.isArray(predicateCollection.predicates) || predicateCollection.predicates.length === 0) {
          return query; // nothing to apply
        }

        const condition = (predicateCollection.condition || 'and').toLowerCase(); // 'and' | 'or'
        const ignoreCase = predicateCollection.ignoreCase !== undefined ? !!predicateCollection.ignoreCase : true;

        // Build a combined Predicate chain
        let combined = null;

        predicateCollection.predicates.forEach(p => {
          // If the format nests predicateCollections, handle recursively
          if (p.isComplex && Array.isArray(p.predicates)) {
            // Recursively build nested predicateCollection predicate
            const nested = buildNestedPredicate(p, ignoreCase);
            if (nested) {
              combined = combined
                ? (condition === 'or' ? combined.or(nested) : combined.and(nested))
                : nested;
            }
            return;
          }

          // Leaf predicate
          const pred = new Predicate(p.field, p.operator, p.value, ignoreCase);
          combined = combined
            ? (condition === 'or' ? combined.or(pred) : combined.and(pred))
            : pred;
        });

        // Clear previous where clauses if needed (optional depending on your lifecycle)
        // query.queries = query.queries.filter(q => q.fn !== 'where');

        if (combined) {
          query.where(combined);
        }

        return query;
      };
      // Helper for nested predicates
      function buildNestedPredicate(block, ignoreCase) {
        const condition = (block.condition || 'and').toLowerCase();
        let mergedPredicate = null;

        block.predicates.forEach(p => {
          let node;
          if (p.isComplex && Array.isArray(p.predicates)) {
            node = buildNestedPredicate(p, ignoreCase);
          } else {
            node = new Predicate(p.field, p.operator, p.value, ignoreCase);
          }
          if (node) {
            mergedPredicate = mergedPredicate
              ? (condition === 'or' ? mergedPredicate.or(node) : mergedPredicate.and(node))
              : node;
          }
        });

        return mergedPredicate;
      }
  
      // 2. Searching (uncomment when you want to support grid search)
      const performSearching = (searchParam) => {
        const { fields, key } = JSON.parse(searchParam)[0];
        query.search(key, fields);
      }
      // 3. Sorting
     const performSorting = (sorted) => {
        for (let i = 0; i < sorted.length; i++) {
          const { name, direction } = sorted[i];
          query.sortBy(name, direction);
        }
      }

      // Apply all operations
      if (datamanager.where) {
        performFiltering(datamanager.where);
      }
      if (datamanager.search) {
        performSearching(datamanager.search);
      }
      if (datamanager.sorted) {
        performSorting(datamanager.sorted);
      }

      // Execute filtering/sorting/search first
      const filteredData = new DataManager(orders).executeLocal(query);

      // Total count after filtering
      const count = filteredData.length;

      // 4. Paging
      let result = filteredData;

      if (datamanager.take !== undefined) {
        const skip = datamanager.skip || 0;
        const take = datamanager.take;

        query.page(skip / take + 1, take);
        result = new DataManager(filteredData).executeLocal(query);
      }

      return {
        result,
        count
      };
    },

    getProductById: (parent, { datamanager }) => {
      console.log('getProductById called with datamanager:', datamanager);

      let id = null;
      if (datamanager && datamanager.params) {
        try {
          const paramsObj = JSON.parse(datamanager.params);
          id = paramsObj.id;
        } catch (e) {
          console.error('Failed to parse params:', datamanager.params);
        }
      }

      if (!id) return null;

      const product = productDetails.find(p => p.productId === id);
      return product || null;
    }

  },

  Mutation: {
    createProduct: (parent, { value }, context, info) => {
      productDetails.push(value);
      return value;
    },
    updateProduct: (parent, { key, keyColumn, value }, context, info) => {
      const product = productDetails.find(p => p.productId === key);
      if (!product) throw new Error("Product not found");

      Object.assign(product, value);
      return product;
    },
     
    deleteProduct: (parent, { key, keyColumn = 'productId' }, context, info) => {
      const idx = productDetails.findIndex(p => String(p[keyColumn]) === String(key));
      if (idx === -1) throw new Error('Product not found');
      const [deleted] = productDetails.splice(idx, 1);
      return deleted;
    }

  }
};

export default resolvers;