! function(a, b, c) {
  "undefined" != typeof module && module.exports ? module.exports = c() : "function" == typeof define && define.amd ? define(c) : b[a] = c()
}("steg", this, function() {
  var a = function() {},
    b = {
      isPrime: function(a) {
        if (isNaN(a) || !isFinite(a) || a % 1 || 2 > a) return !1;
        if (a % 2 === 0) return 2 === a;
        if (a % 3 === 0) return 3 === a;
        for (var b = Math.sqrt(a), c = 5; b >= c; c += 6) {
          if (a % c === 0) return !1;
          if (a % (c + 2) === 0) return !1
        }
        return !0
      },
      findNextPrime: function(a) {
        for (var c = a; !0; c += 1)
          if (b.isPrime(c)) return c
      },
      sum: function(a, b, c) {
        var d = 0;
        c = c || {};
        for (var e = c.start || 0; b > e; e += c.inc || 1) d += a(e) || 0;
        return 0 === d && c.defValue ? c.defValue : d
      },
      product: function(a, b, c) {
        var d = 1;
        c = c || {};
        for (var e = c.start || 0; b > e; e += c.inc || 1) d *= a(e) || 1;
        return 1 === d && c.defValue ? c.defValue : d
      },
      createArrayFromArgs: function(a, b, c) {
        for (var d = new Array(c - 1), e = 0; c > e; e += 1) d[e] = a(e >= b ? e + 1 : e);
        return d
      },
      loadImg: function(a) {
        var b = new Image;
        return b.src = a, b
      }
    };
  return a.prototype.config = {
    t: 3,
    threshold: 1,
    codeUnitSize: 16,
    args: function(a) {
      return a + 1
    },
    messageDelimiter: function(a, b) {
      for (var c = new Array(3 * b), d = 0; d < c.length; d += 1) c[d] = 255;
      return c
    },
    messageCompleted: function(a, b, c) {
      for (var d = !0, e = 0; 16 > e && d; e += 1) d = d && 255 === a[b + 4 * e];
      return d
    }
  }, a.prototype.getHidingCapacity = function(a, b) {
    b = b || {};
    var c = this.config,
      d = b.width || a.width,
      e = b.height || a.height,
      f = b.t || c.t,
      g = b.codeUnitSize || c.codeUnitSize;
    return f * d * e / g >> 0
  }, a.prototype.encode = function(a, c, d) {
    if (c.length) c = b.loadImg(c);
    else if (c.src) c = b.loadImg(c.src);
    else if (!(c instanceof HTMLImageElement)) throw new Error("IllegalInput: The input image is neither an URL string nor an image.");
    d = d || {};
    var e = this.config,
      f = d.t || e.t,
      g = d.threshold || e.threshold,
      h = d.codeUnitSize || e.codeUnitSize,
      i = b.findNextPrime(Math.pow(2, f)),
      j = d.args || e.args,
      k = d.messageDelimiter || e.messageDelimiter;
    if (!f || 1 > f || f > 7) throw new Error('IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8');
    var l = document.createElement("canvas"),
      m = l.getContext("2d");
    l.style.display = "none", l.width = d.width || c.width, l.height = d.height || c.height, d.height && d.width ? m.drawImage(c, 0, 0, d.width, d.height) : m.drawImage(c, 0, 0);
    var n, o, p, q, r, s, t, u, v, w, x = m.getImageData(0, 0, l.width, l.height),
      y = x.data,
      z = h / f >> 0,
      A = h % f,
      B = [];
    for (v = 0; v <= a.length; v += 1) {
      if (s = a.charCodeAt(v) || 0, t = A * v % f, t > 0 && o) {
        if (u = Math.pow(2, f - t) - 1, p = Math.pow(2, h) * (1 - Math.pow(2, -t)), q = (s & u) << t, r = (o & p) >> h - t, B.push(q + r), v < a.length) {
          for (u = Math.pow(2, 2 * f - t) * (1 - Math.pow(2, -f)), w = 1; z > w; w += 1) n = s & u, B.push(n >> (w - 1) * f + (f - t)), u <<= f;
          A * (v + 1) % f === 0 ? (u = Math.pow(2, h) * (1 - Math.pow(2, -f)), n = s & u, B.push(n >> h - f)) : f >= A * (v + 1) % f + (f - t) && (n = s & u, B.push(n >> (z - 1) * f + (f - t)))
        }
      } else if (v < a.length)
        for (u = Math.pow(2, f) - 1, w = 0; z > w; w += 1) n = s & u, B.push(n >> w * f), u <<= f;
      o = s
    }
    var C, D, E, F, G, H = k(B, g);
    for (C = 0; 4 * (C + g) <= y.length && C + g <= B.length; C += g) {
      for (G = [], v = 0; g > v && v + C < B.length; v += 1) {
        for (F = 0, w = C; g + C > w && w < B.length; w += 1) F += B[w] * Math.pow(j(v), w - C);
        G[v] = 255 - i + 1 + F % i
      }
      for (v = 4 * C; v < 4 * (C + G.length) && v < y.length; v += 4) y[v + 3] = G[v / 4 % g];
      E = G.length
    }
    for (D = C + E; D - (C + E) < H.length && 4 * (C + H.length) < y.length; D += 1) y[4 * D + 3] = H[D - (C + E)];
    for (v = 4 * (D + 1) + 3; v < y.length; v += 4) y[v] = 255;
    return x.data = y, m.putImageData(x, 0, 0), l.toDataURL()
  }, a.prototype.decode = function(a, c) {
    if (a.length) a = b.loadImg(a);
    else if (a.src) a = b.loadImg(a.src);
    else if (!(a instanceof HTMLImageElement)) throw new Error("IllegalInput: The input image is neither an URL string nor an image.");
    c = c || {};
    var d = this.config,
      e = c.t || d.t,
      f = c.threshold || d.threshold,
      g = c.codeUnitSize || d.codeUnitSize,
      h = b.findNextPrime(Math.pow(2, e)),
      i = (c.args || d.args, c.messageCompleted || d.messageCompleted);
    if (!e || 1 > e || e > 7) throw new Error('IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8');
    var j = document.createElement("canvas"),
      k = j.getContext("2d");
    j.style.display = "none", j.width = c.width || a.width, j.height = c.width || a.height, c.height && c.width ? k.drawImage(a, 0, 0, c.width, c.height) : k.drawImage(a, 0, 0);
    var l, m, n = k.getImageData(0, 0, j.width, j.height),
      o = n.data,
      p = [];
    if (1 === f)
      for (l = 3, m = !1; !m && l < o.length && !m; l += 4) m = i(o, l, f), m || p.push(o[l] - (255 - h + 1));
    var q = "",
      r = 0,
      s = 0,
      t = Math.pow(2, g) - 1;
    for (l = 0; l < p.length; l += 1) r += p[l] << s, s += e, s >= g && (q += String.fromCharCode(r & t), s %= g, r = p[l] >> e - s);
    return 0 !== r && (q += String.fromCharCode(r & t)), q
  }, new a
});
