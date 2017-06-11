const tcpPortUsed = require('tcp-port-used')
const createServer = require('./createServer')
const PORT = require('../util/PORT')
const setConf = require('../conf/set')
const IP = require('../util/IP')
const HOSTS = require('../util/HOSTS')
const root = process.cwd()

const explorer = (port = 80, host = IP) => {
    const protocal = port === 443 ? 'https://' : 'http://'
    require('child_process').exec('explorer ' + protocal + host + ':' + port)
}

module.exports = ({
    port,
    host
}) => {
    if (host) {
        port = port || 80
        HOSTS(host)
    }
    if (port) {
        port = port | 0
    }

    if (port) {
        setConf({port, host, root})
        tcpPortUsed
            .check(port, IP)
            .then(inUse => {
                inUse || createServer(port)
                explorer(port, host)
            }).catch(err => console.error(err))
    } else {
        PORT().then(port => {
            setConf({port, host, root})
            createServer(port)
            explorer(port, host)
        }).catch(err => console.error(err))
    }
}