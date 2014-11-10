/*!
 * SVG Map
 * @version v1.1.0
 * @author  Rocky(rockyuse@163.com)
 * @date    2014-10-13
 *
 * (c) 2012-2014 Rocky, http://rockydo.com
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
!function (window, $, undefined) {
    Array.prototype.indexOf = function (a) {
        var b, c;
        for (b = null != (c = arguments[1]) ? c : 0, 0 > b && (b += length), b = Math.max(b, 0); b < this.length;) {
            if (b in this && this[b] === a) return b;
            b++
        }
        return -1
    }, Array.prototype.remove = function (a) {
        var b = this.indexOf(a);
        b > -1 && this.splice(b, 1)
    };
    var SVGMap = function () {
            function SVGMap(a, b) {
                this.externalData = {}, this.dom = a, this.setOptions(b), this.render()
            }
            return SVGMap.prototype.options = {
                mapName: "china",
                mapWidth: 500,
                mapHeight: 400,
                stateColorList: ["#2770B5", "#429DD4", "#5AABDA", "#1C8DFF", "#70B3DD", "#C6E1F4", "#EDF2F6"],
                stateDataAttr: ["stateInitColor", "stateHoverColor", "stateSelectedColor", "baifenbi"],
                stateDataType: "json",
                stateSettingsXmlPath: "",
                stateData: {},
                strokeWidth: 1,
                strokeColor: "#F9FCFE",
                stateInitColor: "#AAD5FF",
                stateHoverColor: "#feb41c",
                stateSelectedColor: "#EC971F",
                stateDisabledColor: "#eeeeee",
                showTip: !0,
                mapTipWidth: 100,
                mapTipX: 0,
                mapTipY: -10,
                mapTipHtml: function (a, b) {
                    return b.name
                },
                hoverCallback: function () {},
                clickColorChange: !1,
                clickCallback: function () {},
                unClickCallback: function () {},
                hoverRegion: "",
                clickedRegion: [],
                external: !1
            }, SVGMap.prototype.setOptions = function (a) {
                return null == a && (a = null), this.options = $.extend({}, this.options, a), this
            }, SVGMap.prototype.scaleRaphael = function (a, b, c) {
                var d = document.getElementById(a);
                d.style.position || (d.style.position = "relative"), d.style.width = b + "px", d.style.height = c + "px", d.style.overflow = "hidden";
                var e;
                "VML" == Raphael.type ? (d.innerHTML = "<rvml:group style='position : absolute; width: 1000px; height: 1000px; top: 0px; left: 0px' coordsize='1000,1000' class='rvml' id='vmlgroup_" + a + "'></rvml:group>", e = document.getElementById("vmlgroup_" + a)) : (d.innerHTML = '<div class="svggroup"></div>', e = d.getElementsByClassName("svggroup")[0]);
                var g, f = new Raphael(e, b, c);
                return "SVG" == Raphael.type ? f.canvas.setAttribute("viewBox", "0 0 " + b + " " + c) : g = d.getElementsByTagName("div")[0], f.changeSize = function (a, h, i, j) {
                    j = !j;
                    var k = a / b,
                        l = h / c,
                        m = l > k ? k : l,
                        n = parseInt(c * m),
                        o = parseInt(b * m);
                    if ("VML" == Raphael.type) {
                        var p = document.getElementsByTagName("textpath");
                        for (var q in p) {
                            var r = p[q];
                            if (r.style) {
                                if (!r._fontSize) {
                                    var s = r.style.font.split("px");
                                    r._fontSize = parseInt(s[0]), r._font = s[1]
                                }
                                r.style.font = r._fontSize * m + "px" + r._font
                            }
                        }
                        var t;
                        t = n > o ? 1e3 * o / b : 1e3 * n / c, t = parseInt(t), e.style.width = t + "px", e.style.height = t + "px", j && (e.style.left = parseInt((a - o) / 2) + "px", e.style.top = parseInt((h - n) / 2) + "px"), g.style.overflow = "visible"
                    }
                    j && (o = a, n = h), d.style.width = o + "px", d.style.height = n + "px", f.setSize(o, n), i && (d.style.position = "absolute", d.style.left = parseInt((a - o) / 2) + "px", d.style.top = parseInt((h - n) / 2) + "px")
                }, f.scaleAll = function (a) {
                    f.changeSize(b * a, c * a)
                }, f.changeSize(b, c), f.w = b, f.h = c, f
            }, SVGMap.prototype.render = function () {
                function sharpHover(a, b) {
                    if (opt.hoverRegion == b.id) return opt.timeTimer = 1, clearTimeout(b.timer), void 0;
                    if (opt.external && "undefined" != typeof self.externalData[b.id].eventHoverLock && 0 != self.externalData[b.id].eventHoverLock || -1 == opt.clickedRegion.indexOf(b.id) && b.animate({
                        fill: stateColor[b.id].hoverColor
                    }, 150), opt.showTip) {
                        opt.timeTimer = 1, 0 == $("#MapTip").length && $(document.body).append('<div id="MapTip" class="mapTip"><div class="con"></div><div class="arrow"><div class="arrowMask"></div></div></div'), $("#MapTip .con").html(opt.mapTipHtml(stateData, b));
                        var c = new offsetXY(a);
                        $("#MapTip").css({
                            width: opt.mapTipWidth || "auto",
                            height: opt.mapTipHeight || "auto",
                            left: c[0],
                            top: c[1]
                        }).show()
                    }
                    opt.hoverRegion = b.id, opt.hoverCallback(stateData, b)
                }
                function sharpOut(a, b) {
                    opt.timeTimer = 0, opt.hoverRegion = "", b.timer = setTimeout(function () {
                        opt.hoverRegion != b.id && (opt.external && "undefined" != typeof self.externalData[b.id].eventHoverLock && 0 != self.externalData[b.id].eventHoverLock || -1 == opt.clickedRegion.indexOf(b.id) && b.animate({
                            fill: stateColor[b.id].initColor
                        }, 100), opt.showTip && 1 != opt.timeTimer && $("#MapTip").remove())
                    }, 100)
                }
                function sharpClick(a, b) {
                    0 != opt.clickColorChange && (opt.external && "undefined" != typeof self.externalData[b.id].eventClickLock && 0 != self.externalData[b.id].eventClickLock || (-1 == opt.clickedRegion.indexOf(b.id) ? (opt.clickedRegion.push(b.id), b.animate({
                        fill: stateColor[b.id].selectedColor
                    }, 150), opt.clickCallback(stateData, b)) : (opt.clickedRegion.remove(b.id), opt.external && "undefined" != typeof self.externalData[b.id].eventHoverLock && 0 != self.externalData[b.id].eventHoverLock ? b.animate({
                        fill: stateColor[b.id].initColor
                    }, 150) : b.animate({
                        fill: stateColor[b.id].hoverColor
                    }, 150), opt.unClickCallback(stateData, b))))
                }
                var self = this,
                    opt = this.options,
                    _self = this.dom,
                    mapName = opt.mapName,
                    mapConfig = eval(mapName + "MapConfig"),
                    stateData = {};
                if ("xml" == opt.stateDataType) {
                    var mapSettings = opt.stateSettingsXmlPath;
                    $.ajax({
                        type: "GET",
                        url: mapSettings,
                        async: !1,
                        dataType: $.browser.msie ? "text" : "xml",
                        success: function (a) {
                            var b;
                            $.browser.msie ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = !1, b.loadXML(a)) : b = a;
                            var c = $(b);
                            c.find("stateData").each(function (a) {
                                var b = $(this),
                                    c = b.attr("stateName");
                                stateData[c] = {};
                                for (var a = 0, d = opt.stateDataAttr.length; d > a; a++) stateData[c][opt.stateDataAttr[a]] = b.attr(opt.stateDataAttr[a])
                            })
                        }
                    })
                } else stateData = opt.stateData;
                var offsetXY = function (a) {
                        var b, c, d = $("#MapTip").outerWidth(),
                            e = $("#MapTip").outerHeight();
                        return a && a.pageX ? (b = a.pageX, c = a.pageY) : (b = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, c = event.clientY + document.body.scrollTop + document.documentElement.scrollTop), b = b - d / 2 + opt.mapTipX < 0 ? 0 : b - d / 2 + opt.mapTipX, c = c - e + opt.mapTipY < 0 ? c - opt.mapTipY : c - e + opt.mapTipY, [b, c]
                    },
                    current, r = this.scaleRaphael(_self.attr("id"), mapConfig.width, mapConfig.height),
                    attributes = {
                        fill: opt.stateInitColor,
                        cursor: "pointer",
                        stroke: opt.strokeColor,
                        "stroke-width": opt.strokeWidth,
                        "stroke-linejoin": "round"
                    },
                    stateColor = {};
                for (var state in mapConfig.shapes) {
                    var thisStateData = stateData[state],
                        initColor = thisStateData && opt.stateColorList[thisStateData.stateInitColor] || opt.stateInitColor,
                        hoverColor = thisStateData && thisStateData.stateHoverColor || opt.stateHoverColor,
                        selectedColor = thisStateData && thisStateData.stateSelectedColor || opt.stateSelectedColor,
                        disabledColor = thisStateData && thisStateData.stateDisabledColor || opt.stateDisabledColor;
                    stateColor[state] = {}, stateColor[state].initColor = initColor, stateColor[state].hoverColor = hoverColor, stateColor[state].selectedColor = selectedColor;
                    var obj = r.path(mapConfig.shapes[state]);
                    obj.id = state, obj.name = mapConfig.names[state], obj.timer = "", obj.attr(attributes), opt.external && (self.externalData[obj.id] = obj), stateData[state] && stateData[state].diabled ? obj.attr({
                        fill: disabledColor,
                        cursor: "default"
                    }) : (obj.attr({
                        fill: initColor
                    }), obj.hover(function (a) {
                        sharpHover(a, this)
                    }, function (a) {
                        opt.external && "undefined" != typeof self.externalData[obj.id].eventHoverLock && 1 == self.externalData[obj.id].eventHoverLock || sharpOut(a, this)
                    }).click(function (a) {
                        opt.external && "undefined" != typeof self.externalData[obj.id].eventClickLock && 1 == self.externalData[obj.id].eventClickLock || sharpClick(a, this)
                    }))
                }
                r.changeSize(opt.mapWidth, opt.mapHeight, !1, !1), document.body.onmousemove = function (a) {
                    var b = new offsetXY(a);
                    $("#MapTip").css({
                        left: b[0],
                        top: b[1]
                    })
                }
            }, SVGMap
        }();
    $.fn.SVGMap = function (a) {
        var b = $(this),
            c = b.data();
        return c.SVGMap && delete c.SVGMap, a !== !1 && (c.SVGMap = new SVGMap(b, a)), c.SVGMap
    }
}(window, jQuery);