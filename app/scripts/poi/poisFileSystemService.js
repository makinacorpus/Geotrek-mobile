'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings, globalizationSettings, utils) {

    this._getPoisTrekAbsoluteURL = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
    };

    this._getPoisTrekRelativeURL = function(trekId) {
        return settings.device.RELATIVE_TREK_ROOT + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
    };

    this.convertServerUrlToPoiFileSystemUrl = function(poiId, serverUrl) {
        var filename = serverUrl.substr(serverUrl.lastIndexOf('/') + 1);
        return settings.device.CDV_POI_ROOT + '/' + poiId.toString() + '/' + filename;
    };

    this.convertServerUrlToPictoFileSystemUrl = function(poiId, serverUrl) {
        var filename = serverUrl.substr(serverUrl.lastIndexOf('/') + 1);
        return settings.device.CDV_PICTO_POI_ROOT + '/' + filename;
    };

    this.replaceImgURLs = function(poiData) {
        var copy = angular.copy(poiData, {}),
            _this = this;

        // Parse poi pictures, and change their URL
        angular.forEach(copy.features, function(poi) {
            var currentPoiId = poi.id;

            poi.properties.thumbnail = _this.convertServerUrlToPoiFileSystemUrl(currentPoiId, poi.properties.thumbnail);
            poi.properties.type.pictogram = _this.convertServerUrlToPictoFileSystemUrl(currentPoiId, poi.properties.type.pictogram);

            angular.forEach(poi.properties.pictures, function(picture) {
                picture.url = _this.convertServerUrlToPoiFileSystemUrl(currentPoiId, picture.url);
            });
        });
        return copy;
    };

    // Getting Pois used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getPoisFromTrek = function(trekId) {
        var replaceUrls = true;
        return this._getPoisFromTrek(trekId, replaceUrls);
    };

    // Getting server trek original data
    this.getRawPoisFromTrek = function(trekId) {
        var replaceUrls = false;
        return this._getPoisFromTrek(trekId, replaceUrls);
    };

    this._getPoisFromTrek = function(trekId, replaceUrls) {

        var trekPoisFilepath = this._getPoisTrekRelativeURL(trekId),
            deferred = $q.defer(),
            _this = this;

        $cordovaFile.readAsText(trekPoisFilepath)
        .then(
            function(data) {
                var jsonData = JSON.parse(data);
                if (replaceUrls) {
                    jsonData = _this.replaceImgURLs(jsonData);
                }
                deferred.resolve(jsonData);
            },
            deferred.reject
        );

        return deferred.promise;
    };

});