/**
 * Created by Xurxo on 02/03/2016.
 */
var port = 8000;
var serverUrl = "127.0.0.1";

var http = require("http");
var path = require("path");
var fs = require("fs");
var mongoose = require('mongoose');

var now = new Date();
console.log("Starting web server at " + serverUrl + ":" + port + ", time is: " + now);
var infoSent = false;

var conversion = mongoose.Schema({
    date: Date,
    roman: String,
    arabic: Number,
    conversion: String
});

var Conversion = mongoose.model('Conversion', conversion);
var prod_db = 'mongodb://Xurxo:xx_rta_pass@ds019468.mlab.com:19468/heroku_3c5mc0tl';
var dev_db = 'mongodb://localhost/test';

mongoose.connect(dev_db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {

    http.createServer( function(req, res) {

        var custom = false;
        var aux;
        var resul;
        now = new Date();

        console.log(req.method);

        if(req.method == "POST") {
            switch(req.url) {

                case "/roman_to_arabic":
                    req.on('data', function(chunk) {
                        var value = JSON.parse(chunk);

                        Conversion.find({roman: value.data.toUpperCase()}, function(err, conversions) {
                            if(err) {
                                console.log(err);
                            } else {
                                if (conversions.length > 0) {
                                    resul = conversions[0].arabic;
                                    console.log("DATA RETRIEVED: " + resul);
                                    console.log(conversions[0].date);
                                    Conversion.update({arabic: resul}, {date: now}, function(err, conv) {
                                        console.log(conv);
                                    });
                                } else {
                                    //console.log(conversions.length);
                                    resul = roman_to_arabic(chunk);
                                    aux = new Conversion({
                                        date: now,
                                        roman: value.data.toUpperCase(),
                                        arabic: resul,
                                        conversion: 'rta'
                                    });
                                    aux.save(function (err, conv) {
                                        console.log("Succesfully saved.");
                                    });
                                    console.log(aux);
                                }
                                res.write(resul.toString());
                                res.end();
                            }
                        });

                    });
                    custom = true;
                    break;

                case "/arabic_to_roman":
                    req.on('data', function(chunk) {
                        var value = JSON.parse(chunk);

                        Conversion.find({arabic: value.data}, function(err, conversions) {
                            if(err) {
                                console.log(err);
                            } else {

                                if(conversions.length > 0) {
                                    resul = conversions[0].roman;
                                    console.log("DATA RETRIEVED: " + resul);
                                    console.log(conversions[0].date);
                                    Conversion.update({roman: resul}, {date: now}, function(err, conv) {
                                        console.log(conv);
                                    });
                                } else {
                                    resul = arabic_to_roman(chunk);
                                    aux = new Conversion({date: now, roman: resul, arabic: value.data, conversion: 'atr'});
                                    aux.save(function (err, conv) {
                                        console.log("Succesfully saved.");
                                    });
                                    console.log(aux);
                                }
                                res.write(resul);
                                res.end();
                            }
                        });
                    });
                    custom = true;
                    break;

                case '/update':
                    //var resul = [];
                    var resul = Conversion.find({}).sort({'date': -1}).limit(5);
                    resul.exec(function(err, convs) {
                        if(err) {
                            console.log(err);
                        } else {
                            if(convs.length > 0) {
                                console.log("SENDING --> " + convs.toString());
                                res.write(JSON.stringify(convs));
                                res.end();
                            }
                        }
                    });
                    custom = true;
                    break;

                default:
                    console.log("Incorrect");
                    res.write("Wrong use");
                    res.end();
                    break;
            }
            req.on('data', function(chunk) {
                console.log(req.url);
            });
        } else {
            if(req.method == "GET") {
                switch(req.url) {
                    case '/home':
                        console.log("HELLO");
                        res.writeHead(200);
                        res.write('Hello world!');
                        res.end();
                        custom = true;
                        break;
                    default:
                        custom = false;
                        break;
                }
            }
        }

        var filename = req.url || "index.html";
        //var filename = "/index.html";
        var ext = path.extname(filename);
        var localPath = __dirname;
        var validExtensions = {
            ".html" : "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".txt": "text/plain",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".png": "image/png",
            ".ico": "image/png"
        };
        var isValidExt = validExtensions[ext];

        if (isValidExt && !custom) {

            localPath += "\\..\\RomanArabicFrontend\\app" + filename;
            fs.exists(localPath, function(exists) {
                if(exists) {
                    if(filename == "/index.html") {
                        infoSent = true;
                    }
                    //    var resul = Conversion.find({}).sort({'date': -1}).limit(5);
                    //    resul.exec(function(err, convs) {
                    //        if(err) {
                    //            console.log(err);
                    //        } else {
                    //            if(convs.length > 0) {
                    //                console.log("SENDING --> " + convs.toString());
                    //                res.writeHead(200);
                    //                res.write(JSON.stringify(convs));
                    //                //res.end();
                    //                infoSent = true;
                    //            }
                    //        }
                    //    });
                    //}
                    console.log("Serving file: " + localPath);
                    getFile(localPath, res, ext);
                } else {
                    console.log("File not found: " + localPath);
                    res.writeHead(404);
                    res.end();
                }
            });

        } else {
            if(!custom) {
                console.log("Invalid file extension detected: " + ext);
                res.writeHead(302, {
                    'Location': '/index.html'
                });
                res.end();
            }
        }

    }).listen(port, serverUrl);

});

function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function(err, contents) {
        if(!err) {
            res.setHeader("Content-Length", contents.length);
            //res.setHeader("Content-Type", mimeType);
            res.statusCode = 200;
            if(infoSent) {
                console.log(contents);

                infoSent = false;
            }
            res.write(contents);
            res.end();
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}

function roman_to_arabic(value) {
    var data = JSON.parse(value);
    console.log("ROMAN -> ARABIC: " + deromanize(data.data));
    return deromanize(data.data);
}

function arabic_to_roman(value) {
    var data = JSON.parse(value);
    console.log("ARABIC -> ROMAN: " + romanize(data.data));
    return romanize(data.data);
}

function romanize (num) {
    if (!+num)
        return false;
    var	digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
            "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
            "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function deromanize (str) {
    var	str = str.toUpperCase(),
        validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
        token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
        key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
        num = 0, m;
    if (!(str && validator.test(str)))
        return false;
    while (m = token.exec(str))
        num += key[m[0]];
    return num;
}