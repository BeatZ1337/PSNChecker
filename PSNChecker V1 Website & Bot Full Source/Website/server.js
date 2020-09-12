const express = require('express');
const app = express();
const expressSession = require('express-session')
const config = require('../Settings/config.json');
const path = require('path');
const useragent = require('express-useragent');
const ExpressIP = require('express-ip');
const pretty = require('express-prettify')
const helmet = require('helmet');
const lusca = require('lusca');
const request = require('request');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ECL = require('express-custom-limiter');
const fetch = require('node-fetch');


console.clear();
let proxies = [
    'https://118.97.204.76:8080/'
    // '154.16.202.22:8080',
    // '176.9.119.170:8080',
    // '188.166.83.34:3128',
    // '138.68.165.154:8080',
    // '188.166.83.13:8080',
    // '139.59.169.246:3128',
    // '188.226.141.211:8080',
    // '207.154.231.217:8080',
    // '207.154.231.216:8080',
    // '138.197.157.32:8080',
    // '138.197.157.60:3128',
    // '159.203.166.41:8080',
    // '162.243.107.120:3128',
    // '138.68.161.14:8080',
    // '162.243.108.161:3128',
    // '139.59.169.246:8080',
    // '138.68.173.29:8080',
    // '88.198.24.108:3128',
];
module.exports = (client) => {
    const total = [];
    const totalAvailable = [];
    const totalTaken = [];
    let available = 1;
    let taken = 1;
    let checked = 1;

    var advert = new Array()
    advert[0] = `https://psnchecker.com/imgs/SmackerSolutions.gif`
    advert[1] = `https://theindianawaaz.com/wp-content/uploads/2018/09/Indian-awaaz-Webp.net-gifmaker.gif`

    var advertlinks = new Array()
    advertlinks[0] = `https://smacker-solutions.co.uk/`
    advertlinks[1] = `/discord`

    var ry = Math.floor(Math.random() * advert.length)

    function rayID() {
        return 'xyyx-yxxy-xyyx-yxxy'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 25 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(36);
        });
    };

    var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    app.use(expressSession({
        secret: client.config.webserver.auth_token,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            signed: true,
            expires: expiryDate
        }
    }));
    app.use(ExpressIP().getIpInfoMiddleware);
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, "public")));
    app.set("views", path.join(__dirname, "views"));
    app.use(pretty({
        always: true
    }));
    app.enable("trust proxy", 5);
    app.use(useragent.express());
    app.use(lusca.xframe('SAMEORIGIN'));
    app.use(lusca.xssProtection(true));
    app.use(lusca.nosniff());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.disable('x-powered-by', 'x-forwarded-for');
    //app.enable('Content-Security-Policy: object-src "none";')
    app.use(helmet());
    app.use(morgan("combined"));

    app.use((req, res, next) => {
        const render = res.render;
        const json = res.json;
        res.render = function renderWrapper(...args) {
            Error.captureStackTrace(this);
            return render.apply(this, args);
        };
        res.json = function jsonWrapper(...args) {
            try {
                json.apply(this, args);
            } catch (err) {
                console.error(`Error in res.json | ${err.code} | ${err.message} | ${err.stack}`);
            }
        };
        next();
    });

    const customLimiter = ECL({
        windowMs: 60 * 1000, // 1 minute (can be set higher if needed - this is in miliseconds)
        max: 5, // maximum request sent before ratelimited.
        limiterPage: "index", // Optional of what page you want to render, if you wish to use pages from folders do /foldername/pagename
        message: "Please try again in 1 minute.",
        handler: function(req, res) {
            return res.status(429).render('index', {
                result: "RATELIMITED",
                message: "Please try again in 1 minute.",
                advertImgONE: advert[ry],
                advertLinkOne: advertlinks[ry],
                advertImgTWO: advert[ry],
                advertLinkTwo: advertlinks[ry],
                totalChecked: client.checked,
                tavailable: client.available,
                ttaken: client.taken,
            })
        }
    });
    app.get('/',customLimiter, async (req, res) => {
        // let getResult = await fetch(`https://weleakinfo.com/`, {
        //     method: "GET"
        // }).then(res => res.text());
        // let gotResult = getResult;
        // res.send(gotResult);
        res.render("index", {
            result: "",
            message: ``,
            advertImgONE: advert[ry],
            advertLinkOne: advertlinks[ry],
            advertImgTWO: advert[ry],
            advertLinkTwo: advertlinks[ry],
            totalChecked: client.checked,
                tavailable: client.available,
                ttaken: client.taken,
        });

    })

    app.get('/discord', async (req, res) => {
        res.redirect("https://discord.gg/GBcabcS");
    })
    app.get('/tweetaboutus', async (req, res) => {
        res.redirect('https://twitter.com/intent/tweet?url=https://psnchecker.com/&text=Hey,%20Come%20Check%20Out%20PSNChecker%20\nThe%20ONLY%20LEGIT%20PSNChecker%20Website%20In%20The%20@Playstation%20Community\nhttps://psnchecker.com&via=PSNChecker')
    })
    app.get('/facebookaboutus', async (req, res) => {
        res.redirect('https://www.facebook.com/sharer/sharer.php?u=https://psnchecker.com/&text=Hey,%20Come%20Check%20Out%20PSNChecker%20\nThe%20ONLY%20LEGIT%20PSNChecker%20Website%20In%20The%20@Playstation%20Community\nhttps://psnchecker.com&via=PSNChecker')
    })
    app.get('/invitebot', async (req, res) => {
        res.redirect("https://discordapp.com/oauth2/authorize/?permissions=1341643969&scope=bot&client_id=696742526467702903");
    })
    app.get('/checkpsn', async (req, res) => {
        res.redirect("/");
    })
    app.get('/donate', async (req, res) => {
        res.redirect("https://ko-fi.com/psnchecker");
    })
    app.get('/api/checkpsn', async (req, res) => {
        res.json({
            status: "failed",
            message: "Please provide a PSN Name query: /example-_-modz"
        });
    })
    app.get('/api/checkpsn/:psn', async (req, res) => {
        if (req.useragent.source === "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)") return res.render("comingsoon");
        let psn = req.query.psn;
        res.redirect("https://www.youtube.com/watch?v=oHg5SJYRHA0");
    })
    app.post('/', customLimiter, async function(req, res, next) {
        //res.redirect("https://www.youtube.com/watch?v=oHg5SJYRHA0");
        let b = JSON.parse(JSON.stringify(req.body));
        let psn = req.body.psn;
        if (!psn) return res.json({
            status: "failed",
            message: "missing param"
        })
        console.log("PSN Username:", b["g-recaptcha-response"]);
        let regex = /[A-Za-z\d-_]+$/gi;
      
        let profanity = await fetch(`https://www.purgomalum.com/service/json?text=${psn}`).then(res => res.json())
        if (profanity.result.includes("*")) return res.render('index', {

            result: "PROFANITY",
            message: psn,
            advertImgONE: advert[ry],
            advertLinkOne: advertlinks[ry],
            advertImgTWO: advert[ry],
            advertLinkTwo: advertlinks[ry],
            totalChecked: client.checked,
            tavailable: client.available,
            ttaken: client.taken,

        });
        if (psn.length > 16) return res.render('index', {

            result: "TOO MANY CHARACTERS",
            message: `Please lower the characters of the chosen PSN ${psn} to a maximum of 16 Characters.`,
            advertImgONE: advert[ry],
            advertLinkOne: advertlinks[ry],
            advertImgTWO: advert[ry],
            advertLinkTwo: advertlinks[ry],
            totalChecked: client.checked,
                tavailable: client.available,
                ttaken: client.taken,

        });
        if (psn.length <= 4) return res.render('index', {

            result: "4 LETTERS DON'T EXIST",
            message: `Sorry, but 1-4 alphanumerical PSNs are high likely to be banned or taken therefore we don't condone your search for ${psn}.`,
            advertImgONE: advert[ry],
            advertLinkOne: advertlinks[ry],
            advertImgTWO: advert[ry],
            advertLinkTwo: advertlinks[ry],
            totalChecked: client.checked,
            tavailable: client.available,
            ttaken: client.taken,

        });
        if (!regex.test(psn)) {
            res.render('index', {

                result: "PSN CONTAINS A NON-ALPHANUMERIC CHARACTER",
                message: `PSN that contain non-alphanumerical characters are not allowed.`,
                advertImgONE: advert[ry],
                advertLinkOne: advertlinks[ry],
                advertImgTWO: advert[ry],
                advertLinkTwo: advertlinks[ry],
                totalChecked: client.checked,
                tavailable: client.available,
                ttaken: client.taken,

            });
        }
        if (b["g-recaptcha-response"] === undefined || b["g-recaptcha-response"] === '' || b["g-recaptcha-response"] === null) {
            return res.render('index', {
                result: "CAPTCHA",
                message: "Please Fill In The Captcha...",
                advertImgONE: advert[ry],
                advertLinkOne: advertlinks[ry],
                advertImgTWO: advert[ry],
                advertLinkTwo: advertlinks[ry],
                totalChecked: client.checked,
                tavailable: client.available,
                ttaken: client.taken,

            });
            //success: false, msg: 'Please select captcha' });
        }

        // Secret Key
        const secretKey = "6Lf6hucUAAAAAEh6SJfgdisBNa1NlCdr6TZCHN5s";

        // Verify URL
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${b["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;

        // Make Request To VerifyURL
        request(verifyUrl, (err, response, bod) => {
            body = JSON.parse(bod);
            console.log(body);

            // If Not Successful
            if (bod.success !== undefined && !bod.success) {
                return res.render('index', {
                    result: "CAPTCHA",
                    message: "Unsuccessful Captcha, Please try again.",
                    advertImgONE: advert[ry],
                    advertLinkOne: advertlinks[ry],
                    advertImgTWO: advert[ry],
                    advertLinkTwo: advertlinks[ry],
                    totalChecked: client.checked,
                    tavailable: client.available,
                    ttaken: client.taken,

                });
            }
           
            
            const randomProxy = Math.floor(Math.random() * proxies.length);
            const proxy = proxies[randomProxy];
            console.log("Using:", proxy)
            let headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'PSNChecker.xyz By Mr. Cerberus (@APIDepartment)'
            }
            request.post('https://accounts.api.playstation.com/api/v1/accounts/onlineIds', {
                //proxy: proxy,
                json: {
                    "onlineId": psn,
                    "reserveIfAvailable": false
                },
                headers: headers
            }, (error, result, body) => {
                if (error) {
                    console.log("[PSN]", error);
                    res.render("index", {
                        result: "INTERNAL SERVER ERROR",
                        message: `Please try again in a few minutes.`,
                        advertImgONE: advert[ry],
                        advertLinkOne: advertlinks[ry],
                        advertImgTWO: advert[ry],
                        advertLinkTwo: advertlinks[ry],
                        totalChecked: client.checked,
                        tavailable: client.available,
                        ttaken: client.taken,
                    });
                }
                if (result.statusCode !== 401 && result.statusCode !== 400) {
                    client.available++;
                    client.checked++;
                    res.render("index", {
                        result: "AVAILABLE",
                        message: psn,
                        advertImgONE: advert[ry],
                        advertLinkOne: advertlinks[ry],
                        advertImgTWO: advert[ry],
                        advertLinkTwo: advertlinks[ry],
                        totalChecked: client.checked,
                        tavailable: client.available,
                        ttaken: client.taken,
                    });
                }
                if (result.statusCode === 405) {
                    return res.render("index", {
                        result: "INTERNAL SERVER ERROR",
                        message: "Please try again in a few minutes.",
                        advertImgONE: advert[ry],
                        advertLinkOne: advertlinks[ry],
                        advertImgTWO: advert[ry],
                        advertLinkTwo: advertlinks[ry],
                        totalChecked: client.checked,
                        tavailable: client.available,
                        ttaken: client.taken,
                    });
                } else {
                    client.taken++;
                    client.checked++;
                    res.render("index", {
                        result: "TAKEN",
                        message: psn,
                        advertImgONE: advert[ry],
                        advertLinkOne: advertlinks[ry],
                        advertImgTWO: advert[ry],
                        advertLinkTwo: advertlinks[ry],
                        totalChecked: client.checked,
                        tavailable: client.available,
                        ttaken: client.taken,
                    });
                }
            })
            // res.render("index",{

            //     result: "CAPTCHA",
            //     message: `You must sign into our website via your Discord Account before being able to check.`,
            //     advertImgONE: advert[ry],
            //     advertLinkOne: advertlinks[ry],
            //     advertImgTWO: advert[ry],
            //     advertLinkTwo: advertlinks[ry],
            // })
        })
    })


    //Console Logger
    process.on('unhandledRejection', (error) => {
        console.warn("[UNHANDLED REJECTION] " + (error.stack == undefined ? error : error.stack));
    });

    process.on('uncaughtException', (err) => {
        console.warn("[UNCAUGHT EXCEPTION] " + (err.stack == undefined ? err : err.stack));
    });
    const listener = app.listen(client.config.webserver.port, function() {
        console.log("PSNChecker.com - DO NOT SHUT THIS PROCESS DOWN!");
    });
}