const _general = {
    version: {
        sync: true
    },
    time: {
        sync: true
    },
    get: {
        params: {
            valueObject: {
                type: "json",
                default: "{}"
            }
        },
        dont_poll: true
    },
    getStaticData: {},
    getDynamicData: {
        params: {
            srv: {
                type: "str"
            },
            iface: {
                type: "str"
            }
        }
    },
    getAllData: {
        params: {
            srv: {
                type: "str"
            },
            iface: {
                type: "str"
            }
        }
    }
}

const _system = {
    system: {},
    uuid: {},
    bios: {},
    baseboard: {},
    chassis: {}
}

const _cpu = {
    cpu: {},
    cpuFlags: {},
    cpuCache: {},
    cpuCurrentSpeed: {},
    cpuTemperature: {},
}

const _mem = {
    mem: {},
    memLayout: {},
}

const _bat = {
    battery: {}
}

const _graphics = {
    graphics: {}
}

const _os = {
    osInfo: {},
    shell: {},
    versions: {
        params: {
            apps: {
                type: "str"
            }
        }
    },
    users: {}
}

const _ps = {
    label: "Processes & Services",
    currentLoad: {
        ping: true
    },
    fullLoad: {},
    processes: {},
    processLoad: {
        params: {
            list: {
                label: "Processes",
                type: "str"
            }
        }
    },
    services: {
        params: {
            list: {
                label: "Services",
                type: "str"
            }
        }
    }
}

const _fs = {
    label: "Disks and File System",
    diskLayout: {},
    blockDevices: {},
    disksIO: {
        ping: true
    },
    fsSize: {
        params: {
            drive: {
                type: "str"
            }
        }
    },
    fsOpenFiles: {},
    fsStats: {
        ping: true
    },
}

const _usb = {
    usb: {}
}

const _printer = {
    printer: {}
}

const _audio = {
    audio: {}
}

const _net = {
    label: "Network",
    networkInterfaces: {},
    networkInterfaceDefault: {},
    networkGatewayDefault: {},
    networkStats: {
        ping: true,
        params: {
            iface: {
                type: "str"
            }
        }
    },
    networkConnections: {},
    inetChecksite: {
        params: {
            url: {
                type: "str"
            }
        }
    },
    inetLatency: {
        params: {
            host: {
                type: "str"
            }
        }
    }
}

const _wifi = {
    wifiNetworks: {},
    wifiInterfaces: {},
    wifiConnections: {}
}

const _bt = {
    label: "Bluetooth",
    bluetoothDevices: {}
}

const _docker = {
    dockerInfo: {},
    dockerImages: {
        all: {
            type: "boolean",
            default: false
        }
    },
    dockerContainers: {
        all: {
            type: "boolean",
            default: false
        }
    },
    dockerContainerStats: {
        params: {
            ids: {
                type: "str"
            }
        }
    },
    dockerContainerProcesses: {
        params: {
            id: {
                type: "str"
            }
        }
    },
    dockerVolumes: {},
    dockerAll: {}
}

const _vbox = {
    label: "Virtual Box",
    vboxInfo: {}
}

module.exports = {
    General: _general,
    System: _system,
    CPU: _cpu,
    Memory: _mem,
    Battery: _bat,
    Graphics: _graphics,
    OS: _os,
    ps: _ps,
    fs: _fs,
    USB: _usb,
    Printer: _printer,
    Audio: _audio,
    net: _net,
    Wifi: _wifi,
    bt: _bt,
    Docker: _docker,
    vbox: _vbox
}
