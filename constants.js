const API_PROTOCOL = process.env.API_PROTOCOL || 'http' ;
const API_HOST = process.env.API_HOST || 'localhost' ;
const API_PORT = process.env.API_PORT || '8080' ;

/** Folders */
const CONFIG_FOLDER = 'configs' ;

const AKN_ATTACHMENTS = () => 
    "d:/develop/github/gawati/akn_data_test" ;

const API_SERVER_BASE = () =>
    API_PROTOCOL + '://' + API_HOST + ":" + API_PORT + '/exist/restxq';

const PROCESS_NAME = "GAWATI-CLIENT-SERVER";

module.exports = {
    CONFIG_FOLDER: CONFIG_FOLDER,
    API_SERVER_BASE: API_SERVER_BASE,
    AKN_ATTACHMENTS: AKN_ATTACHMENTS,
    PROCESS_NAME: PROCESS_NAME
};