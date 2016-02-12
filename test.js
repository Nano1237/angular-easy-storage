angular.module('test', ['angular-hybrid-storage']).run(function (HybridStorage) {
    var testA = new HybridStorage('TEST_NAME');
    testA.get().then(function (data) {
        console.log(data, 'a');
    }, function (error) {
        console.warn(error);
    });
    //
    //
    testA.set({a: 1}).then(function () {
        testA.set('a', 66).then(function (data) {
            console.log(data, 'a');
        }, function (error) {
            console.warn(error);
        })
    }, function (error) {
        console.warn(error);
    });


    var testB = new HybridStorage('TEST_NAME_B');
    testB.get().then(function (data) {
        console.log(data, 'b');
    }, function (error) {
        console.warn(error);
    });
    //
    //
    testB.set({b: 0}).then(function () {
        testB.set('b', 99).then(function (data) {
            console.log(data, 'b');
        }, function (error) {
            console.warn(error);
        })
    }, function (error) {
        console.warn(error);
    })
});