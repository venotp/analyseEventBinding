(function analyseEventBinding($, window, threshold) {
    "use strict";
    if (!$ || !window || !window.console || !window.document) {
        throw new Error("unable to analyse event binding : invalid arguments");
    }
    threshold = typeof threshold === "number" ? threshold : 4;
    var output = [];
    var size = $(window.document).find("*").add(window).each(function anlyseBindingOnSingleElement() {
        if (!$._data || !$._data(this)) {
            throw new Error("unable to analyse event binding.");
        }
        var events = $._data(this).events; // this is where jQuery store event handlers by eventName
        if (!events) {
            return;
        }
        var funcName, aggregator, logArgs, logTemplate;
        for (var eventName in events) {
            if (events[eventName].length >= threshold) {
                aggregator = {};
                events[eventName].forEach(function (e) {
                    funcName = e.handler.name || "anonymous";
                    aggregator[funcName] = {
                        count: aggregator[funcName] ? aggregator[funcName].count + 1 : 1,
                        handler: e.handler
                    };
                });
                logArgs = ["color:SeaGreen", "", this];
                logTemplate = "Event %c" + eventName + "%c, on %o, ";
                Object.keys(aggregator).forEach(function forEachFuncName(key) {
                    logTemplate += "\r\n\t\t\t%O is binded %c" + aggregator[key].count + "%c times, ";
                    logArgs.push(aggregator[key].handler, "color:DarkRed", "");
                });
                logArgs.unshift(logTemplate.slice(0, -2) + "\r\n"); // remove the last coma before adding logTemplate to first position in logArgs
                output.push({
                    score: events[eventName].length,
                    logArgs: logArgs
                });
            }
        }
    }).size();
    output.sort(function sortByScore(a, b) {
        return b.score - a.score;
    }).forEach(function (e) {
        window.console.log.apply(this, e.logArgs);
    });
    return "job's done! " + size + " elements analyzed";
})(jQuery, window, 4);
