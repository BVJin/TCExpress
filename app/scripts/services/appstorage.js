'use strict';

/**
 * @ngdoc service
 * @name mobileApp.appstorage
 * @description
 * # appstorage
 * Factory in the mobileApp.
 * ref:
 *   https://github.com/capaj/angularLocalStorage.git
 */
angular.module('expressWuApp')

.provider('AppStorage', function AppStorage() {
  var keyPrefix = 'sys-';
  var encrypt = false;
  var privateMethods = {
    reviver: function(key, value) {

      if (typeof value === 'string') {
        var regexp;

        regexp = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.exec(value);
        if (regexp) {
          return new Date(value);
        }
      }

      return value;
    }
  };

  this.setPrefix = function(prefix) {
    keyPrefix = prefix + '_';
  }

  this.setEncryptMode = function(type) {
    encrypt = type;
  }

  this.$get = function($parse, $crypto) {

    return {

      disableCaching: function() {
        this.disabled = true;
      },

      enableCaching: function() {
        this.disabled = false;
      },

      version: function() {
        return '1';
      },

      prefixKey: function(key) {
        return keyPrefix + key;
      },

      set: function(key, value) {
        key = this.prefixKey(key);

        value = JSON.stringify(value);

        if (value) {
          localStorage.setItem(key, encrypt ? $crypto.encrypt(value) : value);
          // localStorage.setItem(key, value);
        }
      },

      get: function(key) {
        key = this.prefixKey(key);
        var val, value = localStorage.getItem(key);

        if (value) {
          val = JSON.parse(encrypt ? $crypto.decrypt(value) : value, privateMethods.reviver);
          // val = JSON.parse(value, privateMethods.reviver);
        }

        return val;
      },

      remove: function(key) {
        key = this.prefixKey(key);
        localStorage.removeItem(key);
      },

      flush: function() {
        while (localStorage.length) localStorage.removeItem(localStorage.key(0));
      },

      isPresent: function(key) {
        if (!this.disabled) {
          return !!this.get(key);
        }
        return false;
      },

      /**
       * Bind - let's you directly bind a localStorage value to a $scope variable
       * @param {Angular $scope} $scope - the current scope you want the variable available in
       * @param {String} key - the name of the variable you are binding
       * @param {Object} opts - (optional) custom options like default value or unique store name
       * Here are the available options you can set:
       * * defaultValue: the default value
       * * storeName: add a custom store key value instead of using the scope variable name
       * @returns {*} - returns whatever the stored value is
       */
      bind: function($scope, key, opts) {
        var defaultOpts = {
          defaultValue: '',
          storeName: ''
        };
        // Backwards compatibility with old defaultValue string
        if (angular.isString(opts)) {
          opts = angular.extend({}, defaultOpts, {
            defaultValue: opts
          });
        } else {
          // If no defined options we use defaults otherwise extend defaults
          opts = (angular.isUndefined(opts)) ? defaultOpts : angular.extend(defaultOpts, opts);
        }

        // Set the storeName key for the localStorage entry
        // use user defined in specified
        var storeName = opts.storeName || key;

        // If a value doesn't already exist store it as is
        if (!this.get(storeName)) {
          this.set(storeName, opts.defaultValue);
        }

        // If it does exist assign it to the $scope value
        $parse(key).assign($scope, this.get(storeName));

        // Register a listener for changes on the $scope value
        // to update the localStorage value
        $scope.$watch(key, function(val) {
          if (angular.isDefined(val)) {
            this.set(storeName, val);
          }
        }, true);

        return this.get(storeName);
      },

      /**
       * Unbind - let's you unbind a variable from localStorage while removing the value from both
       * the localStorage and the local variable and sets it to null
       * @param $scope - the scope the variable was initially set in
       * @param key - the name of the variable you are unbinding
       * @param storeName - (optional) if you used a custom storeName you will have to specify it here as well
       */
      unbind: function($scope, key, storeName) {
        storeName = storeName || key;
        $parse(key).assign($scope, null);
        $scope.$watch(key, function() {});
        pub.remove(storeName);
      },
    }
  }
})

// .factory('Storage', function(UserHandler) {
//   var getPrefix = function() {
//     var account = UserHandler.getFromLocal();
//     return account.username || 'undefined';
//   }

//   function log(msg) {
//     console.log(msg);
//   }

//   return {

//     initialize: function(callback) {
//       var self = this;
//       var prefix = getPrefix(),
//         dbName = prefix + "_localdb";

//       this.db = window.openDatabase(prefix + "_localdb", "1.0", "Local DB - " + prefix, 2 * 1024 * 1024);

//       // Testing if the table exists is not needed and is here for logging purpose only. We can invoke createTable
//       // no matter what. The 'IF NOT EXISTS' clause will make sure the CREATE statement is issued only if the table
//       // does not already exist.
//       this.db.transaction(
//         function(tx) {
//           tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'", this.txErrorHandler,
//             function(tx, results) {
//               if (results.rows.length == 1) {
//                 log('Using existing accounts table in local SQLite database');
//               } else {
//                 log('Accounts table does not exist in local SQLite database');
//                 self.createTable(callback);
//               }
//             });
//         }
//       )

//     },

//     createTable: function(callback) {
//       this.db.transaction(
//         function(tx) {
//           var sql =
//             "CREATE TABLE IF NOT EXISTS  accounts ( " +
//             "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
//             "username VARCHAR(32), " +
//             "password VARCHAR(64), " +
//             "email VARCHAR(64), " +
//             "device_type VARCHAR(32), " +
//             "gender VARCHAR(16), " +
//             "yob VARCHAR(32), " +
//             "disability VARCHAR(64), " +
//             "transfer_strategy VARCHAR(64), " +
//             "primary_device INTEGER, " +
//             "deleted INTEGER DEFAULT 0, " +
//             "created_date TIMESTAMP DEFAULT (datetime('now', 'localtime')), " +
//             "changed_date TIMESTAMP DEFAULT (datetime('now', 'localtime')) )
//             ";

//           tx.executeSql(sql);
//         },
//         this.txErrorHandler,
//         function() {
//           log('Table account successfully CREATED in local SQLite database');
//           callback();
//         }
//       );
//     },

//     dropTable: function(callback) {
//       this.db.transaction(
//         function(tx) {
//           tx.executeSql('DROP TABLE IF EXISTS employee');
//         },
//         this.txErrorHandler,
//         function() {
//           log('Table employee successfully DROPPED in local SQLite database');
//           callback();
//         }
//       );
//     },

//     findAll: function(callback) {
//       this.db.transaction(
//         function(tx) {
//           var sql = "
//           SELECT * FROM EMPLOYEE ";
//           log('Local SQLite database: "
//           SELECT * FROM EMPLOYEE "');
//           tx.executeSql(sql, this.txErrorHandler,
//             function(tx, results) {
//               var len = results.rows.length,
//                 employees = [],
//                 i = 0;
//               for (; i < len; i = i + 1) {
//                 employees[i] = results.rows.item(i);
//               }
//               log(len + ' rows found');
//               callback(employees);
//             }
//           );
//         }
//       );
//     },

//     getLastSync: function(callback) {
//       this.db.transaction(
//         function(tx) {
//           var sql = "
//           SELECT MAX(lastModified) as lastSync FROM employee ";
//           tx.executeSql(sql, this.txErrorHandler,
//             function(tx, results) {
//               var lastSync = results.rows.item(0).lastSync;
//               log('Last local timestamp is ' + lastSync);
//               callback(lastSync);
//             }
//           );
//         }
//       );
//     },

//     sync: function(callback) {

//       var self = this;
//       log('Starting synchronization...');
//       this.getLastSync(function(lastSync) {
//         self.getChanges(self.syncURL, lastSync,
//           function(changes) {
//             if (changes.length > 0) {
//               self.applyChanges(changes, callback);
//             } else {
//               log('Nothing to synchronize');
//               callback();
//             }
//           }
//         );
//       });

//     },

//     getChanges: function(syncURL, modifiedSince, callback) {

//       $.ajax({
//         url: syncURL,
//         data: {
//           modifiedSince: modifiedSince
//         },
//         dataType: "
//           json ",
//         success: function(data) {
//           log("
//           The server returned " + data.length + "
//           changes that occurred after " + modifiedSince);
//           callback(data);
//         },
//         error: function(model, response) {
//           alert(response.responseText);
//         }
//       });

//     },

//     applyChanges: function(employees, callback) {
//       this.db.transaction(
//         function(tx) {
//           var l = employees.length;
//           var sql =
//             "
//           INSERT OR REPLACE INTO employee(id, firstName, lastName, title, officePhone, deleted, lastModified)
//           " +
//             "
//           VALUES( ? , ? , ? , ? , ? , ? , ? )
//           ";
//           log('Inserting or Updating in local database:');
//           var e;
//           for (var i = 0; i < l; i++) {
//             e = employees[i];
//             log(e.id + ' ' + e.firstName + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
//             var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
//             tx.executeSql(sql, params);
//           }
//           log('Synchronization complete (' + l + ' items synchronized)');
//         },
//         this.txErrorHandler,
//         function(tx) {
//           callback();
//         }
//       );
//     },

//     txErrorHandler: function(tx) {
//       alert(tx.message);
//     }
//   }
// })
;
