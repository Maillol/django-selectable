/*global define, module, test, expect, equal, ok*/

define(['selectable'], function ($) {

    module("Plugin Options Tests", {
        setup: function () {
            // Patch AJAX requests
            var self = this;
            this.xhr = sinon.useFakeXMLHttpRequest();
            this.requests = [];
            this.xhr.onCreate = function (xhr) {
                self.requests.push(xhr);
            };
            this.input = createTextComplete('autocomplete');
            $('#qunit-fixture').append(this.input);
            bindSelectables('#qunit-fixture');
        },
        teardown: function () {
            this.xhr.restore();
            this.input.djselectable('destroy');
        }
    });

    test("Highlight Match On", function () {
        expect(2);
        var response = simpleLookupResponse(),
            self = this,
            menu, item, highlight;
        this.input.djselectable("option", "highlightMatch", true);
        this.input.val("ap").keydown();
        stop();
        setTimeout(function () {
            self.requests[0].respond(200, {"Content-Type": "application/json"},
                JSON.stringify(response)
            );
            menu = $('ul.ui-autocomplete.ui-menu:visible');
            item = $('li', menu).eq(0);
            highlight = $('.highlight', item);
            equal(highlight.length, 1, "Highlight should be present");
            equal(highlight.text(), "Ap", "Highlight text should match");
            start();
        }, 300);
    });

    test("Highlight Match Off", function () {
        expect(1);
        var response = simpleLookupResponse(),
            self = this,
            menu, item, highlight;
        this.input.djselectable("option", "highlightMatch", false);
        this.input.val("ap").keydown();
        stop();
        setTimeout(function () {
            self.requests[0].respond(200, {"Content-Type": "application/json"},
                JSON.stringify(response)
            );
            menu = $('ul.ui-autocomplete.ui-menu:visible');
            item = $('li', menu).eq(0);
            highlight = $('.highlight', item);
            equal(highlight.length, 0, "Highlight should not be present");
            start();
        }, 300);
    });
});