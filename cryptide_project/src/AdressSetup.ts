const ADRESSE_WEBSERVER = "https://193.49.118.205:21116"

// const ADRESSE_DBSERVER = "http://172.20.10.4:3003"
const ADRESSE_DBSERVER = "https://codefirst.iut.uca.fr/containers/Crypteam-api"

const tmp = ADRESSE_DBSERVER
const tmp2 = ADRESSE_WEBSERVER

console.log(ADRESSE_WEBSERVER + " wesh")

const ADRESSE_WEBSITE = ""

const basePath = process.env.REACT_APP_BASEPATH || '/containers/Crypteam-website';

const tmp3 = basePath


export {ADRESSE_DBSERVER, ADRESSE_WEBSERVER, ADRESSE_WEBSITE, basePath}