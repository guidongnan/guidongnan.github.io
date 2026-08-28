/* Password gate for the encrypted Waypoints build.
   Reads window.WP_ENC (from data.js), derives an AES-256-GCM key from the typed
   password (PBKDF2-SHA256, 200k iters), decrypts places + name translations + cover
   photos in the browser, then boots app.js. Nothing sensitive ships in the clear. */
(function () {
  var meta = window.WP_ENC;

  var style = document.createElement("style");
  style.textContent = [
    "html.wp-locked body>.shell,html.wp-locked .aurora{visibility:hidden}",
    "#wpLock{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;background:radial-gradient(120% 120% at 50% 0%,#fbf7ef,#eee4d6);font-family:Inter,'Noto Sans SC',system-ui,sans-serif}",
    "#wpLock .wp-card{display:block;width:min(90vw,340px);background:#fffdf8;border:1px solid #e7ddca;border-radius:20px;padding:30px 26px;box-shadow:0 20px 60px rgba(120,90,50,.18);text-align:center}",
    "#wpLock .wp-emoji{font-size:40px;line-height:1.1}",
    "#wpLock h1{font-family:'Noto Serif SC',serif;font-size:22px;margin:10px 0 4px;color:#4b3b28}",
    "#wpLock p{font-size:13px;color:#a08b6d;margin:0 0 16px}",
    "#wpLock input{width:100%;box-sizing:border-box;padding:12px 14px;font-size:15px;border:1px solid #e0d4bd;border-radius:12px;background:#fbf6ee;margin-bottom:12px}",
    "#wpLock button{width:100%;padding:12px;font-size:15px;font-weight:600;color:#fffdf8;background:#b56a48;border:0;border-radius:12px;cursor:pointer}",
    "#wpLock button:disabled{opacity:.6;cursor:default}"
  ].join("");
  document.head.appendChild(style);
  document.documentElement.classList.add("wp-locked");

  var ov = document.createElement("div");
  ov.id = "wpLock";
  ov.innerHTML =
    '<form class="wp-card" id="wpForm">' +
    '<div class="wp-emoji">\uD83D\uDD12</div>' +
    "<h1>\u53BB\u5904 \u00b7 Waypoints</h1>" +
    '<p id="wpMsg">\u8F93\u5165\u5BC6\u7801\u67E5\u770B \u00b7 Enter password</p>' +
    '<input id="wpPw" type="password" autocomplete="current-password" placeholder="\u5BC6\u7801 / Password" />' +
    '<button type="submit" id="wpGo">\u8FDB\u5165 Enter</button>' +
    "</form>";
  document.body.appendChild(ov);
  setTimeout(function () { var i = document.getElementById("wpPw"); if (i) i.focus(); }, 50);

  function b64d(s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); }

  async function decrypt(pw) {
    var keyMat = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
    var key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64d(meta.salt), iterations: meta.iter, hash: "SHA-256" },
      keyMat, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    var pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64d(meta.iv) }, key, b64d(meta.ct));
    return JSON.parse(new TextDecoder().decode(pt));
  }

  function boot(data) {
    window.WP_SEED = data.places || [];
    window.WP_NAMES = data.names || {};
    window.WP_NO_PERSIST = true; // never write the decrypted data to localStorage
    var s = document.createElement("script");
    s.src = "app.js";
    s.onload = function () {
      document.documentElement.classList.remove("wp-locked");
      var o = document.getElementById("wpLock"); if (o) o.remove();
      window.dispatchEvent(new Event("resize"));
    };
    document.body.appendChild(s);
  }

  document.getElementById("wpForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    var msg = document.getElementById("wpMsg"), go = document.getElementById("wpGo");
    var pw = document.getElementById("wpPw").value;
    if (!pw) return;
    go.disabled = true; msg.textContent = "\u89E3\u5BC6\u4E2D\u2026 Decrypting\u2026";
    try {
      var data = await decrypt(pw);
      msg.textContent = "\u6210\u529F \u00b7 \u52A0\u8F7D\u4E2D\u2026";
      boot(data);
    } catch (err) {
      msg.textContent = "\u5BC6\u7801\u9519\u8BEF\uFF0C\u8BF7\u91CD\u8BD5 \u00b7 Wrong password";
      go.disabled = false;
      var i = document.getElementById("wpPw"); i.value = ""; i.focus();
    }
  });

  if (!meta) document.getElementById("wpMsg").textContent = "data.js missing";
})();
