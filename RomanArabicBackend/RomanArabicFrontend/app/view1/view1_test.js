'use strict';

describe('First test', function() {
    it("should be true", function() {
        expect(true).toBe(true);
    });
});

describe('Check test', function() {
    var scope,
        controller;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new(); // create a new clean scope
        controller = $controller(roman_to_arabic, {
            $scope: scope
        });
    }));


    it("should be", function() {

        check("m", scope);

        expect(scope).toBeDefined();
        expect(scope.checked).toBeDefined();
        expect(scope.valid).toBe("");

        check("ma", scope);

        expect(scope.valid).toBe("Your Roman numeral contains an error.");
        //scope.valid = "";

        //expect(check).toBeDefined();
        //expect(check("m", scope)).toBeDefined();

    });
});

describe('Check use', function() {
    var scope,
        controller;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new(); // create a new clean scope
        controller = $controller(roman_to_arabic, {
            $scope: scope
        });
    }));

    it("Should be false", function() {
        scope.roman = 'mca';
        scope.check(scope.roman);
        expect(scope.checked).toBeFalsy();
    });

    it('Should be ok', function() {
        scope.roman = 'mcmxci';
        scope.submit();

        //expect(scope.answer).toBe('1991');
        expect(scope.roman).toBeDefined();
        expect(scope.checked).toBeTruthy();
    })
});