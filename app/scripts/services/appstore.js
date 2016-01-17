'use strict';

/**
 * @ngdoc service
 * @name mobileAppApp.MSSService
 * @description
 * # MSSService
 * Factory in the mobileAppApp.
 */
angular.module('expressWuApp')

.factory('AppStore', function($log, AppStorage) {

  return {

    get: function() {
      // $log.debug('get local storage');
      var db = AppStorage.get('db');
      if (!db) {
        db = {};
        this.set(db);
      }

      return db;
    },

    set: function(db) {
      AppStorage.set('db', db);
    },

    reset: function() {
      this.set({});
    },

    setValue: function(key, value) {
      AppStorage.set(key, value);
    },

    getValue: function(key) {
      return AppStorage.get(key);
    }
  };
});
