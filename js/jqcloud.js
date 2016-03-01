/*!
 * jQCloud 3.0.2
 * Copyright 2011 Luca Ongaro (http://www.lucaongaro.eu)
 * Copyright 2013 Daniel White (http://www.developerdan.com)
 * Copyright 2016 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
!function($) {
    "use strict";
    function throttle(callback, delay, context) {
        var state = {
            pid: null,
            last: 0
        };
        return function() {
            function exec() {
                return state.last = new Date().getTime(), callback.apply(context || that, Array.prototype.slice.call(args));
            }
            var elapsed = new Date().getTime() - state.last, args = arguments, that = this;
            return elapsed > delay ? exec() : (clearTimeout(state.pid), void (state.pid = setTimeout(exec, delay - elapsed)));
        };
    }
    var jQCloud = function(element, word_array, options) {
        this.$element = $(element), this.word_array = word_array || [], this.options = options, 
        this.sizeGenerator = null, this.colorGenerator = null, this.data = {
            placed_words: [],
            timeouts: {},
            namespace: null,
            step: null,
            angle: null,
            aspect_ratio: null,
            max_weight: null,
            min_weight: null,
            sizes: [],
            colors: []
        }, this.initialize();
    };
    jQCloud.DEFAULTS = {
        width: 100,
        height: 100,
        center: {
            x: .5,
            y: .5
        },
        steps: 10,
        delay: null,
        shape: "elliptic",
        classPattern: "w{n}",
        encodeURI: !0,
        removeOverflowing: !0,
        afterCloudRender: null,
        autoResize: !1,
        colors: null,
        fontSize: null,
        template: null
    }, jQCloud.prototype = {
        initialize: function() {
            if (this.options.width ? this.$element.width(this.options.width) : this.options.width = this.$element.width(), 
            this.options.height ? this.$element.height(this.options.height) : this.options.height = this.$element.height(), 
            this.options = $.extend(!0, {}, jQCloud.DEFAULTS, this.options), null === this.options.delay && (this.options.delay = this.word_array.length > 50 ? 10 : 0), 
            this.options.center.x > 1 && (this.options.center.x = this.options.center.x / this.options.width, 
            this.options.center.y = this.options.center.y / this.options.height), "function" == typeof this.options.colors) this.colorGenerator = this.options.colors; else if ($.isArray(this.options.colors)) {
                var cl = this.options.colors.length;
                if (cl > 0) {
                    if (cl < this.options.steps) for (var i = cl; i < this.options.steps; i++) this.options.colors[i] = this.options.colors[cl - 1];
                    this.colorGenerator = function(weight) {
                        return this.options.colors[this.options.steps - weight];
                    };
                }
            }
            if ("function" == typeof this.options.fontSize) this.sizeGenerator = this.options.fontSize; else if ($.isPlainObject(this.options.fontSize)) this.sizeGenerator = function(width, height, weight) {
                var max = width * this.options.fontSize.from, min = width * this.options.fontSize.to;
                return Math.round(min + 1 * (max - min) / (this.options.steps - 1) * (weight - 1)) + "px";
            }; else if ($.isArray(this.options.fontSize)) {
                var sl = this.options.fontSize.length;
                if (sl > 0) {
                    if (sl < this.options.steps) for (var j = sl; j < this.options.steps; j++) this.options.fontSize[j] = this.options.fontSize[sl - 1];
                    this.sizeGenerator = function(width, height, weight) {
                        return this.options.fontSize[this.options.steps - weight];
                    };
                }
            }
            this.data.angle = 6.28 * Math.random(), this.data.step = "rectangular" === this.options.shape ? 18 : 2, 
            this.data.aspect_ratio = this.options.width / this.options.height, this.clearTimeouts(), 
            this.data.namespace = (this.$element.attr("id") || Math.floor(1e6 * Math.random()).toString(36)) + "_word_", 
            this.$element.addClass("jqcloud"), "static" === this.$element.css("position") && this.$element.css("position", "relative"), 
            this.createTimeout($.proxy(this.drawWordCloud, this), 10), this.options.autoResize && $(window).on("resize", throttle(this.resize, 50, this));
        },
        createTimeout: function(callback, time) {
            var timeout = setTimeout($.proxy(function() {
                delete this.data.timeouts[timeout], callback();
            }, this), time);
            this.data.timeouts[timeout] = !0;
        },
        clearTimeouts: function() {
            $.each(this.data.timeouts, function(key) {
                clearTimeout(key);
            }), this.data.timeouts = {};
        },
        overlapping: function(a, b) {
            return Math.abs(2 * a.left + a.width - 2 * b.left - b.width) < a.width + b.width && Math.abs(2 * a.top + a.height - 2 * b.top - b.height) < a.height + b.height ? !0 : !1;
        },
        hitTest: function(elem) {
            for (var i = 0, l = this.data.placed_words.length; l > i; i++) if (this.overlapping(elem, this.data.placed_words[i])) return !0;
            return !1;
        },
        drawWordCloud: function() {
            var i, l;
            if (this.$element.children('[id^="' + this.data.namespace + '"]').remove(), 0 !== this.word_array.length) {
                for (i = 0, l = this.word_array.length; l > i; i++) this.word_array[i].weight = parseFloat(this.word_array[i].weight, 10);
                if (this.word_array.sort(function(a, b) {
                    return b.weight - a.weight;
                }), this.data.max_weight = this.word_array[0].weight, this.data.min_weight = this.word_array[this.word_array.length - 1].weight, 
                this.data.colors = [], this.colorGenerator) for (i = 0; i < this.options.steps; i++) this.data.colors.push(this.colorGenerator(i + 1));
                if (this.data.sizes = [], this.sizeGenerator) for (i = 0; i < this.options.steps; i++) this.data.sizes.push(this.sizeGenerator(this.options.width, this.options.height, i + 1));
                if (this.options.delay > 0) this.drawOneWordDelayed(); else {
                    for (i = 0, l = this.word_array.length; l > i; i++) this.drawOneWord(i, this.word_array[i]);
                    "function" == typeof this.options.afterCloudRender && this.options.afterCloudRender.call(this.$element);
                }
            }
        },
        drawOneWord: function(index, word) {
            var word_span, word_size, word_style, word_id = this.data.namespace + index, angle = this.data.angle, radius = 0, steps_in_direction = 0, quarter_turns = 0, weight = Math.floor(this.options.steps / 2);
            for (word.attr = $.extend({}, word.html, {
                id: word_id
            }), this.data.max_weight !== this.data.min_weight && (weight = Math.round(1 * (word.weight - this.data.min_weight) * (this.options.steps - 1) / (this.data.max_weight - this.data.min_weight)) + 1), 
            word_span = $("<span>").attr(word.attr), this.options.classPattern && word_span.addClass(this.options.classPattern.replace("{n}", weight)), 
            this.data.colors.length && word_span.css("color", this.data.colors[weight - 1]), 
            this.data.sizes.length && word_span.css("font-size", this.data.sizes[weight - 1]), 
            this.options.template ? word_span.html(this.options.template(word)) : word.link ? ("string" == typeof word.link && (word.link = {
                href: word.link
            }), this.options.encodeURI && (word.link.href = encodeURI(word.link.href).replace(/'/g, "%27")), 
            word_span.append($("<a>").attr(word.link).text(word.text))) : word_span.text(word.text), 
            word.handlers && word_span.on(word.handlers), this.$element.append(word_span), word_size = {
                width: word_span.outerWidth(),
                height: word_span.outerHeight()
            }, word_size.left = this.options.center.x * this.options.width - word_size.width / 2, 
            word_size.top = this.options.center.y * this.options.height - word_size.height / 2, 
            word_style = word_span[0].style, word_style.position = "absolute", word_style.left = word_size.left + "px", 
            word_style.top = word_size.top + "px"; this.hitTest(word_size); ) {
                if ("rectangular" === this.options.shape) switch (steps_in_direction++, steps_in_direction * this.data.step > (1 + Math.floor(quarter_turns / 2)) * this.data.step * (quarter_turns % 4 % 2 === 0 ? 1 : this.data.aspect_ratio) && (steps_in_direction = 0, 
                quarter_turns++), quarter_turns % 4) {
                  case 1:
                    word_size.left += this.data.step * this.data.aspect_ratio + 2 * Math.random();
                    break;

                  case 2:
                    word_size.top -= this.data.step + 2 * Math.random();
                    break;

                  case 3:
                    word_size.left -= this.data.step * this.data.aspect_ratio + 2 * Math.random();
                    break;

                  case 0:
                    word_size.top += this.data.step + 2 * Math.random();
                } else radius += this.data.step, angle += (index % 2 === 0 ? 1 : -1) * this.data.step, 
                word_size.left = this.options.center.x * this.options.width - word_size.width / 2 + radius * Math.cos(angle) * this.data.aspect_ratio, 
                word_size.top = this.options.center.y * this.options.height + radius * Math.sin(angle) - word_size.height / 2;
                word_style.left = word_size.left + "px", word_style.top = word_size.top + "px";
            }
            return this.options.removeOverflowing && (word_size.left < 0 || word_size.top < 0 || word_size.left + word_size.width > this.options.width || word_size.top + word_size.height > this.options.height) ? void word_span.remove() : (this.data.placed_words.push(word_size), 
            void ("function" == typeof word.afterWordRender && word.afterWordRender.call(word_span)));
        },
        drawOneWordDelayed: function(index) {
            return index = index || 0, this.$element.is(":visible") ? void (index < this.word_array.length ? (this.drawOneWord(index, this.word_array[index]), 
            this.createTimeout($.proxy(function() {
                this.drawOneWordDelayed(index + 1);
            }, this), this.options.delay)) : "function" == typeof this.options.afterCloudRender && this.options.afterCloudRender.call(this.$element)) : void this.createTimeout($.proxy(function() {
                this.drawOneWordDelayed(index);
            }, this), 10);
        },
        destroy: function() {
            this.clearTimeouts(), this.$element.removeClass("jqcloud"), this.$element.removeData("jqcloud"), 
            this.$element.children('[id^="' + this.data.namespace + '"]').remove();
        },
        update: function(word_array) {
            this.word_array = word_array, this.data.placed_words = [], this.clearTimeouts(), 
            this.drawWordCloud();
        },
        resize: function() {
            var new_size = {
                width: this.$element.width(),
                height: this.$element.height()
            };
            (new_size.width !== this.options.width || new_size.height !== this.options.height) && (this.options.width = new_size.width, 
            this.options.height = new_size.height, this.data.aspect_ratio = this.options.width / this.options.height, 
            this.update(this.word_array));
        }
    }, $.fn.jQCloud = function(word_array, option) {
        var args = arguments;
        return this.each(function() {
            var $this = $(this), data = $this.data("jqcloud");
            if (data || "destroy" !== word_array) if (data) "string" == typeof word_array && data[word_array].apply(data, Array.prototype.slice.call(args, 1)); else {
                var options = "object" == typeof option ? option : {};
                $this.data("jqcloud", data = new jQCloud(this, word_array, options));
            }
        });
    }, $.fn.jQCloud.defaults = {
        set: function(options) {
            $.extend(!0, jQCloud.DEFAULTS, options);
        },
        get: function(key) {
            var options = jQCloud.DEFAULTS;
            return key && (options = options[key]), $.extend(!0, {}, options);
        }
    };
}(jQuery);