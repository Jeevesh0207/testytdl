"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
const ytdl = require("@distube/ytdl-core");
const cookies = [
    {
        "domain": ".youtube.com",
        "expirationDate": 1768372258.188456,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "g.a000rAi39Tk_bRA6_lbNfRRmtHbbsrm28EXeQn74cea7LdD7ZuZkIDfEb8hl-H20Qa4Y81ZUxwACgYKAcYSARASFQHGX2Mijn4qoGMqHRujLwYgBVnO0RoVAUF8yKon-g6Ub-bNmqHR4Fc8iEbh0076"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1765389121.897876,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSIDTS",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "sidts-CjEBQT4rX0x6qYI1-q2OMpLsmV7OHBcPm4_F1N362D7ndkth_8FaxBFjCwuv0UupAXb3EAA"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1768372258.188209,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SAPISID",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "kkU0JXDwM7QUuGHw/AICx4hc5if52U3bpZ"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1765389121.897979,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSIDCC",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "AKEyXzUMf6zsEkoh0w7aRd1La2YjW_cQIyZ0z1LWAAmnbLVGUm5g3M28Wct8IXAsLzGGZfBx"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1768372258.188137,
        "hostOnly": false,
        "httpOnly": true,
        "name": "SSID",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "ATi3MTar5T3_VabxO"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1768372258.188237,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__Secure-1PAPISID",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "kkU0JXDwM7QUuGHw/AICx4hc5if52U3bpZ"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1768372258.188429,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSID",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "g.a000rAi39Tk_bRA6_lbNfRRmtHbbsrm28EXeQn74cea7LdD7ZuZkQD_7Nvkr2fOxpU5oKaFBLAACgYKAeASARASFQHGX2MiPJ8sXI5XH2X1UCjDUQMqCxoVAUF8yKpwSdsbhN0nK9Vl6T3wZvAY0076"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1768372258.188266,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__Secure-3PAPISID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "kkU0JXDwM7QUuGHw/AICx4hc5if52U3bpZ"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1765389121.898045,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSIDCC",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "AKEyXzUU0C9JuGF18JlYCQFucb_3-YLLdWRave7DL-DCg7VM0WGJar1a8q5jLR77p13oZ5rnRw"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1765389121.89793,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSIDTS",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "sidts-CjEBQT4rX0x6qYI1-q2OMpLsmV7OHBcPm4_F1N362D7ndkth_8FaxBFjCwuv0UupAXb3EAA"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1764612300.840034,
        "hostOnly": false,
        "httpOnly": true,
        "name": "LOGIN_INFO",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "AFmmF2swRQIhAPE8hnvX9b63S-UnuF0ro_wFL3tFnKV1D9b3KBtHjmeJAiByucjjo9whN4eea3Q-ieZ6XVLD4BNZt3E48gJdN0b6fQ:QUQ3MjNmeG1KdWU3WXhlMDZsVjRLcnBYaXBlbHhfNU9fWml4WURYWXE4T01zdkllckcwd3hRVGJnZEJkdmhYdlRvZ095MmdURlBvVUJqd2hKSU94cU5lTWZidi16djlYR0QwbUFPSlNLbWQyejJiUFgxQXd4SVNrS2l4S2hVTGdzbUVjZ0NrcXE2UVVhcEVyYTBTVUxMWVRDZTFWcDlNZWVn"
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1768413120.193918,
        "hostOnly": false,
        "httpOnly": false,
        "name": "PREF",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "f4=4000000&f6=40000000&tz=Asia.Calcutta&f7=100"
    }
];
exports.agent = ytdl.createAgent(cookies);
