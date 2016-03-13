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
var dev_db = 'mongodb://localhost/test';

// Connecting with Mongo Database
mongoose.connect(dev_db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Once the DB is connected
db.once('open', function () {

    // Create server HTTP
    http.createServer( function(req, res) {

        var custom = false;  // To check if it's an allowed "custom" path
        var aux;
        var resul;
        now = new Date();

        // For Post methods
        if(req.method == "POST") {

            // Depending on the path
            switch(req.url) {

                case "/roman_to_arabic":
                    req.on('data', function(chunk) {
                        var value = JSON.parse(chunk);

                        // Check if the key "value" exists
                        if(value.data) {

                            // Search the value to convert in the database
                            Conversion.find({roman: value.data.toUpperCase()}, function (err, conversions) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // If it's already converted just get the stored data
                                    if (conversions.length > 0) {
                                        resul = conversions[0].arabic;

                                        // If the stored conversion was on the other direction, update atr -> rta and time
                                        if (conversions[0].conversion == "atr") {
                                            Conversion.update({arabic: resul}, {
                                                date: now,
                                                conversion: "rta"
                                            }, function (err, conv) {
                                                // TODO: error handle
                                            });
                                        } else {  // Update only the time
                                            Conversion.update({arabic: resul}, {date: now}, function (err, conv) {
                                                // TODO: error handle
                                            });
                                        }
                                    } else {  // If the value is not in the database
                                        // Make the conversion
                                        resul = roman_to_arabic(chunk);
                                        aux = new Conversion({
                                            date: now,
                                            roman: value.data.toUpperCase(),
                                            arabic: resul,
                                            conversion: 'rta'
                                        });
                                        // Store it in the database
                                        aux.save(function (err, conv) {
                                            // TODO: error handle
                                        });
                                    }
                                    // Send answer to the client
                                    res.write(resul.toString());
                                    res.end();
                                }
                            });
                        } else {
                            // If "value" key doesn't exist, POST with wrong keys
                            res.writeHead(400);
                            res.end();
                        }

                    });
                    custom = true;  // This is a valid path
                    break;

                case "/arabic_to_roman":
                    req.on('data', function(chunk) {
                        var value = JSON.parse(chunk);

                        // Check if the key "value" exists
                        if(value.data) {

                            // Search the value to convert in the database
                            Conversion.find({arabic: value.data}, function (err, conversions) {
                                if (err) {
                                    console.log(err);
                                    // TODO: error handle
                                } else {
                                    // If it's already converted just get the stored data
                                    if (conversions.length > 0) {
                                        resul = conversions[0].roman;
                                        now = new Date();
                                        // If the stored conversion was on the other direction, update rta -> atr and time
                                        if (conversions[0].conversion == "rta") {
                                            Conversion.update({roman: resul}, {
                                                date: now,
                                                conversion: "atr"
                                            }, function (err, conv) {
                                                // TODO: error handle
                                            });
                                        } else {  // Update only the time
                                            Conversion.update({roman: resul}, {date: now}, function (err, conv) {
                                                // TODO: error handle
                                            });
                                        }
                                    } else {  // If the value is not in the database
                                        // Make the conversion
                                        resul = arabic_to_roman(chunk);
                                        aux = new Conversion({
                                            date: now,
                                            roman: resul,
                                            arabic: value.data,
                                            conversion: 'atr'
                                        });
                                        // Store it in the database
                                        aux.save(function (err, conv) {
                                            // TODO: error handle
                                        });
                                    }
                                    // Send answer to the client
                                    res.write(resul);
                                    res.end();
                                }
                            });
                        } else {
                            // If "value" key doesn't exist, POST with wrong keys
                            res.writeHead(400);
                            res.end();
                        }
                    });
                    custom = true;  // This is a valid path
                    break;

                case '/update':
                    // Get the last 5 elements from the database
                    var resul = Conversion.find({}).sort({'date': -1}).limit(5);
                    resul.exec(function(err, convs) {
                        if(err) {
                            console.log(err);
                            // TODO: error handle
                        } else {
                            if(convs.length > 0) {
                                // Send answer to the client
                                res.write(JSON.stringify(convs));
                                res.end();
                            }
                        }
                    });
                    custom = true;  // This is a valid path
                    break;

                default:
                    // Wrong path
                    res.writeHead(400);
                    res.end();
                    break;
            }
            //req.on('data', function(chunk) {
            //    //console.log(req.url);
            //});
        } else {
            // Handle the GET methods
            if(req.method == "GET") {
                switch(req.url) {  // Provide redirection for common possible paths
                    case '/':
                        console.log("REDIRECT");
                        res.writeHead(302, {
                            'Location': '/index.html'
                        });
                        res.end();
                        custom = true;  // This is a valid path
                        break;
                    case '/index':
                        res.writeHead(302, {
                            'Location': '/index.html'
                        });
                        res.end();
                        custom = true;  // This is a valid path
                        break;
                    default:
                        custom = false;  // Wrong path
                        break;
                }
            }
        }

        var filename = req.url || "index.html";
        var ext = path.extname(filename);
        var localPath = __dirname;

        // Possible valid file extensions for the get method
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

        // Check if the requested file exists
        if (isValidExt && !custom) {
            localPath += "/../RomanArabicFrontend/app" + filename;
            fs.exists(localPath, function(exists) {
                if(exists) {
                    if(filename == "/index.html") {
                        infoSent = true;
                    }
                    getFile(localPath, res, ext);
                } else {
                    console.log("File not found: " + localPath);
                    res.writeHead(404);
                    res.end();
                }
            });

        } else {
            if(!custom) {
                console.log("Wrong path detected. ");
                res.writeHead(404);
                res.end();
            }
        }

    }).listen(port, serverUrl);  // Make the server listen

});

// Find the different frontend files and serve them to the client
function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function(err, contents) {
        if(!err) {
            res.setHeader("Content-Length", contents.length);
            res.statusCode = 200;
            if(infoSent) {
                //console.log(contents);

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
    //console.log("ROMAN -> ARABIC: " + deromanize(data.data));
    return deromanize(data.data);
}

function arabic_to_roman(value) {
    var data = JSON.parse(value);
    //console.log("ARABIC -> ROMAN: " + romanize(data.data));
    return romanize(data.data);
}

// Function to convert from Arabic to Roman
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

// Function to convert from Roman to Arabic
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