const ADRESSE_WEBSERVER = "http://localhost:3002"

// const ADRESSE_DBSERVER = "http://172.20.10.4:3003"
const ADRESSE_DBSERVER = "https://codefirst.iut.uca.fr/containers/Crypteam-api:3003"

const tmp = ADRESSE_DBSERVER
const tmp2 = ADRESSE_WEBSERVER

const ADRESSE_WEBSITE = ""

const basePath = process.env.REACT_APP_BASEPATH || 'containers/Crypteam-website';

console.log(basePath)

const tmp3 = basePath


export {ADRESSE_DBSERVER, ADRESSE_WEBSERVER, ADRESSE_WEBSITE, basePath}