/**
 * Created by Xurxo on 04/03/2016.
 */
var expect = require('chai').expect;
var request = require('superagent');

describe('Sample web app', function() {
    var baseUrl = 'http://localhost:8000';

    describe('when requested at /hello', function() {
        it('should say hello', function(done) {
            request.get(baseUrl + '/home').end(function assert(err, res) {
                expect(err).to.not.be.ok;
                expect(res).to.have.property('status', 200);
                expect(res.text).to.equal('Hello world!');
                done();
            });
        });
    });

    describe('when requested at /', function() {
        it('should redirect', function(done) {
           request.get(baseUrl).end(function assert(err, res) {
               expect(res.redirects).to.contains('http://localhost:8000/index.html');
               done();
           });
        });
    });

    describe('when requested at /index.html', function() {
        it('should response ok', function(done) {
            request.get(baseUrl + '/index.html').end(function assert(err, res) {
                expect(res).to.have.property('status', 200);
                done();
            });
        });
    });


});