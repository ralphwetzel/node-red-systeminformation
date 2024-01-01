let apiRoot = "/@ralphwetzel/systeminformation";
let API = require("./api.js");
let si = require("systeminformation");

module.exports = function(RED) {

    function si_node(config) {

        RED.nodes.createNode(this,config);
        let node = this;
        let poll_timer;
        node.processing = 0;

        let _lookup = {};
        Object.keys(API).forEach( (g) => {
            Object.keys(API[g]).forEach ( (f) => {
                _lookup[f] = g;
            })
        })

        let run_si = function(func, params, msg, send, done, changed_cb) {

            let g = _lookup[func];
            if (!g) return;
            let api = API?.[g]?.[func];

            msg.topic = func;

            // prepare the params for the function call
            let _params = [];
            let error = false;

            Object.keys(api.params ?? []).forEach( (p) => {
                if (params[p]) {
                    try {
                        _params.push(RED.util.evaluateNodeProperty(params[p], api.params[p].type, node));
                    } catch {
                        node.error(`Failed to parse '${params[p]}' to type '${api.params[p].type}'.`);
                        error = true;
                    }
                } else {
                    _params.push(api.params[p].default ?? "");
                }
            });

            if (error) return;
            
            let run;
            let timer;
            node.processing += 1;

            if (api.sync) {
                // only 'version' or 'time' are called sync
                run = new Promise( resolve => {
                    resolve(si[func]())
                });
            } else {
                // the rest is async
                run = si[func](..._params);
                timer = setTimeout(function() {
                    node.status({
                        fill: "blue",
                        shape: (node.processing) % 2 ? "dot" : "ring",
                        text: `processing${node.processing > 1 ? `: ${node.processing}` : "..."}`
                    });
                }, 250);
            }
            run.then( data => {

                if (changed_cb && typeof(changed_cb) == "function") {
                    if (false == changed_cb(data)) {
                        if (done) done();
                        return;
                    };
                }

                msg.payload = data;

                if (send) {
                    send(msg);
                } else {
                    node.send.apply(node, [msg]);
                }

                if (done) done();

            }).catch( (err) => {
                // Hmmm....
            }).finally(() => {
                clearTimeout(timer);
                node.processing -= 1;
                if (node.processing > 0) {
                    node.status({
                        fill: "blue",
                        shape: (node.processing) % 2 ? "dot" : "ring",
                        text: `processing${node.processing > 1 ? `: ${node.processing}` : "..."}`
                    });
                } else {
                    node.status({});
                }
            });

        };

        node.on('input', function(msg, send, done) {
            if (msg.topic && _lookup[msg.topic]) {
                return run_si(msg.topic, ("object" !== typeof msg.payload) ? {} : msg.payload, msg, send, done);
            }
            return run_si(config.func, config.params, msg, send, done);
        });

        node.on('close', function(done) {
            if (poll_timer) {
                clearInterval(poll_timer);
            }
            done();
        });

        let error = isNaN(config.interval);
        let interval = RED.util.evaluateNodeProperty(config.interval, "num");
        if (!error) {
            error = (interval <= 0)
        }
        if (error) {
            node.warn(`Unsupported value '${config.interval}' to define observation interval; observer launched with 5s polling interval.`);
            interval = 5;
        };
 

        // Not using the built-in observer functionality here!!
        if (config.poll && !API?.[config.group]?.[config.func].dont_poll) {

            if (config.onchangeonly) {

                // used by check_changed to store the result of the last call
                let _data = JSON.stringify({});

                let check_changed = function(data) {

                    let d = JSON.stringify(data);
                    let res = (d !== _data);
                    _data = d;

                    return res;
                }

                poll_timer = setInterval( function() {
                    let msg = {
                        topic: config.func
                    }
                    return run_si(config.func, config.params, msg, undefined, undefined, check_changed);
                }, interval * 1000);

            } else {
                poll_timer = setInterval( function() {
                    let msg = {
                        topic: config.func
                    }
                    return run_si(config.func, config.params, msg);
                }, interval * 1000);
            }
        }
    }

    RED.nodes.registerType("systeminformation", si_node);

    RED.httpAdmin.get(`${apiRoot}/api`, (req, res) => {
        res.status(200).send(API);
    })
}