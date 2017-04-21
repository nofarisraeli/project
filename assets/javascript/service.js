App.service("requestsService", function ($http, $q) {
    var local = 'he';

    this.getData = function (url) {
        var defer = $q.defer();
        $http.get(url)
            .success(function successCallback(response) {
                var data = response.data;
                defer.resolve(data);
            }).error(function errorCallback(response) {
            defer.reject("error");
        });

        return defer.promise;
};

this.sendData = function (url, data, cbSuccess, cbError) {
    $http.post(url,data)
        .then(function (response) {
                if (response.data.error) {
                    if (cbError)
                        cbError(response.data.msg);
                }
                else {
                    if (cbSuccess)
                        cbSuccess(response.data);
                }
            },function errorCallback(response) {
            cbError("error");
        });
};

//***********************************************************************************//
});