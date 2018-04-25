const express = require("express");
const logr = require("./logging");
const aknobject = require("./aknobject");
const docmanage = require ("./documentmanage");
const gauth = require("gawati-auth-middleware");
const authJSON = require("./auth");
const packageJSON = require("./package.json");
var bodyParser = require("body-parser");
var multer = require("multer");

var upload = multer();


var router = express.Router();


var jsonParser = bodyParser.json();

const EXCLUDE_FROM_AUTO_ROUTE = ["/document/upload", "/document/auth"];

/*
Map all the routes form docmanage automatically
except for indicated ones which need special treatement. 
*/
Object.keys(docmanage.documentManage).forEach( 
    (routePath) => {
        console.log(" ROUTE PATH ", routePath);
        // map all the paths except /document/upload, /document/auth
        if (EXCLUDE_FROM_AUTO_ROUTE.indexOf(routePath) < 0) {
            // only paths NOT IN  EXCLUDE_FROM_AUTO_ROUTE
            router.post(
                routePath,
                jsonParser,
                docmanage.documentManage[routePath]
            );
        }
    });

// handle /document/upload here because it is special as it has attachments
var cpUpload = upload.fields(); //[{ name: 'file_0', maxCount: 1 }]
router.post("/document/upload",
    upload.any(),
    docmanage.documentManage["/document/upload"]
);


/** AUTH ROUTE TO TEST AUTHENTICATING SERVICES */
const AUTH_OPTIONS = {"authJSON": authJSON};
router.post("/document/auth",
    jsonParser,
    [
        function (req, res, next) {
            return gauth.authTokenValidate(req, res, next, AUTH_OPTIONS);
        },
        terminal
    ]
);

function terminal(req, res) {
    res.json({msg:"Completed !", auth: res.locals.gawati_auth});
}

/*
Shows keep alive status
*/
router.get(
    "/about",
    (req, res, next) => {
        const pkgName = packageJSON.name ; 
        const pkgVersion = packageJSON.version;
        const aboutInfo = `package=${pkgName};version=${pkgVersion};date=` ;
        res.status(200).send(aboutInfo);
    }
);

// Send the keycloak config file
router.get('/auth/config', function (req, res) {
  res.send(authJSON);
})
  

module.exports = router;

