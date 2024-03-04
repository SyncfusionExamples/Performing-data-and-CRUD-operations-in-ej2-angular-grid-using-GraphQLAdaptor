module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/graphpack/config/index.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/config/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const cosmiconfig = __webpack_require__(/*! cosmiconfig */ "cosmiconfig");
const webpack = __webpack_require__(/*! webpack */ "webpack");
const defaultConfig = __webpack_require__(/*! ./webpack.config */ "./node_modules/graphpack/config/webpack.config.js");
const explorer = cosmiconfig('graphpack').search();
const loadServerConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};
  return {
    port: Number(process.env.PORT),
    ...userConfig.server
  };
};
const loadWebpackConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};
  if (typeof userConfig.webpack === 'function') {
    return userConfig.webpack({
      config: defaultConfig,
      webpack
    });
  }
  return {
    ...defaultConfig,
    ...userConfig.webpack
  };
};
exports.loadServerConfig = loadServerConfig;
exports.loadWebpackConfig = loadWebpackConfig;

/***/ }),

/***/ "./node_modules/graphpack/config/webpack.config.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphpack/config/webpack.config.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FriendlyErrorsWebpackPlugin = __webpack_require__(/*! friendly-errors-webpack-plugin */ "friendly-errors-webpack-plugin");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const webpack = __webpack_require__(/*! webpack */ "webpack");
const nodeExternals = __webpack_require__(/*! webpack-node-externals */ "webpack-node-externals");
const isDev = "development" !== 'production';
const isWebpack = typeof __webpack_require__.m === 'object';
const hasBabelRc = fs.existsSync(path.resolve('babel.config.js'));
if (hasBabelRc && !isWebpack) {
  console.info('🐠 Using babel.config.js defined in your app root');
}
module.exports = {
  devtool: 'source-map',
  entry: {
    // We take care of setting up entry file under lib/index.js
    index: ['graphpack']
  },
  // When bundling with Webpack for the backend you usually don't want to bundle
  // its node_modules dependencies. This creates an externals function that
  // ignores node_modules when bundling in Webpack.
  externals: [nodeExternals({
    whitelist: [/^graphpack$/]
  })],
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      test: /\.(gql|graphql)/,
      use: 'graphql-tag/loader'
    }, {
      test: /\.(js|ts)$/,
      use: [{
        loader: /*require.resolve*/(/*! babel-loader */ "babel-loader"),
        options: {
          babelrc: true,
          cacheDirectory: true,
          presets: hasBabelRc ? undefined : [/*require.resolve*/(/*! babel-preset-graphpack */ "babel-preset-graphpack")]
        }
      }]
    }, {
      test: /\.mjs$/,
      type: 'javascript/auto'
    }]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  optimization: {
    noEmitOnErrors: true
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(process.cwd(), './build'),
    sourceMapFilename: '[name].map'
  },
  performance: {
    hints: false
  },
  plugins: [new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  }), new webpack.EnvironmentPlugin({
    DEBUG: false,
    GRAPHPACK_SRC_DIR: path.resolve(process.cwd(), 'src'),
    NODE_ENV: 'development'
  }), new FriendlyErrorsWebpackPlugin({
    clearConsole: isDev
  })],
  resolve: {
    extensions: ['.ts', '.js']
  },
  stats: 'minimal',
  target: 'node'
};

/***/ }),

/***/ "./node_modules/graphpack/lib/server.js":
/*!**********************************************!*\
  !*** ./node_modules/graphpack/lib/server.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _srcFiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./srcFiles */ "./node_modules/graphpack/lib/srcFiles.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./node_modules/graphpack/config/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_3__);




if (!(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"] && Object.keys(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"]).length > 0)) {
  throw Error(`Couldn't find any resolvers. Please add resolvers to your src/resolvers.js`);
}
const createServer = config => {
  const {
    applyMiddleware,
    port: serverPort,
    ...options
  } = config;
  const port = Number(process.env.PORT) || serverPort || 4000;
  // Pull out fields that are not relevant for the apollo server

  // Use apollo-server-express when middleware detected
  if (applyMiddleware && applyMiddleware.app && typeof applyMiddleware.app.listen === 'function') {
    const server = new apollo_server_express__WEBPACK_IMPORTED_MODULE_1__["ApolloServer"](options);
    server.applyMiddleware(applyMiddleware);
    return applyMiddleware.app.listen({
      port
    }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
  }

  // Use apollo-server
  const server = new apollo_server__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"](options);
  return server.listen({
    port
  }).then(({
    url
  }) => console.log(`🚀 Server ready at ${url}`));
};
const startServer = async () => {
  // Load server config from graphpack.config.js
  const config = await Object(_config__WEBPACK_IMPORTED_MODULE_3__["loadServerConfig"])();
  createServer({
    ...config,
    context: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["context"],
    resolvers: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"],
    typeDefs: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["typeDefs"]
  });
};
startServer();

/***/ }),

/***/ "./node_modules/graphpack/lib/srcFiles.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/lib/srcFiles.js ***!
  \************************************************/
/*! exports provided: importFirst, context, resolvers, typeDefs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importFirst", function() { return importFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolvers", function() { return resolvers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeDefs", function() { return typeDefs; });
const importFirst = req => req.keys().map(mod => req(mod).default || req(mod))[0];

// Optionally import modules
const context = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$"));
const resolvers = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$"));
const typeDefs = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$"));

/***/ }),

/***/ "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$":
/*!**********************************************************!*\
  !*** ./src sync ^\.\/(context|context\/index)\.(js|ts)$ ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$":
/*!**************************************************************!*\
  !*** ./src sync ^\.\/(resolvers|resolvers\/index)\.(js|ts)$ ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./resolvers.js": "./src/resolvers.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$":
/*!********************************************************************!*\
  !*** ./src sync ^\.\/(schema|schema\/index)\.(gql|graphql|js|ts)$ ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./schema.graphql": "./src/schema.graphql"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$";

/***/ }),

/***/ "./src/db.js":
/*!*******************!*\
  !*** ./src/db.js ***!
  \*******************/
/*! exports provided: OrderData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderData", function() { return OrderData; });
let OrderData = [{
  OrderID: 10248,
  CustomerID: 'VINET',
  OrderDate: '1996-07-04T00:00:00.000Z',
  ShippedDate: '1996-07-16T00:00:00.000Z',
  Freight: 32.38,
  ShipName: 'Vins et alcools Chevalier',
  ShipAddress: "59 rue de l'Abbaye",
  ShipCity: 'Reims',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10249,
  CustomerID: 'TOMSP',
  OrderDate: '1996-07-05T00:00:00.000Z',
  ShippedDate: '1996-07-10T00:00:00.000Z',
  Freight: 11.61,
  ShipName: 'Toms Spezialitäten',
  ShipAddress: 'Luisenstr. 48',
  ShipCity: 'Münster',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10250,
  CustomerID: 'HANAR',
  OrderDate: '1996-07-08T00:00:00.000Z',
  ShippedDate: '1996-07-12T00:00:00.000Z',
  Freight: 65.83,
  ShipName: 'Hanari Carnes',
  ShipAddress: 'Rua do Paço, 67',
  ShipCity: 'Rio de Janeiro',
  ShipRegion: 'RJ',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10251,
  CustomerID: 'VICTE',
  OrderDate: '1996-07-08T00:00:00.000Z',
  ShippedDate: '1996-07-15T00:00:00.000Z',
  Freight: 41.34,
  ShipName: 'Victuailles en stock',
  ShipAddress: '2, rue du Commerce',
  ShipCity: 'Lyon',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10252,
  CustomerID: 'SUPRD',
  OrderDate: '1996-07-09T00:00:00.000Z',
  ShippedDate: '1996-07-11T00:00:00.000Z',
  Freight: 51.3,
  ShipName: 'Suprêmes délices',
  ShipAddress: 'Boulevard Tirou, 255',
  ShipCity: 'Charleroi',
  ShipRegion: null,
  ShipCountry: 'Belgium'
}, {
  OrderID: 10253,
  CustomerID: 'HANAR',
  OrderDate: '1996-07-10T00:00:00.000Z',
  ShippedDate: '1996-07-16T00:00:00.000Z',
  Freight: 58.17,
  ShipName: 'Hanari Carnes',
  ShipAddress: 'Rua do Paço, 67',
  ShipCity: 'Rio de Janeiro',
  ShipRegion: 'RJ',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10254,
  CustomerID: 'CHOPS',
  OrderDate: '1996-07-11T00:00:00.000Z',
  ShippedDate: '1996-07-23T00:00:00.000Z',
  Freight: 22.98,
  ShipName: 'Chop-suey Chinese',
  ShipAddress: 'Hauptstr. 31',
  ShipCity: 'Bern',
  ShipRegion: null,
  ShipCountry: 'Switzerland'
}, {
  OrderID: 10255,
  CustomerID: 'RICSU',
  OrderDate: '1996-07-12T00:00:00.000Z',
  ShippedDate: '1996-07-15T00:00:00.000Z',
  Freight: 148.33,
  ShipName: 'Richter Supermarkt',
  ShipAddress: 'Starenweg 5',
  ShipCity: 'Genève',
  ShipRegion: null,
  ShipCountry: 'Switzerland'
}, {
  OrderID: 10256,
  CustomerID: 'WELLI',
  OrderDate: '1996-07-15T00:00:00.000Z',
  ShippedDate: '1996-07-17T00:00:00.000Z',
  Freight: 13.97,
  ShipName: 'Wellington Importadora',
  ShipAddress: 'Rua do Mercado, 12',
  ShipCity: 'Resende',
  ShipRegion: 'SP',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10257,
  CustomerID: 'HILAA',
  OrderDate: '1996-07-16T00:00:00.000Z',
  ShippedDate: '1996-07-22T00:00:00.000Z',
  Freight: 81.91,
  ShipName: 'HILARION-Abastos',
  ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
  ShipCity: 'San Cristóbal',
  ShipRegion: 'Táchira',
  ShipCountry: 'Venezuela'
}, {
  OrderID: 10258,
  CustomerID: 'ERNSH',
  OrderDate: '1996-07-17T00:00:00.000Z',
  ShippedDate: '1996-07-23T00:00:00.000Z',
  Freight: 140.51,
  ShipName: 'Ernst Handel',
  ShipAddress: 'Kirchgasse 6',
  ShipCity: 'Graz',
  ShipRegion: null,
  ShipCountry: 'Austria'
}, {
  OrderID: 10259,
  CustomerID: 'CENTC',
  OrderDate: '1996-07-18T00:00:00.000Z',
  ShippedDate: '1996-07-25T00:00:00.000Z',
  Freight: 3.25,
  ShipName: 'Centro comercial Moctezuma',
  ShipAddress: 'Sierras de Granada 9993',
  ShipCity: 'México D.F.',
  ShipRegion: null,
  ShipCountry: 'Mexico'
}, {
  OrderID: 10260,
  CustomerID: 'OTTIK',
  OrderDate: '1996-07-19T00:00:00.000Z',
  ShippedDate: '1996-07-29T00:00:00.000Z',
  Freight: 55.09,
  ShipName: 'Ottilies Käseladen',
  ShipAddress: 'Mehrheimerstr. 369',
  ShipCity: 'Köln',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10261,
  CustomerID: 'QUEDE',
  OrderDate: '1996-07-19T00:00:00.000Z',
  ShippedDate: '1996-07-30T00:00:00.000Z',
  Freight: 3.05,
  ShipName: 'Que Delícia',
  ShipAddress: 'Rua da Panificadora, 12',
  ShipCity: 'Rio de Janeiro',
  ShipRegion: 'RJ',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10262,
  CustomerID: 'RATTC',
  OrderDate: '1996-07-22T00:00:00.000Z',
  ShippedDate: '1996-07-25T00:00:00.000Z',
  Freight: 48.29,
  ShipName: 'Rattlesnake Canyon Grocery',
  ShipAddress: '2817 Milton Dr.',
  ShipCity: 'Albuquerque',
  ShipRegion: 'NM',
  ShipCountry: 'USA'
}, {
  OrderID: 10263,
  CustomerID: 'ERNSH',
  OrderDate: '1996-07-23T00:00:00.000Z',
  ShippedDate: '1996-07-31T00:00:00.000Z',
  Freight: 146.06,
  ShipName: 'Ernst Handel',
  ShipAddress: 'Kirchgasse 6',
  ShipCity: 'Graz',
  ShipRegion: null,
  ShipCountry: 'Austria'
}, {
  OrderID: 10264,
  CustomerID: 'FOLKO',
  OrderDate: '1996-07-24T00:00:00.000Z',
  ShippedDate: '1996-08-23T00:00:00.000Z',
  Freight: 3.67,
  ShipName: 'Folk och fä HB',
  ShipAddress: 'Åkergatan 24',
  ShipCity: 'Bräcke',
  ShipRegion: null,
  ShipCountry: 'Sweden'
}, {
  OrderID: 10265,
  CustomerID: 'BLONP',
  OrderDate: '1996-07-25T00:00:00.000Z',
  ShippedDate: '1996-08-12T00:00:00.000Z',
  Freight: 55.28,
  ShipName: 'Blondel père et fils',
  ShipAddress: '24, place Kléber',
  ShipCity: 'Strasbourg',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10266,
  CustomerID: 'WARTH',
  OrderDate: '1996-07-26T00:00:00.000Z',
  ShippedDate: '1996-07-31T00:00:00.000Z',
  Freight: 25.73,
  ShipName: 'Wartian Herkku',
  ShipAddress: 'Torikatu 38',
  ShipCity: 'Oulu',
  ShipRegion: null,
  ShipCountry: 'Finland'
}, {
  OrderID: 10267,
  CustomerID: 'FRANK',
  OrderDate: '1996-07-29T00:00:00.000Z',
  ShippedDate: '1996-08-06T00:00:00.000Z',
  Freight: 208.58,
  ShipName: 'Frankenversand',
  ShipAddress: 'Berliner Platz 43',
  ShipCity: 'München',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10268,
  CustomerID: 'GROSR',
  OrderDate: '1996-07-30T00:00:00.000Z',
  ShippedDate: '1996-08-02T00:00:00.000Z',
  Freight: 66.29,
  ShipName: 'GROSELLA-Restaurante',
  ShipAddress: '5ª Ave. Los Palos Grandes',
  ShipCity: 'Caracas',
  ShipRegion: 'DF',
  ShipCountry: 'Venezuela'
}, {
  OrderID: 10269,
  CustomerID: 'WHITC',
  OrderDate: '1996-07-31T00:00:00.000Z',
  ShippedDate: '1996-08-09T00:00:00.000Z',
  Freight: 4.56,
  ShipName: 'White Clover Markets',
  ShipAddress: '1029 - 12th Ave. S.',
  ShipCity: 'Seattle',
  ShipRegion: 'WA',
  ShipCountry: 'USA'
}, {
  OrderID: 10270,
  CustomerID: 'WARTH',
  OrderDate: '1996-08-01T00:00:00.000Z',
  ShippedDate: '1996-08-02T00:00:00.000Z',
  Freight: 136.54,
  ShipName: 'Wartian Herkku',
  ShipAddress: 'Torikatu 38',
  ShipCity: 'Oulu',
  ShipRegion: null,
  ShipCountry: 'Finland'
}, {
  OrderID: 10271,
  CustomerID: 'SPLIR',
  OrderDate: '1996-08-01T00:00:00.000Z',
  ShippedDate: '1996-08-30T00:00:00.000Z',
  Freight: 4.54,
  ShipName: 'Split Rail Beer & Ale',
  ShipAddress: 'P.O. Box 555',
  ShipCity: 'Lander',
  ShipRegion: 'WY',
  ShipCountry: 'USA'
}, {
  OrderID: 10272,
  CustomerID: 'RATTC',
  OrderDate: '1996-08-02T00:00:00.000Z',
  ShippedDate: '1996-08-06T00:00:00.000Z',
  Freight: 98.03,
  ShipName: 'Rattlesnake Canyon Grocery',
  ShipAddress: '2817 Milton Dr.',
  ShipCity: 'Albuquerque',
  ShipRegion: 'NM',
  ShipCountry: 'USA'
}, {
  OrderID: 10273,
  CustomerID: 'QUICK',
  OrderDate: '1996-08-05T00:00:00.000Z',
  ShippedDate: '1996-08-12T00:00:00.000Z',
  Freight: 76.07,
  ShipName: 'QUICK-Stop',
  ShipAddress: 'Taucherstraße 10',
  ShipCity: 'Cunewalde',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10274,
  CustomerID: 'VINET',
  OrderDate: '1996-08-06T00:00:00.000Z',
  ShippedDate: '1996-08-16T00:00:00.000Z',
  Freight: 6.01,
  ShipName: 'Vins et alcools Chevalier',
  ShipAddress: "59 rue de l'Abbaye",
  ShipCity: 'Reims',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10275,
  CustomerID: 'MAGAA',
  OrderDate: '1996-08-07T00:00:00.000Z',
  ShippedDate: '1996-08-09T00:00:00.000Z',
  Freight: 26.93,
  ShipName: 'Magazzini Alimentari Riuniti',
  ShipAddress: 'Via Ludovico il Moro 22',
  ShipCity: 'Bergamo',
  ShipRegion: null,
  ShipCountry: 'Italy'
}, {
  OrderID: 10276,
  CustomerID: 'TORTU',
  OrderDate: '1996-08-08T00:00:00.000Z',
  ShippedDate: '1996-08-14T00:00:00.000Z',
  Freight: 13.84,
  ShipName: 'Tortuga Restaurante',
  ShipAddress: 'Avda. Azteca 123',
  ShipCity: 'México D.F.',
  ShipRegion: null,
  ShipCountry: 'Mexico'
}, {
  OrderID: 10277,
  CustomerID: 'MORGK',
  OrderDate: '1996-08-09T00:00:00.000Z',
  ShippedDate: '1996-08-13T00:00:00.000Z',
  Freight: 125.77,
  ShipName: 'Morgenstern Gesundkost',
  ShipAddress: 'Heerstr. 22',
  ShipCity: 'Leipzig',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10278,
  CustomerID: 'BERGS',
  OrderDate: '1996-08-12T00:00:00.000Z',
  ShippedDate: '1996-08-16T00:00:00.000Z',
  Freight: 92.69,
  ShipName: 'Berglunds snabbköp',
  ShipAddress: 'Berguvsvägen  8',
  ShipCity: 'Luleå',
  ShipRegion: null,
  ShipCountry: 'Sweden'
}, {
  OrderID: 10279,
  CustomerID: 'LEHMS',
  OrderDate: '1996-08-13T00:00:00.000Z',
  ShippedDate: '1996-08-16T00:00:00.000Z',
  Freight: 25.83,
  ShipName: 'Lehmanns Marktstand',
  ShipAddress: 'Magazinweg 7',
  ShipCity: 'Frankfurt a.M.',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10280,
  CustomerID: 'BERGS',
  OrderDate: '1996-08-14T00:00:00.000Z',
  ShippedDate: '1996-09-12T00:00:00.000Z',
  Freight: 8.98,
  ShipName: 'Berglunds snabbköp',
  ShipAddress: 'Berguvsvägen  8',
  ShipCity: 'Luleå',
  ShipRegion: null,
  ShipCountry: 'Sweden'
}, {
  OrderID: 10281,
  CustomerID: 'ROMEY',
  OrderDate: '1996-08-14T00:00:00.000Z',
  ShippedDate: '1996-08-21T00:00:00.000Z',
  Freight: 2.94,
  ShipName: 'Romero y tomillo',
  ShipAddress: 'Gran Vía, 1',
  ShipCity: 'Madrid',
  ShipRegion: null,
  ShipCountry: 'Spain'
}, {
  OrderID: 10282,
  CustomerID: 'ROMEY',
  OrderDate: '1996-08-15T00:00:00.000Z',
  ShippedDate: '1996-08-21T00:00:00.000Z',
  Freight: 12.69,
  ShipName: 'Romero y tomillo',
  ShipAddress: 'Gran Vía, 1',
  ShipCity: 'Madrid',
  ShipRegion: null,
  ShipCountry: 'Spain'
}, {
  OrderID: 10283,
  CustomerID: 'LILAS',
  OrderDate: '1996-08-16T00:00:00.000Z',
  ShippedDate: '1996-08-23T00:00:00.000Z',
  Freight: 84.81,
  ShipName: 'LILA-Supermercado',
  ShipAddress: 'Carrera 52 con Ave. Bolívar #65-98 Llano Largo',
  ShipCity: 'Barquisimeto',
  ShipRegion: 'Lara',
  ShipCountry: 'Venezuela'
}, {
  OrderID: 10284,
  CustomerID: 'LEHMS',
  OrderDate: '1996-08-19T00:00:00.000Z',
  ShippedDate: '1996-08-27T00:00:00.000Z',
  Freight: 76.56,
  ShipName: 'Lehmanns Marktstand',
  ShipAddress: 'Magazinweg 7',
  ShipCity: 'Frankfurt a.M.',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10285,
  CustomerID: 'QUICK',
  OrderDate: '1996-08-20T00:00:00.000Z',
  ShippedDate: '1996-08-26T00:00:00.000Z',
  Freight: 76.83,
  ShipName: 'QUICK-Stop',
  ShipAddress: 'Taucherstraße 10',
  ShipCity: 'Cunewalde',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10286,
  CustomerID: 'QUICK',
  OrderDate: '1996-08-21T00:00:00.000Z',
  ShippedDate: '1996-08-30T00:00:00.000Z',
  Freight: 229.24,
  ShipName: 'QUICK-Stop',
  ShipAddress: 'Taucherstraße 10',
  ShipCity: 'Cunewalde',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10287,
  CustomerID: 'RICAR',
  OrderDate: '1996-08-22T00:00:00.000Z',
  ShippedDate: '1996-08-28T00:00:00.000Z',
  Freight: 12.76,
  ShipName: 'Ricardo Adocicados',
  ShipAddress: 'Av. Copacabana, 267',
  ShipCity: 'Rio de Janeiro',
  ShipRegion: 'RJ',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10288,
  CustomerID: 'REGGC',
  OrderDate: '1996-08-23T00:00:00.000Z',
  ShippedDate: '1996-09-03T00:00:00.000Z',
  Freight: 7.45,
  ShipName: 'Reggiani Caseifici',
  ShipAddress: 'Strada Provinciale 124',
  ShipCity: 'Reggio Emilia',
  ShipRegion: null,
  ShipCountry: 'Italy'
}, {
  OrderID: 10289,
  CustomerID: 'BSBEV',
  OrderDate: '1996-08-26T00:00:00.000Z',
  ShippedDate: '1996-08-28T00:00:00.000Z',
  Freight: 22.77,
  ShipName: "B' Beverages",
  ShipAddress: 'Fauntleroy Circus',
  ShipCity: 'London',
  ShipRegion: null,
  ShipCountry: 'UK'
}, {
  OrderID: 10290,
  CustomerID: 'COMMI',
  OrderDate: '1996-08-27T00:00:00.000Z',
  ShippedDate: '1996-09-03T00:00:00.000Z',
  Freight: 79.7,
  ShipName: 'Comércio Mineiro',
  ShipAddress: 'Av. dos Lusíadas, 23',
  ShipCity: 'Sao Paulo',
  ShipRegion: 'SP',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10291,
  CustomerID: 'QUEDE',
  OrderDate: '1996-08-27T00:00:00.000Z',
  ShippedDate: '1996-09-04T00:00:00.000Z',
  Freight: 6.4,
  ShipName: 'Que Delícia',
  ShipAddress: 'Rua da Panificadora, 12',
  ShipCity: 'Rio de Janeiro',
  ShipRegion: 'RJ',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10292,
  CustomerID: 'TRADH',
  OrderDate: '1996-08-28T00:00:00.000Z',
  ShippedDate: '1996-09-02T00:00:00.000Z',
  Freight: 1.35,
  ShipName: 'Tradiçao Hipermercados',
  ShipAddress: 'Av. Inês de Castro, 414',
  ShipCity: 'Sao Paulo',
  ShipRegion: 'SP',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10293,
  CustomerID: 'TORTU',
  OrderDate: '1996-08-29T00:00:00.000Z',
  ShippedDate: '1996-09-11T00:00:00.000Z',
  Freight: 21.18,
  ShipName: 'Tortuga Restaurante',
  ShipAddress: 'Avda. Azteca 123',
  ShipCity: 'México D.F.',
  ShipRegion: null,
  ShipCountry: 'Mexico'
}, {
  OrderID: 10294,
  CustomerID: 'RATTC',
  OrderDate: '1996-08-30T00:00:00.000Z',
  ShippedDate: '1996-09-05T00:00:00.000Z',
  Freight: 147.26,
  ShipName: 'Rattlesnake Canyon Grocery',
  ShipAddress: '2817 Milton Dr.',
  ShipCity: 'Albuquerque',
  ShipRegion: 'NM',
  ShipCountry: 'USA'
}, {
  OrderID: 10295,
  CustomerID: 'VINET',
  OrderDate: '1996-09-02T00:00:00.000Z',
  ShippedDate: '1996-09-10T00:00:00.000Z',
  Freight: 1.15,
  ShipName: 'Vins et alcools Chevalier',
  ShipAddress: "59 rue de l'Abbaye",
  ShipCity: 'Reims',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10296,
  CustomerID: 'LILAS',
  OrderDate: '1996-09-03T00:00:00.000Z',
  ShippedDate: '1996-09-11T00:00:00.000Z',
  Freight: 0.12,
  ShipName: 'LILA-Supermercado',
  ShipAddress: 'Carrera 52 con Ave. Bolívar #65-98 Llano Largo',
  ShipCity: 'Barquisimeto',
  ShipRegion: 'Lara',
  ShipCountry: 'Venezuela'
}, {
  OrderID: 10297,
  CustomerID: 'BLONP',
  OrderDate: '1996-09-04T00:00:00.000Z',
  ShippedDate: '1996-09-10T00:00:00.000Z',
  Freight: 5.74,
  ShipName: 'Blondel père et fils',
  ShipAddress: '24, place Kléber',
  ShipCity: 'Strasbourg',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10298,
  CustomerID: 'HUNGO',
  OrderDate: '1996-09-05T00:00:00.000Z',
  ShippedDate: '1996-09-11T00:00:00.000Z',
  Freight: 168.22,
  ShipName: 'Hungry Owl All-Night Grocers',
  ShipAddress: '8 Johnstown Road',
  ShipCity: 'Cork',
  ShipRegion: 'Co. Cork',
  ShipCountry: 'Ireland'
}, {
  OrderID: 10299,
  CustomerID: 'RICAR',
  OrderDate: '1996-09-06T00:00:00.000Z',
  ShippedDate: '1996-09-13T00:00:00.000Z',
  Freight: 29.76,
  ShipName: 'Ricardo Adocicados',
  ShipAddress: 'Av. Copacabana, 267',
  ShipCity: 'Rio de Janeiro',
  ShipRegion: 'RJ',
  ShipCountry: 'Brazil'
}, {
  OrderID: 10300,
  CustomerID: 'MAGAA',
  OrderDate: '1996-09-09T00:00:00.000Z',
  ShippedDate: '1996-09-18T00:00:00.000Z',
  Freight: 17.68,
  ShipName: 'Magazzini Alimentari Riuniti',
  ShipAddress: 'Via Ludovico il Moro 22',
  ShipCity: 'Bergamo',
  ShipRegion: null,
  ShipCountry: 'Italy'
}, {
  OrderID: 10301,
  CustomerID: 'WANDK',
  OrderDate: '1996-09-09T00:00:00.000Z',
  ShippedDate: '1996-09-17T00:00:00.000Z',
  Freight: 45.08,
  ShipName: 'Die Wandernde Kuh',
  ShipAddress: 'Adenauerallee 900',
  ShipCity: 'Stuttgart',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10302,
  CustomerID: 'SUPRD',
  OrderDate: '1996-09-10T00:00:00.000Z',
  ShippedDate: '1996-10-09T00:00:00.000Z',
  Freight: 6.27,
  ShipName: 'Suprêmes délices',
  ShipAddress: 'Boulevard Tirou, 255',
  ShipCity: 'Charleroi',
  ShipRegion: null,
  ShipCountry: 'Belgium'
}, {
  OrderID: 10303,
  CustomerID: 'GODOS',
  OrderDate: '1996-09-11T00:00:00.000Z',
  ShippedDate: '1996-09-18T00:00:00.000Z',
  Freight: 107.83,
  ShipName: 'Godos Cocina Típica',
  ShipAddress: 'C/ Romero, 33',
  ShipCity: 'Sevilla',
  ShipRegion: null,
  ShipCountry: 'Spain'
}, {
  OrderID: 10304,
  CustomerID: 'TORTU',
  OrderDate: '1996-09-12T00:00:00.000Z',
  ShippedDate: '1996-09-17T00:00:00.000Z',
  Freight: 63.79,
  ShipName: 'Tortuga Restaurante',
  ShipAddress: 'Avda. Azteca 123',
  ShipCity: 'México D.F.',
  ShipRegion: null,
  ShipCountry: 'Mexico'
}, {
  OrderID: 10305,
  CustomerID: 'OLDWO',
  OrderDate: '1996-09-13T00:00:00.000Z',
  ShippedDate: '1996-10-09T00:00:00.000Z',
  Freight: 257.62,
  ShipName: 'Old World Delicatessen',
  ShipAddress: '2743 Bering St.',
  ShipCity: 'Anchorage',
  ShipRegion: 'AK',
  ShipCountry: 'USA'
}, {
  OrderID: 10306,
  CustomerID: 'ROMEY',
  OrderDate: '1996-09-16T00:00:00.000Z',
  ShippedDate: '1996-09-23T00:00:00.000Z',
  Freight: 7.56,
  ShipName: 'Romero y tomillo',
  ShipAddress: 'Gran Vía, 1',
  ShipCity: 'Madrid',
  ShipRegion: null,
  ShipCountry: 'Spain'
}, {
  OrderID: 10307,
  CustomerID: 'LONEP',
  OrderDate: '1996-09-17T00:00:00.000Z',
  ShippedDate: '1996-09-25T00:00:00.000Z',
  Freight: 0.56,
  ShipName: 'Lonesome Pine Restaurant',
  ShipAddress: '89 Chiaroscuro Rd.',
  ShipCity: 'Portland',
  ShipRegion: 'OR',
  ShipCountry: 'USA'
}, {
  OrderID: 10308,
  CustomerID: 'ANATR',
  OrderDate: '1996-09-18T00:00:00.000Z',
  ShippedDate: '1996-09-24T00:00:00.000Z',
  Freight: 1.61,
  ShipName: 'Ana Trujillo Emparedados y helados',
  ShipAddress: 'Avda. de la Constitución 2222',
  ShipCity: 'México D.F.',
  ShipRegion: null,
  ShipCountry: 'Mexico'
}, {
  OrderID: 10309,
  CustomerID: 'HUNGO',
  OrderDate: '1996-09-19T00:00:00.000Z',
  ShippedDate: '1996-10-23T00:00:00.000Z',
  Freight: 47.3,
  ShipName: 'Hungry Owl All-Night Grocers',
  ShipAddress: '8 Johnstown Road',
  ShipCity: 'Cork',
  ShipRegion: 'Co. Cork',
  ShipCountry: 'Ireland'
}, {
  OrderID: 10310,
  CustomerID: 'THEBI',
  OrderDate: '1996-09-20T00:00:00.000Z',
  ShippedDate: '1996-09-27T00:00:00.000Z',
  Freight: 17.52,
  ShipName: 'The Big Cheese',
  ShipAddress: '89 Jefferson Way Suite 2',
  ShipCity: 'Portland',
  ShipRegion: 'OR',
  ShipCountry: 'USA'
}, {
  OrderID: 10311,
  CustomerID: 'DUMON',
  OrderDate: '1996-09-20T00:00:00.000Z',
  ShippedDate: '1996-09-26T00:00:00.000Z',
  Freight: 24.69,
  ShipName: 'Du monde entier',
  ShipAddress: '67, rue des Cinquante Otages',
  ShipCity: 'Nantes',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10312,
  CustomerID: 'WANDK',
  OrderDate: '1996-09-23T00:00:00.000Z',
  ShippedDate: '1996-10-03T00:00:00.000Z',
  Freight: 40.26,
  ShipName: 'Die Wandernde Kuh',
  ShipAddress: 'Adenauerallee 900',
  ShipCity: 'Stuttgart',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10313,
  CustomerID: 'QUICK',
  OrderDate: '1996-09-24T00:00:00.000Z',
  ShippedDate: '1996-10-04T00:00:00.000Z',
  Freight: 1.96,
  ShipName: 'QUICK-Stop',
  ShipAddress: 'Taucherstraße 10',
  ShipCity: 'Cunewalde',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10314,
  CustomerID: 'RATTC',
  OrderDate: '1996-09-25T00:00:00.000Z',
  ShippedDate: '1996-10-04T00:00:00.000Z',
  Freight: 74.16,
  ShipName: 'Rattlesnake Canyon Grocery',
  ShipAddress: '2817 Milton Dr.',
  ShipCity: 'Albuquerque',
  ShipRegion: 'NM',
  ShipCountry: 'USA'
}, {
  OrderID: 10315,
  CustomerID: 'ISLAT',
  OrderDate: '1996-09-26T00:00:00.000Z',
  ShippedDate: '1996-10-03T00:00:00.000Z',
  Freight: 41.76,
  ShipName: 'Island Trading',
  ShipAddress: 'Garden House Crowther Way',
  ShipCity: 'Cowes',
  ShipRegion: 'Isle of Wight',
  ShipCountry: 'UK'
}, {
  OrderID: 10316,
  CustomerID: 'RATTC',
  OrderDate: '1996-09-27T00:00:00.000Z',
  ShippedDate: '1996-10-08T00:00:00.000Z',
  Freight: 150.15,
  ShipName: 'Rattlesnake Canyon Grocery',
  ShipAddress: '2817 Milton Dr.',
  ShipCity: 'Albuquerque',
  ShipRegion: 'NM',
  ShipCountry: 'USA'
}, {
  OrderID: 10317,
  CustomerID: 'LONEP',
  OrderDate: '1996-09-30T00:00:00.000Z',
  ShippedDate: '1996-10-10T00:00:00.000Z',
  Freight: 12.69,
  ShipName: 'Lonesome Pine Restaurant',
  ShipAddress: '89 Chiaroscuro Rd.',
  ShipCity: 'Portland',
  ShipRegion: 'OR',
  ShipCountry: 'USA'
}, {
  OrderID: 10318,
  CustomerID: 'ISLAT',
  OrderDate: '1996-10-01T00:00:00.000Z',
  ShippedDate: '1996-10-04T00:00:00.000Z',
  Freight: 4.73,
  ShipName: 'Island Trading',
  ShipAddress: 'Garden House Crowther Way',
  ShipCity: 'Cowes',
  ShipRegion: 'Isle of Wight',
  ShipCountry: 'UK'
}, {
  OrderID: 10319,
  CustomerID: 'TORTU',
  OrderDate: '1996-10-02T00:00:00.000Z',
  ShippedDate: '1996-10-11T00:00:00.000Z',
  Freight: 64.5,
  ShipName: 'Tortuga Restaurante',
  ShipAddress: 'Avda. Azteca 123',
  ShipCity: 'México D.F.',
  ShipRegion: null,
  ShipCountry: 'Mexico'
}, {
  OrderID: 10320,
  CustomerID: 'WARTH',
  OrderDate: '1996-10-03T00:00:00.000Z',
  ShippedDate: '1996-10-18T00:00:00.000Z',
  Freight: 34.57,
  ShipName: 'Wartian Herkku',
  ShipAddress: 'Torikatu 38',
  ShipCity: 'Oulu',
  ShipRegion: null,
  ShipCountry: 'Finland'
}, {
  OrderID: 10321,
  CustomerID: 'ISLAT',
  OrderDate: '1996-10-03T00:00:00.000Z',
  ShippedDate: '1996-10-11T00:00:00.000Z',
  Freight: 3.43,
  ShipName: 'Island Trading',
  ShipAddress: 'Garden House Crowther Way',
  ShipCity: 'Cowes',
  ShipRegion: 'Isle of Wight',
  ShipCountry: 'UK'
}, {
  OrderID: 10322,
  CustomerID: 'PERIC',
  OrderDate: '1996-10-04T00:00:00.000Z',
  ShippedDate: '1996-10-23T00:00:00.000Z',
  Freight: 0.4,
  ShipName: 'Pericles Comidas clásicas',
  ShipAddress: 'Calle Dr. Jorge Cash 321',
  ShipCity: 'México D.F.',
  ShipRegion: null,
  ShipCountry: 'Mexico'
}, {
  OrderID: 10323,
  CustomerID: 'KOENE',
  OrderDate: '1996-10-07T00:00:00.000Z',
  ShippedDate: '1996-10-14T00:00:00.000Z',
  Freight: 4.88,
  ShipName: 'Königlich Essen',
  ShipAddress: 'Maubelstr. 90',
  ShipCity: 'Brandenburg',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10324,
  CustomerID: 'SAVEA',
  OrderDate: '1996-10-08T00:00:00.000Z',
  ShippedDate: '1996-10-10T00:00:00.000Z',
  Freight: 214.27,
  ShipName: 'Save-a-lot Markets',
  ShipAddress: '187 Suffolk Ln.',
  ShipCity: 'Boise',
  ShipRegion: 'ID',
  ShipCountry: 'USA'
}, {
  OrderID: 10325,
  CustomerID: 'KOENE',
  OrderDate: '1996-10-09T00:00:00.000Z',
  ShippedDate: '1996-10-14T00:00:00.000Z',
  Freight: 64.86,
  ShipName: 'Königlich Essen',
  ShipAddress: 'Maubelstr. 90',
  ShipCity: 'Brandenburg',
  ShipRegion: null,
  ShipCountry: 'Germany'
}, {
  OrderID: 10326,
  CustomerID: 'BOLID',
  OrderDate: '1996-10-10T00:00:00.000Z',
  ShippedDate: '1996-10-14T00:00:00.000Z',
  Freight: 77.92,
  ShipName: 'Bólido Comidas preparadas',
  ShipAddress: 'C/ Araquil, 67',
  ShipCity: 'Madrid',
  ShipRegion: null,
  ShipCountry: 'Spain'
}, {
  OrderID: 10327,
  CustomerID: 'FOLKO',
  OrderDate: '1996-10-11T00:00:00.000Z',
  ShippedDate: '1996-10-14T00:00:00.000Z',
  Freight: 63.36,
  ShipName: 'Folk och fä HB',
  ShipAddress: 'Åkergatan 24',
  ShipCity: 'Bräcke',
  ShipRegion: null,
  ShipCountry: 'Sweden'
}, {
  OrderID: 10328,
  CustomerID: 'FURIB',
  OrderDate: '1996-10-14T00:00:00.000Z',
  ShippedDate: '1996-10-17T00:00:00.000Z',
  Freight: 87.03,
  ShipName: 'Furia Bacalhau e Frutos do Mar',
  ShipAddress: 'Jardim das rosas n. 32',
  ShipCity: 'Lisboa',
  ShipRegion: null,
  ShipCountry: 'Portugal'
}, {
  OrderID: 10329,
  CustomerID: 'SPLIR',
  OrderDate: '1996-10-15T00:00:00.000Z',
  ShippedDate: '1996-10-23T00:00:00.000Z',
  Freight: 191.67,
  ShipName: 'Split Rail Beer & Ale',
  ShipAddress: 'P.O. Box 555',
  ShipCity: 'Lander',
  ShipRegion: 'WY',
  ShipCountry: 'USA'
}, {
  OrderID: 10330,
  CustomerID: 'LILAS',
  OrderDate: '1996-10-16T00:00:00.000Z',
  ShippedDate: '1996-10-28T00:00:00.000Z',
  Freight: 12.75,
  ShipName: 'LILA-Supermercado',
  ShipAddress: 'Carrera 52 con Ave. Bolívar #65-98 Llano Largo',
  ShipCity: 'Barquisimeto',
  ShipRegion: 'Lara',
  ShipCountry: 'Venezuela'
}, {
  OrderID: 10331,
  CustomerID: 'BONAP',
  OrderDate: '1996-10-16T00:00:00.000Z',
  ShippedDate: '1996-10-21T00:00:00.000Z',
  Freight: 10.19,
  ShipName: 'Bon app',
  ShipAddress: '12, rue des Bouchers',
  ShipCity: 'Marseille',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10332,
  CustomerID: 'MEREP',
  OrderDate: '1996-10-17T00:00:00.000Z',
  ShippedDate: '1996-10-21T00:00:00.000Z',
  Freight: 52.84,
  ShipName: 'Mère Paillarde',
  ShipAddress: '43 rue St. Laurent',
  ShipCity: 'Montréal',
  ShipRegion: 'Québec',
  ShipCountry: 'Canada'
}, {
  OrderID: 10333,
  CustomerID: 'WARTH',
  OrderDate: '1996-10-18T00:00:00.000Z',
  ShippedDate: '1996-10-25T00:00:00.000Z',
  Freight: 0.59,
  ShipName: 'Wartian Herkku',
  ShipAddress: 'Torikatu 38',
  ShipCity: 'Oulu',
  ShipRegion: null,
  ShipCountry: 'Finland'
}, {
  OrderID: 10334,
  CustomerID: 'VICTE',
  OrderDate: '1996-10-21T00:00:00.000Z',
  ShippedDate: '1996-10-28T00:00:00.000Z',
  Freight: 8.56,
  ShipName: 'Victuailles en stock',
  ShipAddress: '2, rue du Commerce',
  ShipCity: 'Lyon',
  ShipRegion: null,
  ShipCountry: 'France'
}, {
  OrderID: 10335,
  CustomerID: 'HUNGO',
  OrderDate: '1996-10-22T00:00:00.000Z',
  ShippedDate: '1996-10-24T00:00:00.000Z',
  Freight: 42.11,
  ShipName: 'Hungry Owl All-Night Grocers',
  ShipAddress: '8 Johnstown Road',
  ShipCity: 'Cork',
  ShipRegion: 'Co. Cork',
  ShipCountry: 'Ireland'
}, {
  OrderID: 10336,
  CustomerID: 'PRINI',
  OrderDate: '1996-10-23T00:00:00.000Z',
  ShippedDate: '1996-10-25T00:00:00.000Z',
  Freight: 15.51,
  ShipName: 'Princesa Isabel Vinhos',
  ShipAddress: 'Estrada da saúde n. 58',
  ShipCity: 'Lisboa',
  ShipRegion: null,
  ShipCountry: 'Portugal'
}, {
  OrderID: 10337,
  CustomerID: 'FRANK',
  OrderDate: '1996-10-24T00:00:00.000Z',
  ShippedDate: '1996-10-29T00:00:00.000Z',
  Freight: 108.26,
  ShipName: 'Frankenversand',
  ShipAddress: 'Berliner Platz 43',
  ShipCity: 'München',
  ShipRegion: null,
  ShipCountry: 'Germany'
}];

/***/ }),

/***/ "./src/resolvers.js":
/*!**************************!*\
  !*** ./src/resolvers.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ "./src/db.js");
/* harmony import */ var _syncfusion_ej2_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @syncfusion/ej2-data */ "@syncfusion/ej2-data");
/* harmony import */ var _syncfusion_ej2_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_syncfusion_ej2_data__WEBPACK_IMPORTED_MODULE_1__);


_syncfusion_ej2_data__WEBPACK_IMPORTED_MODULE_1__["DataUtil"].serverTimezoneOffset = 0;
const resolvers = {
  Query: {
    getOrders: (parent, {
      datamanager
    }, context, info) => {
      console.log(datamanager);
      let orders = [..._db__WEBPACK_IMPORTED_MODULE_0__["OrderData"]];
      const query = new _syncfusion_ej2_data__WEBPACK_IMPORTED_MODULE_1__["Query"]();
      const performFiltering = filterString => {
        const filter = JSON.parse(filterString);
        // Iterating over each predicate
        filter[0].predicates.forEach(predicate => {
          const field = predicate.field;
          const operator = predicate.operator;
          const value = predicate.value;
          query.where(field, operator, value);
        });
      };
      const performSearching = searchParam => {
        const {
          fields,
          key
        } = JSON.parse(searchParam)[0];
        query.search(key, fields);
      };
      const performSorting = sorted => {
        for (let i = 0; i < sorted.length; i++) {
          const {
            name,
            direction
          } = sorted[i];
          query.sortBy(name, direction);
        }
      };

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
      orders = new _syncfusion_ej2_data__WEBPACK_IMPORTED_MODULE_1__["DataManager"](orders).executeLocal(query);
      var count = orders.length;

      // Perform paging
      if (datamanager.skip && datamanager.take) {
        const pageSkip = datamanager.skip / datamanager.take + 1;
        const pageTake = datamanager.take;
        query.page(pageSkip, pageTake);
      } else if (datamanager.skip === 0 && datamanager.take) {
        query.page(1, datamanager.take);
      }
      const currentResult = new _syncfusion_ej2_data__WEBPACK_IMPORTED_MODULE_1__["DataManager"](orders).executeLocal(query);
      return {
        result: currentResult,
        count: count
      }; // Return result and count separately
    }
  },
  Mutation: {
    createOrder: (parent, {
      value
    }, context, info) => {
      const newOrder = value;
      _db__WEBPACK_IMPORTED_MODULE_0__["OrderData"].push(newOrder);
      return newOrder;
    },
    updateOrder: (parent, {
      key,
      keyColumn,
      value
    }, context, info) => {
      let updatedOrder = _db__WEBPACK_IMPORTED_MODULE_0__["OrderData"].find(order => order.OrderID === parseInt(key));
      updatedOrder.CustomerID = value.CustomerID;
      updatedOrder.EmployeeID = value.EmployeeID;
      updatedOrder.Freight = value.Freight;
      updatedOrder.ShipCity = value.ShipCity;
      updatedOrder.ShipCountry = value.ShipCountry;
      return updatedOrder; // Make sure to return the updated order.
    },
    deleteOrder: (parent, {
      key,
      keyColumn,
      value
    }, context, info) => {
      const orderIndex = _db__WEBPACK_IMPORTED_MODULE_0__["OrderData"].findIndex(order => order.OrderID === parseInt(key));
      if (orderIndex === -1) throw new Error("Order not found." + value);
      const deletedOrders = _db__WEBPACK_IMPORTED_MODULE_0__["OrderData"].splice(orderIndex, 1);
      return deletedOrders[0];
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (resolvers);

/***/ }),

/***/ "./src/schema.graphql":
/*!****************************!*\
  !*** ./src/schema.graphql ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"Sort"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"direction"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"Aggregate"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"field"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"DataManager"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"skip"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"take"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"sorted"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Sort"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"group"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"table"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"select"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"where"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"search"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"requiresCounts"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"aggregates"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Aggregate"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"params"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"OrderInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"OrderID"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"CustomerID"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ShipCity"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ShipCountry"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Order"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"OrderID"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"CustomerID"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ShipCity"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ShipCountry"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ReturnType"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"result"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"count"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"aggregates"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"getOrders"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"datamanager"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DataManager"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ReturnType"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateOrder"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"keyColumn"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteOrder"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"keyColumn"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}}},"directives":[]}]}],"loc":{"start":0,"end":1172}};
    doc.loc.source = {"body":"#Grid Sort direction\r\n\r\ninput Sort {\r\n    name: String\r\n    direction: String\r\n} \r\n\r\n#Grid aggregates type\r\n\r\ninput Aggregate {\r\n    field: String! \r\n    type: String!\r\n}\r\n\r\n#Syncfusion DataManager query params\r\n\r\ninput DataManager {\r\n    skip: Int\r\n    take: Int\r\n    sorted: [Sort]\r\n    group: [String]\r\n    table: String\r\n    select: [String]\r\n    where: String\r\n    search: String\r\n    requiresCounts: Boolean,\r\n    aggregates: [Aggregate],\r\n    params: String\r\n}\r\n\r\n# Grid field names\r\ninput OrderInput {\r\n  OrderID: Int!\r\n  CustomerID: String\r\n  ShipCity: String\r\n  ShipCountry: String\r\n}\r\n\r\ntype Order {\r\n  OrderID: Int!\r\n  CustomerID: String\r\n  ShipCity: String\r\n  ShipCountry: String\r\n}\r\n\r\n# need to return type as 'result (i.e, current pager data)' and count (i.e., total number of records in your database)\r\ntype ReturnType {\r\n  result: [Order]\r\n  count: Int\r\n  aggregates: String\r\n}\r\n\r\ntype Query {\r\n  getOrders(datamanager: DataManager): ReturnType \r\n}\r\ntype Mutation {\r\n\r\n  createOrder(value: OrderInput): Order!\r\n  updateOrder(key: Int!, keyColumn: String, value: OrderInput): Order\r\n  deleteOrder(key: Int!, keyColumn: String, value: OrderInput): Order!\r\n}","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ 0:
/*!***********************!*\
  !*** multi graphpack ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! graphpack */"./node_modules/graphpack/lib/server.js");


/***/ }),

/***/ "@syncfusion/ej2-data":
/*!***************************************!*\
  !*** external "@syncfusion/ej2-data" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@syncfusion/ej2-data");

/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "babel-loader":
/*!*******************************!*\
  !*** external "babel-loader" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-loader");

/***/ }),

/***/ "babel-preset-graphpack":
/*!*****************************************!*\
  !*** external "babel-preset-graphpack" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-preset-graphpack");

/***/ }),

/***/ "cosmiconfig":
/*!******************************!*\
  !*** external "cosmiconfig" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cosmiconfig");

/***/ }),

/***/ "friendly-errors-webpack-plugin":
/*!*************************************************!*\
  !*** external "friendly-errors-webpack-plugin" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("friendly-errors-webpack-plugin");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-node-externals":
/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })

/******/ });
//# sourceMappingURL=index.map