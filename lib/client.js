window.__ModuleLoader__.load({
	id: "@dsh-external/dsh-raiden-theme",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		//#region src/state/adapter.ts
		const SUCCESS_HOLD_MS = 1200;
		const ERROR_HOLD_MS = 1600;
		let lastState = "idle";
		let lastChangeAt = 0;
		let successTimer;
		let errorTimer;
		function resetStateAdapter() {
			lastState = "idle";
			lastChangeAt = 0;
			if (successTimer) clearTimeout(successTimer);
			if (errorTimer) clearTimeout(errorTimer);
			successTimer = void 0;
			errorTimer = void 0;
		}
		function scheduleFlash(next, holdMs, onState) {
			const timerRef = next === "success" ? "successTimer" : "errorTimer";
			const existing = next === "success" ? successTimer : errorTimer;
			if (existing) clearTimeout(existing);
			onState(next);
			const timer = setTimeout(() => onState("idle"), holdMs);
			if (timerRef === "successTimer") successTimer = timer;
			else errorTimer = timer;
		}
		function mapDomSignals(signals, onState) {
			if (signals.success) {
				scheduleFlash("success", SUCCESS_HOLD_MS, onState);
				lastState = "success";
				return lastState;
			}
			if (signals.error) {
				scheduleFlash("error", ERROR_HOLD_MS, onState);
				lastState = "error";
				return lastState;
			}
			let next = "idle";
			if (!signals.activeConversation) next = "idle";
			else if (signals.streaming) next = "streaming";
			else if (signals.hasToolCall) next = "tool-calling";
			else if (signals.composerPhase === "thinking" || signals.composerPhase === "reasoning") next = "thinking";
			else next = "idle";
			const now = Date.now();
			if (next !== lastState && now - lastChangeAt > 80) {
				lastState = next;
				lastChangeAt = now;
				onState(next);
			}
			return lastState;
		}
		//#endregion
		//#region src/assets/validate.ts
		const COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))$/;
		function isSafeCssColor(value) {
			const trimmed = value.trim();
			if (!trimmed || trimmed.length > 64) return false;
			if (/[;{}]/.test(trimmed)) return false;
			return COLOR_RE.test(trimmed);
		}
		function sanitizeColorField(value) {
			if (typeof value !== "string") return void 0;
			return isSafeCssColor(value) ? value.trim() : void 0;
		}
		function isAllowedImageProtocol(url) {
			if (url.startsWith("data:image/")) return true;
			if (url.startsWith("blob:")) return true;
			if (url.startsWith("/plugins/")) return true;
			if (/^https?:\/\/127\.0\.0\.1(?::\d+)?\//.test(url)) return true;
			if (/^https?:\/\/localhost(?::\d+)?\//.test(url)) return true;
			return false;
		}
		//#endregion
		//#region src/client/inline-restore.ts
		function snapshotInlineStyles(element, keys) {
			return keys.map((key) => ({
				key,
				value: element.style.getPropertyValue(key),
				priority: element.style.getPropertyPriority(key)
			}));
		}
		function restoreInlineStyles(element, snapshot) {
			for (const entry of snapshot) if (entry.value === "") element.style.removeProperty(entry.key);
			else element.style.setProperty(entry.key, entry.value, entry.priority);
		}
		//#endregion
		//#region src/theme/user-theme.ts
		const PRESETS = {
			"raiden-violet": {
				primary: "#a78bfa",
				secondary: "#493b50",
				accent: "#e7b957",
				background: "#fff7f1",
				surface: "#fffdfb",
				text: "#141018",
				success: "#e7b957",
				warning: "#e7b957",
				error: "#c43c3c"
			},
			"raiden-night": {
				primary: "#c4b5fd",
				secondary: "#bfaeeb",
				accent: "#e7be62",
				background: "#211b32",
				surface: "#2a2340",
				text: "#fff3e8",
				success: "#e7be62",
				warning: "#e7be62",
				error: "#c43c3c"
			},
			"raiden-sakura": {
				primary: "#a78bfa",
				secondary: "#91d5e8",
				accent: "#e7b957",
				background: "#f6fbfc",
				surface: "#ffffff",
				text: "#141018",
				success: "#e7b957",
				warning: "#e7b957",
				error: "#c43c3c"
			}
		};
		const TAFFY_TOKEN_KEYS = [
			"--ds-raiden-pink",
			"--ds-raiden-charcoal",
			"--ds-raiden-gold",
			"--ds-raiden-ribbon",
			"--ds-raiden-text",
			"--raiden-pink",
			"--raiden-gold"
		];
		function resolveThemeTokens(colors) {
			const base = colors.preset === "custom" ? PRESETS["raiden-violet"] : PRESETS[colors.preset];
			return {
				primary: sanitizeColorField(colors.primary) ?? base.primary,
				secondary: sanitizeColorField(colors.secondary) ?? base.secondary,
				accent: sanitizeColorField(colors.accent) ?? base.accent,
				background: sanitizeColorField(colors.background) ?? base.background,
				surface: sanitizeColorField(colors.surface) ?? base.surface,
				text: sanitizeColorField(colors.text) ?? base.text,
				success: sanitizeColorField(colors.success) ?? base.success,
				warning: sanitizeColorField(colors.warning) ?? base.warning,
				error: sanitizeColorField(colors.error) ?? base.error
			};
		}
		function snapshotThemeTokens(root) {
			return snapshotInlineStyles(root, TAFFY_TOKEN_KEYS);
		}
		function applyThemeTokens(root, tokens, options) {
			root.style.setProperty("--ds-raiden-pink", tokens.primary);
			root.style.setProperty("--ds-raiden-charcoal", tokens.secondary);
			root.style.setProperty("--ds-raiden-gold", tokens.accent);
			root.style.setProperty("--ds-raiden-ribbon", tokens.error);
			root.style.setProperty("--raiden-pink", tokens.primary);
			root.style.setProperty("--raiden-gold", tokens.accent);
			if (options?.pinText) root.style.setProperty("--ds-raiden-text", tokens.text);
			else root.style.removeProperty("--ds-raiden-text");
		}
		function restoreThemeTokens(root, snapshot) {
			restoreInlineStyles(root, snapshot);
		}
		//#endregion
		//#region src/theme/time-theme.ts
		const PHASE_BOUNDARIES = [
			6,
			12,
			18,
			22
		];
		function resolveTimePhase(date = /* @__PURE__ */ new Date()) {
			const hour = date.getHours();
			if (hour >= 6 && hour < 12) return "morning";
			if (hour >= 12 && hour < 18) return "afternoon";
			if (hour >= 18 && hour < 22) return "evening";
			return "night";
		}
		function msUntilNextPhaseBoundary(date = /* @__PURE__ */ new Date()) {
			const hour = date.getHours();
			const nextBoundary = PHASE_BOUNDARIES.find((boundary) => boundary > hour);
			const next = new Date(date);
			if (nextBoundary === void 0) {
				next.setDate(next.getDate() + 1);
				next.setHours(PHASE_BOUNDARIES[0], 0, 0, 0);
			} else next.setHours(nextBoundary, 0, 0, 0);
			return Math.max(1e3, next.getTime() - date.getTime());
		}
		function startTimePhaseTicker(onPhase) {
			let lastPhase = resolveTimePhase();
			let timer = 0;
			onPhase(lastPhase);
			const tick = () => {
				const phase = resolveTimePhase();
				if (phase !== lastPhase) {
					lastPhase = phase;
					onPhase(phase);
				}
				timer = window.setTimeout(tick, msUntilNextPhaseBoundary());
			};
			timer = window.setTimeout(tick, msUntilNextPhaseBoundary());
			return () => window.clearTimeout(timer);
		}
		//#endregion
		//#region node_modules/cosmokit/lib/index.cjs
		var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
			var __defProp = Object.defineProperty;
			var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
			var __getOwnPropNames = Object.getOwnPropertyNames;
			var __hasOwnProp = Object.prototype.hasOwnProperty;
			var __export = (target, all) => {
				for (var name in all) __defProp(target, name, {
					get: all[name],
					enumerable: true
				});
			};
			var __copyProps = (to, from, except, desc) => {
				if (from && typeof from === "object" || typeof from === "function") {
					for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
						get: () => from[key],
						enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
					});
				}
				return to;
			};
			var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
			var index_exports = {};
			__export(index_exports, {
				Binary: () => Binary,
				Time: () => Time,
				arrayBufferToBase64: () => arrayBufferToBase64,
				arrayBufferToHex: () => arrayBufferToHex,
				base64ToArrayBuffer: () => base64ToArrayBuffer,
				camelCase: () => camelCase,
				camelize: () => camelize,
				capitalize: () => capitalize,
				clone: () => clone,
				contain: () => contain,
				deduplicate: () => deduplicate,
				deepEqual: () => deepEqual,
				defineProperty: () => defineProperty,
				difference: () => difference,
				filterKeys: () => filterKeys,
				formatProperty: () => formatProperty,
				hexToArrayBuffer: () => hexToArrayBuffer,
				hyphenate: () => hyphenate,
				intersection: () => intersection,
				is: () => is,
				isNonNullable: () => isNonNullable,
				isNullable: () => isNullable,
				isPlainObject: () => isPlainObject,
				makeArray: () => makeArray,
				mapValues: () => mapValues,
				noop: () => noop,
				omit: () => omit,
				paramCase: () => paramCase,
				pick: () => pick,
				remove: () => remove,
				sanitize: () => sanitize,
				snakeCase: () => snakeCase,
				trimSlash: () => trimSlash,
				uncapitalize: () => uncapitalize,
				union: () => union,
				valueMap: () => mapValues
			});
			module.exports = __toCommonJS(index_exports);
			function noop() {}
			function isNullable(value) {
				return value === null || value === void 0;
			}
			function isNonNullable(value) {
				return !isNullable(value);
			}
			function isPlainObject(data) {
				return data && typeof data === "object" && !Array.isArray(data);
			}
			function filterKeys(object, filter) {
				return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
			}
			function mapValues(object, transform) {
				return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
			}
			function pick(source, keys, forced) {
				if (!keys) return { ...source };
				const result = {};
				for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
				return result;
			}
			function omit(source, keys) {
				if (!keys) return { ...source };
				const result = { ...source };
				for (const key of keys) Reflect.deleteProperty(result, key);
				return result;
			}
			function defineProperty(object, key, value) {
				return Object.defineProperty(object, key, {
					writable: true,
					value,
					enumerable: false
				});
			}
			function contain(array1, array2) {
				return array2.every((item) => array1.includes(item));
			}
			function intersection(array1, array2) {
				return array1.filter((item) => array2.includes(item));
			}
			function difference(array1, array2) {
				return array1.filter((item) => !array2.includes(item));
			}
			function union(array1, array2) {
				return Array.from(/* @__PURE__ */ new Set([...array1, ...array2]));
			}
			function deduplicate(array) {
				return [...new Set(array)];
			}
			function remove(list, item) {
				const index = list?.indexOf(item);
				if (index >= 0) {
					list.splice(index, 1);
					return true;
				} else return false;
			}
			function makeArray(source) {
				return Array.isArray(source) ? source : isNullable(source) ? [] : [source];
			}
			function is(type, value) {
				if (arguments.length === 1) return (value2) => is(type, value2);
				return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
			}
			function isArrayBufferLike(value) {
				return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
			}
			function isArrayBufferSource(value) {
				return isArrayBufferLike(value) || ArrayBuffer.isView(value);
			}
			var Binary;
			((Binary2) => {
				Binary2.is = isArrayBufferLike;
				Binary2.isSource = isArrayBufferSource;
				function fromSource(source) {
					if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
					else return source;
				}
				Binary2.fromSource = fromSource;
				function toBase64(source) {
					source = fromSource(source);
					if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
					let binary = "";
					const bytes = new Uint8Array(source);
					for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
					return btoa(binary);
				}
				Binary2.toBase64 = toBase64;
				function fromBase64(source) {
					if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
					return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
				}
				Binary2.fromBase64 = fromBase64;
				function toHex(source) {
					source = fromSource(source);
					if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
					return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
				}
				Binary2.toHex = toHex;
				function fromHex(source) {
					if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
					const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
					const buffer = [];
					for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
					return Uint8Array.from(buffer).buffer;
				}
				Binary2.fromHex = fromHex;
			})(Binary || (Binary = {}));
			var base64ToArrayBuffer = Binary.fromBase64;
			var arrayBufferToBase64 = Binary.toBase64;
			var hexToArrayBuffer = Binary.fromHex;
			var arrayBufferToHex = Binary.toHex;
			function clone(source, refs = /* @__PURE__ */ new Map()) {
				if (!source || typeof source !== "object") return source;
				if (is("Date", source)) return new Date(source.valueOf());
				if (is("RegExp", source)) return new RegExp(source.source, source.flags);
				if (isArrayBufferLike(source)) return source.slice(0);
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				const cached = refs.get(source);
				if (cached) return cached;
				if (Array.isArray(source)) {
					const result2 = [];
					refs.set(source, result2);
					source.forEach((value, index) => {
						result2[index] = Reflect.apply(clone, null, [value, refs]);
					});
					return result2;
				}
				const result = Object.create(Object.getPrototypeOf(source));
				refs.set(source, result);
				for (const key of Reflect.ownKeys(source)) {
					const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
					if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
					Reflect.defineProperty(result, key, descriptor);
				}
				return result;
			}
			function deepEqual(a, b, strict) {
				if (a === b) return true;
				if (!strict && isNullable(a) && isNullable(b)) return true;
				if (typeof a !== typeof b) return false;
				if (typeof a !== "object") return false;
				if (!a || !b) return false;
				function check(test, then) {
					return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
				}
				return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check(isArrayBufferLike, (a2, b2) => {
					if (a2.byteLength !== b2.byteLength) return false;
					const viewA = new Uint8Array(a2);
					const viewB = new Uint8Array(b2);
					for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
					return true;
				}) ?? Object.keys({
					...a,
					...b
				}).every((key) => deepEqual(a[key], b[key], strict));
			}
			function capitalize(source) {
				return source.charAt(0).toUpperCase() + source.slice(1);
			}
			function uncapitalize(source) {
				return source.charAt(0).toLowerCase() + source.slice(1);
			}
			function camelCase(source) {
				return source.replace(/[_-][a-z]/g, (str) => str.slice(1).toUpperCase());
			}
			function tokenize(source, delimiters, delimiter) {
				const output = [];
				let state = 0;
				for (let i = 0; i < source.length; i++) {
					const code = source.charCodeAt(i);
					if (code >= 65 && code <= 90) {
						if (state === 1) {
							const next = source.charCodeAt(i + 1);
							if (next >= 97 && next <= 122) output.push(delimiter);
							output.push(code + 32);
						} else {
							if (state !== 0) output.push(delimiter);
							output.push(code + 32);
						}
						state = 1;
					} else if (code >= 97 && code <= 122) {
						output.push(code);
						state = 2;
					} else if (delimiters.includes(code)) {
						if (state !== 0) output.push(delimiter);
						state = 0;
					} else output.push(code);
				}
				return String.fromCharCode(...output);
			}
			function paramCase(source) {
				return tokenize(source, [45, 95], 45);
			}
			function snakeCase(source) {
				return tokenize(source, [45, 95], 95);
			}
			var camelize = camelCase;
			var hyphenate = paramCase;
			function formatProperty(key) {
				if (typeof key !== "string") return `[${key.toString()}]`;
				return /^[a-z_$][\w$]*$/i.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
			}
			function trimSlash(source) {
				return source.replace(/\/$/, "");
			}
			function sanitize(source) {
				if (!source.startsWith("/")) source = "/" + source;
				return trimSlash(source);
			}
			var Time;
			((Time2) => {
				Time2.millisecond = 1;
				Time2.second = 1e3;
				Time2.minute = Time2.second * 60;
				Time2.hour = Time2.minute * 60;
				Time2.day = Time2.hour * 24;
				Time2.week = Time2.day * 7;
				let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
				function setTimezoneOffset(offset) {
					timezoneOffset = offset;
				}
				Time2.setTimezoneOffset = setTimezoneOffset;
				function getTimezoneOffset() {
					return timezoneOffset;
				}
				Time2.getTimezoneOffset = getTimezoneOffset;
				function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
					if (typeof date === "number") date = new Date(date);
					if (offset === void 0) offset = timezoneOffset;
					return Math.floor((date.valueOf() / Time2.minute - offset) / 1440);
				}
				Time2.getDateNumber = getDateNumber;
				function fromDateNumber(value, offset) {
					const date = new Date(value * Time2.day);
					if (offset === void 0) offset = timezoneOffset;
					return new Date(+date + offset * Time2.minute);
				}
				Time2.fromDateNumber = fromDateNumber;
				const numeric = /\d+(?:\.\d+)?/.source;
				const timeRegExp = new RegExp(`^${[
					"w(?:eek(?:s)?)?",
					"d(?:ay(?:s)?)?",
					"h(?:our(?:s)?)?",
					"m(?:in(?:ute)?(?:s)?)?",
					"s(?:ec(?:ond)?(?:s)?)?"
				].map((unit) => `(${numeric}${unit})?`).join("")}$`);
				function parseTime(source) {
					const capture = timeRegExp.exec(source);
					if (!capture) return 0;
					return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
				}
				Time2.parseTime = parseTime;
				function parseDate(date) {
					const parsed = parseTime(date);
					if (parsed) date = Date.now() + parsed;
					else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
					else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
					return date ? new Date(date) : /* @__PURE__ */ new Date();
				}
				Time2.parseDate = parseDate;
				function format(ms) {
					const abs = Math.abs(ms);
					if (abs >= Time2.day - Time2.hour / 2) return Math.round(ms / Time2.day) + "d";
					else if (abs >= Time2.hour - Time2.minute / 2) return Math.round(ms / Time2.hour) + "h";
					else if (abs >= Time2.minute - Time2.second / 2) return Math.round(ms / Time2.minute) + "m";
					else if (abs >= Time2.second) return Math.round(ms / Time2.second) + "s";
					return ms + "ms";
				}
				Time2.format = format;
				function toDigits(source, length = 2) {
					return source.toString().padStart(length, "0");
				}
				Time2.toDigits = toDigits;
				function template(template2, time = /* @__PURE__ */ new Date()) {
					return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
				}
				Time2.template = template;
			})(Time || (Time = {}));
			0 && (module.exports = {
				Binary,
				Time,
				arrayBufferToBase64,
				arrayBufferToHex,
				base64ToArrayBuffer,
				camelCase,
				camelize,
				capitalize,
				clone,
				contain,
				deduplicate,
				deepEqual,
				defineProperty,
				difference,
				filterKeys,
				formatProperty,
				hexToArrayBuffer,
				hyphenate,
				intersection,
				is,
				isNonNullable,
				isNullable,
				isPlainObject,
				makeArray,
				mapValues,
				noop,
				omit,
				paramCase,
				pick,
				remove,
				sanitize,
				snakeCase,
				trimSlash,
				uncapitalize,
				union,
				valueMap
			});
		}));
		//#endregion
		//#region src/config.ts
		var import_lib = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
			var __defProp = Object.defineProperty;
			var __name = (target, value) => __defProp(target, "name", {
				value,
				configurable: true
			});
			var import_cosmokit = require_lib$1();
			var kSchema = Symbol.for("schemastery");
			var kValidationError = Symbol.for("ValidationError");
			globalThis.__schemastery_index__ ??= 0;
			globalThis.__schemastery_refs__ = void 0;
			var ValidationError = class extends TypeError {
				constructor(message, options) {
					let prefix = "$";
					for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
					else if (typeof segment === "number") prefix += "[" + segment + "]";
					else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
					if (prefix.startsWith(".")) prefix = prefix.slice(1);
					super((prefix === "$" ? "" : `${prefix} `) + message);
					this.options = options;
				}
				static {
					__name(this, "ValidationError");
				}
				name = "ValidationError";
				static is(error) {
					return !!error?.[kValidationError];
				}
			};
			Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
			var Schema = /* @__PURE__ */ __name(function(options) {
				const schema = /* @__PURE__ */ __name(function(data, options2 = {}) {
					return Schema.resolve(data, schema, options2)[0];
				}, "schema");
				if (options.refs) {
					const refs = (0, import_cosmokit.valueMap)(options.refs, (options2) => new Schema(options2));
					const getRef = /* @__PURE__ */ __name((uid) => refs[uid], "getRef");
					for (const key in refs) {
						const options2 = refs[key];
						options2.sKey = getRef(options2.sKey);
						options2.inner = getRef(options2.inner);
						options2.list = options2.list && options2.list.map(getRef);
						options2.dict = options2.dict && (0, import_cosmokit.valueMap)(options2.dict, getRef);
					}
					return refs[options.uid];
				}
				Object.assign(schema, options);
				if (typeof schema.callback === "string") try {
					schema.callback = new Function("return " + schema.callback)();
				} catch {}
				Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
				Object.setPrototypeOf(schema, Schema.prototype);
				schema.meta ||= {};
				schema.toString = schema.toString.bind(schema);
				return schema;
			}, "Schema");
			Schema.prototype = Object.create(Function.prototype);
			Schema.prototype[kSchema] = true;
			Object.defineProperty(Schema.prototype, "~standard", { get() {
				return {
					version: 1,
					vendor: "schemastery",
					validate: /* @__PURE__ */ __name((value) => {
						try {
							return { value: Schema.resolve(value, this, {})[0] };
						} catch (error) {
							if (ValidationError.is(error)) return { issues: [{
								message: error.message,
								path: error.options.path
							}] };
							throw error;
						}
					}, "validate")
				};
			} });
			Schema.ValidationError = ValidationError;
			Schema.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
				if (globalThis.__schemastery_refs__) {
					globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
					return this.uid;
				}
				globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
				globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
				const result = {
					uid: this.uid,
					refs: globalThis.__schemastery_refs__
				};
				globalThis.__schemastery_refs__ = void 0;
				return result;
			}, "toJSON");
			Schema.prototype.set = /* @__PURE__ */ __name(function set(key, value) {
				this.dict[key] = value;
				return this;
			}, "set");
			Schema.prototype.push = /* @__PURE__ */ __name(function push(value) {
				this.list.push(value);
				return this;
			}, "push");
			function mergeDesc(original, messages) {
				const result = typeof original === "string" ? { "": original } : { ...original };
				for (const locale in messages) {
					const value = messages[locale];
					if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
					else if (typeof value === "string") result[locale] = value;
				}
				return result;
			}
			__name(mergeDesc, "mergeDesc");
			function getInner(value) {
				return value?.$value ?? value?.$inner;
			}
			__name(getInner, "getInner");
			function extractKeys(data) {
				return (0, import_cosmokit.filterKeys)(data ?? {}, (key) => !key.startsWith("$"));
			}
			__name(extractKeys, "extractKeys");
			Schema.prototype.i18n = /* @__PURE__ */ __name(function i18n(messages) {
				const schema = Schema(this);
				const desc = mergeDesc(schema.meta.description, messages);
				if (Object.keys(desc).length) schema.meta.description = desc;
				if (schema.dict) schema.dict = (0, import_cosmokit.valueMap)(schema.dict, (inner, key) => {
					return inner.i18n((0, import_cosmokit.valueMap)(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
				});
				if (schema.list) schema.list = schema.list.map((inner, index) => {
					return inner.i18n((0, import_cosmokit.valueMap)(messages, (data = {}) => {
						if (Array.isArray(getInner(data))) return getInner(data)[index];
						if (Array.isArray(data)) return data[index];
						return extractKeys(data);
					}));
				});
				if (schema.inner) schema.inner = schema.inner.i18n((0, import_cosmokit.valueMap)(messages, (data) => {
					if (getInner(data)) return getInner(data);
					return extractKeys(data);
				}));
				if (schema.sKey) schema.sKey = schema.sKey.i18n((0, import_cosmokit.valueMap)(messages, (data) => data?.$key));
				return schema;
			}, "i18n");
			Schema.prototype.extra = /* @__PURE__ */ __name(function extra(key, value) {
				const schema = Schema(this);
				schema.meta = {
					...schema.meta,
					[key]: value
				};
				return schema;
			}, "extra");
			for (const key of [
				"required",
				"disabled",
				"collapse",
				"hidden",
				"loose"
			]) Object.assign(Schema.prototype, { [key](value = true) {
				const schema = Schema(this);
				schema.meta = {
					...schema.meta,
					[key]: value
				};
				return schema;
			} });
			Schema.prototype.deprecated = /* @__PURE__ */ __name(function deprecated() {
				const schema = Schema(this);
				schema.meta.badges ||= [];
				schema.meta.badges.push({
					text: "deprecated",
					type: "danger"
				});
				return schema;
			}, "deprecated");
			Schema.prototype.experimental = /* @__PURE__ */ __name(function experimental() {
				const schema = Schema(this);
				schema.meta.badges ||= [];
				schema.meta.badges.push({
					text: "experimental",
					type: "warning"
				});
				return schema;
			}, "experimental");
			Schema.prototype.pattern = /* @__PURE__ */ __name(function pattern(regexp) {
				const schema = Schema(this);
				const pattern2 = (0, import_cosmokit.pick)(regexp, ["source", "flags"]);
				schema.meta = {
					...schema.meta,
					pattern: pattern2
				};
				return schema;
			}, "pattern");
			Schema.prototype.simplify = /* @__PURE__ */ __name(function simplify(value) {
				if ((0, import_cosmokit.deepEqual)(value, this.meta.default, this.type === "dict")) return null;
				if ((0, import_cosmokit.isNullable)(value)) return value;
				if (this.type === "object" || this.type === "dict") {
					const result = {};
					for (const key in value) {
						const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
						if (this.type === "dict" || !(0, import_cosmokit.isNullable)(item)) result[key] = item;
					}
					if ((0, import_cosmokit.deepEqual)(result, this.meta.default, this.type === "dict")) return null;
					return result;
				} else if (this.type === "array" || this.type === "tuple") {
					const result = [];
					value.forEach((value2, index) => {
						const schema = this.type === "array" ? this.inner : this.list[index];
						const item = schema ? schema.simplify(value2) : value2;
						result.push(item);
					});
					return result;
				} else if (this.type === "intersect") {
					const result = {};
					for (const item of this.list) Object.assign(result, item.simplify(value));
					return result;
				} else if (this.type === "union") for (const schema of this.list) try {
					Schema.resolve(value, schema, {});
					return schema.simplify(value);
				} catch {}
				return value;
			}, "simplify");
			Schema.prototype.toString = /* @__PURE__ */ __name(function toString(inline) {
				return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
			}, "toString");
			Schema.prototype.role = /* @__PURE__ */ __name(function role(role, extra2) {
				const schema = Schema(this);
				schema.meta = {
					...schema.meta,
					role,
					extra: extra2
				};
				return schema;
			}, "role");
			for (const key of [
				"default",
				"link",
				"comment",
				"description",
				"max",
				"min",
				"step"
			]) Object.assign(Schema.prototype, { [key](value) {
				const schema = Schema(this);
				schema.meta = {
					...schema.meta,
					[key]: value
				};
				return schema;
			} });
			var resolvers = {};
			Schema.extend = /* @__PURE__ */ __name(function extend(type, resolve2) {
				resolvers[type] = resolve2;
			}, "extend");
			Schema.resolve = /* @__PURE__ */ __name(function resolve(data, schema, options = {}, strict = false) {
				if (!schema) return [data];
				if (options.ignore?.(data, schema)) return [data];
				if ((0, import_cosmokit.isNullable)(data) && schema.type !== "lazy") {
					if (schema.meta.required) throw new ValidationError(`missing required value`, options);
					let current = schema;
					let fallback = schema.meta.default;
					while (current?.type === "intersect" && (0, import_cosmokit.isNullable)(fallback)) {
						current = current.list[0];
						fallback = current?.meta.default;
					}
					if ((0, import_cosmokit.isNullable)(fallback)) return [data];
					data = (0, import_cosmokit.clone)(fallback);
				}
				const callback = resolvers[schema.type];
				if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
				try {
					return callback(data, schema, options, strict);
				} catch (error) {
					if (!schema.meta.loose) throw error;
					return [schema.meta.default];
				}
			}, "resolve");
			Schema.from = /* @__PURE__ */ __name(function from(source) {
				if ((0, import_cosmokit.isNullable)(source)) return Schema.any();
				else if ([
					"string",
					"number",
					"boolean"
				].includes(typeof source)) return Schema.const(source).required();
				else if (source[kSchema]) return source;
				else if (typeof source === "function") switch (source) {
					case String: return Schema.string().required();
					case Number: return Schema.number().required();
					case Boolean: return Schema.boolean().required();
					case Function: return Schema.function().required();
					default: return Schema.is(source).required();
				}
				else throw new TypeError(`cannot infer schema from ${source}`);
			}, "from");
			Schema.lazy = /* @__PURE__ */ __name(function lazy(builder) {
				const schema = new Schema({
					type: "lazy",
					builder,
					inner: { toJSON: /* @__PURE__ */ __name(() => {
						if (!schema.inner[kSchema]) {
							schema.inner = schema.builder();
							schema.inner.meta = {
								...schema.meta,
								...schema.inner.meta
							};
						}
						return schema.inner.toJSON();
					}, "toJSON") }
				});
				return schema;
			}, "lazy");
			Schema.natural = /* @__PURE__ */ __name(function natural() {
				return Schema.number().step(1).min(0);
			}, "natural");
			Schema.percent = /* @__PURE__ */ __name(function percent() {
				return Schema.number().step(.01).min(0).max(1).role("slider");
			}, "percent");
			Schema.date = /* @__PURE__ */ __name(function date() {
				return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
					const date2 = new Date(value);
					if (isNaN(+date2)) throw new ValidationError(`invalid date "${value}"`, options);
					return date2;
				}, true)]);
			}, "date");
			Schema.regExp = /* @__PURE__ */ __name(function regExp(flag = "") {
				return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
					try {
						return new RegExp(value, flag);
					} catch (e) {
						throw new ValidationError(e.message, options);
					}
				}, true)]);
			}, "regExp");
			Schema.arrayBuffer = /* @__PURE__ */ __name(function arrayBuffer(encoding) {
				return Schema.union([
					Schema.is(ArrayBuffer),
					Schema.is(SharedArrayBuffer),
					Schema.transform(Schema.any(), (value, options) => {
						if (import_cosmokit.Binary.isSource(value)) return import_cosmokit.Binary.fromSource(value);
						throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
					}, true),
					...encoding ? [Schema.transform(Schema.string(), (value, options) => {
						try {
							return encoding === "base64" ? import_cosmokit.Binary.fromBase64(value) : import_cosmokit.Binary.fromHex(value);
						} catch (e) {
							throw new ValidationError(e.message, options);
						}
					}, true)] : []
				]);
			}, "arrayBuffer");
			Schema.extend("lazy", (data, schema, options, strict) => {
				if (!schema.inner[kSchema]) {
					schema.inner = schema.builder();
					schema.inner.meta = {
						...schema.meta,
						...schema.inner.meta
					};
				}
				return Schema.resolve(data, schema.inner, options, strict);
			});
			Schema.extend("any", (data) => {
				return [data];
			});
			Schema.extend("never", (data, _, options) => {
				throw new ValidationError(`expected nullable but got ${data}`, options);
			});
			Schema.extend("const", (data, { value }, options) => {
				if ((0, import_cosmokit.deepEqual)(data, value)) return [value];
				throw new ValidationError(`expected ${value} but got ${data}`, options);
			});
			function checkWithinRange(data, meta, description, options, skipMin = false) {
				const { max = Infinity, min = -Infinity } = meta;
				if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
				if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
			}
			__name(checkWithinRange, "checkWithinRange");
			Schema.extend("string", (data, { meta }, options) => {
				if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
				if (meta.pattern) {
					const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
					if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
				}
				checkWithinRange(data.length, meta, "string length", options);
				return [data];
			});
			function decimalShift(data, digits) {
				const str = data.toString();
				if (str.includes("e")) return data * Math.pow(10, digits);
				const index = str.indexOf(".");
				if (index === -1) return data * Math.pow(10, digits);
				const frac = str.slice(index + 1);
				const integer = str.slice(0, index);
				if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
				return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
			}
			__name(decimalShift, "decimalShift");
			function isMultipleOf(data, min, step) {
				step = Math.abs(step);
				if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
				const index = step.toString().indexOf(".");
				const digits = step.toString().slice(index + 1).length;
				return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
			}
			__name(isMultipleOf, "isMultipleOf");
			Schema.extend("number", (data, { meta }, options) => {
				if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
				checkWithinRange(data, meta, "number", options);
				const { step } = meta;
				if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
				return [data];
			});
			Schema.extend("boolean", (data, _, options) => {
				if (typeof data === "boolean") return [data];
				throw new ValidationError(`expected boolean but got ${data}`, options);
			});
			Schema.extend("bitset", (data, { bits, meta }, options) => {
				let value = 0, keys = [];
				if (typeof data === "number") {
					value = data;
					for (const key in bits) if (data & bits[key]) keys.push(key);
				} else if (Array.isArray(data)) {
					keys = data;
					for (const key of keys) {
						if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
						if (key in bits) value |= bits[key];
					}
				} else throw new ValidationError(`expected number or array but got ${data}`, options);
				if (value === meta.default) return [value];
				return [value, keys];
			});
			Schema.extend("function", (data, _, options) => {
				if (typeof data === "function") return [data];
				throw new ValidationError(`expected function but got ${data}`, options);
			});
			Schema.extend("is", (data, { constructor }, options) => {
				if (typeof constructor === "function") {
					if (data instanceof constructor) return [data];
					throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
				} else {
					if ((0, import_cosmokit.isNullable)(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
					let prototype = Object.getPrototypeOf(data);
					while (prototype) {
						if (prototype.constructor?.name === constructor) return [data];
						prototype = Object.getPrototypeOf(prototype);
					}
					throw new ValidationError(`expected ${constructor} but got ${data}`, options);
				}
			});
			function property(data, key, schema, options) {
				try {
					const [value, adapted] = Schema.resolve(data[key], schema, {
						...options,
						path: [...options.path || [], key]
					});
					if (adapted !== void 0) data[key] = adapted;
					return value;
				} catch (e) {
					if (!options?.autofix) throw e;
					delete data[key];
					return schema.meta.default;
				}
			}
			__name(property, "property");
			Schema.extend("array", (data, { inner, meta }, options) => {
				if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
				checkWithinRange(data.length, meta, "array length", options, !(0, import_cosmokit.isNullable)(inner.meta.default));
				return [data.map((_, index) => property(data, index, inner, options))];
			});
			Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
				if (!(0, import_cosmokit.isPlainObject)(data)) throw new ValidationError(`expected object but got ${data}`, options);
				const result = {};
				for (const key in data) {
					let rKey;
					try {
						rKey = Schema.resolve(key, sKey, options)[0];
					} catch (error) {
						if (strict) continue;
						throw error;
					}
					result[rKey] = property(data, key, inner, options);
					data[rKey] = data[key];
					if (key !== rKey) delete data[key];
				}
				return [result];
			});
			Schema.extend("tuple", (data, { list }, options, strict) => {
				if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
				const result = list.map((inner, index) => property(data, index, inner, options));
				if (strict) return [result];
				result.push(...data.slice(list.length));
				return [result];
			});
			function merge(result, data) {
				for (const key in data) {
					if (key in result) continue;
					result[key] = data[key];
				}
			}
			__name(merge, "merge");
			Schema.extend("object", (data, { dict }, options, strict) => {
				if (!(0, import_cosmokit.isPlainObject)(data)) throw new ValidationError(`expected object but got ${data}`, options);
				const result = {};
				for (const key in dict) {
					const value = property(data, key, dict[key], options);
					if (!(0, import_cosmokit.isNullable)(value) || key in data) result[key] = value;
				}
				if (!strict) merge(result, data);
				return [result];
			});
			Schema.extend("union", (data, { list, toString: toString2 }, options, strict) => {
				const messages = [];
				for (const inner of list) try {
					return Schema.resolve(data, inner, options, strict);
				} catch (error) {
					messages.push(error);
				}
				throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
			});
			Schema.extend("intersect", (data, { list, toString: toString2 }, options, strict) => {
				if (!list.length) return [data];
				let result;
				for (const inner of list) {
					const value = Schema.resolve(data, inner, options, true)[0];
					if ((0, import_cosmokit.isNullable)(value)) continue;
					if ((0, import_cosmokit.isNullable)(result)) result = value;
					else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
					else if (typeof value === "object") merge(result ??= {}, value);
					else if (result !== value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
				}
				if (!strict && (0, import_cosmokit.isPlainObject)(data)) merge(result, data);
				return [result];
			});
			Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
				const [result, adapted = data] = Schema.resolve(data, inner, options, true);
				if (preserve) return [callback(result)];
				else return [callback(result), callback(adapted)];
			});
			var formatters = {};
			function defineMethod(name, keys, format) {
				formatters[name] = format;
				Object.assign(Schema, { [name](...args) {
					const schema = new Schema({ type: name });
					keys.forEach((key, index) => {
						switch (key) {
							case "sKey":
								schema.sKey = args[index] ?? Schema.string();
								break;
							case "inner":
								schema.inner = Schema.from(args[index]);
								break;
							case "list":
								schema.list = args[index].map(Schema.from);
								break;
							case "dict":
								schema.dict = (0, import_cosmokit.valueMap)(args[index], Schema.from);
								break;
							case "bits":
								schema.bits = {};
								for (const key2 in args[index]) {
									if (typeof args[index][key2] !== "number") continue;
									schema.bits[key2] = args[index][key2];
								}
								break;
							case "callback": {
								const callback = schema.callback = args[index];
								callback["toJSON"] ||= () => callback.toString();
								break;
							}
							case "constructor": {
								const constructor = schema.constructor = args[index];
								if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
								break;
							}
							default: schema[key] = args[index];
						}
					});
					if (name === "object" || name === "dict") schema.meta.default = {};
					else if (name === "array" || name === "tuple") schema.meta.default = [];
					else if (name === "bitset") schema.meta.default = 0;
					return schema;
				} });
			}
			__name(defineMethod, "defineMethod");
			defineMethod("is", ["constructor"], ({ constructor }) => {
				if (typeof constructor === "function") return constructor.name;
				else return constructor;
			});
			defineMethod("any", [], () => "any");
			defineMethod("never", [], () => "never");
			defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
			defineMethod("string", [], () => "string");
			defineMethod("number", [], () => "number");
			defineMethod("boolean", [], () => "boolean");
			defineMethod("bitset", ["bits"], () => "bitset");
			defineMethod("function", [], () => "function");
			defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
			defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
			defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
			defineMethod("object", ["dict"], ({ dict }) => {
				if (Object.keys(dict).length === 0) return "{}";
				return `{ ${Object.entries(dict).map(([key, inner]) => {
					return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
				}).join(", ")} }`;
			});
			defineMethod("union", ["list"], ({ list }, inline) => {
				const result = list.map(({ toString: format }) => format()).join(" | ");
				return inline ? `(${result})` : result;
			});
			defineMethod("intersect", ["list"], ({ list }) => {
				return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
			});
			defineMethod("transform", [
				"inner",
				"callback",
				"preserve"
			], ({ inner }, isInner) => inner.toString(isInner));
			module.exports = Schema;
		})))(), 1);
		import_lib.default.object({});
		const colorPreset = import_lib.default.union([
			import_lib.default.const("raiden-violet"),
			import_lib.default.const("raiden-night"),
			import_lib.default.const("raiden-sakura"),
			import_lib.default.const("custom")
		]).default("raiden-violet");
		const dynamicIntensity = import_lib.default.union([
			import_lib.default.const("low"),
			import_lib.default.const("standard"),
			import_lib.default.const("high")
		]).default("standard");
		const motion = import_lib.default.union([import_lib.default.const("off"), import_lib.default.const("standard")]).default("standard");
		const RaidenColorConfigSchema = import_lib.default.object({
			preset: colorPreset,
			primary: import_lib.default.string(),
			secondary: import_lib.default.string(),
			accent: import_lib.default.string(),
			background: import_lib.default.string(),
			surface: import_lib.default.string(),
			text: import_lib.default.string(),
			success: import_lib.default.string(),
			warning: import_lib.default.string(),
			error: import_lib.default.string(),
			dynamicEnabled: import_lib.default.boolean().default(true),
			dynamicIntensity
		});
		const RaidenSettingsSchema = import_lib.default.object({
			schemaVersion: import_lib.default.const(1).default(1),
			enabled: import_lib.default.boolean().default(true),
			displayName: import_lib.default.string().default("雷电将军"),
			subtitle: import_lib.default.string().default("尘世七执政 · 永恒"),
			avatar: import_lib.default.union([import_lib.default.const("default"), import_lib.default.string()]).default("default"),
			portrait: import_lib.default.union([
				import_lib.default.const("default"),
				import_lib.default.const("off"),
				import_lib.default.string()
			]).default("default"),
			timePhaseEnabled: import_lib.default.boolean().default(true),
			stateColorEnabled: import_lib.default.boolean().default(true),
			motion,
			reducedMotion: import_lib.default.boolean().default(false),
			veilOpacity: import_lib.default.number().min(0).max(100).default(10),
			acrylicPercent: import_lib.default.number().min(0).max(100).default(70),
			frameOpacity: import_lib.default.number().min(0).max(100).default(85),
			panelOpacity: import_lib.default.number().min(0).max(100).default(82),
			characterOpacity: import_lib.default.number().min(0).max(100).default(100),
			showLeftCharacter: import_lib.default.boolean().default(true),
			showRightCharacter: import_lib.default.boolean().default(true),
			showMascot: import_lib.default.boolean().default(true),
			colors: RaidenColorConfigSchema
		});
		function parseRaidenSettings(value) {
			const resolved = RaidenSettingsSchema(value && typeof value === "object" ? value : {});
			return {
				schemaVersion: 1,
				enabled: resolved.enabled,
				displayName: resolved.displayName,
				subtitle: resolved.subtitle,
				avatar: resolved.avatar,
				portrait: resolved.portrait,
				timePhaseEnabled: resolved.timePhaseEnabled,
				stateColorEnabled: resolved.stateColorEnabled,
				motion: resolved.motion,
				reducedMotion: resolved.reducedMotion,
				veilOpacity: resolved.veilOpacity,
				acrylicPercent: resolved.acrylicPercent,
				frameOpacity: resolved.frameOpacity,
				panelOpacity: resolved.panelOpacity,
				characterOpacity: resolved.characterOpacity,
				showLeftCharacter: resolved.showLeftCharacter,
				showRightCharacter: resolved.showRightCharacter,
				showMascot: resolved.showMascot,
				colors: {
					preset: resolved.colors.preset,
					primary: resolved.colors.primary,
					secondary: resolved.colors.secondary,
					accent: resolved.colors.accent,
					background: resolved.colors.background,
					surface: resolved.colors.surface,
					text: resolved.colors.text,
					success: resolved.colors.success,
					warning: resolved.colors.warning,
					error: resolved.colors.error,
					dynamicEnabled: resolved.colors.dynamicEnabled,
					dynamicIntensity: resolved.colors.dynamicIntensity
				}
			};
		}
		const DEFAULT_SETTINGS = parseRaidenSettings({});
		//#endregion
		//#region src/client/settings-store.ts
		const STORAGE_KEY = "dsh-raiden-theme:v1";
		const SETTINGS_CHANGE_EVENT = "dsh-raiden-theme:settings-change";
		const LEGACY_VEILS = [
			"thin",
			"standard",
			"thick"
		];
		function isLegacyVeil(value) {
			return typeof value === "string" && LEGACY_VEILS.includes(value);
		}
		function percentFromLegacyVeil(veil) {
			if (veil === "thin") return 8;
			if (veil === "thick") return 18;
			return 12;
		}
		function veilFromOpacity(percent) {
			if (percent <= 9) return "thin";
			if (percent >= 16) return "thick";
			return "standard";
		}
		function veilBucket(settings) {
			return veilFromOpacity(settings.veilOpacity);
		}
		function migrateStoredSettings(raw) {
			if (!raw || typeof raw !== "object") return {};
			const input = { ...raw };
			const colors = { ...typeof input.colors === "object" && input.colors ? input.colors : {} };
			if (input.preset !== void 0 && colors.preset === void 0) colors.preset = input.preset;
			if (input.dynamicEnabled !== void 0 && colors.dynamicEnabled === void 0) colors.dynamicEnabled = input.dynamicEnabled;
			if (input.dynamicIntensity !== void 0 && colors.dynamicIntensity === void 0) colors.dynamicIntensity = input.dynamicIntensity;
			input.colors = colors;
			delete input.preset;
			delete input.dynamicEnabled;
			delete input.dynamicIntensity;
			if (input.veilOpacity == null) {
				const legacy = input.backgroundVeil ?? input.veilStrength;
				if (isLegacyVeil(legacy)) input.veilOpacity = percentFromLegacyVeil(legacy);
			}
			delete input.veilStrength;
			delete input.backgroundVeil;
			return input;
		}
		function loadSettings() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (!raw) return { ...DEFAULT_SETTINGS };
				return parseRaidenSettings(migrateStoredSettings(JSON.parse(raw)));
			} catch {
				return { ...DEFAULT_SETTINGS };
			}
		}
		function saveSettings(next) {
			const clean = parseRaidenSettings(next);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
			window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: clean }));
		}
		function subscribeSettings(onChange) {
			const handler = () => onChange(loadSettings());
			window.addEventListener("storage", handler);
			window.addEventListener(SETTINGS_CHANGE_EVENT, handler);
			return () => {
				window.removeEventListener("storage", handler);
				window.removeEventListener(SETTINGS_CHANGE_EVENT, handler);
			};
		}
		//#endregion
		//#region src/client/theme-css.ts
		const tokensCss = "/* Raiden tokens live on body. Official --dsw-* stay on native DSH panes only. */\n\nbody[data-dsh-raiden-theme] {\n  --ds-raiden-cream: #fff7f1;\n  --ds-raiden-cream-deep: #ffe8f0;\n  --ds-raiden-pink: #f29bc2;\n  --ds-raiden-pink-soft: #ffd8e7;\n  --ds-raiden-gold: #e7b957;\n  --ds-raiden-gold-deep: #c9a227;\n  --ds-raiden-charcoal: #493b50;\n  --ds-raiden-ribbon: #c43c3c;\n  --ds-raiden-lens: #91d5e8;\n  --ds-raiden-lavender: #b9a7e8;\n  --ds-raiden-text: #141018;\n  --ds-raiden-text-on-dark: #fff3e8;\n  --raiden-text-halo:\n    0 0 0.6px rgba(255, 255, 255, 0.95),\n    0 1px 0 rgba(255, 247, 241, 0.92),\n    0 0 8px rgba(255, 247, 241, 0.62);\n  --ds-raiden-border: rgba(73, 59, 80, 0.14);\n  --raiden-q-face: none;\n  --raiden-q-send: none;\n  --raiden-q-settings: none;\n  --raiden-q-brand: none;\n  --raiden-q-brand-right: none;\n  --raiden-q-new: none;\n  --raiden-q-command: none;\n  --raiden-q-stop: none;\n  --raiden-veil-strength: 0.12;\n\n  --ds-agent-idle: var(--ds-raiden-pink);\n  --ds-agent-thinking: var(--ds-raiden-lavender);\n  --ds-agent-tool: var(--ds-raiden-lens);\n  --ds-agent-streaming: var(--ds-raiden-pink-soft);\n  --ds-agent-success: var(--ds-raiden-gold);\n  --ds-agent-error: var(--ds-raiden-ribbon);\n\n  --raiden-sidebar-width: 280px;\n  --raiden-accent: var(--ds-raiden-pink);\n  --raiden-glow: rgba(242, 155, 194, 0.28);\n  --raiden-hairline: color-mix(in srgb, var(--ds-raiden-pink) 35%, transparent);\n  --raiden-motion-scale: 1;\n  --raiden-motion-duration: 1;\n  --raiden-veil: var(--ds-raiden-cream);\n  --raiden-font: \"M PLUS Rounded 1c\", Nunito, Inter, \"Segoe UI\", \"Noto Sans SC\", \"PingFang SC\", system-ui, sans-serif;\n  --raiden-mono: \"JetBrains Mono\", ui-monospace, \"Cascadia Mono\", Consolas, monospace;\n  --raiden-pink: var(--ds-raiden-pink);\n  --raiden-pink-deep: #dc6f9e;\n  --raiden-ink: var(--ds-raiden-text);\n  --raiden-muted: #817486;\n  --raiden-blue: var(--ds-raiden-lens);\n  --raiden-radius-sm: 8px;\n  --raiden-radius-md: 12px;\n  --raiden-radius-lg: 16px;\n  --raiden-frame-inset: 8px;\n  --raiden-frame-opacity: 0.85;\n  --raiden-panel-opacity: 82;\n  --raiden-plate-art: linear-gradient(\n    90deg,\n    rgba(255, 214, 232, 0.7),\n    rgba(255, 247, 241, 0.42) 50%,\n    rgba(255, 214, 232, 0.58)\n  );\n  --raiden-settings-frame-art: var(--raiden-plate-art);\n  --raiden-character-opacity: 1;\n  --raiden-veil-opacity: var(--raiden-veil-strength);\n  --raiden-acrylic-percent: 70;\n  --raiden-conversation-left: 0px;\n  --raiden-conversation-top: 0px;\n  --raiden-conversation-width: 0px;\n  --raiden-conversation-height: 0px;\n  --raiden-conversation-content-left: 0px;\n  --raiden-conversation-content-width: 0px;\n  --raiden-conversation-viewport-top: 0px;\n  --raiden-conversation-viewport-height: 0px;\n  --raiden-content-left: 0px;\n  --raiden-content-width: 0px;\n  --raiden-viewport-top: 0px;\n  --raiden-viewport-height: 0px;\n  --raiden-composer-top: 0px;\n  --raiden-composer-height: 0px;\n  --raiden-acrylic-bg: color-mix(in srgb, rgb(255, 250, 247) calc(var(--raiden-acrylic-percent) * 1%), transparent);\n  --raiden-acrylic-bg-strong: color-mix(in srgb, rgb(255, 250, 247) calc((var(--raiden-acrylic-percent) + 12) * 1%), transparent);\n  --raiden-acrylic-bg-soft: color-mix(in srgb, rgb(255, 250, 247) calc((var(--raiden-acrylic-percent) - 15) * 1%), transparent);\n  --raiden-acrylic-border: rgba(242, 155, 194, 0.25);\n  --raiden-acrylic-hairline: rgba(242, 155, 194, 0.22);\n  --raiden-acrylic-shadow: rgba(73, 59, 80, 0.12);\n  --raiden-acrylic-blur: 14px;\n  --raiden-acrylic-saturation: 1.05;\n  --raiden-acrylic-light: color-mix(in srgb, rgb(255, 250, 247) calc(var(--raiden-panel-opacity) * 1%), transparent);\n  --raiden-acrylic-dark: color-mix(in srgb, rgb(36, 29, 52) calc(var(--raiden-panel-opacity) * 1%), transparent);\n  --raiden-border-light: rgba(242, 155, 194, 0.34);\n  --raiden-border-dark: rgba(255, 220, 240, 0.2);\n  --raiden-highlight: rgba(255, 255, 255, 0.5);\n  --raiden-shadow: 0 12px 32px rgba(73, 59, 80, 0.12);\n\n  background-color: transparent;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-sakura'] {\n  --ds-raiden-cream: #f6fbfc;\n  --ds-raiden-cream-deep: #e8f4f6;\n  --raiden-accent: var(--ds-raiden-lens);\n  --raiden-glow: rgba(145, 213, 232, 0.28);\n  --raiden-veil: #f6fbfc;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] {\n  --ds-raiden-cream: #211b32;\n  --ds-raiden-cream-deep: #181326;\n  --ds-raiden-text: #fff3e8;\n  --ds-raiden-text-on-dark: #fff3e8;\n  --raiden-text-halo:\n    0 0 0.8px rgba(255, 243, 232, 0.95),\n    0 0 7px rgba(231, 185, 87, 0.34),\n    0 0 14px rgba(242, 155, 194, 0.22);\n  --raiden-veil: #211b32;\n  --raiden-veil-strength: 0.14;\n  --raiden-veil-opacity: var(--raiden-veil-strength);\n  --raiden-panel-opacity: 82;\n  --raiden-glow: rgba(242, 165, 200, 0.22);\n  --raiden-plate-art: linear-gradient(\n    90deg,\n    rgba(220, 111, 158, 0.22),\n    rgba(39, 30, 55, 0.42) 50%,\n    rgba(185, 167, 232, 0.16)\n  );\n  --raiden-settings-frame-art: var(--raiden-plate-art);\n  --raiden-acrylic-bg: color-mix(in srgb, rgb(36, 29, 52) calc(var(--raiden-acrylic-percent) * 1%), transparent);\n  --raiden-acrylic-bg-strong: color-mix(in srgb, rgb(36, 29, 52) calc((var(--raiden-acrylic-percent) + 10) * 1%), transparent);\n  --raiden-acrylic-bg-soft: color-mix(in srgb, rgb(36, 29, 52) calc((var(--raiden-acrylic-percent) - 18) * 1%), transparent);\n  --raiden-acrylic-dark: color-mix(in srgb, rgb(36, 29, 52) calc(var(--raiden-panel-opacity) * 1%), transparent);\n  --raiden-acrylic-border: rgba(255, 244, 250, 0.14);\n  --raiden-acrylic-hairline: rgba(191, 174, 235, 0.22);\n  --raiden-acrylic-shadow: rgba(0, 0, 0, 0.3);\n  --raiden-acrylic-blur: 14px;\n  --raiden-acrylic-saturation: 1.05;\n  --raiden-muted: #a99db2;\n  background-color: transparent;\n}\n\nbody[data-dsh-raiden-theme] :is(\n  [class*='sidebarCol'],\n  [class*='centerCol'],\n  [class*='detailsCol'],\n  [data-pane='conversation'],\n  [data-pane='sidebar']\n) {\n  --dsw-alias-bg-base: transparent;\n  --dsw-alias-bg-layer-1: color-mix(in srgb, var(--ds-raiden-cream) 22%, transparent);\n  --dsw-alias-bg-layer-2: color-mix(in srgb, #fffdfb 28%, transparent);\n  --dsw-alias-bg-layer-3: color-mix(in srgb, var(--ds-raiden-cream-deep) 36%, transparent);\n  --dsw-alias-bg-overlay: color-mix(in srgb, var(--ds-raiden-cream) 28%, transparent);\n  --dsw-alias-border-l1: rgba(73, 59, 80, 0.08);\n  --dsw-alias-border-l2: rgba(73, 59, 80, 0.14);\n  --dsw-alias-border-l2-darkmode-thin: rgba(73, 59, 80, 0.12);\n  --dsw-alias-border-l3: color-mix(in srgb, var(--ds-raiden-pink) 42%, transparent);\n  --dsw-alias-brand-primary: var(--ds-raiden-pink);\n  --dsw-alias-brand-text: var(--ds-raiden-text);\n  --dsw-alias-button-info-fill: var(--ds-raiden-pink);\n  --dsw-alias-button-info-hover: var(--ds-raiden-pink-soft);\n  --dsw-alias-label-caption: #6d5d74;\n  --dsw-alias-label-dimmed: #8a7a90;\n  --dsw-alias-label-primary-bluish: var(--ds-raiden-text);\n  --dsw-alias-label-primary-dimmed: #5c4c62;\n  --dsw-alias-label-primary-foreground: #fff7f1;\n  --dsw-alias-label-primary-inverted: #fff7f1;\n  --dsw-alias-label-primary: var(--ds-raiden-text);\n  --dsw-alias-label-secondary: #74697b;\n  --dsw-alias-label-tertiary: #948a99;\n  --dsw-alias-interactive-bg-hover: rgba(242, 155, 194, 0.12);\n  --dsw-alias-interactive-bg-active: rgba(185, 167, 232, 0.16);\n  --dsw-specific-bubble: #fff4ea;\n  --dsw-specific-bubble-highlight: #ffe4d2;\n  --dsw-specific-sidebar-fill: color-mix(in srgb, #ffd6e8 62%, transparent);\n  --dsw-specific-input-major: color-mix(in srgb, #fffdfb 90%, transparent);\n  color: var(--ds-raiden-text);\n  font-family: var(--raiden-font);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is(\n  [class*='sidebarCol'],\n  [class*='centerCol'],\n  [class*='detailsCol'],\n  [data-pane='conversation'],\n  [data-pane='sidebar']\n),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is(\n  [class*='sidebarCol'],\n  [class*='centerCol'],\n  [class*='detailsCol'],\n  [data-pane='conversation'],\n  [data-pane='sidebar']\n) {\n  --dsw-alias-bg-layer-1: color-mix(in srgb, #2a2340 22%, transparent);\n  --dsw-alias-bg-layer-2: color-mix(in srgb, #2a2340 28%, transparent);\n  --dsw-alias-bg-layer-3: color-mix(in srgb, #181326 32%, transparent);\n  --dsw-alias-bg-overlay: color-mix(in srgb, #181326 28%, transparent);\n  --dsw-alias-border-l1: rgba(242, 165, 200, 0.12);\n  --dsw-alias-border-l2: rgba(185, 167, 232, 0.2);\n  --dsw-alias-border-l3: color-mix(in srgb, var(--ds-raiden-gold) 40%, transparent);\n  --dsw-alias-brand-primary: var(--ds-raiden-pink-soft);\n  --dsw-alias-brand-text: var(--ds-raiden-text);\n  --dsw-alias-label-caption: #e8dce8;\n  --dsw-alias-label-dimmed: #d4c8d8;\n  --dsw-alias-label-primary-bluish: var(--ds-raiden-text);\n  --dsw-alias-label-primary-dimmed: #f4eef4;\n  --dsw-alias-label-primary-foreground: #211b32;\n  --dsw-alias-label-primary-inverted: #211b32;\n  --dsw-alias-label-primary: var(--ds-raiden-text);\n  --dsw-alias-label-secondary: #d8cddf;\n  --dsw-alias-label-tertiary: #a99db2;\n  --dsw-specific-bubble: #2f2744;\n  --dsw-specific-bubble-highlight: #3a3250;\n  --dsw-specific-sidebar-fill: color-mix(in srgb, #271e37 64%, transparent);\n  --dsw-specific-input-major: color-mix(in srgb, #2a2340 88%, transparent);\n  color: var(--ds-raiden-text);\n}\n\nbody[data-dsh-raiden-theme] [class*='centerCol'] {\n  --dsw-alias-bg-base: transparent;\n  --dsw-alias-bg-layer-1: color-mix(in srgb, var(--ds-raiden-cream) 12%, transparent);\n  --dsw-alias-bg-layer-2: color-mix(in srgb, #fffdfb 14%, transparent);\n  --dsw-alias-bg-layer-3: color-mix(in srgb, var(--ds-raiden-cream-deep) 16%, transparent);\n  --dsw-alias-bg-overlay: color-mix(in srgb, var(--ds-raiden-cream) 18%, transparent);\n}\n\n/* AppFrame.frame paints --dsw-alias-bg-base. Keep that token transparent so\n   column translucency reveals the wallpaper instead of the host shell. */\nbody[data-dsh-raiden-theme] [id='root'] div:has(> [class*='sidebarCol']):has(> [class*='centerCol']) {\n  --dsw-alias-bg-base: transparent;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [class*='centerCol'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [class*='centerCol'] {\n  --dsw-alias-bg-layer-1: color-mix(in srgb, #2a2340 12%, transparent);\n  --dsw-alias-bg-layer-2: color-mix(in srgb, #2a2340 14%, transparent);\n  --dsw-alias-bg-layer-3: color-mix(in srgb, #181326 16%, transparent);\n  --dsw-alias-bg-overlay: color-mix(in srgb, #181326 18%, transparent);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='idle'] {\n  --raiden-accent: var(--ds-agent-idle);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='thinking'] {\n  --raiden-accent: var(--ds-agent-thinking);\n  --raiden-glow: rgba(185, 167, 232, 0.3);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='tool-calling'] {\n  --raiden-accent: var(--ds-agent-tool);\n  --raiden-glow: rgba(145, 213, 232, 0.3);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='streaming'] {\n  --raiden-accent: var(--ds-agent-streaming);\n  --raiden-glow: rgba(242, 155, 194, 0.3);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='success'] {\n  --raiden-accent: var(--ds-agent-success);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='error'] {\n  --raiden-accent: var(--ds-agent-error);\n  --raiden-glow: rgba(196, 60, 60, 0.3);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-veil='thin'] {\n  --raiden-veil-strength: 0.08;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-veil='standard'] {\n  --raiden-veil-strength: 0.12;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-veil='thick'] {\n  --raiden-veil-strength: 0.18;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-frame-opacity='70'] {\n  --raiden-frame-opacity: 0.7;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-frame-opacity='85'] {\n  --raiden-frame-opacity: 0.85;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-frame-opacity='100'] {\n  --raiden-frame-opacity: 1;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-panel-opacity='55'] {\n  --raiden-panel-opacity: 55;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-panel-opacity='70'] {\n  --raiden-panel-opacity: 70;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-panel-opacity='85'] {\n  --raiden-panel-opacity: 85;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-panel-opacity='92'] {\n  --raiden-panel-opacity: 92;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-character-opacity='70'] {\n  --raiden-character-opacity: 0.7;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-character-opacity='85'] {\n  --raiden-character-opacity: 0.85;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-character-opacity='100'] {\n  --raiden-character-opacity: 1;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-acrylic-percent='50'] {\n  --raiden-acrylic-percent: 50;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-acrylic-percent='70'] {\n  --raiden-acrylic-percent: 70;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-acrylic-percent='85'] {\n  --raiden-acrylic-percent: 85;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-acrylic-percent='92'] {\n  --raiden-acrylic-percent: 92;\n}\n\nbody[data-dsh-raiden-theme][data-dsh-raiden-intensity='low'] {\n  --raiden-motion-scale: 0.6;\n  --raiden-motion-duration: 1.4;\n}\n\nbody[data-dsh-raiden-theme][data-dsh-raiden-intensity='high'] {\n  --raiden-motion-scale: 1.2;\n  --raiden-motion-duration: 0.8;\n}\n\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] {\n  --raiden-motion-scale: 0;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-low-power] {\n  --raiden-acrylic-blur: 0px;\n  --raiden-motion-scale: 0;\n}\n";
		const surfacesCss = "/* Opt-in acrylic only. Never scan host overlays, details, or undeclared plugins. */\n\nbody[data-dsh-raiden-theme] :is(\n  [data-raiden-surface='acrylic'],\n  [data-plugin-root][data-raiden-acrylic='standard']\n) {\n  background: var(--raiden-acrylic-bg);\n  border-color: var(--raiden-acrylic-border);\n  box-shadow:\n    inset 0 1px var(--raiden-highlight),\n    0 16px 38px var(--raiden-acrylic-shadow);\n  backdrop-filter: blur(var(--raiden-acrylic-blur)) saturate(var(--raiden-acrylic-saturation));\n  -webkit-backdrop-filter: blur(var(--raiden-acrylic-blur)) saturate(var(--raiden-acrylic-saturation));\n}\n\nbody[data-dsh-raiden-theme] [data-plugin-root][data-raiden-acrylic='soft'] {\n  background: var(--raiden-acrylic-bg-soft);\n  backdrop-filter: blur(12px) saturate(var(--raiden-acrylic-saturation));\n  -webkit-backdrop-filter: blur(12px) saturate(var(--raiden-acrylic-saturation));\n}\n\nbody[data-dsh-raiden-theme] :is(\n  [data-raiden-surface='solid'],\n  [data-plugin-root][data-raiden-acrylic='off']\n) {\n  background: var(--raiden-acrylic-bg-strong);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is(\n  [data-raiden-surface='acrylic'],\n  [data-plugin-root][data-raiden-acrylic='standard']\n),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is(\n  [data-raiden-surface='acrylic'],\n  [data-plugin-root][data-raiden-acrylic='standard']\n) {\n  background: var(--raiden-acrylic-bg);\n}\n\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {\n  body[data-dsh-raiden-theme] :is(\n    [data-raiden-surface='acrylic'],\n    [data-plugin-root][data-raiden-acrylic='standard'],\n    [data-plugin-root][data-raiden-acrylic='soft']\n  ) {\n    background: var(--raiden-acrylic-bg-strong);\n  }\n}\n\nbody[data-dsh-raiden-theme][data-raiden-low-power] :is(\n  [data-raiden-surface='acrylic'],\n  [data-plugin-root][data-raiden-acrylic='standard'],\n  [data-plugin-root][data-raiden-acrylic='soft']\n) {\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n  background: var(--raiden-acrylic-bg-strong);\n}\n";
		const badgesCss = "/* Raiden conversation stage: pink outer, gold inner, curtains, candy corners. */\n\nbody[data-dsh-raiden-theme] [data-skin-chrome='atelier-frame'] {\n  position: fixed;\n  z-index: 0;\n  box-sizing: border-box;\n  overflow: visible;\n  pointer-events: none;\n  left: var(--raiden-frame-left, calc(var(--raiden-viewport-left, var(--raiden-content-left, var(--raiden-conversation-content-left))) - 10px));\n  top: var(--raiden-frame-top, calc(var(--raiden-viewport-top, var(--raiden-conversation-viewport-top)) - 10px));\n  width: var(--raiden-frame-width, calc(var(--raiden-viewport-width, var(--raiden-content-width, var(--raiden-conversation-content-width))) + 20px));\n  height: var(--raiden-frame-height, calc(var(--raiden-viewport-height, var(--raiden-conversation-viewport-height)) + 20px));\n  right: auto;\n  bottom: auto;\n  border: 2.5px solid rgba(242, 155, 194, var(--raiden-frame-opacity, 1));\n  border-radius: 26px;\n  background: var(--raiden-acrylic-light);\n  opacity: 1;\n  transition: none;\n  box-shadow:\n    inset 0 0 0 1.5px rgba(231, 185, 87, 0.78),\n    0 0 0 1px rgba(185, 167, 232, 0.38),\n    0 10px 24px rgba(242, 155, 194, 0.14);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-skin-chrome='atelier-frame'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-skin-chrome='atelier-frame'] {\n  border-color: rgba(242, 165, 200, var(--raiden-frame-opacity, 1));\n  background: var(--raiden-acrylic-dark);\n  box-shadow:\n    inset 0 0 0 1.5px rgba(231, 185, 87, 0.62),\n    0 0 0 1px rgba(185, 167, 232, 0.32),\n    0 10px 24px rgba(33, 27, 50, 0.22);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-frame-hidden] [data-skin-chrome='atelier-frame'],\nbody[data-dsh-raiden-theme][data-raiden-frame-hidden] [data-skin-chrome='raiden-top-curtain'],\nbody[data-dsh-raiden-theme][data-raiden-frame-hidden] [data-skin-chrome='raiden-bottom-curtain'] {\n  opacity: 0;\n}\n\nbody[data-dsh-raiden-theme] [data-skin-chrome='raiden-top-curtain'],\nbody[data-dsh-raiden-theme] [data-skin-chrome='raiden-bottom-curtain'] {\n  position: fixed;\n  z-index: 0;\n  pointer-events: none;\n  left: var(--raiden-frame-left, var(--raiden-content-left, var(--raiden-conversation-left)));\n  width: var(--raiden-frame-width, var(--raiden-content-width, var(--raiden-conversation-width)));\n  right: auto;\n  opacity: 1;\n  transition: none;\n}\n\nbody[data-dsh-raiden-theme] [data-skin-chrome='raiden-top-curtain'] {\n  top: var(--raiden-frame-top, var(--raiden-viewport-top));\n  height: 28px;\n  border-radius: 26px 26px 0 0;\n  background:\n    linear-gradient(180deg, rgba(242, 155, 194, 0.28), rgba(231, 185, 87, 0.12) 55%, transparent 100%);\n}\n\nbody[data-dsh-raiden-theme] [data-skin-chrome='raiden-bottom-curtain'] {\n  top: calc(var(--raiden-composer-top, calc(var(--raiden-frame-top, var(--raiden-viewport-top)) + var(--raiden-frame-height, var(--raiden-viewport-height)))) - 22px);\n  height: 22px;\n  border-radius: 0;\n  background:\n    radial-gradient(ellipse 88% 140% at 50% 120%, rgba(145, 213, 232, 0.22), transparent 68%),\n    radial-gradient(ellipse 72% 120% at 50% 100%, rgba(185, 167, 232, 0.16), transparent 74%),\n    linear-gradient(0deg, rgba(242, 155, 194, 0.12), transparent 100%);\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-chat-active]) [data-skin-chrome='raiden-top-curtain'] {\n  height: 22px;\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-chat-active]) [data-skin-chrome='raiden-bottom-curtain'] {\n  height: 22px;\n  top: calc(var(--raiden-frame-top, var(--raiden-viewport-top)) + var(--raiden-frame-height, var(--raiden-viewport-height)) - 22px);\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-badge] {\n  position: absolute;\n  top: -16px;\n  left: 50%;\n  width: 88px;\n  height: 32px;\n  translate: -50% 0;\n  pointer-events: none;\n  opacity: 0;\n  border-radius: 999px;\n  background:\n    radial-gradient(circle at 22% 54%, #ffd8e7 0 8px, transparent 9px),\n    radial-gradient(circle at 78% 54%, #ffd8e7 0 8px, transparent 9px),\n    linear-gradient(180deg, rgba(242, 155, 194, 0.95), rgba(231, 185, 87, 0.88));\n  box-shadow: 0 0 0 1.5px rgba(231, 185, 87, 0.72);\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corners] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner] {\n  position: absolute;\n  pointer-events: none;\n  width: 22px;\n  height: 22px;\n  border: 1.5px solid rgba(242, 155, 194, 0.55);\n  box-shadow: inset 0 0 0 1px rgba(231, 185, 87, 0.35);\n  background: transparent;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner]::after {\n  content: '';\n  position: absolute;\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: radial-gradient(circle at 35% 30%, rgba(255, 247, 241, 0.9), rgba(242, 155, 194, 0.7) 55%, rgba(231, 185, 87, 0.6));\n  pointer-events: none;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-frame-corner],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-frame-corner] {\n  border-color: rgba(242, 165, 200, 0.45);\n  box-shadow: inset 0 0 0 1px rgba(231, 185, 87, 0.28);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-frame-corner]::after,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-frame-corner]::after {\n  background: radial-gradient(circle at 35% 30%, rgba(255, 243, 232, 0.8), rgba(242, 165, 200, 0.6) 55%, rgba(231, 185, 87, 0.5));\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='top-left'] {\n  top: 10px;\n  left: 10px;\n  border-right: 0;\n  border-bottom: 0;\n  border-radius: 12px 0 0 0;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='top-left']::after {\n  top: -3px;\n  left: -3px;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='top-right'] {\n  top: 10px;\n  right: 10px;\n  border-left: 0;\n  border-bottom: 0;\n  border-radius: 0 12px 0 0;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='top-right']::after {\n  top: -3px;\n  right: -3px;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='bottom-left'] {\n  bottom: 10px;\n  left: 10px;\n  border-right: 0;\n  border-top: 0;\n  border-radius: 0 0 0 12px;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='bottom-left']::after {\n  bottom: -3px;\n  left: -3px;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='bottom-right'] {\n  bottom: 10px;\n  right: 10px;\n  border-left: 0;\n  border-top: 0;\n  border-radius: 0 0 12px 0;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-frame-corner='bottom-right']::after {\n  bottom: -3px;\n  right: -3px;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-frame-compact] [data-raiden-frame-corner],\nbody[data-dsh-raiden-theme][data-raiden-frame-compact] [data-raiden-frame-badge] {\n  opacity: 0;\n}\n\n@media (max-width: 700px) {\n  body[data-dsh-raiden-theme] [data-skin-chrome='raiden-top-curtain'],\n  body[data-dsh-raiden-theme] [data-skin-chrome='raiden-bottom-curtain'],\n  body[data-dsh-raiden-theme] [data-raiden-frame-badge] {\n    opacity: 0;\n  }\n}\n\nbody[data-dsh-raiden-theme] [data-skin-chrome='sidebar-trim'] {\n  position: fixed;\n  z-index: 0;\n  pointer-events: none;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: var(--raiden-sidebar-width, 280px);\n  overflow: visible;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] [data-skin-chrome='sidebar-trim'] {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-corner],\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-ornament] {\n  position: absolute;\n  pointer-events: none;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-corner] {\n  width: 28px;\n  height: 28px;\n  border: 1.5px solid rgba(231, 185, 87, 0.58);\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-corner='top-left'],\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-corner='top-right'] {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-corner='bottom-left'] {\n  bottom: 10px;\n  left: 10px;\n  border-right: 0;\n  border-top: 0;\n  border-radius: 0 0 0 10px;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-corner='bottom-right'] {\n  bottom: 10px;\n  right: 10px;\n  border-left: 0;\n  border-top: 0;\n  border-radius: 0 0 10px 0;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-ornament='ribbon'] {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sidebar-ornament='swag'] {\n  left: 18px;\n  right: 18px;\n  bottom: 58px;\n  height: 28px;\n  background:\n    linear-gradient(90deg, transparent, rgba(231, 185, 87, 0.55) 12% 88%, transparent) center 10px / 100% 1px no-repeat,\n    linear-gradient(90deg, transparent, rgba(242, 155, 194, 0.4) 18% 82%, transparent) center 13px / 100% 1px no-repeat;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-sidebar-ornament='ribbon'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-sidebar-ornament='ribbon'] {\n  display: none;\n}\n\n\nbody[data-dsh-raiden-theme] [data-phase='hero'] [class*='headline'] {\n  grid-template-columns: 36px auto;\n  animation: raiden-hero-enter 0.7s ease-out both;\n}\n\nbody[data-dsh-raiden-theme] [data-phase='hero'] [class*='previewBadge'] {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme] [data-phase='hero'] [class*='headline']:has(> [class*='fish']) > [class*='fish'] {\n  width: 36px;\n  height: 36px;\n  border: 2px solid rgba(231, 185, 87, 0.78);\n  border-radius: 50%;\n  outline: 1.5px solid rgba(242, 155, 194, 0.42);\n  outline-offset: 3px;\n  background:\n    var(--raiden-hero-avatar) center / cover no-repeat,\n    color-mix(in srgb, var(--ds-raiden-cream) 62%, transparent);\n  box-shadow:\n    0 0 0 6px rgba(242, 155, 194, 0.12),\n    0 4px 12px rgba(73, 59, 80, 0.16);\n  animation: raiden-hero-bob 4.5s ease-in-out infinite;\n}\n\nbody[data-dsh-raiden-theme] [data-phase='hero'] [class*='headlineText'] {\n  color: var(--raiden-pink-deep);\n  font-weight: 900;\n  letter-spacing: 0.02em;\n  background-image:\n    linear-gradient(105deg, transparent 42%, rgba(255, 255, 255, 0.85) 50%, transparent 58%),\n    linear-gradient(105deg, #c74078 0%, #e06a9b 22%, #c99a27 48%, #b8860b 70%, #d8558f 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n  paint-order: stroke fill;\n  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.78)) drop-shadow(0 3px 8px rgba(242, 155, 194, 0.22));\n  background-size: 300% 100%, 200% 100%;\n  animation: raiden-hero-shimmer 7s ease-in-out infinite alternate;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-phase='hero'] [class*='headlineText'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-phase='hero'] [class*='headlineText'] {\n  color: #ffd8e7;\n  background-image:\n    linear-gradient(105deg, transparent 42%, rgba(255, 245, 235, 0.6) 50%, transparent 58%),\n    linear-gradient(105deg, #ffb8d6 0%, #ffc9e2 22%, #ffe08a 48%, #ffd060 68%, #ffb3d0 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n  filter: drop-shadow(0 1px 0 rgba(33, 27, 50, 0.55)) drop-shadow(0 3px 8px rgba(231, 185, 87, 0.16));\n  background-size: 300% 100%, 200% 100%;\n  animation: raiden-hero-shimmer 7s ease-in-out infinite alternate;\n}\n\nbody[data-dsh-raiden-theme] [data-phase='hero'] [class*='headline'] > [class*='fishHitbox'] svg {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) [aria-current='page'] {\n  background: rgba(242, 155, 194, 0.18);\n  box-shadow: inset 3px 0 0 var(--ds-raiden-pink);\n  border-color: rgba(242, 155, 194, 0.32);\n}\n\n/* hero subtle motion */\n@keyframes raiden-hero-shimmer {\n  0% { background-position: 0% 50%; }\n  100% { background-position: 200% 50%; }\n}\n@keyframes raiden-hero-bob {\n  0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 0 0 6px rgba(242, 155, 194, 0.12), 0 4px 12px rgba(73, 59, 80, 0.16), 0 0 0 0 rgba(231, 185, 87, 0); }\n  50% { transform: translateY(-2px) scale(1.035); box-shadow: 0 0 0 8px rgba(242, 155, 194, 0.18), 0 6px 16px rgba(73, 59, 80, 0.20), 0 0 16px 4px rgba(255, 168, 205, 0.45); }\n}\n\n@keyframes raiden-hero-enter {\n  from { opacity: 0; transform: translateY(10px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@media (prefers-reduced-motion: reduce) {\n  body[data-dsh-raiden-theme] [data-phase='hero'] [class*='headline'],\n  body[data-dsh-raiden-theme] [data-phase='hero'] [class*='headlineText'],\n  body[data-dsh-raiden-theme] [data-phase='hero'] [class*='headline']:has(> [class*='fish']) > [class*='fish'] {\n    animation: none;\n  }\n}\n";
		const componentsCss = "/* Decorative layers + native DSH chrome. Do not restyle third-party plugin roots. */\n\nbody[data-dsh-raiden-theme] [id='root'] {\n  background: transparent;\n}\n\nbody[data-dsh-raiden-theme] [id='root'] div:has(> [class*='sidebarCol']):has(> [class*='centerCol']) {\n  background: transparent;\n}\n\nbody[data-dsh-raiden-theme] [data-skin-chrome='character-stage'] {\n  position: fixed;\n  inset: 0;\n  z-index: 0;\n  overflow: hidden;\n  pointer-events: none;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-wallpaper] {\n  position: fixed;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center 76%;\n  pointer-events: none;\n  opacity: 1;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-wallpaper],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-wallpaper] {\n  object-position: center 62%;\n  filter: saturate(1.08) contrast(1.04);\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-wallpaper][data-raiden-asset-error] {\n  opacity: 0;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-veil='curtain'] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  pointer-events: none;\n  opacity: 1;\n  background:\n    radial-gradient(\n      ellipse 48% 62% at 52% 42%,\n      color-mix(\n        in srgb,\n        var(--raiden-veil, var(--ds-raiden-cream)) calc(var(--raiden-veil-opacity, 0.12) * 130%),\n        transparent\n      ),\n      color-mix(\n        in srgb,\n        var(--raiden-veil, var(--ds-raiden-cream)) calc(var(--raiden-veil-opacity, 0.12) * 35%),\n        transparent\n      ) 68%,\n      transparent 100%\n    );\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-atmosphere] {\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      transparent 48%,\n      color-mix(in srgb, var(--raiden-veil, var(--ds-raiden-cream)) 16%, transparent) 100%\n    ),\n    radial-gradient(\n      ellipse 90% 40% at 50% 100%,\n      color-mix(in srgb, var(--raiden-veil, var(--ds-raiden-cream)) 22%, transparent),\n      transparent 70%\n    );\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-atmosphere],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-atmosphere] {\n  background:\n    radial-gradient(ellipse 36% 48% at 18% 62%, rgba(242, 155, 194, 0.16), transparent 72%),\n    radial-gradient(ellipse 28% 36% at 84% 70%, rgba(231, 185, 87, 0.1), transparent 70%),\n    linear-gradient(180deg, transparent 42%, rgba(18, 10, 28, 0.28) 100%);\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-ground] {\n  position: absolute;\n  z-index: 2;\n  pointer-events: none;\n  height: 54px;\n  border-radius: 50%;\n  filter: blur(12px);\n  background: radial-gradient(ellipse, rgba(73, 59, 80, 0.28), transparent 72%);\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-ground='left'] {\n  left: 0;\n  bottom: 10px;\n  width: min(30vw, 380px);\n  translate: calc(var(--raiden-conversation-left, var(--raiden-sidebar-width)) + clamp(16px, 2vw, 36px)) 0;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-ground='right'] {\n  right: calc(var(--raiden-right-panel-width, var(--raiden-frame-right-inset, 0px)) + 12px);\n  bottom: 12px;\n  width: min(22vw, 280px);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-ground],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-ground] {\n  background: radial-gradient(ellipse, rgba(242, 155, 194, 0.22), rgba(8, 4, 16, 0.42) 42%, transparent 74%);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-hide-left] [data-raiden-ground='left'],\nbody[data-dsh-raiden-theme][data-raiden-hide-right] [data-raiden-ground='right'],\nbody[data-dsh-raiden-theme][data-raiden-right-crowded] [data-raiden-ground='right'] {\n  opacity: 0;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-sparkles] {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  pointer-events: none;\n  opacity: 0.55;\n  background-image:\n    radial-gradient(circle, rgba(255, 216, 231, 0.95) 0 1.5px, transparent 2.4px),\n    radial-gradient(circle, rgba(231, 185, 87, 0.78) 0 1.2px, transparent 2px),\n    radial-gradient(circle, rgba(242, 155, 194, 0.7) 0 1px, transparent 1.8px);\n  background-size: 220px 180px, 280px 240px, 160px 200px;\n  background-position: 12% 18%, 78% 32%, 42% 72%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-low-power] [data-raiden-sparkles],\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-raiden-sparkles],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-raiden-sparkles] {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-sparkles],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-sparkles] {\n  opacity: 0.42;\n  background-image:\n    radial-gradient(circle, rgba(255, 236, 180, 0.95) 0 1.6px, transparent 2.6px),\n    radial-gradient(circle, rgba(242, 165, 200, 0.7) 0 1.2px, transparent 2.1px),\n    radial-gradient(circle, rgba(185, 167, 232, 0.65) 0 1px, transparent 1.8px);\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-character] {\n  position: absolute;\n  display: block;\n  z-index: 2;\n  width: auto;\n  max-width: none;\n  object-fit: contain;\n  object-position: center bottom;\n  pointer-events: none;\n  opacity: var(--raiden-character-opacity, 1);\n  filter:\n    saturate(1.02)\n    contrast(0.98)\n    drop-shadow(0 0 14px rgba(255, 216, 180, 0.22))\n    drop-shadow(0 18px 16px rgba(73, 59, 80, 0.28));\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-character][data-raiden-asset-error] {\n  opacity: 0;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-character],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-character] {\n  filter:\n    brightness(1.04)\n    saturate(0.98)\n    contrast(1.04)\n    drop-shadow(0 0 22px rgba(242, 155, 194, 0.38))\n    drop-shadow(0 0 36px rgba(231, 185, 87, 0.16))\n    drop-shadow(0 20px 18px rgba(8, 4, 16, 0.5));\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-character='left'] {\n  left: 0;\n  bottom: clamp(-18px, -1.2vh, -4px);\n  translate: calc(var(--raiden-conversation-left, var(--raiden-sidebar-width)) + clamp(10px, 1.6vw, 28px)) 0;\n  height: clamp(520px, 88vh, 1080px);\n  max-width: min(32vw, 460px);\n  transform-origin: center bottom;\n  transition: none;\n}\n\nbody[data-dsh-raiden-theme]:not([data-ds-dark-theme]):not([data-raiden-preset='raiden-night']) [data-raiden-character='left'] {\n  filter:\n    saturate(1.02)\n    sepia(0.1)\n    drop-shadow(-14px 0 18px rgba(255, 214, 150, 0.42))\n    drop-shadow(0 0 0.45px #fff4ea)\n    drop-shadow(0 0 16px rgba(255, 216, 180, 0.28))\n    drop-shadow(0 16px 14px rgba(120, 70, 50, 0.22));\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-character='right'] {\n  right: calc(var(--raiden-right-panel-width, var(--raiden-frame-right-inset, 0px)) - 8px);\n  bottom: clamp(-16px, -1vh, -4px);\n  height: clamp(500px, 84vh, 1020px);\n  max-width: min(24vw, 340px);\n  object-position: right bottom;\n  transform-origin: center bottom;\n  transition:\n    right 420ms cubic-bezier(0.22, 0.78, 0.2, 1),\n    height 420ms cubic-bezier(0.22, 0.78, 0.2, 1),\n    opacity 220ms ease;\n}\n\n/* Conservatory: left figure sits on the greenhouse floor. */\nbody[data-dsh-raiden-theme]:not([data-ds-dark-theme]):not([data-raiden-preset='raiden-night']) [data-raiden-character='left'][data-raiden-pose='sit'] {\n  height: clamp(280px, 52vh, 620px);\n  max-width: min(36vw, 520px);\n  bottom: clamp(4px, 1.4vh, 18px);\n}\n\n/* Conservatory: right figure is a standing salute, keep her taller. */\nbody[data-dsh-raiden-theme]:not([data-ds-dark-theme]):not([data-raiden-preset='raiden-night']) [data-raiden-character='right'][data-raiden-pose='stand'] {\n  height: clamp(420px, 72vh, 880px);\n  bottom: clamp(-8px, -0.4vh, 0px);\n}\n\n/* Concert: left wink is a bust, plant her in the spotlight. */\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-character='left'][data-raiden-pose='bust'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-character='left'][data-raiden-pose='bust'] {\n  height: clamp(340px, 58vh, 720px);\n  max-width: min(30vw, 420px);\n  bottom: clamp(8px, 2vh, 28px);\n}\n\n/* Concert: right figure sits at the piano on stage. */\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-raiden-character='right'][data-raiden-pose='sit'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-raiden-character='right'][data-raiden-pose='sit'] {\n  height: clamp(250px, 46vh, 540px);\n  max-width: min(28vw, 380px);\n  bottom: clamp(6px, 1.8vh, 22px);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-better-sidebar-open] [data-raiden-character='right'],\nbody[data-dsh-raiden-theme][data-raiden-details-open] [data-raiden-character='right'],\nbody[data-dsh-raiden-theme][data-dsh-floating-panel-open] [data-raiden-character='right'] {\n  right: calc(var(--raiden-right-panel-width, var(--raiden-frame-right-inset, 0px)) - 6px);\n  height: clamp(360px, 62vh, 780px);\n  opacity: 0.92;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-better-sidebar-open] [data-raiden-character='right'][data-raiden-pose='sit'],\nbody[data-dsh-raiden-theme][data-raiden-details-open] [data-raiden-character='right'][data-raiden-pose='sit'],\nbody[data-dsh-raiden-theme][data-dsh-floating-panel-open] [data-raiden-character='right'][data-raiden-pose='sit'] {\n  height: clamp(220px, 38vh, 420px);\n  opacity: 0.94;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-scene='fused'] [data-raiden-character],\nbody[data-dsh-raiden-theme][data-raiden-scene='fused'] [data-raiden-ground] {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-hide-right] [data-raiden-character='right'],\nbody[data-dsh-raiden-theme][data-raiden-right-crowded] [data-raiden-character='right'] {\n  opacity: 0;\n}\n\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) {\n  position: relative;\n  background: var(--dsw-specific-sidebar-fill);\n}\n\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) [data-raiden-mascot='sidebar'] {\n  position: absolute;\n  left: 50%;\n  top: auto;\n  bottom: calc(var(--raiden-sidebar-footer-height, 56px) + 6px);\n  z-index: 0;\n  width: min(118px, calc(100% - 48px));\n  height: auto;\n  max-height: 15vh;\n  object-fit: contain;\n  object-position: center bottom;\n  border-radius: 0;\n  pointer-events: none;\n  opacity: var(--raiden-character-opacity, 1);\n  translate: -50% 0;\n  filter: drop-shadow(0 6px 12px rgba(73, 59, 80, 0.16));\n}\n\nbody[data-dsh-raiden-theme][data-raiden-hide-mascot] [data-raiden-mascot='sidebar'],\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] [data-raiden-mascot='sidebar'] {\n  display: none;\n}\n\nbody[data-dsh-raiden-theme] [data-raiden-mascot='sidebar'][data-raiden-asset-error] {\n  opacity: 0;\n}\n\n@media (max-width: 1080px) {\n  body[data-dsh-raiden-theme] [data-raiden-character='left'] {\n    height: clamp(380px, 70vh, 720px);\n  }\n\n  body[data-dsh-raiden-theme] [data-raiden-character='right'] {\n    height: clamp(360px, 66vh, 680px);\n  }\n}\n\n@media (max-width: 700px) {\n  body[data-dsh-raiden-theme] [data-raiden-character] {\n    height: clamp(240px, 46vh, 420px);\n    opacity: 0.88;\n  }\n\n  body[data-dsh-raiden-theme] [data-raiden-mascot='sidebar'] {\n    opacity: 0.72;\n    width: 96px;\n  }\n}\n\nbody[data-dsh-raiden-theme] [class*='centerCol'] {\n  background: rgba(255, 247, 241, 0.16);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [class*='centerCol'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [class*='centerCol'] {\n  background: rgba(33, 27, 50, 0.22);\n}\n\nbody[data-dsh-raiden-theme] [class*='centerCol'] [data-phase] {\n  background-color: transparent;\n}\n\nbody[data-dsh-raiden-theme] [class*='centerCol'] [data-conversation-scroll] {\n  background-color: transparent;\n  border-radius: 22px;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [class*='centerCol'] [data-conversation-scroll],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [class*='centerCol'] [data-conversation-scroll] {\n  background-color: transparent;\n}\n\nbody[data-dsh-raiden-theme] :is(\n  [data-pane='conversation'],\n  [class*='centerCol']\n) :is([data-conversation-scroll], [data-chat-flow], [data-composer-card], [data-input-mirror], textarea) {\n  --dsw-alias-label-primary: var(--ds-raiden-text);\n  --dsw-alias-label-primary-bluish: var(--ds-raiden-text);\n  --dsw-alias-brand-text: var(--ds-raiden-text);\n  color: var(--ds-raiden-text);\n  caret-color: var(--ds-raiden-pink);\n}\n\nbody[data-dsh-raiden-theme] [data-chat-flow] :is(\n  [class*='markdown'],\n  [class*='Markdown'],\n  [data-slot='conversation.chat.node']\n) {\n  --dsw-alias-label-primary: var(--ds-raiden-text);\n  color: var(--ds-raiden-text);\n  font-weight: 500;\n  text-shadow: var(--raiden-text-halo);\n}\n\nbody[data-dsh-raiden-theme] [data-chat-flow] :is(pre, code, kbd, samp) {\n  text-shadow: none;\n  font-weight: inherit;\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card] {\n  position: relative;\n  overflow: visible;\n  background: color-mix(in srgb, var(--raiden-acrylic-light) 88%, transparent);\n  border: 1px solid rgba(242, 155, 194, 0.42);\n  border-radius: 16px;\n  box-shadow:\n    inset 0 0 0 1px rgba(231, 185, 87, 0.35),\n    inset 0 1px var(--raiden-highlight);\n  backdrop-filter: blur(12px) saturate(1.06);\n  -webkit-backdrop-filter: blur(12px) saturate(1.06);\n  color: var(--ds-raiden-text);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-low-power] [data-composer-card] {\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n  background: var(--raiden-acrylic-bg-strong);\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card]::before {\n  content: '';\n  position: absolute;\n  left: 8%;\n  right: 8%;\n  top: -2px;\n  height: 2px;\n  pointer-events: none;\n  background: linear-gradient(90deg, transparent, rgba(242, 155, 194, 0.95), rgba(231, 185, 87, 0.95), rgba(242, 155, 194, 0.95), transparent);\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card]::after {\n  content: none;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] {\n  background: var(--raiden-acrylic-dark);\n  border-color: var(--raiden-border-dark);\n}\n\nbody[data-dsh-raiden-theme] [data-slot='sidebar.settings'] [role='dialog'][aria-modal='true'] {\n  background: var(--ds-raiden-cream);\n  color: var(--ds-raiden-text);\n  --dsw-alias-bg-base: var(--ds-raiden-cream);\n  --dsw-alias-bg-layer-1: var(--ds-raiden-cream);\n  --dsw-alias-bg-layer-2: var(--ds-raiden-cream);\n  --dsw-alias-bg-layer-3: var(--ds-raiden-cream-deep);\n}\n\n[data-dsh-raiden-settings] {\n  --ds-raiden-pink: #f29bc2;\n}\n\nbody[data-dsh-raiden-theme] .dsh-raiden-general-row,\n[data-dsh-raiden-settings].dsh-raiden-general-row {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 16px 0;\n  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(73, 59, 80, 0.14));\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-general-title {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-general-note {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-slider-row {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-slider-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  font-size: 14px;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-slider-row input[type='range'] {\n  width: 100%;\n  accent-color: var(--ds-raiden-pink, #f29bc2);\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-general-cubes {\n  display: flex;\n  align-items: stretch;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-general-cube {\n  box-sizing: border-box;\n  flex: 1 1 180px;\n  min-height: 82px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  padding: 20px 32px;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(73, 59, 80, 0.14));\n  border-radius: 16px;\n  background: transparent;\n  font: inherit;\n  font-size: 14px;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-general-cube:hover:not(.is-selected) {\n  background: var(--dsw-alias-interactive-bg-hover, rgba(242, 155, 194, 0.12));\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-general-cube.is-selected {\n  background: var(--dsw-alias-bg-layer-2, rgba(255, 216, 231, 0.35));\n  border-color: var(--dsw-alias-border-l3, rgba(242, 155, 194, 0.42));\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-general-cube:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n\n:is(body[data-dsh-raiden-theme], [data-dsh-raiden-settings]) .dsh-raiden-clover {\n  width: 16px;\n  height: 16px;\n  color: var(--ds-raiden-pink, #f29bc2);\n}\n\n/* Circular chips: new-session stays 36px; brand (collapse) is larger. */\n\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] [data-slot='sidebar.settings'] > :is(button, [role='button']),\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog'],\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']) {\n  position: relative;\n  box-sizing: border-box;\n  width: 36px;\n  height: 36px;\n  min-width: 36px;\n  min-height: 36px;\n  max-width: 36px;\n  padding: 0;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  overflow: visible;\n}\n\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏'],\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar'],\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏'],\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar'] {\n  position: relative;\n  box-sizing: border-box;\n  width: 48px;\n  height: 48px;\n  min-width: 48px;\n  min-height: 48px;\n  max-width: 48px;\n  padding: 0;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  overflow: visible;\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='停止生成'],\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Stop generating'],\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='命令'],\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Commands'] {\n  position: relative;\n  box-sizing: border-box;\n  width: 42px;\n  height: 42px;\n  min-width: 42px;\n  min-height: 42px;\n  padding: 0;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  overflow: visible;\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='命令'],\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Commands'] {\n  overflow: visible;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] [data-slot='sidebar.settings'] > :is(button, [role='button']),\nbody[data-dsh-raiden-theme][data-raiden-sidebar-size='rail'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog'] {\n  width: 42px;\n  height: 42px;\n  min-width: 42px;\n  min-height: 42px;\n  overflow: visible;\n  border-image: none;\n  border-radius: 50%;\n  font-size: 0;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='发送消息'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Send message'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='停止生成'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Stop generating'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='命令'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Commands'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog'] svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']) > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']) > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏'] > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar'] > svg {\n  opacity: 0;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='发送消息']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Send message']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='停止生成']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Stop generating']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='命令']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Commands']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand'])::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand'])::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar']::after {\n  content: '';\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  border-radius: 50%;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 118% 118%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='发送消息']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Send message']::after {\n  background-image: var(--raiden-q-send);\n  background-position: center;\n  background-size: 122% 122%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='停止生成']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Stop generating']::after {\n  background-image: var(--raiden-q-stop);\n  background-position: center;\n  background-size: 122% 122%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='命令']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] [data-composer-card] button[aria-label='Commands']::after {\n  background-image: var(--raiden-q-command);\n  background-position: center;\n  background-size: 122% 122%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']::after {\n  background-image: var(--raiden-q-settings);\n  background-position: center;\n  background-size: 122% 122%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand'])::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready][data-raiden-sidebar-size='rail'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand'])::after {\n  background-image: var(--raiden-q-new);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏']::after,\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar']::after {\n  background-image: var(--raiden-q-brand-right);\n  background-position: center;\n  background-size: 122% 122%;\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] > :is(button, [role='button']),\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog'],\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']),\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']) {\n  position: relative;\n  z-index: 1;\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  width: 100%;\n  min-width: 0;\n  min-height: 56px;\n  height: auto;\n  padding: 8px 16px;\n  overflow: hidden;\n  border-radius: 14px;\n  color: var(--ds-raiden-text);\n  background: var(--raiden-plate-art);\n  border: 1px solid color-mix(in srgb, var(--ds-raiden-pink) 26%, transparent);\n  box-shadow: none;\n  filter: none;\n  font-size: 14px;\n  line-height: 1.2;\n  opacity: 1;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] > :is(button, [role='button']),\nbody[data-dsh-raiden-theme][data-ds-dark-theme]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night']:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] > :is(button, [role='button']),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night']:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-ds-dark-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night']:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night']:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']) {\n  color: var(--ds-raiden-text-on-dark);\n  background: var(--raiden-plate-art);\n  border-color: color-mix(in srgb, var(--ds-raiden-pink) 28%, transparent);\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:hover,\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):hover,\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):hover {\n  filter: brightness(1.06);\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:active,\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):active,\nbody[data-dsh-raiden-theme]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):active {\n  filter: brightness(0.98);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] > :is(button, [role='button'])::before,\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog']::before,\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand'])::before,\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand'])::before {\n  content: '';\n  flex: 0 0 36px;\n  box-sizing: border-box;\n  width: 36px;\n  height: 36px;\n  min-width: 36px;\n  min-height: 36px;\n  aspect-ratio: 1;\n  padding: 0;\n  border-radius: 50%;\n  overflow: hidden;\n  pointer-events: none;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 118% 118%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] > :is(button, [role='button'])::before,\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog']::before {\n  flex: 0 0 44px;\n  width: 44px;\n  height: 44px;\n  min-width: 44px;\n  min-height: 44px;\n  background-image: var(--raiden-q-settings);\n  background-position: center;\n  background-size: 122% 122%;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand'])::before,\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand'])::before {\n  background-image: var(--raiden-q-new);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) [data-slot='sidebar.settings'] button[aria-haspopup='dialog'] svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']) > svg,\nbody[data-dsh-raiden-theme][data-raiden-q-ready]:not([data-raiden-sidebar-size='rail']) :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']) > svg {\n  position: absolute;\n  width: 0;\n  height: 0;\n  opacity: 0;\n  overflow: hidden;\n}\n\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand'] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 10px;\n  min-height: 56px;\n  overflow: hidden;\n  font-size: 0;\n  line-height: 0;\n  color: var(--ds-raiden-pink);\n}\n\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand'] > * {\n  font-size: 0;\n  line-height: 0;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand'] :is(svg, img) {\n  position: absolute;\n  width: 0;\n  height: 0;\n  opacity: 0;\n  overflow: hidden;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-q-ready] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand']::before {\n  content: '';\n  flex: 0 0 56px;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  min-width: 56px;\n  min-height: 56px;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  overflow: hidden;\n  pointer-events: none;\n  background-image: var(--raiden-q-brand);\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 122% 122%;\n}\n\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand']::after {\n  content: 'raiden-harness';\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  min-height: 56px;\n  font-size: 16px;\n  font-weight: 700;\n  line-height: 1.1;\n  letter-spacing: 0.03em;\n  color: var(--ds-raiden-pink);\n  text-shadow: 0 0 10px color-mix(in srgb, var(--ds-raiden-pink) 45%, transparent);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [class*='centerCol'] button,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [class*='centerCol'] button,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [class*='sidebarCol'] button,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [class*='sidebarCol'] button {\n  color: color-mix(in srgb, var(--ds-raiden-gold) 58%, var(--ds-raiden-pink));\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button svg,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button svg,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [class*='centerCol'] button svg,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [class*='centerCol'] button svg,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [class*='sidebarCol'] button svg,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [class*='sidebarCol'] button svg {\n  color: color-mix(in srgb, var(--ds-raiden-gold) 62%, var(--ds-raiden-pink));\n  stroke: currentColor;\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='发送消息']:focus-visible,\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Send message']:focus-visible,\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='停止生成']:focus-visible,\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Stop generating']:focus-visible,\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='命令']:focus-visible,\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Commands']:focus-visible,\nbody[data-dsh-raiden-theme] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:focus-visible,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):focus-visible,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):focus-visible,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏']:focus-visible,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar']:focus-visible,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏']:focus-visible,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar']:focus-visible {\n  outline: 2px solid var(--ds-raiden-pink);\n  outline-offset: 2px;\n}\n\n/* Dark chrome: keep labeled rows on the sidebar fill, no extra glow plate. */\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-slot='sidebar.settings'] > :is(button, [role='button']),\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-slot='sidebar.settings'] button[aria-haspopup='dialog'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-slot='sidebar.settings'] > :is(button, [role='button']),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']) {\n  box-shadow: none;\n  filter: none;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='停止生成'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Stop generating'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='停止生成'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='Stop generating'] {\n  border: 1px solid rgba(242, 165, 200, 0.48);\n  box-shadow:\n    inset 0 1px rgba(255, 244, 250, 0.16),\n    0 0 12px rgba(242, 165, 200, 0.26);\n  transition: box-shadow 140ms ease, border-color 140ms ease, filter 140ms ease, transform 140ms ease;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏'],\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar'] {\n  border: 1px solid rgba(185, 167, 232, 0.32);\n  box-shadow:\n    inset 0 1px rgba(255, 244, 250, 0.1),\n    0 0 8px rgba(242, 165, 200, 0.14);\n  transition: box-shadow 140ms ease, border-color 140ms ease, filter 140ms ease, transform 140ms ease;\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):hover {\n  filter: brightness(1.08);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息']:hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message']:hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='停止生成']:hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Stop generating']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='发送消息']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='Send message']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='停止生成']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] [data-composer-card] button[aria-label='Stop generating']:hover {\n  border-color: rgba(255, 205, 225, 0.82);\n  filter: brightness(1.1);\n  box-shadow:\n    inset 0 1px rgba(255, 255, 255, 0.24),\n    0 0 18px rgba(242, 165, 200, 0.32);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏']:hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar']:hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏']:hover,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏']:hover,\nbody[data-dsh-raiden-theme][data-raiden-preset='raiden-night'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar']:hover {\n  border-color: rgba(255, 205, 225, 0.62);\n  filter: brightness(1.06);\n  box-shadow:\n    inset 0 1px rgba(255, 255, 255, 0.16),\n    0 0 12px rgba(242, 165, 200, 0.22);\n}\n\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='停止生成']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Stop generating']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏']:active,\nbody[data-dsh-raiden-theme][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar']:active {\n  transform: scale(1.02);\n  box-shadow:\n    inset 0 2px 6px rgba(8, 4, 16, 0.42),\n    0 0 8px rgba(242, 165, 200, 0.16);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-low-power][data-ds-dark-theme] [data-slot='sidebar.settings'] button,\nbody[data-dsh-raiden-theme][data-raiden-low-power][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-raiden-low-power][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme][data-raiden-low-power][data-ds-dark-theme] [data-composer-card] button[aria-label='停止生成'],\nbody[data-dsh-raiden-theme][data-raiden-low-power][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']),\nbody[data-dsh-raiden-theme][data-raiden-low-power][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏'],\nbody[data-dsh-raiden-theme][data-raiden-low-power][data-ds-dark-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'][data-ds-dark-theme] [data-slot='sidebar.settings'] button,\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message'] {\n  box-shadow: none;\n  filter: none;\n  animation: none;\n  transition: none;\n}\n\n@media (max-width: 900px) {\n  body[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息'],\n  body[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message'],\n  body[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='停止生成'] {\n    box-shadow:\n      inset 0 1px rgba(255, 244, 250, 0.12),\n      0 0 8px rgba(242, 165, 200, 0.16);\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-dsh-raiden-theme][data-ds-dark-theme] [data-slot='sidebar.settings'] button,\n  body[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息'],\n  body[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message'] {\n    box-shadow: none;\n    animation: none;\n    transition: none;\n  }\n}\n";
		const motionCss = "body[data-dsh-raiden-theme][data-raiden-viewport-resizing] [data-raiden-character],\nbody[data-dsh-raiden-theme][data-raiden-viewport-resizing] [data-skin-chrome='atelier-frame'],\nbody[data-dsh-raiden-theme][data-raiden-viewport-resizing] [data-skin-chrome='sidebar-trim'] {\n  transition: none;\n  filter: none;\n  animation: none;\n}\n\n@keyframes raiden-q-pop {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.08); }\n}\n\n@keyframes raiden-idle-sway {\n  0%, 100% { transform: translateY(0) rotate(0deg); }\n  50% { transform: translateY(-7px) rotate(0.35deg); }\n}\n\n@keyframes raiden-sparkle-drift {\n  0%, 100% { background-position: 12% 18%, 78% 32%, 42% 72%; opacity: 0.42; }\n  50% { background-position: 18% 28%, 70% 24%, 48% 64%; opacity: 0.68; }\n}\n\n@keyframes raiden-send-glow {\n  0%, 100% {\n    box-shadow:\n      inset 0 1px rgba(255, 255, 255, 0.62),\n      0 6px 16px rgba(220, 111, 158, 0.18);\n  }\n  50% {\n    box-shadow:\n      inset 0 1px rgba(255, 255, 255, 0.72),\n      0 8px 18px rgba(220, 111, 158, 0.28);\n  }\n}\n\n@keyframes raiden-breathe {\n  0%, 100% { filter: drop-shadow(0 0 0 transparent); }\n  50% { filter: drop-shadow(0 0 8px color-mix(in srgb, var(--ds-raiden-pink) 45%, transparent)); }\n}\n\n@keyframes raiden-veil-breathe {\n  0%, 100% { filter: saturate(1); }\n  50% { filter: saturate(1.04); }\n}\n\n@keyframes raiden-status-flash {\n  0% { filter: drop-shadow(0 0 0 transparent); }\n  40% { filter: drop-shadow(0 0 8px color-mix(in srgb, var(--ds-raiden-gold) 70%, transparent)); }\n  100% { filter: drop-shadow(0 0 0 transparent); }\n}\n\n@keyframes raiden-error-pulse {\n  0% { filter: drop-shadow(0 0 0 transparent); }\n  40% { filter: drop-shadow(0 0 8px color-mix(in srgb, var(--ds-raiden-ribbon) 60%, transparent)); }\n  100% { filter: drop-shadow(0 0 0 transparent); }\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='idle'] [data-raiden-veil='curtain'] {\n  animation: raiden-veil-breathe calc(10s * var(--raiden-motion-duration, 1)) ease-in-out infinite;\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-low-power]):not([data-dsh-raiden-motion='off']):not([data-dsh-raiden-reduced-motion='true']) [data-raiden-character] {\n  animation: raiden-idle-sway calc(5.6s * var(--raiden-motion-duration, 1)) ease-in-out infinite;\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-low-power]):not([data-dsh-raiden-motion='off']):not([data-dsh-raiden-reduced-motion='true']) [data-raiden-character='right'] {\n  animation-duration: calc(6.4s * var(--raiden-motion-duration, 1));\n  animation-delay: -1.8s;\n}\n\nbody[data-dsh-raiden-theme]:not([data-raiden-low-power]):not([data-dsh-raiden-motion='off']):not([data-dsh-raiden-reduced-motion='true']) [data-raiden-sparkles] {\n  animation: raiden-sparkle-drift calc(9s * var(--raiden-motion-duration, 1)) ease-in-out infinite;\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Send message'] {\n  animation: raiden-send-glow calc(2.8s * var(--raiden-motion-duration, 1)) ease-in-out infinite;\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='发送消息']:hover:not(:disabled),\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Send message']:hover:not(:disabled) {\n  transform: scale(1.02);\n}\n\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='发送消息']:active:not(:disabled),\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Send message']:active:not(:disabled) {\n  transform: scale(1.02);\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='thinking'] [data-skin-chrome='atelier-frame'] {\n  animation: raiden-breathe 1.8s ease-in-out infinite;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='success'] [data-skin-chrome='atelier-frame'] {\n  animation: raiden-status-flash 700ms ease-out 1;\n}\n\nbody[data-dsh-raiden-theme][data-raiden-state='error'] [data-skin-chrome='atelier-frame'] {\n  animation: raiden-error-pulse 700ms ease-out 1;\n}\n\nbody[data-dsh-raiden-theme] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:hover::before,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand']:hover::before,\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='命令']:hover::after,\nbody[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Commands']:hover::after,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='打开侧边栏']:hover::after,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Open sidebar']:hover::after,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='收起侧边栏']:hover::after,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='Collapse sidebar']:hover::after,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):hover::before,\nbody[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):hover::before {\n  animation: raiden-q-pop 0.45s ease;\n}\n\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-raiden-character],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-raiden-character],\nbody[data-dsh-raiden-theme][data-raiden-low-power] [data-raiden-character],\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-raiden-sparkles],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-raiden-sparkles],\nbody[data-dsh-raiden-theme][data-raiden-low-power] [data-raiden-sparkles],\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme][data-raiden-low-power] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-raiden-low-power] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='发送消息'],\nbody[data-dsh-raiden-theme][data-ds-dark-theme] [data-composer-card] button[aria-label='Send message'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-raiden-veil='curtain'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-raiden-veil='curtain'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-skin-chrome='atelier-frame'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-skin-chrome='atelier-frame'],\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:hover::before,\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:hover::before,\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand']:hover::before,\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand']:hover::before,\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-composer-card] button[aria-label='命令']:hover::after,\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-composer-card] button[aria-label='命令']:hover::after,\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] [data-composer-card] button[aria-label='Commands']:hover::after,\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] [data-composer-card] button[aria-label='Commands']:hover::after,\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):hover::before,\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):hover::before,\nbody[data-dsh-raiden-theme][data-dsh-raiden-motion='off'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):hover::before,\nbody[data-dsh-raiden-theme][data-dsh-raiden-reduced-motion='true'] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):hover::before {\n  animation: none;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-dsh-raiden-theme] [data-raiden-character],\n  body[data-dsh-raiden-theme] [data-raiden-veil='curtain'],\n  body[data-dsh-raiden-theme] [data-skin-chrome],\n  body[data-dsh-raiden-theme] [data-composer-card] button[aria-label='发送消息'],\n  body[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Send message'],\n  body[data-dsh-raiden-theme] [data-slot='sidebar.settings'] button[aria-haspopup='dialog']:hover::before,\n  body[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[class*='brand']:hover::before,\n  body[data-dsh-raiden-theme] [data-composer-card] button[aria-label='命令']:hover::before,\n  body[data-dsh-raiden-theme] [data-composer-card] button[aria-label='Commands']:hover::before,\n  body[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='新建会话']:not([class*='brand']):hover::before,\n  body[data-dsh-raiden-theme] :is([data-pane='sidebar'], [class*='sidebarCol']) button[aria-label='New session']:not([class*='brand']):hover::before {\n    animation: none;\n    transition: none;\n  }\n}\n";
		//#endregion
		//#region src/client/styles.ts
		const STYLE_ID = "dsh-raiden-theme-style";
		const THEME_CSS = `${tokensCss}\n${surfacesCss}\n${badgesCss}\n${componentsCss}\n${motionCss}`;
		function ensureStyleNode(doc) {
			const existing = doc.getElementById(STYLE_ID);
			if (existing instanceof HTMLStyleElement) {
				if (existing.textContent !== THEME_CSS) existing.textContent = THEME_CSS;
				return existing;
			}
			const style = doc.createElement("style");
			style.id = STYLE_ID;
			style.setAttribute("data-dsh-raiden-theme", "style");
			style.setAttribute("data-plugin-css", "@dsh-external/dsh-raiden-theme");
			style.textContent = THEME_CSS;
			doc.head.append(style);
			return style;
		}
		function removeStyleNode(doc) {
			doc.getElementById(STYLE_ID)?.remove();
		}
		//#endregion
		//#region src/client/chrome-selectors.ts
		/** DSH public DOM API selectors — single source of truth for chrome hooks. */
		const SKIN_OWNER = "dsh-raiden-theme";
		const SIDEBAR_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])";
		const DETAILS_SELECTOR = ":is([data-pane='details'], [class*='detailsCol'], [class*='_explorer']:not([class*='Body']):not([class*='body']))";
		const CONVERSATION_SELECTOR = ":is([data-pane='conversation'], [class*='centerCol'])";
		const HERO_SELECTOR = "[data-phase='hero']";
		const ACTIVE_SELECTOR = "[data-phase='active']";
		const CHAT_FLOW_SELECTOR = "[data-chat-flow]";
		const CONVERSATION_SCROLL_SELECTOR = "[data-conversation-scroll]";
		const COMPOSER_OVERLAY_SELECTOR = "[data-conversation-composer-overlay]";
		const COMPOSER_CARD_SELECTOR = "[data-composer-card]";
		const SETTINGS_DIALOG_SELECTOR = "[data-slot='sidebar.settings'] [role='dialog'][aria-modal='true']";
		const WORKSPACE_SELECTOR = "header [role='tablist']";
		const BETTER_SIDEBAR_SELECTOR = "[data-dsh-better-sidebar]";
		const RIGHT_DOCK_SELECTOR = [
			DETAILS_SELECTOR,
			BETTER_SIDEBAR_SELECTOR,
			"[data-dsh-floating-panel]",
			"[data-plugin-root]"
		].join(", ");
		const TOOL_CALL_SELECTOR = "[data-tool-call]";
		const STREAMING_SELECTOR = "[data-streaming=\"true\"]";
		//#endregion
		//#region src/client/metrics-stamp.ts
		const METRICS_OPT_OUT_KEY = "dsh-raiden-theme:metrics";
		const MISS_GRACE_MS = 3e3;
		let enabledGetter = () => true;
		let selectorWarned = false;
		let mountedAt = 0;
		let lastMetricsSignature = "";
		function setMetricsEnabledGetter(getter) {
			enabledGetter = getter;
		}
		function metricsStampingEnabled() {
			try {
				return localStorage.getItem(METRICS_OPT_OUT_KEY) !== "0";
			} catch {
				return true;
			}
		}
		function selectorMisses(doc) {
			const misses = [];
			const required = [
				["SIDEBAR_SELECTOR", SIDEBAR_SELECTOR],
				["COMPOSER_CARD_SELECTOR", COMPOSER_CARD_SELECTOR],
				["CONVERSATION_SELECTOR", CONVERSATION_SELECTOR]
			];
			for (const [name, selector] of required) if (!doc.querySelector(selector)) misses.push(name);
			if (doc.querySelector("[data-phase='hero']") === null && doc.querySelector("[data-phase='active']") === null) misses.push("PHASE_SELECTOR");
			if (doc.querySelector("[data-phase='active']") !== null) {
				if (!(doc.querySelector(`[data-phase='active'] [data-chat-flow]`) ?? doc.querySelector("[data-chat-flow]"))) misses.push("CHAT_FLOW_SELECTOR");
			}
			return misses;
		}
		function parsePx(value) {
			const parsed = Number.parseFloat(value);
			return Number.isFinite(parsed) ? parsed : 0;
		}
		function readMetricsFromBody(body, enabled, scene) {
			const view = body.ownerDocument.defaultView;
			const computed = view?.getComputedStyle(body);
			const frameWidth = parsePx(computed?.getPropertyValue("--raiden-frame-width") ?? "0");
			const frameHeight = parsePx(computed?.getPropertyValue("--raiden-frame-height") ?? "0");
			let phase = "unknown";
			if (body.querySelector("[data-phase='hero']")) phase = "hero";
			else if (body.querySelector("[data-phase='active']")) phase = "active";
			return {
				scene,
				at: (/* @__PURE__ */ new Date()).toISOString(),
				enabled,
				selectorMisses: selectorMisses(body.ownerDocument),
				frameWidth: Math.round(frameWidth),
				frameHeight: Math.round(frameHeight),
				frameHidden: body.hasAttribute("data-raiden-frame-hidden"),
				frameCompact: body.hasAttribute("data-raiden-frame-compact"),
				phase,
				viewportWidth: view?.innerWidth ?? 0,
				viewportHeight: view?.innerHeight ?? 0
			};
		}
		function stampMetrics(doc, body, scene) {
			if (!metricsStampingEnabled()) return;
			const node = doc.getElementById(STYLE_ID);
			if (!(node instanceof HTMLStyleElement)) return;
			const payload = readMetricsFromBody(body, enabledGetter(), scene);
			const signature = JSON.stringify({
				...payload,
				at: ""
			});
			if (signature === lastMetricsSignature) return;
			lastMetricsSignature = signature;
			node.setAttribute("data-raiden-metrics", JSON.stringify(payload));
			maybeWarnSelectorMisses(payload.enabled, payload.selectorMisses);
		}
		function maybeWarnSelectorMisses(enabled, misses) {
			if (!enabled || selectorWarned || misses.length === 0) return;
			if (Date.now() - mountedAt < MISS_GRACE_MS) return;
			console.warn("[dsh-raiden-theme] selector miss:", misses.join(", "));
			selectorWarned = true;
		}
		function clearMetricsStamp(doc) {
			doc.getElementById(STYLE_ID)?.removeAttribute("data-raiden-metrics");
		}
		function resetMetricsStampState() {
			selectorWarned = false;
			mountedAt = Date.now();
			lastMetricsSignature = "";
		}
		const PLUGIN_ASSET_BASE = `/plugins/@dsh-external/dsh-raiden-theme/assets/raiden`;
		/** Bumped when shipped art changes so browsers skip the 24h asset cache. */
		const ASSET_SET_VERSION = "2026-08-26-raiden-v1";
		function buildAssetUrl(relativePath) {
			const clean = relativePath.replace(/^\/+/, "");
			return `${PLUGIN_ASSET_BASE}/${clean}?v=${ASSET_SET_VERSION}`;
		}
		//#endregion
		//#region src/client/bundled-assets.ts
		/** Default stage art URLs — served from the plugin assets directory, not inlined in client.js. */
		const BUNDLED_AVATAR = buildAssetUrl("avatar.webp");
		const BUNDLED_AVATAR_NIGHT = buildAssetUrl("avatar-night.webp");
		const BUNDLED_PORTRAIT = buildAssetUrl("portrait.webp");
		const BUNDLED_WALLPAPER_LIGHT = buildAssetUrl("wallpaper-light.webp");
		const BUNDLED_WALLPAPER_DARK = buildAssetUrl("wallpaper-dark.webp");
		const BUNDLED_LEFT_LIGHT = buildAssetUrl("left-light.webp");
		const BUNDLED_RIGHT_LIGHT = buildAssetUrl("right-light.webp");
		const BUNDLED_LEFT_DARK = buildAssetUrl("left-dark.webp");
		const BUNDLED_RIGHT_DARK = buildAssetUrl("right-dark.webp");
		const BUNDLED_HERO_AVATAR = buildAssetUrl("hero-avatar.webp");
		//#endregion
		//#region src/client/bundled-q.ts
		/** Q chrome headshot URLs — served from assets/raiden/icons, not inlined in client.js. */
		const BUNDLED_Q_FACE = buildAssetUrl("icons/face-look.webp");
		const BUNDLED_Q_SEND = buildAssetUrl("icons/face-happy.webp");
		const BUNDLED_Q_STOP = buildAssetUrl("icons/face-stop.webp");
		const BUNDLED_Q_NEW = buildAssetUrl("icons/face-new.webp");
		const BUNDLED_Q_SETTINGS = buildAssetUrl("icons/face-wink.webp");
		const BUNDLED_Q_BRAND = buildAssetUrl("icons/face-look.webp");
		const BUNDLED_Q_BRAND_RIGHT = buildAssetUrl("icons/face-pet.webp");
		const BUNDLED_Q_COMMAND = buildAssetUrl("icons/face-portrait.webp");
		//#endregion
		//#region src/assets/resolve.ts
		function isNightScene(root = document.body) {
			return root.hasAttribute("data-ds-dark-theme") || root.getAttribute("data-raiden-preset") === "raiden-night";
		}
		function pickImage(candidate, fallback) {
			return candidate && isAllowedImageProtocol(candidate) ? candidate : fallback;
		}
		function resolveAvatarUrl(settings, custom, night = isNightScene()) {
			const fallback = night && BUNDLED_AVATAR_NIGHT ? BUNDLED_AVATAR_NIGHT : BUNDLED_AVATAR;
			return pickImage(custom?.avatar ?? (settings.avatar !== "default" ? settings.avatar : void 0) ?? fallback, fallback);
		}
		function resolvePortraitUrl(settings, custom) {
			if (settings.portrait === "off") return null;
			return pickImage(custom?.portrait ?? (settings.portrait !== "default" ? settings.portrait : void 0) ?? BUNDLED_PORTRAIT, BUNDLED_PORTRAIT);
		}
		function resolveWallpaperUrl(night) {
			const candidate = night ? BUNDLED_WALLPAPER_DARK : BUNDLED_WALLPAPER_LIGHT;
			return candidate && isAllowedImageProtocol(candidate) ? candidate : "";
		}
		function resolvePortraitFallback() {
			return pickImage(BUNDLED_PORTRAIT, BUNDLED_AVATAR);
		}
		function resolveFigureUrls(night) {
			const left = night ? BUNDLED_LEFT_DARK : BUNDLED_LEFT_LIGHT;
			const right = night ? BUNDLED_RIGHT_DARK : BUNDLED_RIGHT_LIGHT;
			return {
				left: pickImage(left, BUNDLED_PORTRAIT),
				right: pickImage(right, BUNDLED_PORTRAIT)
			};
		}
		function resolveQChromeUrls(settings) {
			const avatar = resolveAvatarUrl(settings);
			const portrait = resolvePortraitUrl(settings) ?? avatar;
			return {
				face: pickImage(BUNDLED_Q_FACE, avatar),
				send: pickImage(BUNDLED_Q_SEND, avatar),
				stop: pickImage(BUNDLED_Q_STOP, avatar),
				newSession: pickImage(BUNDLED_Q_NEW, avatar),
				settings: pickImage(BUNDLED_Q_SETTINGS, avatar),
				brand: pickImage(BUNDLED_Q_BRAND, portrait),
				brandRight: pickImage(BUNDLED_Q_BRAND_RIGHT, portrait),
				command: pickImage(BUNDLED_Q_COMMAND, portrait)
			};
		}
		//#endregion
		//#region src/client/performance.ts
		/** When true, disable blur-heavy acrylic and extra motion work. */
		function shouldUseLowPower(settings) {
			if (settings.reducedMotion || settings.motion === "off") return true;
			if (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
			if (typeof navigator !== "undefined") {
				if (navigator.connection?.saveData === true) return true;
			}
			const nav = navigator;
			if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4 && typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
			return false;
		}
		//#endregion
		//#region src/client/mount.ts
		const ROOT_ATTR = "data-dsh-raiden-theme";
		const Q_VARS = [
			"--raiden-hero-avatar",
			"--raiden-q-face",
			"--raiden-q-send",
			"--raiden-q-stop",
			"--raiden-q-new",
			"--raiden-q-settings",
			"--raiden-q-brand",
			"--raiden-q-brand-right",
			"--raiden-q-command"
		];
		function tagChrome(node, chrome) {
			node.dataset.skinOwner = SKIN_OWNER;
			node.dataset.skinChrome = chrome;
			node.setAttribute("aria-hidden", "true");
			return node;
		}
		function bindAssetFallback(image, fallbackSrc) {
			image.addEventListener("error", () => {
				const current = image.getAttribute("src") ?? "";
				if (fallbackSrc && current !== fallbackSrc) {
					delete image.dataset.raidenAssetError;
					image.src = fallbackSrc;
					return;
				}
				image.dataset.raidenAssetError = "";
			});
			image.addEventListener("load", () => {
				delete image.dataset.raidenAssetError;
			});
		}
		function applyImageSrc(image, src) {
			delete image.dataset.raidenAssetError;
			if (image.getAttribute("src") === src) return;
			image.src = src;
		}
		function makeImage(src, character, pose) {
			const image = document.createElement("img");
			image.dataset.skinOwner = SKIN_OWNER;
			image.dataset.raidenCharacter = character;
			image.dataset.raidenPose = pose;
			image.alt = "";
			image.decoding = "async";
			bindAssetFallback(image, resolvePortraitFallback());
			applyImageSrc(image, src);
			return image;
		}
		function scenePoses(night) {
			return night ? {
				left: "bust",
				right: "sit"
			} : {
				left: "sit",
				right: "stand"
			};
		}
		function makeMascot(src) {
			const image = document.createElement("img");
			image.dataset.skinOwner = SKIN_OWNER;
			image.dataset.raidenMascot = "sidebar";
			image.alt = "";
			image.decoding = "async";
			bindAssetFallback(image, resolvePortraitFallback());
			applyImageSrc(image, src);
			return image;
		}
		const Q_PRELOAD_TIMEOUT_MS = 12e3;
		function preloadImage(url, timeoutMs = Q_PRELOAD_TIMEOUT_MS) {
			if (!url || url === "none") return Promise.resolve(false);
			if (url.startsWith("data:image/")) return Promise.resolve(true);
			return new Promise((resolve) => {
				const image = new Image();
				let settled = false;
				const finish = (ok) => {
					if (settled) return;
					settled = true;
					window.clearTimeout(timer);
					resolve(ok);
				};
				const timer = window.setTimeout(() => finish(false), timeoutMs);
				image.onload = () => finish(true);
				image.onerror = () => finish(false);
				image.src = url;
			});
		}
		const Q_READY_ATTR = "data-raiden-q-ready";
		const appliedQChrome = /* @__PURE__ */ new WeakMap();
		const pendingQChrome = /* @__PURE__ */ new WeakMap();
		const preloadedQImages = /* @__PURE__ */ new Map();
		let qChromeEpoch = 0;
		function preloadQImage(url) {
			if (!url || url === "none" || url.startsWith("data:image/")) return Promise.resolve(Boolean(url) && url !== "none");
			const cached = preloadedQImages.get(url);
			if (cached) return cached;
			const loaded = preloadImage(url);
			loaded.then((ok) => {
				if (!ok) preloadedQImages.delete(url);
			});
			preloadedQImages.set(url, loaded);
			return loaded;
		}
		function applyQChromeVars(body, settings) {
			const q = resolveQChromeUrls(settings);
			const entries = [
				["--raiden-q-face", q.face],
				["--raiden-q-send", q.send],
				["--raiden-q-stop", q.stop],
				["--raiden-q-new", q.newSession],
				["--raiden-q-settings", q.settings],
				["--raiden-q-brand", q.brand],
				["--raiden-q-brand-right", q.brandRight],
				["--raiden-q-command", q.command]
			];
			const signature = JSON.stringify(entries);
			if (appliedQChrome.get(body) === signature && entries.every(([key, url]) => body.style.getPropertyValue(key) === `url("${url}")`) && body.hasAttribute(Q_READY_ATTR) || pendingQChrome.get(body) === signature) return;
			const epoch = ++qChromeEpoch;
			pendingQChrome.set(body, signature);
			body.removeAttribute(Q_READY_ATTR);
			for (const [key] of entries) body.style.setProperty(key, "none");
			Promise.all(entries.map(async ([key, url]) => {
				const ok = await preloadQImage(url);
				if (epoch !== qChromeEpoch) return false;
				body.style.setProperty(key, ok ? `url("${url}")` : "none");
				return ok;
			})).then((loaded) => {
				if (epoch !== qChromeEpoch) return;
				if (loaded.every(Boolean)) appliedQChrome.set(body, signature);
				else appliedQChrome.delete(body);
				if (loaded.every(Boolean)) body.setAttribute(Q_READY_ATTR, "");
			}).finally(() => {
				if (pendingQChrome.get(body) === signature) pendingQChrome.delete(body);
			});
		}
		function applyRootAttributes(body, settings, state) {
			if (!settings.enabled) {
				body.removeAttribute(ROOT_ATTR);
				body.removeAttribute("data-raiden-state");
				body.removeAttribute("data-raiden-preset");
				body.removeAttribute("data-dsh-raiden-intensity");
				body.removeAttribute("data-dsh-raiden-motion");
				body.removeAttribute("data-dsh-raiden-reduced-motion");
				body.removeAttribute("data-raiden-veil");
				body.removeAttribute("data-raiden-acrylic-percent");
				body.removeAttribute("data-raiden-frame-opacity");
				body.removeAttribute("data-raiden-panel-opacity");
				body.removeAttribute("data-raiden-character-opacity");
				body.removeAttribute("data-raiden-scene");
				body.removeAttribute("data-raiden-hide-left");
				body.removeAttribute("data-raiden-hide-right");
				body.removeAttribute("data-raiden-hide-mascot");
				body.removeAttribute("data-raiden-q-ready");
				appliedQChrome.delete(body);
				body.removeAttribute("data-raiden-low-power");
				clearOpacityVars(body);
				return;
			}
			body.setAttribute(ROOT_ATTR, "");
			body.setAttribute("data-raiden-state", state);
			body.setAttribute("data-raiden-preset", settings.colors.preset);
			body.setAttribute("data-dsh-raiden-intensity", settings.colors.dynamicIntensity);
			body.setAttribute("data-dsh-raiden-motion", settings.motion === "off" ? "off" : "standard");
			body.setAttribute("data-dsh-raiden-reduced-motion", settings.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "true" : "false");
			body.setAttribute("data-raiden-veil", veilBucket(settings));
			body.setAttribute("data-raiden-acrylic-percent", String(settings.acrylicPercent));
			body.setAttribute("data-raiden-frame-opacity", String(settings.frameOpacity));
			body.setAttribute("data-raiden-panel-opacity", String(settings.panelOpacity));
			body.setAttribute("data-raiden-character-opacity", String(settings.characterOpacity));
			body.setAttribute("data-raiden-scene", "fused");
			applyOpacityVars(body, settings);
			body.style.setProperty("--raiden-hero-avatar", `url("${BUNDLED_HERO_AVATAR}")`);
			body.toggleAttribute("data-raiden-hide-left", !settings.showLeftCharacter);
			body.toggleAttribute("data-raiden-hide-right", !settings.showRightCharacter);
			body.toggleAttribute("data-raiden-hide-mascot", !settings.showMascot);
			body.toggleAttribute("data-raiden-low-power", shouldUseLowPower(settings));
			applyQChromeVars(body, settings);
		}
		function syncStageArt(root = document.body, settings) {
			const night = isNightScene(root);
			const wallpaper = root.querySelector("[data-raiden-wallpaper]");
			const wallpaperUrl = resolveWallpaperUrl(night);
			if (wallpaper instanceof HTMLImageElement && wallpaperUrl) applyImageSrc(wallpaper, wallpaperUrl);
			const figures = resolveFigureUrls(night);
			const poses = scenePoses(night);
			const left = root.querySelector("[data-raiden-character='left']");
			const right = root.querySelector("[data-raiden-character='right']");
			const mascot = root.querySelector("[data-raiden-mascot='sidebar']");
			if (left instanceof HTMLImageElement) {
				left.dataset.raidenPose = poses.left;
				applyImageSrc(left, figures.left);
			}
			if (right instanceof HTMLImageElement) {
				right.dataset.raidenPose = poses.right;
				applyImageSrc(right, figures.right);
			}
			if (settings && mascot instanceof HTMLImageElement) applyImageSrc(mascot, resolveAvatarUrl(settings, void 0, night));
		}
		function createCharacterStage(settings) {
			if (!settings.enabled) return null;
			const night = isNightScene();
			const stage = tagChrome(document.createElement("div"), "character-stage");
			const wallpaperUrl = resolveWallpaperUrl(night);
			if (wallpaperUrl) {
				const wallpaper = document.createElement("img");
				wallpaper.dataset.skinOwner = SKIN_OWNER;
				wallpaper.dataset.raidenWallpaper = "paper";
				wallpaper.alt = "";
				wallpaper.decoding = "async";
				bindAssetFallback(wallpaper);
				applyImageSrc(wallpaper, wallpaperUrl);
				stage.append(wallpaper);
			}
			const veil = document.createElement("div");
			veil.dataset.skinOwner = SKIN_OWNER;
			veil.dataset.raidenVeil = "curtain";
			stage.append(veil);
			const sparkles = document.createElement("div");
			sparkles.dataset.skinOwner = SKIN_OWNER;
			sparkles.dataset.raidenSparkles = "ambient";
			sparkles.setAttribute("aria-hidden", "true");
			const atmosphere = document.createElement("div");
			atmosphere.dataset.skinOwner = SKIN_OWNER;
			atmosphere.dataset.raidenAtmosphere = "haze";
			atmosphere.setAttribute("aria-hidden", "true");
			if (settings.portrait !== "off") {
				const figures = resolveFigureUrls(night);
				const poses = scenePoses(night);
				const leftGround = document.createElement("div");
				leftGround.dataset.skinOwner = SKIN_OWNER;
				leftGround.dataset.raidenGround = "left";
				leftGround.setAttribute("aria-hidden", "true");
				const rightGround = document.createElement("div");
				rightGround.dataset.skinOwner = SKIN_OWNER;
				rightGround.dataset.raidenGround = "right";
				rightGround.setAttribute("aria-hidden", "true");
				stage.append(leftGround, rightGround, makeImage(figures.left, "left", poses.left), makeImage(figures.right, "right", poses.right));
			}
			stage.append(atmosphere, sparkles);
			return stage;
		}
		function createAtelierFrame() {
			const frame = tagChrome(document.createElement("div"), "atelier-frame");
			const corners = document.createElement("span");
			corners.dataset.raidenFrameCorners = "";
			corners.setAttribute("aria-hidden", "true");
			for (const corner of [
				"top-left",
				"top-right",
				"bottom-left",
				"bottom-right"
			]) {
				const node = document.createElement("span");
				node.dataset.raidenFrameCorner = corner;
				node.setAttribute("aria-hidden", "true");
				corners.append(node);
			}
			const badge = document.createElement("span");
			badge.dataset.raidenFrameBadge = "";
			badge.setAttribute("aria-hidden", "true");
			frame.append(corners, badge);
			return frame;
		}
		function createStageCurtains() {
			return [tagChrome(document.createElement("div"), "raiden-top-curtain"), tagChrome(document.createElement("div"), "raiden-bottom-curtain")];
		}
		function createSidebarTrim() {
			const trim = tagChrome(document.createElement("div"), "sidebar-trim");
			for (const corner of [
				"top-left",
				"top-right",
				"bottom-right",
				"bottom-left"
			]) {
				const node = document.createElement("span");
				node.dataset.raidenSidebarCorner = corner;
				node.setAttribute("aria-hidden", "true");
				trim.append(node);
			}
			for (const part of ["ribbon", "swag"]) {
				const node = document.createElement("span");
				node.dataset.raidenSidebarOrnament = part;
				node.setAttribute("aria-hidden", "true");
				trim.append(node);
			}
			return trim;
		}
		function createTrims() {
			return [
				...createStageCurtains(),
				createAtelierFrame(),
				createSidebarTrim()
			];
		}
		function decorateSidebar(settings, sidebar) {
			if (sidebar.querySelector("[data-raiden-mascot='sidebar']")) return [];
			const inner = sidebar.querySelector(":scope > div");
			const host = inner instanceof HTMLElement ? inner : sidebar;
			const mascot = makeMascot(resolveAvatarUrl(settings, void 0, isNightScene()));
			host.prepend(mascot);
			return [mascot];
		}
		function removeOwnedChrome(root = document) {
			root.querySelectorAll(`[data-skin-owner="${SKIN_OWNER}"]`).forEach((node) => node.remove());
		}
		const OPACITY_VARS = [
			"--raiden-frame-opacity",
			"--raiden-panel-opacity",
			"--raiden-veil-opacity",
			"--raiden-character-opacity",
			"--raiden-acrylic-percent"
		];
		function clearOpacityVars(body) {
			for (const key of OPACITY_VARS) body.style.removeProperty(key);
		}
		function applyOpacityVars(body, settings) {
			body.style.setProperty("--raiden-frame-opacity", String(settings.frameOpacity / 100));
			body.style.setProperty("--raiden-panel-opacity", String(settings.panelOpacity));
			body.style.setProperty("--raiden-veil-opacity", String(settings.veilOpacity / 100));
			body.style.setProperty("--raiden-character-opacity", String(settings.characterOpacity / 100));
			body.style.setProperty("--raiden-acrylic-percent", String(settings.acrylicPercent));
		}
		const TAFFY_INLINE_STYLE_KEYS = [
			...Q_VARS,
			...OPACITY_VARS,
			"--raiden-conversation-left",
			"--raiden-conversation-top",
			"--raiden-conversation-width",
			"--raiden-conversation-height",
			"--raiden-conversation-content-left",
			"--raiden-conversation-content-width",
			"--raiden-conversation-viewport-top",
			"--raiden-conversation-viewport-height",
			"--raiden-content-left",
			"--raiden-content-width",
			"--raiden-viewport-top",
			"--raiden-viewport-height",
			"--raiden-frame-left",
			"--raiden-frame-top",
			"--raiden-frame-width",
			"--raiden-frame-height",
			"--raiden-right-panel-width",
			"--raiden-frame-right-inset"
		];
		//#endregion
		//#region src/client/backdrop.ts
		function applyBackdrop(body) {
			if (!body.hasAttribute("data-dsh-raiden-theme")) return;
			syncStageArt(body);
		}
		function startBackdropSync(body) {
			applyBackdrop(body);
			const observer = new MutationObserver(() => applyBackdrop(body));
			observer.observe(body, {
				attributes: true,
				attributeFilter: [
					"data-ds-dark-theme",
					"data-dsh-raiden-theme",
					"data-raiden-preset"
				]
			});
			return () => {
				observer.disconnect();
			};
		}
		//#endregion
		//#region src/client/schedule.ts
		/** Coalesce DOM work to one animation frame, optionally capped by a minimum interval. */
		function createRafScheduler(run, minIntervalMs = 0) {
			let raf = 0;
			let timeout = 0;
			let lastRun = 0;
			let intervalMs = minIntervalMs;
			const invoke = () => {
				lastRun = typeof performance !== "undefined" ? performance.now() : Date.now();
				run();
			};
			const scheduleFrame = () => {
				if (raf) return;
				raf = requestAnimationFrame(() => {
					raf = 0;
					invoke();
				});
			};
			const schedule = () => {
				if (raf || timeout) return;
				const now = typeof performance !== "undefined" ? performance.now() : Date.now();
				const elapsed = lastRun > 0 ? now - lastRun : intervalMs;
				if (intervalMs > 0 && elapsed < intervalMs) {
					timeout = window.setTimeout(() => {
						timeout = 0;
						scheduleFrame();
					}, intervalMs - elapsed);
					return;
				}
				scheduleFrame();
			};
			return {
				schedule,
				flush: () => {
					if (raf) cancelAnimationFrame(raf);
					if (timeout) clearTimeout(timeout);
					raf = 0;
					timeout = 0;
					invoke();
				},
				cancel: () => {
					if (raf) cancelAnimationFrame(raf);
					if (timeout) clearTimeout(timeout);
					raf = 0;
					timeout = 0;
				},
				setMinInterval: (ms) => {
					intervalMs = Math.max(0, ms);
				}
			};
		}
		//#endregion
		//#region src/client/projected-state.ts
		const STATE_TRACKED_SELECTOR = [
			ACTIVE_SELECTOR,
			CHAT_FLOW_SELECTOR,
			WORKSPACE_SELECTOR,
			BETTER_SIDEBAR_SELECTOR,
			SETTINGS_DIALOG_SELECTOR,
			"[data-dsh-floating-panel]"
		].join(", ");
		function touchesTrackedState(node) {
			if (!(node instanceof Element)) return false;
			return node.matches(STATE_TRACKED_SELECTOR) || node.closest(STATE_TRACKED_SELECTOR) !== null || node.querySelector(STATE_TRACKED_SELECTOR) !== null;
		}
		function startProjectedState(body) {
			const sync = () => {
				const conversationFlow = body.querySelector(`${ACTIVE_SELECTOR} ${CHAT_FLOW_SELECTOR}`) !== null;
				body.toggleAttribute("data-raiden-chat-active", conversationFlow);
				body.toggleAttribute("data-raiden-conversation-active", body.querySelector(ACTIVE_SELECTOR) !== null);
				body.toggleAttribute("data-raiden-workspace", body.querySelector(WORKSPACE_SELECTOR) !== null);
				body.toggleAttribute("data-raiden-better-sidebar-open", (() => {
					const panel = body.querySelector(BETTER_SIDEBAR_SELECTOR);
					if (!(panel instanceof HTMLElement)) return false;
					if (body.hasAttribute("data-dsh-sidebar-collapsed")) return false;
					const box = panel.getBoundingClientRect();
					return box.height > 80 && box.width > 160 && box.width < window.innerWidth * .72;
				})());
				body.toggleAttribute("data-raiden-settings-open", body.querySelector(SETTINGS_DIALOG_SELECTOR) !== null);
				body.toggleAttribute("data-dsh-floating-panel-open", body.querySelector("[data-dsh-floating-panel]") !== null);
			};
			sync();
			const scheduler = createRafScheduler(sync);
			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type === "attributes") {
						scheduler.schedule();
						return;
					}
					if (mutation.type !== "childList") continue;
					if ([...mutation.addedNodes, ...mutation.removedNodes].some(touchesTrackedState)) {
						scheduler.schedule();
						return;
					}
				}
			});
			observer.observe(body, {
				attributes: true,
				attributeFilter: [
					"data-phase",
					"data-chat-flow",
					"data-dsh-better-sidebar",
					"data-dsh-sidebar-collapsed"
				],
				childList: true,
				subtree: true
			});
			return () => {
				scheduler.cancel();
				observer.disconnect();
				body.removeAttribute("data-raiden-chat-active");
				body.removeAttribute("data-raiden-conversation-active");
				body.removeAttribute("data-raiden-workspace");
				body.removeAttribute("data-raiden-better-sidebar-open");
				body.removeAttribute("data-raiden-settings-open");
				body.removeAttribute("data-dsh-floating-panel-open");
			};
		}
		//#endregion
		//#region src/client/sidebar-metrics.ts
		const LAYOUT_TRACKED_SELECTOR = [SIDEBAR_SELECTOR, RIGHT_DOCK_SELECTOR].join(", ");
		function touchesTrackedLayout(node) {
			if (!(node instanceof Element)) return false;
			return node.matches(LAYOUT_TRACKED_SELECTOR) || node.closest(LAYOUT_TRACKED_SELECTOR) !== null || node.querySelector(LAYOUT_TRACKED_SELECTOR) !== null;
		}
		function measureRightPanelWidth(doc) {
			const vw = doc.defaultView?.innerWidth ?? 0;
			if (vw <= 0) return 0;
			let leftEdge = vw;
			let found = false;
			for (const node of doc.querySelectorAll(RIGHT_DOCK_SELECTOR)) {
				if (!(node instanceof HTMLElement)) continue;
				if (node.closest(`[data-skin-owner="dsh-raiden-theme"]`)) continue;
				const box = node.getBoundingClientRect();
				if (box.width < 160 || box.height < 120) continue;
				if (box.left < vw * .5) continue;
				if (box.left >= vw - 12) continue;
				leftEdge = Math.min(leftEdge, box.left);
				found = true;
			}
			return found ? Math.max(0, Math.round(vw - leftEdge)) : 0;
		}
		function startSidebarMetrics(doc) {
			const sheet = doc.createElement("style");
			sheet.dataset.skinChrome = "sidebar-width-rule";
			sheet.dataset.skinOwner = SKIN_OWNER;
			doc.head.append(sheet);
			sheet.sheet?.insertRule("body { --raiden-sidebar-width: 280px; --raiden-details-width: 0px; --raiden-right-panel-width: 0px; --raiden-sidebar-footer-height: 56px; }");
			const widthRule = sheet.sheet?.cssRules[0];
			let sidebarObserver;
			let dockObserver;
			const observedDocks = /* @__PURE__ */ new Set();
			let currentSidebar = null;
			const writeSidebar = (width) => {
				if (!widthRule) return;
				const rounded = Math.max(0, Math.round(width));
				widthRule.style.setProperty("--raiden-sidebar-width", `${rounded}px`);
				const size = rounded <= 120 ? "rail" : rounded <= 220 ? "narrow" : "wide";
				doc.body.dataset.raidenSidebarSize = size;
			};
			const writeFooter = (sidebar) => {
				if (!widthRule) return;
				const slot = sidebar.querySelector("[data-slot='sidebar.settings']");
				const button = slot instanceof HTMLElement ? slot.matches("button") ? slot : slot.querySelector("button") ?? slot : sidebar.querySelector("button[aria-label='设置']");
				if (!(button instanceof HTMLElement) || button.getBoundingClientRect().height < 8) {
					widthRule.style.setProperty("--raiden-sidebar-footer-height", "56px");
					return;
				}
				let cluster = button;
				const parent = button.parentElement;
				if (parent instanceof HTMLElement && parent !== sidebar) {
					const parentBox = parent.getBoundingClientRect();
					const sidebarBox = sidebar.getBoundingClientRect();
					if (parentBox.height > 0 && parentBox.height < sidebarBox.height * .35) cluster = parent;
				}
				const rounded = Math.max(44, Math.round(sidebar.getBoundingClientRect().bottom - cluster.getBoundingClientRect().top));
				widthRule.style.setProperty("--raiden-sidebar-footer-height", `${rounded}px`);
			};
			const writeRightPanel = () => {
				if (!widthRule) return;
				const width = measureRightPanelWidth(doc);
				widthRule.style.setProperty("--raiden-details-width", `${width}px`);
				widthRule.style.setProperty("--raiden-right-panel-width", `${width}px`);
				doc.body.toggleAttribute("data-raiden-details-open", width > 40);
				doc.body.toggleAttribute("data-raiden-right-crowded", width > 380);
			};
			const attachSidebar = (sidebar) => {
				writeFooter(sidebar);
				if (currentSidebar === sidebar) return;
				sidebarObserver?.disconnect();
				currentSidebar = sidebar;
				writeSidebar(sidebar.getBoundingClientRect().width);
				writeFooter(sidebar);
				sidebarObserver = new ResizeObserver((entries) => {
					const entry = entries.at(-1);
					if (entry) writeSidebar(entry.contentRect.width);
					writeFooter(sidebar);
				});
				sidebarObserver.observe(sidebar);
			};
			const attachDocks = () => {
				const nextDocks = new Set([...doc.querySelectorAll(RIGHT_DOCK_SELECTOR)].filter((node) => node instanceof HTMLElement));
				if (nextDocks.size === observedDocks.size && [...nextDocks].every((node) => observedDocks.has(node))) {
					writeRightPanel();
					return;
				}
				dockObserver?.disconnect();
				observedDocks.clear();
				dockObserver = new ResizeObserver(() => writeRightPanel());
				for (const node of nextDocks) {
					dockObserver.observe(node);
					observedDocks.add(node);
				}
				writeRightPanel();
			};
			const tryAttach = () => {
				const sidebar = doc.querySelector(SIDEBAR_SELECTOR);
				if (sidebar instanceof HTMLElement) attachSidebar(sidebar);
				attachDocks();
			};
			tryAttach();
			const scheduler = createRafScheduler(tryAttach, 48);
			const mutationObserver = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type !== "childList") continue;
					if (touchesTrackedLayout(mutation.target) || [...mutation.addedNodes, ...mutation.removedNodes].some(touchesTrackedLayout)) {
						scheduler.schedule();
						return;
					}
				}
			});
			mutationObserver.observe(doc.body, {
				childList: true,
				subtree: true
			});
			doc.defaultView?.addEventListener("resize", writeRightPanel);
			return () => {
				scheduler.cancel();
				sidebarObserver?.disconnect();
				dockObserver?.disconnect();
				mutationObserver.disconnect();
				doc.defaultView?.removeEventListener("resize", writeRightPanel);
				sheet.remove();
				delete doc.body.dataset.raidenSidebarSize;
				doc.body.removeAttribute("data-raiden-details-open");
				doc.body.removeAttribute("data-raiden-right-crowded");
			};
		}
		//#endregion
		//#region src/client/conversation-metrics.ts
		const MEASURE_INTERVAL_MS = 16;
		const STREAMING_MEASURE_INTERVAL_MS = 120;
		const STREAMING_STAMP_INTERVAL_MS = 500;
		const CONVERSATION_METRIC_KEYS = [
			"--raiden-conversation-left",
			"--raiden-conversation-top",
			"--raiden-conversation-width",
			"--raiden-conversation-height",
			"--raiden-conversation-content-left",
			"--raiden-conversation-content-width",
			"--raiden-conversation-viewport-top",
			"--raiden-conversation-viewport-height",
			"--raiden-content-left",
			"--raiden-content-width",
			"--raiden-viewport-top",
			"--raiden-viewport-height",
			"--raiden-frame-left",
			"--raiden-frame-top",
			"--raiden-frame-width",
			"--raiden-frame-height",
			"--raiden-frame-right-inset",
			"--raiden-composer-top",
			"--raiden-composer-height"
		];
		function computeFrameBox(rects) {
			const { shell, content, viewport, composer } = rects;
			const viewportLeft = typeof viewport.left === "number" ? viewport.left : content.left;
			const viewportWidth = typeof viewport.width === "number" && viewport.width > 40 ? viewport.width : content.width;
			let left = viewportLeft - 4;
			let right = viewportLeft + viewportWidth + 4;
			let top = viewport.top - 4;
			let bottom = viewport.top + viewport.height + 4;
			if (content.width > 40) {
				left = Math.min(left, content.left - 4);
				right = Math.max(right, content.left + content.width + 4);
			}
			if (composer && composer.width > 40 && composer.height > 24) {
				left = Math.min(left, composer.left - 4);
				right = Math.max(right, composer.left + composer.width + 4);
				top = Math.min(top, composer.top - 4);
				bottom = Math.max(bottom, composer.top + composer.height + 4);
			}
			const shellLeft = shell.left + 0;
			const shellTop = shell.top + 0;
			const shellRight = shell.left + shell.width - 0;
			const shellBottom = shell.top + shell.height - 0;
			left = Math.max(left, shellLeft);
			top = Math.max(top, shellTop);
			right = Math.min(right, shellRight);
			bottom = Math.min(bottom, shellBottom);
			if (right - left < 48 || bottom - top < 48) return {
				left: Math.round(shellLeft),
				top: Math.round(shellTop),
				width: Math.max(0, Math.round(shellRight - shellLeft)),
				height: Math.max(0, Math.round(shellBottom - shellTop))
			};
			return {
				left: Math.round(left),
				top: Math.round(top),
				width: Math.round(right - left),
				height: Math.round(bottom - top)
			};
		}
		const TRACKED_SELECTOR = [
			CONVERSATION_SELECTOR,
			CHAT_FLOW_SELECTOR,
			CONVERSATION_SCROLL_SELECTOR,
			COMPOSER_CARD_SELECTOR,
			COMPOSER_OVERLAY_SELECTOR,
			HERO_SELECTOR,
			SIDEBAR_SELECTOR,
			DETAILS_SELECTOR,
			"[data-phase='active']"
		].join(", ");
		function asElement(node) {
			return node instanceof HTMLElement ? node : null;
		}
		function visibleWidth(node) {
			return node ? node.getBoundingClientRect().width : 0;
		}
		function findConversationPane(doc) {
			const preferred = asElement(doc.querySelector("[data-pane='conversation']"));
			if (preferred && visibleWidth(preferred) > 0) return preferred;
			const candidates = [...doc.querySelectorAll(CONVERSATION_SELECTOR)].filter((node) => {
				return node instanceof HTMLElement;
			});
			let best = null;
			let bestWidth = 0;
			for (const node of candidates) {
				const width = node.getBoundingClientRect().width;
				if (width > bestWidth) {
					best = node;
					bestWidth = width;
				}
			}
			return best;
		}
		function findChatFlow(shell) {
			const scoped = asElement(shell.querySelector(CHAT_FLOW_SELECTOR));
			if (scoped && visibleWidth(scoped) > 0) return scoped;
			const global = asElement(shell.ownerDocument.querySelector(CHAT_FLOW_SELECTOR));
			return global && visibleWidth(global) > 0 ? global : null;
		}
		function findConversationScroll(shell) {
			const scoped = asElement(shell.querySelector(CONVERSATION_SCROLL_SELECTOR));
			if (scoped && scoped.getBoundingClientRect().height > 0) return scoped;
			return asElement(shell.ownerDocument.querySelector(CONVERSATION_SCROLL_SELECTOR));
		}
		function findContentColumn(shell) {
			const phaseRoot = asElement(shell.querySelector("[data-phase]"));
			if (shell.matches("[data-phase='hero']") || phaseRoot?.getAttribute("data-phase") === "hero") {
				const composer = asElement(shell.querySelector(COMPOSER_CARD_SELECTOR));
				if (composer && visibleWidth(composer) > 0) return composer;
			}
			return findChatFlow(shell) ?? findConversationScroll(shell) ?? shell;
		}
		function findViewportColumn(shell, content) {
			const phaseRoot = asElement(shell.querySelector("[data-phase]"));
			if (shell.matches("[data-phase='hero']") || phaseRoot?.getAttribute("data-phase") === "hero") return content;
			return findConversationScroll(shell) ?? shell;
		}
		function findComposerCard(shell) {
			const scoped = asElement(shell.querySelector(COMPOSER_CARD_SELECTOR));
			if (scoped && visibleWidth(scoped) > 0) return scoped;
			const global = asElement(shell.ownerDocument.querySelector(COMPOSER_CARD_SELECTOR));
			return global && visibleWidth(global) > 0 ? global : null;
		}
		function writeConversationMetrics(body, rects) {
			const hidden = rects.content.width < 48 || rects.viewport.height < 48;
			const frame = computeFrameBox(rects);
			const hasComposer = Boolean(rects.composer && rects.composer.width > 40 && rects.composer.height > 24);
			const composerTop = hasComposer && rects.composer ? Math.round(rects.composer.top) : frame.top + frame.height;
			const composerHeight = hasComposer && rects.composer ? Math.round(rects.composer.height) : 0;
			const vw = body.ownerDocument.defaultView?.innerWidth ?? 0;
			const fromContent = rects.content.width > 40 ? Math.max(0, Math.round(vw - (rects.content.left + rects.content.width))) : 0;
			const metrics = [
				["--raiden-conversation-left", `${Math.round(rects.shell.left)}px`],
				["--raiden-conversation-top", `${Math.round(rects.shell.top)}px`],
				["--raiden-conversation-width", `${Math.round(rects.shell.width)}px`],
				["--raiden-conversation-height", `${Math.round(rects.shell.height)}px`],
				["--raiden-conversation-content-left", `${Math.round(rects.content.left)}px`],
				["--raiden-conversation-content-width", `${Math.round(rects.content.width)}px`],
				["--raiden-conversation-viewport-top", `${Math.round(rects.viewport.top)}px`],
				["--raiden-conversation-viewport-height", `${Math.round(rects.viewport.height)}px`],
				["--raiden-content-left", `${Math.round(rects.content.left)}px`],
				["--raiden-content-width", `${Math.round(rects.content.width)}px`],
				["--raiden-viewport-top", `${Math.round(rects.viewport.top)}px`],
				["--raiden-viewport-height", `${Math.round(rects.viewport.height)}px`],
				["--raiden-frame-left", `${frame.left}px`],
				["--raiden-frame-top", `${frame.top}px`],
				["--raiden-frame-width", `${frame.width}px`],
				["--raiden-frame-height", `${frame.height}px`],
				["--raiden-composer-top", `${composerTop}px`],
				["--raiden-composer-height", `${composerHeight}px`],
				["--raiden-frame-right-inset", `${fromContent}px`]
			];
			for (const [key, value] of metrics) if (body.style.getPropertyValue(key) !== value) body.style.setProperty(key, value);
			body.toggleAttribute("data-raiden-frame-hidden", hidden);
			body.toggleAttribute("data-raiden-frame-compact", !hidden && rects.content.width < 420);
		}
		function touchesTracked(node) {
			if (!(node instanceof Element)) return false;
			return Element.prototype.matches.call(node, TRACKED_SELECTOR) || Element.prototype.querySelector.call(node, TRACKED_SELECTOR) !== null;
		}
		function startConversationMetrics(doc, body) {
			const original = snapshotInlineStyles(body, CONVERSATION_METRIC_KEYS);
			let shell = null;
			let content = null;
			let viewport = null;
			let composer = null;
			let sidebar = null;
			let details = null;
			let lastStampAt = 0;
			let resizeObserver;
			let mutationObserver;
			let disposed = false;
			const syncObserved = (next, current) => {
				if (next === current) return current;
				if (current) resizeObserver?.unobserve(current);
				if (next) resizeObserver?.observe(next);
				return next;
			};
			const measure = () => {
				if (disposed) return;
				const nextShell = findConversationPane(doc);
				shell = syncObserved(nextShell, shell);
				if (!shell) {
					content = syncObserved(null, content);
					viewport = syncObserved(null, viewport);
					composer = syncObserved(null, composer);
					sidebar = syncObserved(null, sidebar);
					details = syncObserved(null, details);
					body.setAttribute("data-raiden-frame-hidden", "");
					body.removeAttribute("data-raiden-frame-compact");
					for (const key of CONVERSATION_METRIC_KEYS) body.style.removeProperty(key);
					return;
				}
				const nextContent = findContentColumn(shell);
				const nextViewport = findViewportColumn(shell, nextContent);
				const nextComposer = findComposerCard(shell);
				content = syncObserved(nextContent, content);
				viewport = syncObserved(nextViewport, viewport);
				composer = syncObserved(nextComposer, composer);
				sidebar = syncObserved(asElement(doc.querySelector(SIDEBAR_SELECTOR)), sidebar);
				details = syncObserved(asElement(doc.querySelector(DETAILS_SELECTOR)), details);
				writeConversationMetrics(body, {
					shell: shell.getBoundingClientRect(),
					content: nextContent.getBoundingClientRect(),
					viewport: nextViewport.getBoundingClientRect(),
					composer: nextComposer?.getBoundingClientRect() ?? null
				});
				const streaming = doc.querySelector(STREAMING_SELECTOR) !== null;
				scheduler.setMinInterval(streaming ? STREAMING_MEASURE_INTERVAL_MS : MEASURE_INTERVAL_MS);
				const now = Date.now();
				if (!streaming || now - lastStampAt >= STREAMING_STAMP_INTERVAL_MS) {
					stampMetrics(doc, body);
					lastStampAt = now;
				}
			};
			const scheduler = createRafScheduler(measure, MEASURE_INTERVAL_MS);
			const onWindowResize = () => scheduler.schedule();
			const dispose = () => {
				if (disposed) return;
				disposed = true;
				scheduler.cancel();
				resizeObserver?.disconnect();
				mutationObserver?.disconnect();
				window.removeEventListener("resize", onWindowResize);
				window.visualViewport?.removeEventListener("resize", onWindowResize);
				restoreInlineStyles(body, original);
				body.removeAttribute("data-raiden-frame-hidden");
				body.removeAttribute("data-raiden-frame-compact");
			};
			try {
				resizeObserver = new ResizeObserver(() => scheduler.schedule());
				mutationObserver = new MutationObserver((mutations) => {
					for (const mutation of mutations) {
						if (mutation.type === "attributes") {
							scheduler.schedule();
							return;
						}
						if (mutation.type !== "childList") continue;
						for (const node of mutation.addedNodes) if (touchesTracked(node)) {
							scheduler.schedule();
							return;
						}
						for (const node of mutation.removedNodes) if (touchesTracked(node) || node === shell || node === content || node === viewport || node === composer) {
							scheduler.schedule();
							return;
						}
					}
				});
				mutationObserver.observe(doc.body, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: [
						"data-phase",
						"data-chat-flow",
						"data-conversation-composer-overlay"
					]
				});
				window.addEventListener("resize", onWindowResize);
				window.visualViewport?.addEventListener("resize", onWindowResize);
				measure();
			} catch (error) {
				dispose();
				throw error;
			}
			return dispose;
		}
		//#endregion
		//#region src/client/acrylic-surfaces.ts
		const SURFACE_ATTR = "data-raiden-surface";
		const OWNER_ATTR = "data-raiden-surface-owner";
		function clearOwnedSurface(element) {
			if (element.getAttribute(OWNER_ATTR) !== "dsh-raiden-theme") return;
			element.removeAttribute(OWNER_ATTR);
			element.removeAttribute(SURFACE_ATTR);
		}
		function clearOwnedSurfaces(doc) {
			for (const node of doc.querySelectorAll(`[${OWNER_ATTR}="dsh-raiden-theme"]`)) if (node instanceof HTMLElement) clearOwnedSurface(node);
		}
		/**
		* Acrylic is CSS opt-in only. This runtime never writes surface attributes onto
		* host panes or third-party plugins. It only clears leftovers from older builds.
		*/
		function startAcrylicSurfaces(doc) {
			clearOwnedSurfaces(doc);
			return () => {
				clearOwnedSurfaces(doc);
			};
		}
		//#endregion
		//#region src/client/hero-copy.ts
		const HOST_HEADLINE = "探索未至之境";
		const TAFFY_HEADLINE = "关注雷电将军喵！关注雷电将军谢谢喵！";
		const HERO_TEXT_SELECTOR = "[class*='headlineText']";
		/** DSH owns this text; keep an exact snapshot so plugin dispose restores it. */
		function createHeroCopySync() {
			const originals = /* @__PURE__ */ new Map();
			return {
				apply(root) {
					for (const node of root.querySelectorAll(HERO_TEXT_SELECTOR)) {
						if (!(node instanceof HTMLElement)) continue;
						const text = node.textContent ?? "";
						if (text.trim() !== HOST_HEADLINE) continue;
						if (!originals.has(node)) originals.set(node, text);
						node.textContent = TAFFY_HEADLINE;
					}
				},
				restore() {
					for (const [node, text] of originals) if (node.isConnected && node.textContent === TAFFY_HEADLINE) node.textContent = text;
					originals.clear();
				}
			};
		}
		function touchesHeroCopy(node) {
			if (!(node instanceof Element)) return false;
			return node.matches("[class*='headlineText']") || node.closest("[class*='headline']") !== null || node.querySelector("[class*='headlineText']") !== null;
		}
		//#endregion
		//#region src/client/chrome-observer.ts
		function isSkinOwned(node) {
			return node instanceof Element && (node.getAttribute("data-skin-owner") === "dsh-raiden-theme" || node.closest(`[data-skin-owner="dsh-raiden-theme"]`) !== null);
		}
		function touchesSelector(node, selector) {
			return node instanceof Element && (node.matches(selector) || node.querySelector(selector) !== null);
		}
		function createChromeObserver(options) {
			const sidebarNodes = /* @__PURE__ */ new Map();
			const heroCopy = createHeroCopySync();
			const clearSidebar = (sidebar) => {
				for (const node of sidebarNodes.get(sidebar) ?? []) node.remove();
				sidebarNodes.delete(sidebar);
			};
			const maybeDecorateSidebar = () => {
				const settings = options.getSettings();
				if (!settings.enabled) return;
				const sidebar = document.querySelector(SIDEBAR_SELECTOR);
				if (!(sidebar instanceof HTMLElement)) return;
				if (sidebar.querySelector(`[data-skin-owner="dsh-raiden-theme"][data-raiden-mascot='sidebar']`)) return;
				clearSidebar(sidebar);
				const nodes = decorateSidebar(settings, sidebar);
				sidebarNodes.set(sidebar, nodes);
				options.onNodes?.(nodes);
				options.onSidebarChange?.();
			};
			const scheduler = createRafScheduler(maybeDecorateSidebar);
			const observer = new MutationObserver((mutations) => {
				let sidebarChanged = false;
				for (const mutation of mutations) {
					if (mutation.type === "characterData") {
						const parent = mutation.target.parentElement;
						if (parent instanceof Element && parent.matches("[class*='headlineText']")) heroCopy.apply(parent);
						continue;
					}
					if (mutation.type === "childList") {
						if (mutation.target instanceof Element && mutation.target.matches("[class*='headlineText']")) heroCopy.apply(mutation.target);
						for (const node of mutation.addedNodes) {
							if (isSkinOwned(node)) continue;
							if (touchesHeroCopy(node)) heroCopy.apply(node instanceof Element ? node : document);
							if (touchesSelector(node, ":is([data-pane='sidebar'], [class*='sidebarCol'])")) sidebarChanged = true;
						}
					}
				}
				if (sidebarChanged) scheduler.schedule();
			});
			observer.observe(document.body, {
				childList: true,
				characterData: true,
				subtree: true
			});
			heroCopy.apply(document);
			maybeDecorateSidebar();
			return { disconnect: () => {
				scheduler.cancel();
				observer.disconnect();
				heroCopy.restore();
				for (const sidebar of sidebarNodes.keys()) clearSidebar(sidebar);
				sidebarNodes.clear();
			} };
		}
		//#endregion
		//#region src/client/state-view.ts
		const AGENT_THROTTLE_MS = 120;
		function createStateObserver(options) {
			const body = document.body;
			let lastEmitAt = 0;
			const readSignals = () => {
				const now = Date.now();
				if (now - lastEmitAt < AGENT_THROTTLE_MS) return;
				const activeConversation = body.querySelector(ACTIVE_SELECTOR) !== null;
				const composerPhase = body.querySelector("[data-chat-flow]")?.getAttribute("data-phase") ?? null;
				const streaming = body.querySelector(STREAMING_SELECTOR) !== null;
				const hasToolCall = body.querySelector(TOOL_CALL_SELECTOR) !== null;
				lastEmitAt = now;
				mapDomSignals({
					activeConversation,
					composerPhase,
					streaming,
					hasToolCall,
					error: false,
					success: false
				}, options.onState);
			};
			readSignals();
			const scheduler = createRafScheduler(readSignals, 32);
			const observer = new MutationObserver(() => scheduler.schedule());
			observer.observe(body, {
				attributes: true,
				attributeFilter: ["data-phase", "data-streaming"],
				childList: true,
				subtree: true
			});
			return () => {
				scheduler.cancel();
				observer.disconnect();
			};
		}
		//#endregion
		//#region src/client/settings-panel.ts
		const SETTINGS_NS = "settings.raidenTheme";
		function CloverIcon() {
			return (0, react.createElement)("svg", {
				className: "dsh-raiden-clover",
				viewBox: "0 0 16 16",
				width: 16,
				height: 16,
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				fill: "currentColor",
				d: "M8 1.6c1.4 1.6 1.6 3.4 1.2 4.6 1.2-.6 2.8-.4 4 0.8 1 1 1 2.6 0 3.6-1 1-2.5 1.1-3.6.4 0.3 1.2 0 2.9-1.6 4.4-1.6-1.5-1.9-3.2-1.6-4.4-1.1.7-2.6.6-3.6-.4-1-1-1-2.6 0-3.6 1.2-1.2 2.8-1.4 4-.8C6.4 5 6.6 3.2 8 1.6z"
			}));
		}
		function Cube({ selected, label, onClick }) {
			return (0, react.createElement)("button", {
				type: "button",
				className: `dsh-raiden-general-cube${selected ? " is-selected" : ""}`,
				"aria-pressed": selected,
				onClick
			}, selected ? CloverIcon() : null, label);
		}
		function Slider({ label, value, onChange }) {
			return (0, react.createElement)("label", { className: "dsh-raiden-slider-row" }, (0, react.createElement)("span", { className: "dsh-raiden-slider-head" }, (0, react.createElement)("span", null, label), (0, react.createElement)("output", null, `${value}%`)), (0, react.createElement)("input", {
				type: "range",
				min: 0,
				max: 100,
				step: 1,
				value,
				onInput: (event) => onChange(Number(event.currentTarget.value)),
				onChange: (event) => onChange(Number(event.currentTarget.value))
			}));
		}
		function RaidenModeRow() {
			const [settings, setSettings] = (0, react.useState)(loadSettings);
			(0, react.useEffect)(() => {
				const refresh = () => setSettings(loadSettings());
				window.addEventListener("storage", refresh);
				window.addEventListener("dsh-raiden-theme:settings-change", refresh);
				return () => {
					window.removeEventListener("storage", refresh);
					window.removeEventListener("dsh-raiden-theme:settings-change", refresh);
				};
			}, []);
			const commit = (patch) => {
				const next = {
					...settings,
					...patch
				};
				setSettings(next);
				saveSettings(next);
			};
			return (0, react.createElement)("div", {
				className: "dsh-raiden-general-row",
				"data-dsh-raiden-settings": ""
			}, (0, react.createElement)("div", { className: "dsh-raiden-general-title" }, "雷电将军工房"), (0, react.createElement)("div", { className: "dsh-raiden-general-cubes" }, (0, react.createElement)(Cube, {
				selected: settings.enabled,
				label: "开启",
				onClick: () => commit({ enabled: true })
			}), (0, react.createElement)(Cube, {
				selected: !settings.enabled,
				label: "关闭",
				onClick: () => commit({ enabled: false })
			})), (0, react.createElement)(Slider, {
				label: "边框透明度",
				value: settings.frameOpacity,
				onChange: (frameOpacity) => commit({ frameOpacity })
			}), (0, react.createElement)(Slider, {
				label: "面板透明度",
				value: settings.panelOpacity,
				onChange: (panelOpacity) => commit({ panelOpacity })
			}), (0, react.createElement)(Slider, {
				label: "背景纱",
				value: settings.veilOpacity,
				onChange: (veilOpacity) => commit({ veilOpacity })
			}), (0, react.createElement)(Slider, {
				label: "亚克力透明度",
				value: settings.acrylicPercent,
				onChange: (acrylicPercent) => commit({ acrylicPercent })
			}), (0, react.createElement)("div", { className: "dsh-raiden-general-title" }, "立绘"), (0, react.createElement)("div", { className: "dsh-raiden-general-cubes" }, (0, react.createElement)(Cube, {
				selected: settings.showLeftCharacter,
				label: "左侧",
				onClick: () => commit({ showLeftCharacter: !settings.showLeftCharacter })
			}), (0, react.createElement)(Cube, {
				selected: settings.showRightCharacter,
				label: "右侧",
				onClick: () => commit({ showRightCharacter: !settings.showRightCharacter })
			}), (0, react.createElement)(Cube, {
				selected: settings.showMascot,
				label: "鸣神",
				onClick: () => commit({ showMascot: !settings.showMascot })
			})), (0, react.createElement)(Slider, {
				label: "立绘透明度",
				value: settings.characterOpacity,
				onChange: (characterOpacity) => commit({ characterOpacity })
			}), (0, react.createElement)("div", { className: "dsh-raiden-general-title" }, "减弱动效"), (0, react.createElement)("div", { className: "dsh-raiden-general-cubes" }, (0, react.createElement)(Cube, {
				selected: settings.reducedMotion,
				label: "开启",
				onClick: () => commit({
					reducedMotion: true,
					motion: "off"
				})
			}), (0, react.createElement)(Cube, {
				selected: !settings.reducedMotion,
				label: "关闭",
				onClick: () => commit({
					reducedMotion: false,
					motion: "standard"
				})
			})), (0, react.createElement)("div", { className: "dsh-raiden-general-note" }, "工房开了喵：浅色花房、深色舞台跟着「外观」走。边框包住对话，百分比只改透明层，人物默认不透明。想听雷电将军说话，去 Agent 预设里选「Raiden 雷电将军」喵。"));
		}
		function registerSettingsPanel(ctx) {
			ctx.effect(() => ctx.locale.register(SETTINGS_NS, {
				zh: { "settings.raidenTheme.label": "雷电将军工房" },
				en: { "settings.raidenTheme.label": "Raiden atelier" }
			}), "@dsh-external/dsh-raiden-theme: locale");
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "raiden-theme",
				order: 11,
				locale: SETTINGS_NS
			}, RaidenModeRow));
		}
		//#endregion
		//#region src/client/index.ts
		const name = "@dsh-external/dsh-raiden-theme";
		const inject = ["slots", "locale"];
		function apply(ctx) {
			const body = document.body;
			const tokenSnapshot = snapshotThemeTokens(body);
			const inlineSnapshot = snapshotInlineStyles(body, TAFFY_INLINE_STYLE_KEYS);
			let settings = loadSettings();
			let state = "idle";
			let chromeMounted = false;
			let disposeStateObserver;
			let disposeTimePhase;
			let disposeSettingsSub;
			let disposeBackdrop;
			let disposeProjectedState;
			let disposeSidebarMetrics;
			let disposeConversationMetrics;
			let disposeAcrylicSurfaces;
			let disposeChromeObserver;
			const restoreHostStyles = () => {
				restoreThemeTokens(body, tokenSnapshot);
				restoreInlineStyles(body, inlineSnapshot);
			};
			const disposeChromeRuntime = () => {
				disposeBackdrop?.();
				disposeBackdrop = void 0;
				disposeProjectedState?.();
				disposeProjectedState = void 0;
				disposeSidebarMetrics?.();
				disposeSidebarMetrics = void 0;
				disposeConversationMetrics?.();
				disposeConversationMetrics = void 0;
				disposeAcrylicSurfaces?.();
				disposeAcrylicSurfaces = void 0;
				disposeChromeObserver?.();
				disposeChromeObserver = void 0;
			};
			const unmountChrome = () => {
				disposeChromeRuntime();
				removeOwnedChrome(document);
				chromeMounted = false;
			};
			const syncTheme = () => {
				ensureStyleNode(document);
				if (!settings.enabled) {
					applyRootAttributes(body, settings, state);
					restoreHostStyles();
					stampMetrics(document, body);
					return;
				}
				applyThemeTokens(body, resolveThemeTokens(settings.colors), { pinText: settings.colors.preset === "custom" && Boolean(settings.colors.text) });
				applyRootAttributes(body, settings, state);
				if (settings.timePhaseEnabled) body.setAttribute("data-time-phase", resolveTimePhase());
				else body.removeAttribute("data-time-phase");
				stampMetrics(document, body);
			};
			const mountStaticChrome = () => {
				if (chromeMounted) {
					syncStageArt(body, settings);
					if (!body.querySelector("[data-skin-chrome='raiden-top-curtain']")) for (const node of createStageCurtains()) body.append(node);
					return;
				}
				if (!settings.enabled) return;
				removeOwnedChrome(document);
				const stage = createCharacterStage(settings);
				if (stage) body.prepend(stage);
				for (const trim of createTrims()) body.append(trim);
				disposeBackdrop = startBackdropSync(body);
				disposeProjectedState = startProjectedState(body);
				disposeSidebarMetrics = startSidebarMetrics(document);
				disposeConversationMetrics = startConversationMetrics(document, body);
				disposeAcrylicSurfaces = startAcrylicSurfaces(document);
				disposeChromeObserver = createChromeObserver({ getSettings: () => settings }).disconnect;
				chromeMounted = true;
			};
			const ensureChrome = () => {
				if (!settings.enabled) {
					unmountChrome();
					return;
				}
				mountStaticChrome();
			};
			ctx.effect(() => {
				resetMetricsStampState();
				setMetricsEnabledGetter(() => settings.enabled);
				ensureStyleNode(document);
				syncTheme();
				ensureChrome();
				disposeStateObserver = createStateObserver({ onState: (next) => {
					state = next;
					if (settings.enabled) body.setAttribute("data-raiden-state", state);
				} });
				disposeTimePhase = settings.timePhaseEnabled ? startTimePhaseTicker((phase) => body.setAttribute("data-time-phase", phase)) : void 0;
				disposeSettingsSub = subscribeSettings((next) => {
					settings = next;
					syncTheme();
					ensureChrome();
				});
				return () => {
					disposeStateObserver?.();
					disposeStateObserver = void 0;
					disposeTimePhase?.();
					disposeSettingsSub?.();
					unmountChrome();
					resetStateAdapter();
					removeStyleNode(document);
					clearMetricsStamp(document);
					body.removeAttribute("data-dsh-raiden-theme");
					body.removeAttribute("data-raiden-state");
					body.removeAttribute("data-raiden-preset");
					body.removeAttribute("data-raiden-chat-active");
					body.removeAttribute("data-raiden-conversation-active");
					body.removeAttribute("data-raiden-workspace");
					body.removeAttribute("data-raiden-better-sidebar-open");
					body.removeAttribute("data-raiden-details-open");
					body.removeAttribute("data-raiden-settings-open");
					body.removeAttribute("data-dsh-floating-panel-open");
					body.removeAttribute("data-time-phase");
					body.removeAttribute("data-dsh-raiden-intensity");
					body.removeAttribute("data-dsh-raiden-motion");
					body.removeAttribute("data-dsh-raiden-reduced-motion");
					body.removeAttribute("data-raiden-veil");
					body.removeAttribute("data-raiden-low-power");
					body.removeAttribute("data-raiden-acrylic-percent");
					body.removeAttribute("data-raiden-frame-opacity");
					body.removeAttribute("data-raiden-panel-opacity");
					body.removeAttribute("data-raiden-character-opacity");
					body.removeAttribute("data-raiden-scene");
					body.removeAttribute("data-raiden-hide-left");
					body.removeAttribute("data-raiden-hide-right");
					body.removeAttribute("data-raiden-hide-mascot");
					body.removeAttribute("data-raiden-right-crowded");
					body.removeAttribute("data-raiden-q-ready");
					delete body.dataset.raidenSidebarSize;
					restoreHostStyles();
				};
			}, "dsh-raiden-theme:lifecycle");
			registerSettingsPanel(ctx);
			if (!localStorage.getItem("dsh-raiden-theme:v1")) saveSettings(settings);
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map