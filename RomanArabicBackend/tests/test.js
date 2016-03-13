/**
 * Created by Xurxo on 04/03/2016.
 */
process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var request = require('superagent');

describe('Testing GET', function() {
    var baseUrl = 'http://localhost:8000';

    describe('when requested at /', function() {
        it('should redirect: 302', function(done) {
           request.get(baseUrl).end(function assert(err, res) {
               console.log(res);
               expect(res).to.have.property('status', 200);
               expect(res.redirects).to.contains('http://localhost:8000/index.html');
               done();
           });
        });
    });

    describe('when requested at /index.html', function() {
        it('should response ok: 200', function(done) {
            request.get(baseUrl + '/index.html').end(function assert(err, res) {
                expect(res).to.have.property('status', 200);
                done();
            });
        });
    });

    describe('when requested at /a_wrong_path', function() {
        it('should response error: 404', function(done) {
            request.get(baseUrl + '/a_wrong_path').end(function assert(err, res) {
                expect(res).to.have.property('status', 404);
                done();
            });
        });
    });


});

describe('Testing POST', function() {
    var baseUrl = 'http://localhost:8000';

    describe('when sending arabic number', function() {
        it('should return "X"', function(done) {
            request.post(baseUrl + '/arabic_to_roman')
                .send({'data': 10})
                .end(function assert(err, res) {
                    expect(res).to.have.property('status', 200);
                    expect(res.text).to.equal("X");
                    expect(res).to.be.json;
                    done();
                });
        });
        it('should return "MCMXCI"', function(done) {
            request.post(baseUrl + '/arabic_to_roman')
                .send({'data': 1991})
                .end(function assert(err, res) {
                    expect(res).to.have.property('status', 200);
                    expect(res.text).to.equal("MCMXCI");
                    expect(res).to.be.json;
                    done();
                });
        });
    });

    describe('when sending roman number', function() {
        it('should return "10"', function(done) {
            request.post(baseUrl + '/roman_to_arabic')
                .send({'data': "X"})
                .end(function assert(err, res) {
                    expect(res).to.have.property('status', 200);
                    expect(res.text).to.equal("10");
                    expect(res).to.be.json;
                    done();
                });
        });
        it('should return "1991"', function(done) {
            request.post(baseUrl + '/roman_to_arabic')
                .send({'data': "MCMXCI"})
                .end(function assert(err, res) {
                    expect(res).to.have.property('status', 200);
                    expect(res.text).to.equal("1991");
                    expect(res).to.be.json;
                    done();
                });
        });
    });

    describe('when asking for update', function() {
        it('should return values', function(done) {
            request.post(baseUrl + '/update')
                .send()
                .end(function assert(err, res) {
                    expect(res).to.have.property('status', 200);
                    expect(res).to.be.json;
                    done();
                });
        });
    });

    describe('when sending wrong post key values', function() {
        it('should give error 400: Bad request in roman to arabic', function(done) {
            request.post(baseUrl + '/roman_to_arabic')
                .send({'aaa': "something"})
                .end(function assert(err, res) {
                    expect(res).to.have.property('status', 400);
                    done();
                });
        });
        it('should give error 400: Bad request in arabic to roman', function(done) {
            request.post(baseUrl + '/arabic_to_roman')
                .send({'aaa': "something"})
                .end(function assert(err, res) {
                    expect(res).to.have.property('status', 400);
                    done();
                });
        });
    });
});