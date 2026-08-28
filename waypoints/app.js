/* ============================================================
   去处 · Waypoints — personal interactive place atlas
   Vanilla JS + Leaflet. All state persists in localStorage.
   ============================================================ */

/* ---------- categories ---------- */
const CATEGORIES = {
  nature: { emoji: "🏔", color: "#6f9270", label: "自然" },
  city: { emoji: "🏙", color: "#5f7d99", label: "城市" },
  heritage: { emoji: "🏛", color: "#c0923f", label: "古迹" },
  food: { emoji: "🍜", color: "#c17767", label: "美食" },
  beach: { emoji: "🏖", color: "#6fa39d", label: "海滨" },
  adventure: { emoji: "🧗", color: "#8f7a9e", label: "探险" },
  art: { emoji: "🎨", color: "#b3789a", label: "艺术" },
  landmark: { emoji: "⭐", color: "#c8933d", label: "景点" },
  other: { emoji: "📍", color: "#9a9186", label: "其他" },
};
const catOf = (id) => CATEGORIES[id] || CATEGORIES.other;

/* ---------- i18n (English default) ---------- */
const LANGS = ["en", "zh"];
const I18N = {
  en: {
    brand: "Waypoints", brand_sub: "Personal Atlas",
    search_ph: "Search places, cities, tags…",
    seg_all: "All", seg_want: "Wishlist", seg_visited: "Visited",
    stat_saved: "Saved", stat_visited: "Visited", stat_explored: "Explored",
    foot_new: "＋ New spot", foot_import: "Import", foot_export: "Export", foot_reset: "Reset",
    tool_style: "Map style (M)", tool_surprise: "Surprise me (R)", tool_pin: "Drop a pin",
    tool_territory: "Visited territory (B)", tool_locate: "Fit all",
    theme_title: "Theme (T)", lang_title: "Language / 语言", collapse_title: "Collapse", reopen: "🧭 List",
    pin_hint: "Tap the map to place a spot · Esc to cancel",
    cat_nature: "Nature", cat_city: "City", cat_heritage: "Heritage", cat_food: "Food", cat_beach: "Beach",
    cat_adventure: "Adventure", cat_art: "Art", cat_landmark: "Landmark", cat_other: "Other",
    st_want: "Wishlist", st_visited: "Visited", badge_visited: "Visited", badge_want: "Wishlist",
    d_category: "Category", d_status: "Status", d_coords: "Coordinates", d_visited: "Visited", d_want: "On the wishlist", d_when: "Visited", d_alt: "Altitude", d_visits: "Visits",
    act_visit: "✓ Mark visited", act_unvisit: "↺ Move to wishlist", act_fav: "☆ Favorite", act_unfav: "★ Unfavorite",
    act_edit: "✎ Edit", act_delete: "🗑 Delete",
    empty: "No places match.<br/>Try another filter, or ＋ add one.",
    ed_new: "New spot", ed_edit: "Edit spot",
    f_name: "Name", f_en: "English name", f_local: "Local name", f_city: "City / region", f_category: "Category", f_date: "Visit date",
    f_lat: "Latitude", f_lng: "Longitude", f_status: "Status", f_fav: "★ Mark as favorite",
    f_tags: "Tags (comma separated)", f_note: "Note",
    btn_delete: "Delete", btn_cancel: "Cancel", btn_save: "Save",
    ph_name: "e.g. Lingyin Temple", ph_local: "e.g. Lingyin Si", ph_note: "Why you want to go…",
    t_style: "Map style · {n}", t_theme: "Theme · {n}", t_lang: "Language · English",
    t_import_ok: "Imported · {n} places", t_import_detailed: "Done · {a} landmarks / {b} cities",
    t_import_fail: "Import failed: bad file format", t_export: "Exported {n} places",
    t_reset_confirm: "Reset to sample data? This overwrites everything.", t_reset_do: "Reset",
    t_reset_done: "Sample data restored", t_deleted: "Deleted {name}", t_undo: "Undo", t_restored: "Restored {name}",
    t_visited: "Visited {name} ✓", t_unvisited: "{name} back to wishlist", t_fav: "Favorited · {name}",
    t_unfav: "Unfavorited · {name}", t_saved: "Changes saved", t_added: "Added {name}", t_take: "Off to {name}",
    t_coord_bad: "Enter valid coordinates", t_territory_on: "Visited territory on", t_territory_off: "Visited territory hidden",
    t_map_missing: "Map library didn't load — check your network and refresh", t_names_missing: "Place data not loaded, please refresh",
  },
  zh: {
    brand: "去处", brand_sub: "WAYPOINTS",
    search_ph: "搜索地点、城市、标签…",
    seg_all: "全部", seg_want: "想去", seg_visited: "去过",
    stat_saved: "收藏", stat_visited: "去过", stat_explored: "足迹",
    foot_new: "＋ 新地点", foot_import: "导入", foot_export: "导出", foot_reset: "重置",
    tool_style: "地图风格 (M)", tool_surprise: "随机去处 (R)", tool_pin: "点图添加地点",
    tool_territory: "去过版图·深色显示 (B)", tool_locate: "回到全部",
    theme_title: "切换主题 (T)", lang_title: "Language / 语言", collapse_title: "收起面板", reopen: "🧭 列表",
    pin_hint: "点击地图放置新地点 · Esc 取消",
    cat_nature: "自然", cat_city: "城市", cat_heritage: "古迹", cat_food: "美食", cat_beach: "海滨",
    cat_adventure: "探险", cat_art: "艺术", cat_landmark: "景点", cat_other: "其他",
    st_want: "想去", st_visited: "去过", badge_visited: "去过", badge_want: "想去",
    d_category: "分类", d_status: "状态", d_coords: "坐标", d_visited: "已经去过", d_want: "想去", d_when: "造访", d_alt: "海拔", d_visits: "到访记录",
    act_visit: "✓ 标记去过", act_unvisit: "↺ 标为想去", act_fav: "☆ 心水", act_unfav: "★ 取消心水",
    act_edit: "✎ 编辑", act_delete: "🗑 删除",
    empty: "没有符合条件的地点<br/>试试换个筛选，或 ＋ 新建一个",
    ed_new: "新建地点", ed_edit: "编辑地点",
    f_name: "名称", f_en: "英文名", f_local: "当地语言名称", f_city: "城市 / 地区", f_category: "分类", f_date: "造访日期",
    f_lat: "纬度 Lat", f_lng: "经度 Lng", f_status: "状态", f_fav: "★ 标为心水",
    f_tags: "标签（逗号分隔）", f_note: "笔记",
    btn_delete: "删除", btn_cancel: "取消", btn_save: "保存",
    ph_name: "如 灵隐寺", ph_local: "如 Lingyin Si", ph_note: "为什么想去这里…",
    t_style: "地图风格 · {n}", t_theme: "主题 · {n}", t_lang: "语言 · 中文",
    t_import_ok: "导入成功 · {n} 个地点", t_import_detailed: "导入完成 · {a} 个著名景点 / {b} 个城市",
    t_import_fail: "导入失败：文件格式不对", t_export: "已导出 {n} 个地点",
    t_reset_confirm: "确认恢复示例数据？会覆盖当前所有地点", t_reset_do: "确认重置",
    t_reset_done: "已恢复示例数据", t_deleted: "已删除 {name}", t_undo: "撤销", t_restored: "已恢复 {name}",
    t_visited: "去过 {name} ✓", t_unvisited: "{name} 移回想去", t_fav: "心水 · {name}",
    t_unfav: "取消心水 · {name}", t_saved: "已保存修改", t_added: "已添加 {name}", t_take: "带你去 · {name}",
    t_coord_bad: "请填写有效的经纬度", t_territory_on: "已开启去过版图", t_territory_off: "已隐藏去过版图",
    t_map_missing: "地图库未加载，检查网络后刷新", t_names_missing: "景点数据未加载，请刷新页面重试",
  },
};
function t(key, p) {
  const lang = (typeof state !== "undefined" && state && state.settings && state.settings.lang) || "en";
  let s = (I18N[lang] && I18N[lang][key]) != null ? I18N[lang][key] : (I18N.en[key] != null ? I18N.en[key] : key);
  if (p) for (const k in p) s = s.replace(new RegExp("\\{" + k + "\\}", "g"), p[k]);
  return s;
}
const catLabel = (id) => t("cat_" + id);
const styleLabel = (s) => ((state.settings && state.settings.lang) === "en" && s.en ? s.en : s.name);
// localize the auto-generated "N 张照片 · years" photo note; leave user notes untouched
function locNote(n) {
  return (state.settings && state.settings.lang) === "en" ? String(n).replace(/(\d+)\s*张照片/, "$1 photos") : n;
}
const WEEKDAY = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  zh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
};
function yearRange(p) {
  const m = String(p.note || "").match(/(?:19|20)\d\d(?:\s*[–-]\s*(?:19|20)\d\d)?/);
  return m ? m[0].replace(/\s/g, "") : "";
}
// visit label: latest visit date + weekday (and total visit count), else the year range
function visitLabel(p) {
  const lang = (state.settings && state.settings.lang) === "en" ? "en" : "zh";
  const ds = Array.isArray(p.dates) ? p.dates : [];
  if (ds.length) {
    const last = ds[ds.length - 1];
    const dd = new Date(last + "T00:00:00");
    let s = last + (isNaN(dd) ? "" : " \u00b7 " + WEEKDAY[lang][dd.getDay()]);
    if (ds.length > 1) s += lang === "en" ? ` \u00b7 ${ds.length}\u00d7` : ` \u00b7 \u5171${ds.length}\u6b21`;
    return s;
  }
  if (p.date) {
    const d = new Date(p.date + "T00:00:00");
    if (!isNaN(d)) return p.date + " · " + WEEKDAY[lang][d.getDay()];
  }
  return yearRange(p);
}

/* place name forms: Chinese + English + local (native) ---------------------- */
function nmeta(p) {
  const w = (window.WP_NAMES && window.WP_NAMES[p.name]) || {};
  return { zh: p.name || "", en: p.en || w.en || "", local: p.local || w.local || "" };
}
function nameParts(p) {
  const m = nmeta(p);
  const lang = (state.settings && state.settings.lang) || "en";
  const alt = [];
  let title;
  if (lang === "en") {
    title = m.en || m.zh;
    if (m.zh && m.zh !== title) alt.push(m.zh);
    if (m.local && m.local !== title && m.local !== m.zh) alt.push(m.local);
  } else {
    title = m.zh || m.en;
    if (m.en && m.en !== title) alt.push(m.en);
    if (m.local && m.local !== title && m.local !== m.zh) alt.push(m.local);
  }
  return { title, alt };
}

function applyLang() {
  const lang = state.settings.lang;
  document.body.dataset.lang = lang;
  document.documentElement.lang = lang === "en" ? "en" : "zh";
  document.body.style.setProperty("--lm-label", lang === "en" ? '" Landmark"' : '" 景点"');
  document.querySelectorAll("[data-i18n]").forEach((n) => (n.innerHTML = t(n.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((n) => (n.placeholder = t(n.dataset.i18nPh)));
  document.querySelectorAll("[data-i18n-title]").forEach((n) => (n.title = t(n.dataset.i18nTitle)));
  const lc = document.querySelector("#langToggle .lang-code");
  if (lc) lc.textContent = lang === "en" ? "EN" : "中";
  if (map) applyMapStyle();
}
function cycleLang() {
  state.settings.lang = state.settings.lang === "en" ? "zh" : "en";
  saveSettings();
  applyLang();
  render();
  if (state.activeId) renderDetail(state.places.find((x) => x.id === state.activeId) || null);
  toast(t("t_lang"), { emoji: "🌐" });
}

/* ---------- landmark database (famous 景点, matched by proximity to a photo) ---------- */
const LANDMARKS = [
  { name: "故宫", emoji: "🏛", lat: 39.9163, lng: 116.3972, r: 0.9 },
  { name: "天安门广场", emoji: "🚩", lat: 39.9055, lng: 116.3976, r: 0.6 },
  { name: "长城·八达岭", emoji: "🧱", lat: 40.3591, lng: 116.0169, r: 3.0 },
  { name: "天坛", emoji: "🏯", lat: 39.8822, lng: 116.4066, r: 0.8 },
  { name: "颐和园", emoji: "🏞", lat: 39.9999, lng: 116.2755, r: 1.2 },
  { name: "兵马俑", emoji: "🗿", lat: 34.3853, lng: 109.2734, r: 0.6 },
  { name: "西安城墙", emoji: "🧱", lat: 34.2611, lng: 108.9398, r: 1.0 },
  { name: "大雁塔", emoji: "🏯", lat: 34.2223, lng: 108.964, r: 0.4 },
  { name: "布达拉宫", emoji: "🏔", lat: 29.6558, lng: 91.117, r: 0.5 },
  { name: "大昭寺", emoji: "🛕", lat: 29.653, lng: 91.131, r: 0.3 },
  { name: "外滩", emoji: "🌆", lat: 31.24, lng: 121.49, r: 0.8 },
  { name: "东方明珠", emoji: "🗼", lat: 31.2397, lng: 121.4998, r: 0.4 },
  { name: "西湖", emoji: "🏞", lat: 30.244, lng: 120.149, r: 2.2 },
  { name: "灵隐寺", emoji: "🛕", lat: 30.2405, lng: 120.1015, r: 0.5 },
  { name: "黄山", emoji: "⛰", lat: 30.134, lng: 118.167, r: 5.0 },
  { name: "泰山", emoji: "⛰", lat: 36.256, lng: 117.101, r: 3.0 },
  { name: "乐山大佛", emoji: "🗿", lat: 29.545, lng: 103.771, r: 0.4 },
  { name: "丽江古城", emoji: "🏘", lat: 26.877, lng: 100.234, r: 0.8 },
  { name: "香港·维多利亚港", emoji: "🌃", lat: 22.293, lng: 114.169, r: 1.2 },
  { name: "澳门·大三巴", emoji: "⛪", lat: 22.1976, lng: 113.541, r: 0.3 },
  { name: "桂林·象鼻山", emoji: "🐘", lat: 25.261, lng: 110.293, r: 0.5 },
  { name: "哈尔滨·圣索菲亚教堂", emoji: "⛪", lat: 45.769, lng: 126.626, r: 0.3 },
  { name: "泉州·开元寺", emoji: "🛕", lat: 24.916, lng: 118.586, r: 0.4 },
  { name: "厦门·鼓浪屿", emoji: "🏝", lat: 24.447, lng: 118.067, r: 0.9 },
  { name: "天津之眼", emoji: "🎡", lat: 39.153, lng: 117.181, r: 0.4 },
  { name: "呼和浩特·大召寺", emoji: "🛕", lat: 40.811, lng: 111.656, r: 0.4 },
  { name: "塞维利亚大教堂", emoji: "⛪", lat: 37.3859, lng: -5.9932, r: 0.25 },
  { name: "塞维利亚·西班牙广场", emoji: "🏛", lat: 37.3772, lng: -5.9869, r: 0.3 },
  { name: "塞维利亚王宫", emoji: "🏰", lat: 37.383, lng: -5.9905, r: 0.25 },
  { name: "马拉加城堡", emoji: "🏰", lat: 36.7213, lng: -4.416, r: 0.35 },
  { name: "里斯本·贝伦塔", emoji: "🗼", lat: 38.6916, lng: -9.216, r: 0.3 },
  { name: "热罗尼莫斯修道院", emoji: "⛪", lat: 38.6979, lng: -9.2065, r: 0.3 },
  { name: "波尔图·路易一世大桥", emoji: "🌉", lat: 41.14, lng: -8.6094, r: 0.4 },
  { name: "波尔图·莱罗书店", emoji: "📚", lat: 41.147, lng: -8.6151, r: 0.12 },
  { name: "圣索菲亚大教堂", emoji: "🕌", lat: 41.0086, lng: 28.98, r: 0.2 },
  { name: "蓝色清真寺", emoji: "🕌", lat: 41.0054, lng: 28.9768, r: 0.2 },
  { name: "托普卡帕宫", emoji: "🏰", lat: 41.0115, lng: 28.9834, r: 0.35 },
  { name: "卡帕多奇亚·热气球", emoji: "🎈", lat: 38.6431, lng: 34.8286, r: 3.0 },
  { name: "安塔利亚老城", emoji: "🏛", lat: 36.885, lng: 30.704, r: 0.6 },
  { name: "曼谷大皇宫", emoji: "🏯", lat: 13.75, lng: 100.4915, r: 0.35 },
  { name: "卧佛寺", emoji: "🛕", lat: 13.7465, lng: 100.4927, r: 0.2 },
  { name: "郑王庙(黎明寺)", emoji: "🛕", lat: 13.7437, lng: 100.4889, r: 0.2 },
  { name: "清迈·契迪龙寺", emoji: "🛕", lat: 18.7869, lng: 98.9863, r: 0.2 },
  { name: "清迈·双龙寺", emoji: "🛕", lat: 18.8047, lng: 98.9217, r: 0.3 },
  { name: "大阪城", emoji: "🏯", lat: 34.6873, lng: 135.5259, r: 0.5 },
  { name: "清水寺", emoji: "⛩", lat: 34.9949, lng: 135.785, r: 0.3 },
  { name: "金阁寺", emoji: "🏯", lat: 35.0394, lng: 135.7292, r: 0.25 },
  { name: "伏见稻荷大社", emoji: "⛩", lat: 34.9671, lng: 135.7727, r: 0.5 },
  { name: "奈良·东大寺", emoji: "🛕", lat: 34.689, lng: 135.8398, r: 0.4 },
  { name: "奈良公园", emoji: "🦌", lat: 34.6851, lng: 135.843, r: 0.7 },
  { name: "景福宫", emoji: "🏯", lat: 37.5796, lng: 126.977, r: 0.35 },
  { name: "北村韩屋村", emoji: "🏘", lat: 37.5826, lng: 126.985, r: 0.35 },
  { name: "N首尔塔", emoji: "🗼", lat: 37.5512, lng: 126.9882, r: 0.3 },
  { name: "明洞", emoji: "🛍", lat: 37.5636, lng: 126.983, r: 0.35 },
  { name: "河内·还剑湖", emoji: "🏞", lat: 21.0287, lng: 105.8524, r: 0.35 },
  { name: "胡志明·红教堂", emoji: "⛪", lat: 10.7797, lng: 106.699, r: 0.3 },
  { name: "下龙湾", emoji: "⛵", lat: 20.91, lng: 107.183, r: 6.0 },
  { name: "芽庄·婆那加占婆塔", emoji: "🛕", lat: 12.2654, lng: 109.1955, r: 0.3 },
  { name: "哈桑二世清真寺", emoji: "🕌", lat: 33.6083, lng: -7.6325, r: 0.3 },
  { name: "亚庇·水上清真寺", emoji: "🕌", lat: 5.9836, lng: 116.0735, r: 0.25 },
  { name: "巴库·火焰塔", emoji: "🔥", lat: 40.3595, lng: 49.829, r: 0.4 },
  { name: "巴库老城", emoji: "🏛", lat: 40.3667, lng: 49.8352, r: 0.4 },
  { name: "海参崴·金角湾大桥", emoji: "🌉", lat: 43.115, lng: 131.89, r: 0.6 },
];
const LANDMARK_KW = /(寺|庙|塔|宫|殿|皇宫|陵|祠|石窟|古城|教堂|大教堂|清真寺|修道院|城堡|遗址|纪念馆|博物馆|美术馆|神社|大社|Temple|Palace|Tower|Cathedral|Church|Mosque|Castle|Museum|Shrine|Basilica|Monastery|Fort)/i;

function haversineKm(la1, lo1, la2, lo2) {
  const R = 6371;
  const toR = (d) => (d * Math.PI) / 180;
  const dLa = toR(la2 - la1);
  const dLo = toR(lo2 - lo1);
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(toR(la1)) * Math.cos(toR(la2)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
const slug = (s) => (String(s || "").replace(/[^0-9a-z\u4e00-\u9fff]+/gi, "").slice(0, 24) || Math.random().toString(36).slice(2, 8));

function poiEmoji(t) {
  if (/清真寺|Mosque/i.test(t)) return "🕌";
  if (/教堂|Cathedral|Church|Basilica/i.test(t)) return "⛪";
  if (/神社|大社|Shrine/i.test(t)) return "⛩";
  if (/寺|庙|石窟|Temple|Monastery/i.test(t)) return "🛕";
  if (/塔|Tower/i.test(t)) return "🗼";
  if (/宫|殿|皇宫|城堡|Palace|Castle|Fort/i.test(t)) return "🏰";
  if (/博物馆|美术馆|Museum/i.test(t)) return "🖼";
  return "⭐";
}

// Decide whether a photo point sits at a known/likely 景点.
function detectLandmark(lat, lng, feature, address) {
  let best = null;
  let bestD = Infinity;
  for (const L of LANDMARKS) {
    const d = haversineKm(lat, lng, L.lat, L.lng);
    if (d <= (L.r || 0.4) && d < bestD) {
      bestD = d;
      best = L;
    }
  }
  if (best) return { id: "lm_" + slug(best.name), name: best.name, emoji: best.emoji, coords: [best.lat, best.lng], curated: true };
  const f = String(feature || "").trim();
  const text = f + " " + String(address || "");
  if (f && !/^[\d+]/.test(f) && LANDMARK_KW.test(text)) {
    return { id: "poi_" + slug(f), name: f, emoji: poiEmoji(text), coords: [lat, lng], curated: false };
  }
  return null;
}

/* ---------- map styles ---------- */
const OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// CARTO's public basemaps now stamp "API KEY REQUIRED" on every tile; Esri's are still key-free.
const ESRI = (s) => `https://server.arcgisonline.com/ArcGIS/rest/services/${s}/MapServer/tile/{z}/{y}/{x}`;
const ATTR_ESRI = '&copy; <a href="https://www.esri.com/">Esri</a>';
const ATTR_OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const MAP_STYLES = [
  { id: "daylight", name: "素白", en: "Daylight", url: ESRI("Canvas/World_Light_Gray_Base"), sub: "abc", retina: false, attr: ATTR_ESRI, swatch: "#eae4d8", filter: "sepia(.12) saturate(.9) brightness(1.02)" },
  { id: "voyager", name: "旅人", en: "Voyager", url: ESRI("World_Street_Map"), sub: "abc", retina: false, attr: ATTR_ESRI, swatch: "#e7dfce", filter: "saturate(.82) brightness(1.02)" },
  { id: "parchment", name: "旧纸", en: "Parchment", url: OSM, sub: "abc", retina: false, attr: ATTR_OSM, swatch: "#e0cfa8", filter: "sepia(.42) saturate(.72) brightness(1.04) contrast(.94) hue-rotate(-8deg)" },
];

const THEMES = ["paper", "sage", "mist", "blush"];

/* ---------- seed data (used on first run / reset) ---------- */
// Default map data = famous-landmark detection baked from the photo export (see seed-data.js).
// The inline array below is a legacy offline fallback used only if seed-data.js fails to load.
const SEED_PLACES = window.WP_SEED || [];

/* ---------- storage ---------- */
const KEY_PLACES = "waypoints.v4.places";
const KEY_SETTINGS = "waypoints.v1.settings";

const clone = (x) => JSON.parse(JSON.stringify(x));

function loadPlaces() {
  if (window.WP_NO_PERSIST) return clone(SEED_PLACES);
  try {
    const raw = JSON.parse(localStorage.getItem(KEY_PLACES));
    if (Array.isArray(raw) && raw.length) return raw;
  } catch (e) {}
  return clone(SEED_PLACES);
}
function savePlaces() {
  if (window.WP_NO_PERSIST) return;
  localStorage.setItem(KEY_PLACES, JSON.stringify(state.places));
}
function loadSettings() {
  const def = { theme: "paper", style: "daylight", territory: true, lang: "en" };
  let s;
  try {
    s = Object.assign({}, def, JSON.parse(localStorage.getItem(KEY_SETTINGS)) || {});
  } catch (e) {
    s = { ...def };
  }
  if (!THEMES.includes(s.theme)) s.theme = def.theme;
  if (!MAP_STYLES.some((m) => m.id === s.style)) s.style = def.style;
  if (!LANGS.includes(s.lang)) s.lang = def.lang;
  return s;
}
function saveSettings() {
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(state.settings));
}

/* ---------- state ---------- */
const state = {
  places: loadPlaces(),
  settings: loadSettings(),
  search: "",
  category: "all",
  status: "all",
  activeId: null,
};

/* ---------- DOM ---------- */
const $ = (s) => document.querySelector(s);
const el = {
  rail: $("#rail"),
  chips: $("#categoryChips"),
  statusSeg: $("#statusSeg"),
  search: $("#search"),
  list: $("#placeList"),
  statTotal: $("#statTotal"),
  statVisited: $("#statVisited"),
  statPct: $("#statPct"),
  detail: $("#detail"),
  styleBtn: $("#styleBtn"),
  styleName: $("#styleName"),
  styleSwatch: $("#styleSwatch"),
  territoryBtn: $("#territoryBtn"),
  toasts: $("#toasts"),
  modal: $("#modal"),
  editor: $("#editor"),
  editorTitle: $("#editorTitle"),
  editorDelete: $("#editorDelete"),
};

/* ---------- helpers ---------- */
const uid = () => "p" + Math.random().toString(36).slice(2, 9);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg, { emoji = "✨", action } = {}) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<span class="em">${emoji}</span><span>${esc(msg)}</span>`;
  if (action) {
    const b = document.createElement("button");
    b.textContent = action.label;
    b.onclick = () => {
      action.fn();
      dismiss();
    };
    t.appendChild(b);
  }
  el.toasts.appendChild(t);
  const dismiss = () => {
    t.classList.add("out");
    setTimeout(() => t.remove(), 350);
  };
  setTimeout(dismiss, action ? 5200 : 2800);
}

function animateNumber(node, to, suffix = "") {
  const from = parseFloat(node.dataset.val || "0") || 0;
  node.dataset.val = to;
  const start = performance.now();
  const dur = 550;
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    node.textContent = Math.round(from + (to - from) * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- filtering ---------- */
function filtered() {
  const q = state.search.trim().toLowerCase();
  return state.places.filter((p) => {
    if (state.category !== "all" && p.category !== state.category) return false;
    if (state.status === "visited" && p.status !== "visited") return false;
    if (state.status === "want" && p.status !== "want") return false;
    if (state.status === "fav" && !p.fav) return false;
    if (q) {
      const m = nmeta(p);
      const hay = [m.zh, m.en, m.local, p.city, (p.tags || []).join(" "), p.note].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/* ---------- map ---------- */
let map, tileLayer, currentUrl, markerGroup;
const markerRefs = new Map();

const mqMobile = window.matchMedia("(max-width: 900px)");
const isMobile = () => mqMobile.matches;
let _busyT;
const markBusy = () => document.body.classList.add("is-busy");
const clearBusySoon = () => {
  clearTimeout(_busyT);
  _busyT = setTimeout(() => document.body.classList.remove("is-busy"), 160);
};
let minimizeRail = () => {};

function initMap() {
  map = L.map("map", { zoomControl: false, worldCopyJump: true, minZoom: 2 }).setView([28, 40], 3);
  L.control.zoom({ position: isMobile() ? "topright" : "bottomright" }).addTo(map);
  markerGroup = L.layerGroup().addTo(map);
  applyMapStyle();
  // drop the panels' backdrop-blur while the map is moving (mobile flicker fix)
  map.on("movestart zoomstart dragstart", markBusy);
  map.on("moveend zoomend dragend", clearBusySoon);
  map.on("click", () => {
    if (state.activeId) select(null);
  });
}
const round = (n) => Math.round(n * 1e5) / 1e5;

function currentStyle() {
  return MAP_STYLES.find((s) => s.id === state.settings.style) || MAP_STYLES[0];
}
function applyMapStyle() {
  const s = currentStyle();
  if (!tileLayer || s.url !== currentUrl) {
    if (tileLayer) map.removeLayer(tileLayer);
    tileLayer = L.tileLayer(s.url, {
      subdomains: s.sub,
      detectRetina: s.retina,
      maxZoom: 19,
      attribution: s.attr,
    }).addTo(map);
    currentUrl = s.url;
  }
  document.getElementById("map").style.setProperty("--tile-filter", s.filter);
  el.styleName.textContent = styleLabel(s);
  el.styleSwatch.style.background = s.swatch;
}
function cycleMapStyle() {
  const i = MAP_STYLES.findIndex((s) => s.id === state.settings.style);
  state.settings.style = MAP_STYLES[(i + 1) % MAP_STYLES.length].id;
  saveSettings();
  applyMapStyle();
  toast(t("t_style", { n: styleLabel(currentStyle()) }), { emoji: "🗺️" });
}

function archOf(p) {
  const D = window.WP_LM3D;
  if (!D) return "default";
  const name = p.name || "";
  for (const [re, a] of D.byKw) if (re.test(name)) return a;
  const e = (p.emoji || "").replace(/\uFE0F/g, "");
  if (D.byEmoji[e]) return D.byEmoji[e];
  return p.category === "landmark" ? "default" : "city";
}
function markerIcon(p, active) {
  const isLm = p.category === "landmark";
  if (window.WP_LM3D) {
    const arch = archOf(p);
    const svg = window.WP_LM3D.icons[arch] || window.WP_LM3D.icons.default;
    return L.divIcon({
      className: "wp-marker lm3d-marker " + (isLm ? "lm" : "city") + (active ? " active" : ""),
      html: `<div class="lm3d ${arch}">
          <span class="lm3d-shadow"></span>
          <span class="lm3d-art">${svg}</span>
          ${p.fav ? '<span class="wp-fav">★</span>' : ""}
        </div>`,
      iconSize: [44, 52],
      iconAnchor: [22, 48],
      tooltipAnchor: [0, -46],
    });
  }
  const c = catOf(p.category);
  return L.divIcon({
    className: "wp-marker wp-dot-marker" + (active ? " active" : ""),
    html: `<div class="wp-dot ${p.status}" style="--c:${c.color}"><span class="wp-dot-pulse"></span>${p.fav ? '<span class="wp-fav">★</span>' : ""}</div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    tooltipAnchor: [0, -12],
  });
}

function renderMarkers(list) {
  markerGroup.clearLayers();
  markerRefs.clear();
  list.forEach((p) => {
    const active = p.id === state.activeId;
    const m = L.marker(p.coords, { icon: markerIcon(p, active) })
      .bindTooltip(nameParts(p).title, { className: "wp-tip", direction: "top", offset: [0, -6] })
      .on("click", () => select(p.id))
      .on("mouseover", () => highlightCard(p.id, true))
      .on("mouseout", () => highlightCard(p.id, false));
    m.addTo(markerGroup);
    markerRefs.set(p.id, m);
    if (active) m.openTooltip();
  });
}

function hoverMarker(id, on) {
  const m = markerRefs.get(id);
  const node = m && m.getElement();
  if (node) node.classList.toggle("hover", on);
}

function fitTo(list) {
  if (!list.length) return;
  if (list.length === 1) {
    map.flyTo(list[0].coords, Math.max(map.getZoom(), 9), { duration: 1 });
    return;
  }
  const b = L.latLngBounds(list.map((p) => p.coords));
  map.flyToBounds(b, { padding: [80, 80], duration: 1, maxZoom: 12 });
}

/* ---------- render list ---------- */
function renderChips() {
  const counts = {};
  state.places.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1));
  const items = [`<button class="chip ${state.category === "all" ? "active" : ""}" data-cat="all"><span class="dot"></span>${t("seg_all")}</button>`];
  Object.entries(CATEGORIES).forEach(([id, c]) => {
    if (!counts[id]) return;
    items.push(
      `<button class="chip ${state.category === id ? "active" : ""}" data-cat="${id}" style="--chip:${c.color}"><span class="dot"></span>${c.emoji} ${catLabel(id)}<span style="opacity:.6">·${counts[id]}</span></button>`
    );
  });
  el.chips.innerHTML = items.join("");
}

function renderList(list) {
  if (!list.length) {
    el.list.innerHTML = `<div class="empty">${t("empty")}</div>`;
    return;
  }
  el.list.innerHTML = list
    .map((p, i) => {
      const c = catOf(p.category);
      const emoji = p.emoji || c.emoji;
      const np = nameParts(p);
      const sub = [...new Set([...np.alt, p.city])].filter((x) => x && x !== np.title).join(" · ");
      return `<article class="card ${p.id === state.activeId ? "active" : ""} ${p.category === "landmark" ? "landmark" : ""}" data-id="${p.id}" style="--cat:${p.category === "landmark" ? "#c8933d" : c.color};--i:${i}">
        <div class="emoji">${emoji}</div>
        <div class="meta">
          <div class="title">${esc(np.title)}</div>
          <div class="sub">${esc(sub)}</div>
          ${visitLabel(p) ? `<div class="when">${esc(visitLabel(p))}</div>` : ""}
        </div>
        <div class="flags">
          ${p.status === "visited" ? `<span class="badge visited">${t("badge_visited")}</span>` : `<span class="badge">${t("badge_want")}</span>`}
          ${p.fav ? '<span class="star">★</span>' : ""}
        </div>
      </article>`;
    })
    .join("");
}

function highlightCard(id, on) {
  const card = el.list.querySelector(`.card[data-id="${id}"]`);
  if (card && on) card.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

/* ---------- detail ---------- */
/* ---------- weather on visit days ---------- */
// Baked into the place data at build time by photo-atlas/_build/fetch-weather.js, so the
// map never has to call a weather API at view time. Values are [wmoCode, tMin, tMax].
const WX_CODES = {
  0: ["\u2600\uFE0F", "\u6674", "Clear"],
  1: ["\uD83C\uDF24\uFE0F", "\u6674\u95f4\u591a\u4e91", "Mainly clear"],
  2: ["\u26C5", "\u591a\u4e91", "Partly cloudy"],
  3: ["\u2601\uFE0F", "\u9634", "Overcast"],
  45: ["\uD83C\uDF2B\uFE0F", "\u96fe", "Fog"],
  48: ["\uD83C\uDF2B\uFE0F", "\u96fe\u51c7", "Rime fog"],
  51: ["\uD83C\uDF26\uFE0F", "\u5c0f\u6bdb\u6bdb\u96e8", "Light drizzle"],
  53: ["\uD83C\uDF26\uFE0F", "\u6bdb\u6bdb\u96e8", "Drizzle"],
  55: ["\uD83C\uDF27\uFE0F", "\u6d53\u6bdb\u6bdb\u96e8", "Dense drizzle"],
  56: ["\uD83C\uDF28\uFE0F", "\u51bb\u6bdb\u6bdb\u96e8", "Freezing drizzle"],
  57: ["\uD83C\uDF28\uFE0F", "\u6d53\u51bb\u6bdb\u6bdb\u96e8", "Freezing drizzle"],
  61: ["\uD83C\uDF26\uFE0F", "\u5c0f\u96e8", "Light rain"],
  63: ["\uD83C\uDF27\uFE0F", "\u4e2d\u96e8", "Rain"],
  65: ["\uD83C\uDF27\uFE0F", "\u5927\u96e8", "Heavy rain"],
  66: ["\uD83C\uDF28\uFE0F", "\u51bb\u96e8", "Freezing rain"],
  67: ["\uD83C\uDF28\uFE0F", "\u5f3a\u51bb\u96e8", "Heavy freezing rain"],
  71: ["\uD83C\uDF28\uFE0F", "\u5c0f\u96ea", "Light snow"],
  73: ["\u2744\uFE0F", "\u4e2d\u96ea", "Snow"],
  75: ["\u2744\uFE0F", "\u5927\u96ea", "Heavy snow"],
  77: ["\u2744\uFE0F", "\u7c73\u96ea", "Snow grains"],
  80: ["\uD83C\uDF26\uFE0F", "\u9635\u96e8", "Rain showers"],
  81: ["\uD83C\uDF27\uFE0F", "\u5f3a\u9635\u96e8", "Heavy showers"],
  82: ["\u26C8\uFE0F", "\u7279\u5927\u9635\u96e8", "Violent showers"],
  85: ["\uD83C\uDF28\uFE0F", "\u9635\u96ea", "Snow showers"],
  86: ["\u2744\uFE0F", "\u5f3a\u9635\u96ea", "Heavy snow showers"],
  95: ["\u26C8\uFE0F", "\u96f7\u96e8", "Thunderstorm"],
  96: ["\u26C8\uFE0F", "\u96f7\u96e8\u4f34\u51b0\u96ea", "Thunderstorm with hail"],
  99: ["\u26C8\uFE0F", "\u96f7\u66b4\u4f34\u51b0\u96ea", "Thunderstorm with hail"],
};

function wxChip(p, date, lang) {
  const w = p.wx && p.wx[date];
  if (!w) return "";
  const meta = WX_CODES[w[0]];
  if (!meta) return "";
  return ` <i class="wx" title="${esc(lang === "en" ? meta[2] : meta[1])}">${meta[0]} ${Math.round(w[1])}\u00b0\u2013${Math.round(w[2])}\u00b0</i>`;
}

function renderDetail(p) {
  document.body.classList.toggle("has-detail", !!p);
  if (!p) {
    el.detail.hidden = true;
    el.detail.innerHTML = "";
    return;
  }
  const c = catOf(p.category);
  const emoji = p.emoji || c.emoji;
  const accent = p.category === "landmark" ? "#c8933d" : c.color;
  el.detail.hidden = false;
  el.detail.style.transform = "";
  if (isMobile()) minimizeRail();
  el.detail.style.setProperty("--cat", accent);
  const np = nameParts(p);
  const sub = [...new Set([...np.alt, p.city])].filter((x) => x && x !== np.title).join(" · ");
  const lang = (state.settings && state.settings.lang) === "en" ? "en" : "zh";
  const coverHtml = p.cover ? `<figure class="detail-cover"><img src="${esc(p.cover)}" alt="${esc(np.title)}" onerror="this.closest('.detail-cover').remove()"></figure>` : "";
  const altHtml = (typeof p.alt === "number" && p.alt >= 1 && p.alt <= 3000) ? `<div class="detail-row"><span class="k">${t("d_alt")}</span><span class="v">~${Math.round(p.alt)} m</span></div>` : "";
  const dts = Array.isArray(p.dates) ? p.dates : [];
  const datesHtml = dts.length ? `<div class="detail-dates"><div class="dates-head">${t("d_visits")} \u00b7 ${dts.length}</div><div class="dates-list">${dts.slice().reverse().map((dt) => { const dd = new Date(dt + "T00:00:00"); const wd = isNaN(dd) ? "" : WEEKDAY[lang][dd.getDay()]; return `<span class="date-chip">${esc(dt)}${wd ? ` <em>${wd}</em>` : ""}${wxChip(p, dt, lang)}</span>`; }).join("")}</div></div>` : "";
  el.detail.innerHTML = `
    <button class="sheet-handle" type="button" aria-label="${t("btn_cancel")}"><span class="grip"></span></button>
    ${coverHtml}
    <div class="detail-hero">
      <button class="icon-btn detail-close" title="Esc">✕</button>
      <div class="detail-emoji">${emoji}</div>
      <h2 class="detail-title">${esc(np.title)} ${p.fav ? '<span class="star">★</span>' : ""}</h2>
      <div class="detail-en">${esc(sub)}</div>
    </div>
    <div class="detail-body">
      ${(p.tags && p.tags.length) ? `<div class="detail-tags">${p.tags.map((tg) => `<span class="tag">${esc(tg)}</span>`).join("")}</div>` : ""}
      <div class="detail-row"><span class="k">${t("d_category")}</span><span class="v">${c.emoji} ${catLabel(p.category)}</span></div>
      <div class="detail-row"><span class="k">${t("d_status")}</span><span class="v">${p.status === "visited" ? t("d_visited") : t("d_want")}</span></div>
      ${visitLabel(p) ? `<div class="detail-row"><span class="k">${t("d_when")}</span><span class="v">${esc(visitLabel(p))}</span></div>` : ""}
      ${altHtml}
      <div class="detail-row"><span class="k">${t("d_coords")}</span><span class="v">${p.coords[0].toFixed(4)}, ${p.coords[1].toFixed(4)}</span></div>
      ${p.note ? `<div class="detail-note">${esc(locNote(p.note))}</div>` : ""}
      ${datesHtml}
    </div>`;

  el.detail.querySelector(".detail-close").onclick = () => select(null);
}

/* ---------- stats ---------- */
function renderStats() {
  const total = state.places.length;
  const visited = state.places.filter((p) => p.status === "visited").length;
  animateNumber(el.statTotal, total);
  animateNumber(el.statVisited, visited);
  animateNumber(el.statPct, total ? Math.round((visited / total) * 100) : 0, "%");
}

/* ---------- visited territories (choropleth) ---------- */
let territoryLayer = null;
let territorySig = "";
function refreshTerritory() {
  if (!map || !window.WP_BOUNDARIES) return;
  // a place's country tag may sit behind the "景点" tag on landmarks; shade by its CITY, not its name
  const countryOf = (p) => (p.tags || []).find((t) => t !== "景点") || "";
  const chinaNames = [...new Set(
    state.places.filter((p) => countryOf(p) === "中国").map((p) => (p.city || p.name || "").trim()).filter(Boolean)
  )].sort();
  const foreign = [...new Set(state.places.map(countryOf).filter((c) => c && c !== "中国"))].sort();
  const on = state.settings.territory !== false;
  const sig = (on ? "1" : "0") + "|" + chinaNames.join(",") + "|" + foreign.join(",");
  if (sig === territorySig) return;
  territorySig = sig;
  if (territoryLayer) {
    map.removeLayer(territoryLayer);
    territoryLayer = null;
  }
  if (!on) return;
  const cn = new Set(chinaNames);
  const fr = new Set(foreign);
  const feats = [];
  (window.WP_BOUNDARIES.china || []).forEach((b) => {
    if (cn.has(b.name)) feats.push({ type: "Feature", properties: { name: b.name }, geometry: b.geometry });
  });
  (window.WP_BOUNDARIES.world || []).forEach((b) => {
    if (fr.has(b.name)) feats.push({ type: "Feature", properties: { name: b.name }, geometry: b.geometry });
  });
  if (!feats.length) return;
  const accent = (getComputedStyle(document.body).getPropertyValue("--accent") || "#b56a48").trim();
  territoryLayer = L.geoJSON(
    { type: "FeatureCollection", features: feats },
    {
      interactive: false,
      style: () => ({ fillColor: accent, fillOpacity: 0.14, color: accent, weight: 0.8, opacity: 0.45 }),
    }
  ).addTo(map);
  territoryLayer.bringToBack();
}
function toggleTerritory() {
  state.settings.territory = state.settings.territory === false;
  saveSettings();
  if (el.territoryBtn) el.territoryBtn.classList.toggle("active", state.settings.territory !== false);
  refreshTerritory();
  toast(state.settings.territory !== false ? t("t_territory_on") : t("t_territory_off"), { emoji: "🗺️" });
}

/* ---------- master render ---------- */
function render(fit = false) {
  const list = filtered();
  renderChips();
  renderList(list);
  renderMarkers(list);
  renderStats();
  refreshTerritory();
  if (fit) fitTo(list);
}

/* ---------- selection ---------- */
function select(id) {
  state.activeId = id;
  const p = id && state.places.find((x) => x.id === id);
  // update card active states without full re-render
  el.list.querySelectorAll(".card").forEach((c) => c.classList.toggle("active", c.dataset.id === id));
  renderMarkers(filtered());
  renderDetail(p || null);
  if (p) {
    map.flyTo(p.coords, Math.max(map.getZoom(), 9), { duration: 1, easeLinearity: 0.25 });
  }
}

/* ---------- mutations ---------- */
function toggleVisited(id) {
  const p = state.places.find((x) => x.id === id);
  if (!p) return;
  p.status = p.status === "visited" ? "want" : "visited";
  savePlaces();
  render();
  renderDetail(p);
  toast(p.status === "visited" ? t("t_visited", { name: nameParts(p).title }) : t("t_unvisited", { name: nameParts(p).title }), { emoji: p.status === "visited" ? "🎉" : "📌" });
}
function toggleFav(id) {
  const p = state.places.find((x) => x.id === id);
  if (!p) return;
  p.fav = !p.fav;
  savePlaces();
  render();
  renderDetail(p);
  toast(p.fav ? t("t_fav", { name: nameParts(p).title }) : t("t_unfav", { name: nameParts(p).title }), { emoji: p.fav ? "⭐" : "☆" });
}
function removePlace(id) {
  const idx = state.places.findIndex((x) => x.id === id);
  if (idx < 0) return;
  const removed = state.places[idx];
  state.places.splice(idx, 1);
  if (state.activeId === id) state.activeId = null;
  savePlaces();
  renderDetail(null);
  render();
  toast(t("t_deleted", { name: nameParts(removed).title }), {
    emoji: "🗑",
    action: {
      label: t("t_undo"),
      fn: () => {
        state.places.splice(Math.min(idx, state.places.length), 0, removed);
        savePlaces();
        render();
        toast(t("t_restored", { name: nameParts(removed).title }), { emoji: "↩️" });
      },
    },
  });
}

/* ---------- editor ---------- */
let editingId = null;
function openEditor(place, coords) {
  editingId = place ? place.id : null;
  el.editorTitle.textContent = place ? t("ed_edit") : t("ed_new");
  el.editorDelete.hidden = !place;
  // category options
  const sel = $("#fCategory");
  sel.innerHTML = Object.entries(CATEGORIES)
    .map(([id, c]) => `<option value="${id}">${c.emoji} ${catLabel(id)}</option>`)
    .join("");
  const nm = place ? nmeta(place) : { en: "", local: "" };
  $("#fName").value = place ? place.name : "";
  $("#fEn").value = place ? (place.en || nm.en) : "";
  if ($("#fLocal")) $("#fLocal").value = place ? (place.local || nm.local) : "";
  $("#fCity").value = place ? place.city || "" : "";
  if ($("#fDate")) $("#fDate").value = place ? place.date || "" : "";
  $("#fCategory").value = place ? place.category : "heritage";
  $("#fStatus").value = place ? place.status : "want";
  $("#fFav").checked = place ? !!place.fav : false;
  $("#fTags").value = place ? (place.tags || []).join(", ") : "";
  $("#fNote").value = place ? place.note || "" : "";
  $("#fLat").value = place ? place.coords[0] : coords ? coords[0] : "";
  $("#fLng").value = place ? place.coords[1] : coords ? coords[1] : "";
  el.modal.hidden = false;
  setTimeout(() => $("#fName").focus(), 60);
}
function closeEditor() {
  el.modal.hidden = true;
  editingId = null;
}
function submitEditor(e) {
  e.preventDefault();
  const lat = parseFloat($("#fLat").value);
  const lng = parseFloat($("#fLng").value);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    toast("请填写有效的经纬度", { emoji: "⚠️" });
    return;
  }
  const data = {
    name: $("#fName").value.trim() || "Untitled",
    en: $("#fEn").value.trim(),
    local: $("#fLocal") ? $("#fLocal").value.trim() : "",
    city: $("#fCity").value.trim(),
    date: $("#fDate") ? $("#fDate").value : "",
    category: $("#fCategory").value,
    status: $("#fStatus").value,
    fav: $("#fFav").checked,
    coords: [round(lat), round(lng)],
    tags: $("#fTags").value.split(",").map((t) => t.trim()).filter(Boolean),
    note: $("#fNote").value.trim(),
  };
  let id;
  if (editingId) {
    const p = state.places.find((x) => x.id === editingId);
    Object.assign(p, data);
    id = editingId;
  } else {
    id = uid();
    state.places.push(Object.assign({ id }, data));
  }
  savePlaces();
  closeEditor();
  render();
  select(id);
  toast(editingId ? "已保存修改" : `已添加 ${data.name}`, { emoji: "📍" });
}

/* ---------- import / export / reset ---------- */
function exportJSON() {
  const blob = new Blob([JSON.stringify(state.places, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `waypoints-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(t("t_export", { n: state.places.length }), { emoji: "⬇️" });
}
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(reader.result);
      if (!Array.isArray(arr)) throw new Error("not array");
      if (isDetailedExport(arr)) {
        importDetailed(arr);
        return;
      }
      const byId = new Map(state.places.map((p) => [p.id, p]));
      let added = 0;
      arr.forEach((p) => {
        if (!p || !Array.isArray(p.coords)) return;
        const id = p.id || uid();
        byId.set(id, Object.assign({ status: "want", category: "other", tags: [] }, p, { id }));
        added++;
      });
      state.places = [...byId.values()];
      savePlaces();
      render(true);
      toast(t("t_import_ok", { n: added }), { emoji: "⬆️" });
    } catch (err) {
      toast(t("t_import_fail"), { emoji: "⚠️" });
    }
  };
  reader.readAsText(file);
}

/* ---------- detailed (app v2) import: detect 景点, roll the rest up to cities ---------- */
function isDetailedExport(arr) {
  const s = arr.find((x) => x && typeof x === "object");
  return !!s && s.status === undefined && (s.count !== undefined || s.feature !== undefined || s.address !== undefined);
}
function parseYearsList(list) {
  const ys = [];
  list.forEach((s) => (String(s).match(/20\d\d/g) || []).forEach((y) => ys.push(+y)));
  if (!ys.length) return "";
  const a = Math.min(...ys);
  const b = Math.max(...ys);
  return a === b ? "" + a : a + "–" + b;
}
function photoNote(count, yearsList) {
  const y = parseYearsList(yearsList);
  return count + " 张照片" + (y ? " · " + y : "");
}
function cleanCityOf(r) {
  const D = window.WP_LANDMARK_DATA;
  const loc = String(r.locality || "").trim();
  const adm = String(r.adminArea || "").trim();
  const ctry = String(r.country || "").trim();
  if (D) {
    if (D.RENAME_CITY[loc]) return D.RENAME_CITY[loc];
    if (D.RENAME_CITY[adm]) return D.RENAME_CITY[adm];
    const base = loc || adm || ctry;
    return D.RENAME_CITY[base] || base;
  }
  return loc || r.subAdminArea || adm || ctry || "";
}
// Detect a *famous* landmark from a detailed record: curated keyword first, then coord proximity.
function detectFamous(r) {
  const D = window.WP_LANDMARK_DATA;
  if (!D) return null;
  const text = String(r.feature || "") + " " + String(r.address || "");
  for (const [name, emoji, cat, kws] of D.FAMOUS) {
    for (const k of kws) if (text.includes(k)) return { name, emoji, cat, how: "famous" };
  }
  if (Array.isArray(r.coords)) {
    const la = r.coords[0], lo = r.coords[1];
    for (const [name, emoji, cat, lat, lng, rad] of D.COORD) {
      if (haversineKm(la, lo, lat, lng) <= rad) return { name, emoji, cat, how: "coord" };
    }
  }
  return null;
}
function importDetailed(records) {
  const D = window.WP_LANDMARK_DATA;
  if (!D) { toast(t("t_names_missing"), { emoji: "⚠️" }); return; }
  const block = new Set(D.BLOCK_CITY || []);
  const lms = new Map();          // displayName -> landmark group
  const cityBuckets = new Map();  // city -> aggregate of non-landmark points
  const citiesWithLm = new Set(); // cities that have >=1 famous landmark
  for (const r of records) {
    if (!Array.isArray(r.coords)) continue;
    const lat = r.coords[0];
    const lng = r.coords[1];
    const cnt = r.count || 1;
    const city = cleanCityOf(r);
    let d = detectFamous(r);
    // drop cross-city keyword false positives (e.g. a "栈桥" that isn't in 青岛)
    if (d) {
      const allow = D.NAME_CITY[d.name];
      if (allow && !allow.some((x) => city.includes(x))) d = null;
    }
    if (d) {
      const disp = D.RENAME_LANDMARK[d.name + "\u0000" + city] || d.name;
      const g = lms.get(disp) || { name: disp, emoji: d.emoji, coords: [lat, lng], best: -1, count: 0, years: [], country: r.country || "", city: city || "", cover: "", alt: null, dates: [] };
      g.count += cnt;
      if (cnt >= g.best) { g.best = cnt; g.coords = [lat, lng]; if (r.cover) g.cover = r.cover; if (r.alt != null) g.alt = r.alt; }
      if (r.years) g.years.push(r.years);
      if (Array.isArray(r.dates)) g.dates.push(...r.dates);
      if (!g.country && r.country) g.country = r.country;
      if (!g.city && city) g.city = city;
      lms.set(disp, g);
      if (city && !block.has(city)) citiesWithLm.add(city);
    } else {
      if (!city || block.has(city)) continue;
      const b = cityBuckets.get(city) || { count: 0, years: [], best: [-1, [lat, lng]], country: r.country || "", cover: "", alt: null, dates: [] };
      b.count += cnt;
      if (r.years) b.years.push(r.years);
      if (cnt >= b.best[0]) { b.best = [cnt, [lat, lng]]; if (r.cover) b.cover = r.cover; if (r.alt != null) b.alt = r.alt; }
      if (Array.isArray(r.dates)) b.dates.push(...r.dates);
      if (!b.country && r.country) b.country = r.country;
      cityBuckets.set(city, b);
    }
  }
  const landmarks = [...lms.values()].map((g) => {
    const o = {
      id: "lm_" + slug(g.name), name: g.name, en: "", city: g.city || g.name, category: "landmark", status: "visited", fav: true,
      coords: g.coords, tags: ["景点"].concat(g.country ? [g.country] : []), note: photoNote(g.count, g.years), emoji: g.emoji,
      dates: [...new Set(g.dates)].sort(),
    };
    if (g.alt != null) o.alt = Math.round(g.alt);
    if (g.cover) o.cover = g.cover;
    return o;
  });
  const cityPlaces = [...cityBuckets.entries()]
    .filter(([city]) => !citiesWithLm.has(city))
    .map(([city, b]) => {
      const o = {
        id: "city_" + slug(city), name: city, en: "", city, category: "other", status: "visited", fav: false,
        coords: b.best[1], tags: b.country ? [b.country] : [], note: photoNote(b.count, b.years),
        dates: [...new Set(b.dates)].sort(),
      };
      if (b.alt != null) o.alt = Math.round(b.alt);
      if (b.cover) o.cover = b.cover;
      return o;
    });
  const cnt = (p) => +(String(p.note).match(/(\d+)/) || [0, 0])[1];
  landmarks.sort((a, b) => cnt(b) - cnt(a));
  cityPlaces.sort((a, b) => cnt(b) - cnt(a));
  state.places = [...landmarks, ...cityPlaces];
  state.activeId = null;
  savePlaces();
  renderDetail(null);
  render(true);
  toast(t("t_import_detailed", { a: landmarks.length, b: cityPlaces.length }), { emoji: "⭐" });
}

function resetData() {
  toast(t("t_reset_confirm"), {
    emoji: "⚠️",
    action: {
      label: t("t_reset_do"),
      fn: () => {
        state.places = clone(SEED_PLACES);
        state.activeId = null;
        savePlaces();
        renderDetail(null);
        render(true);
        toast(t("t_reset_done"), { emoji: "🌱" });
      },
    },
  });
}

/* ---------- theme ---------- */
function applyTheme() {
  document.body.dataset.theme = state.settings.theme;
}
function cycleTheme() {
  const i = THEMES.indexOf(state.settings.theme);
  state.settings.theme = THEMES[(i + 1) % THEMES.length];
  saveSettings();
  applyTheme();
  toast(t("t_theme", { n: state.settings.theme }), { emoji: "🎨" });
}

/* ---------- events ---------- */
function wire() {
  el.chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.category = b.dataset.cat;
    render(true);
  });
  el.statusSeg.addEventListener("click", (e) => {
    const b = e.target.closest(".seg");
    if (!b) return;
    el.statusSeg.querySelectorAll(".seg").forEach((x) => x.classList.toggle("active", x === b));
    state.status = b.dataset.status;
    render(true);
  });
  let searchTimer;
  el.search.addEventListener("input", (e) => {
    state.search = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => render(true), 180);
  });

  el.list.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) select(card.dataset.id);
  });
  el.list.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".card");
    if (card) hoverMarker(card.dataset.id, true);
  });
  el.list.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".card");
    if (card) hoverMarker(card.dataset.id, false);
  });

  el.styleBtn.onclick = cycleMapStyle;
  $("#surpriseBtn").onclick = surprise;
  $("#locateBtn").onclick = () => fitTo(filtered());
  if (el.territoryBtn) el.territoryBtn.onclick = toggleTerritory;
  $("#themeToggle").onclick = cycleTheme;
  $("#langToggle").onclick = cycleLang;

  el.editor.addEventListener("submit", submitEditor);
  $("#editorCancel").onclick = closeEditor;
  $("#editorClose").onclick = closeEditor;
  el.editorDelete.onclick = () => {
    if (editingId) {
      const id = editingId;
      closeEditor();
      removePlace(id);
    }
  };
  el.modal.addEventListener("click", (e) => {
    if (e.target === el.modal) closeEditor();
  });

  document.addEventListener("keydown", onKey);
}

function surprise() {
  const list = filtered();
  if (!list.length) return;
  const p = list[Math.floor(Math.random() * list.length)];
  select(p.id);
  toast(t("t_take", { name: nameParts(p).title }), { emoji: "🎲" });
}

function onKey(e) {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if (e.key === "Escape") {
    if (!el.modal.hidden) closeEditor();
    else if (state.activeId) select(null);
    return;
  }
  if (typing) return;
  if (e.key === "/") {
    e.preventDefault();
    el.search.focus();
  } else if (e.key.toLowerCase() === "r") {
    surprise();
  } else if (e.key.toLowerCase() === "m") {
    cycleMapStyle();
  } else if (e.key.toLowerCase() === "t") {
    cycleTheme();
  } else if (e.key.toLowerCase() === "b") {
    toggleTerritory();
  } else if (e.key.toLowerCase() === "l") {
    cycleLang();
  }
}

/* ---------- collapsible panels & mobile bottom-sheets ---------- */
function setupPanels() {
  const rail = el.rail;
  const handle = $("#railHandle");
  const collapseBtn = $("#railCollapse");
  const reopenBtn = $("#railReopen");
  if (!rail) return;

  /* desktop: slide-away collapse */
  const setCollapsed = (on) => {
    rail.classList.toggle("collapsed", on);
    if (reopenBtn) reopenBtn.hidden = !on;
  };
  if (collapseBtn) collapseBtn.onclick = () => setCollapsed(true);
  if (reopenBtn) reopenBtn.onclick = () => setCollapsed(false);

  /* mobile: draggable bottom sheet with snap points */
  let snap = "half";
  const target = (s) => {
    const h = rail.offsetHeight || window.innerHeight * 0.86;
    if (s === "full") return 0;
    if (s === "min") return Math.max(0, h - 78);
    return Math.max(0, h - window.innerHeight * 0.46);
  };
  const place = (s, animate = true) => {
    snap = s;
    if (!animate) rail.style.transition = "none";
    rail.style.transform = `translateY(${target(s)}px)`;
    if (!animate) requestAnimationFrame(() => (rail.style.transition = ""));
  };
  minimizeRail = () => {
    if (isMobile()) place("min");
  };
  const curOff = () => {
    const m = /translateY\(([-\d.]+)px\)/.exec(rail.style.transform);
    return m ? parseFloat(m[1]) : target(snap);
  };

  let drag = false, startY = 0, startOff = 0, moved = 0;
  if (handle) {
    handle.addEventListener("pointerdown", (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      drag = true; startY = e.clientY; startOff = curOff(); moved = 0;
      document.body.classList.add("sheet-dragging");
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    });
    handle.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dy = e.clientY - startY;
      moved = Math.max(moved, Math.abs(dy));
      const off = Math.min(Math.max(0, startOff + dy), rail.offsetHeight - 78);
      rail.style.transform = `translateY(${off}px)`;
    });
    const end = () => {
      if (!drag) return;
      drag = false;
      document.body.classList.remove("sheet-dragging");
      if (moved < 6) { place(snap === "min" ? "half" : "min"); return; }
      const here = curOff();
      const opts = [["full", target("full")], ["half", target("half")], ["min", target("min")]];
      opts.sort((a, b) => Math.abs(a[1] - here) - Math.abs(b[1] - here));
      place(opts[0][0]);
    };
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  }

  /* mobile: detail sheet — drag down to dismiss */
  let dDrag = false, dStart = 0, dMoved = 0;
  el.detail.addEventListener("pointerdown", (e) => {
    if (!isMobile()) return;
    const fromHandle = e.target.closest(".sheet-handle");
    if (!fromHandle && !e.target.closest(".detail-hero")) return;
    if (!fromHandle && e.target.closest("button")) return;
    dDrag = true; dStart = e.clientY; dMoved = 0;
    el.detail.style.transition = "none";
    document.body.classList.add("sheet-dragging");
    try { el.detail.setPointerCapture(e.pointerId); } catch (_) {}
  });
  el.detail.addEventListener("pointermove", (e) => {
    if (!dDrag) return;
    dMoved = Math.max(0, e.clientY - dStart);
    el.detail.style.transform = `translateY(${dMoved}px)`;
  });
  const endDetail = () => {
    if (!dDrag) return;
    dDrag = false;
    document.body.classList.remove("sheet-dragging");
    el.detail.style.transition = "";
    if (dMoved > 120) { el.detail.style.transform = ""; select(null); }
    else el.detail.style.transform = "translateY(0)";
  };
  el.detail.addEventListener("pointerup", endDetail);
  el.detail.addEventListener("pointercancel", endDetail);

  /* keep positions sane across breakpoint / rotation */
  const sync = () => {
    if (isMobile()) {
      rail.classList.remove("collapsed");
      if (reopenBtn) reopenBtn.hidden = true;
      place(snap, false);
    } else {
      rail.style.transform = "";
      rail.style.transition = "";
      el.detail.style.transform = "";
    }
  };
  try { mqMobile.addEventListener("change", sync); } catch (_) { mqMobile.addListener(sync); }
  window.addEventListener("resize", () => { if (isMobile()) place(snap, false); });
  if (isMobile()) place("half", false);
}

/* ---------- boot ---------- */
function boot() {
  applyTheme();
  if (window.L) {
    initMap();
  } else {
    toast(t("t_map_missing"), { emoji: "📡" });
  }
  wire();
  setupPanels();
  applyLang();
  render(true);
  if (el.territoryBtn) el.territoryBtn.classList.toggle("active", state.settings.territory !== false);
}
boot();
