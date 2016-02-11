angular.module('easyStorage', []).factory('EasyStorage', AlwaysLocalEasyStorageFactory);


function AlwaysLocalEasyStorageFactory($q) {
    var easyStorage = EasyStorage;
    var currentAppType = getCurrentAppType();
    var storageTypes = {
        localStorage: {
            get: getByLocalStorage,
            set: setByLocalStorage
        },
        chromeApp: {
            get: getByChromeApp,
            set: setByChromeApp
        }
    };
    easyStorage.prototype.set = set;
    easyStorage.prototype.get = get;
    return easyStorage;

    function EasyStorage(name) {
        var self = this;
        self.name = name;
    }

    function getCurrentAppType() {
        return 'chromeApp';
        //return 'localStorage';
    }

    function get() {
        return storageTypes[currentAppType].get.apply(this, arguments);
    }

    function set(key, data) {
        return storageTypes[currentAppType].set.apply(this, arguments);
    }

    /*

     LOCAL STORAGE METHODS

     */

    /**
     * @description
     * Gets data from the localStorage
     * @param {string=} key an optional param for getting specific data
     * @returns {*}
     */
    function getByLocalStorage(key) {
        var defer = $q.defer();
        var data = window.localStorage.getItem(this.name);
        var dataParsed;
        try {
            dataParsed = JSON.parse(data);
        } catch (error) {
            defer.reject(error);
        }
        if (key) {
            if (!angular.isObject(dataParsed)) {
                defer.reject('Parsed Data is not an Object');
            } else if (angular.isDefined(dataParsed[key])) {
                defer.resolve(dataParsed[key]);
            } else {
                defer.reject('Key is undefined');
            }
        } else {
            defer.resolve(dataParsed);
        }
        return defer.promise;
    }

    /**
     * @description
     * Sets data to the localStorage
     * @param {string|*} key either the key of the data that should be overridden or the whole data
     * @param {*=} value If set then the data of the key will be overridden
     * @returns {*}
     */
    function setByLocalStorage(key, value) {
        var defer = $q.defer();
        var self = this;

        getByLocalStorage.call(self).then(function (data) {
            var dataString;
            if (value) {
                data[key] = value;
            } else {
                data = key;
            }
            try {
                dataString = JSON.stringify(data);
            } catch (error) {
                defer.reject(error);
            }

            window.localStorage.setItem(self.name, dataString);
            defer.resolve(data, dataString);
        }, defer.reject);

        return defer.promise;
    }


    /*

     CHROME APP METHODS

     */

    function getByChromeApp(key) {
        var defer = $q.defer();
        var self = this;
        chrome.storage.local.get(self.name, function (response) {
            var data = response[self.name];
            if (key) {
                if (!angular.isObject(data)) {
                    defer.reject('Parsed Data is not an Object');
                } else if (angular.isDefined(data[key])) {
                    defer.resolve(data[key]);
                } else {
                    defer.reject('Key is undefined');
                }
            } else {
                defer.resolve(data);
            }
            defer.resolve();
        });
        return defer.promise;
    }

    function setByChromeApp(key, value) {
        var defer = $q.defer();
        var self = this;

        getByChromeApp.call(self).then(function (data) {//@todo: das könnte hier anderes überschreiben
            if (value) {
                data[key] = value;
            } else {
                data = key;
            }
            var dataWithName = {};
            dataWithName[self.name] = data;
            chrome.storage.local.set(dataWithName, function () {
                defer.resolve(data, JSON.stringify(data));
            });
        }, defer.reject);

        return defer.promise;
    }

}