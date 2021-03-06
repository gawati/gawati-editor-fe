const dm = require("./documentmanage");

/**
 * API stack for each Request end point. 
 * They are called one after the other in the order of the array
 */
var dmAPIs  = {};

/*
Adds a new document to the database.
Check for existence of doc with the same IRI on Client and Portal.
Input object submitted to the API:
"data": {
    "pkg": {
        "pkgIdentity":
        "pkgAttachments":
        ...
    }
    "skipCheck":
}
param {skipCheck} Boolean - whether docExistsOnPortal check may be skipped. 
 */
dmAPIs["/document/add"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.docExistsOnClient,
        dm.docExistsOnPortal,
        dm.setFormObject,
        dm.convertFormObjectToAknObject,
        dm.convertAknObjectToXml,
        dm.saveToXmlDb,
        dm.returnResponse
    ]
};

/*
Updates a field of an existing document on the database.
Input object submitted to the API:
"data": {
    "pkg": {
        "pkgIdentity":
        "pkgAttachments":
        ...
    }
}
 */
dmAPIs["/document/edit"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.updateAknField,
        //convertXmltoJsonObject,
        dm.returnResponse
    ]
};

/*
Loads an existing document on the database.
Input object submitted to the API:
"data": {
    "iri": "/akn/ke/act/legge/1970-06-03/Cap_44/eng@/!main"
}
 */
dmAPIs["/document/load"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.loadXmlForIri,
        dm.convertAknXmlToObject,
        dm.returnResponse
    ]
};

/*
Lists all documents that the user has permissions to.
Input object submitted to the API:
"data": {
    "docTypes": "all", 
    "itemsFrom": 1,
    "pageSize": 5
}
 */
dmAPIs["/documents"] = {
    method: "post", 
    stack: [
        dm.authenticate,
        dm.receiveSubmitData,
        dm.loadListing,
        dm.convertAknXmlToObjects,
        dm.sortListing,
        dm.returnResponse
    ]
};

dmAPIs["/documents/filter"] = {
    method: "post", 
    stack: [
        dm.authenticate,
        dm.receiveSubmitData,
        dm.loadFilterListing,
        dm.convertAknXmlToObjects,
        dm.returnResponse
    ]
};

dmAPIs["/document/delete"] = {
    method: "post", 
    stack: [
        dm.receiveSubmitData,
        dm.loadXmlForIri,
        dm.convertAknXmlToObject,
        dm.deleteDocument,
        dm.returnResponse
    ]
};

dmAPIs["/documents/metadata"] = {
    method: "get", 
    stack: [
        //dm.authenticate,
        dm.loadMetadata,
        dm.returnResponse
    ]
};

dmAPIs["/document/tags/refresh"] = {
    method: "post",
    stack: [
        dm.receiveSubmitData,
        dm.refreshTags,
        dm.returnResponse
    ]
};
        
dmAPIs["/documents/metadata/add"] = {
    method: "post", 
    stack: [
        //dm.authenticate,
        dm.receiveSubmitData,
        dm.saveMetadata,
        dm.returnResponse
    ]
};

dmAPIs["/documents/custom/meta/edit"] = {
    method: "post", 
    stack: [
        //dm.authenticate,
        dm.receiveSubmitData,
        dm.convertFormToMetaObject,
        dm.convertMetaObjectToXml,
        dm.saveCustomMetaToDb,
        dm.returnResponse
    ]
};

module.exports.dmAPIs = dmAPIs;