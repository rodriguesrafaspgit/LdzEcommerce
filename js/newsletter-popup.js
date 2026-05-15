// Cookies
!(function () {
	var c = { expires: "1d", path: "; path=/" },
		e = {
			install: function (e) {
				(e.prototype.$cookies = this), (e.cookies = this);
			},
			config: function (e, n) {
				e && (c.expires = e), n && (c.path = "; path=" + n);
			},
			get: function (e) {
				var n =
					decodeURIComponent(
						document.cookie.replace(
							new RegExp(
								"(?:(?:^|.*;)\\s*" +
									encodeURIComponent(e).replace(/[\-\.\+\*]/g, "\\$&") +
									"\\s*\\=\\s*([^;]*).*$)|^.*$"
							),
							"$1"
						)
					) || null;
				if (
					n &&
					"{" === n.substring(0, 1) &&
					"}" === n.substring(n.length - 1, n.length)
				)
					try {
						n = JSON.parse(n);
					} catch (e) {
						return n;
					}
				return n;
			},
			set: function (e, n, t, o, i, r) {
				if (!e) throw new Error("cookie name is not find in first argument");
				if (/^(?:expires|max\-age|path|domain|secure)$/i.test(e))
					throw new Error(
						"cookie key name illegality ,Cannot be set to ['expires','max-age','path','domain','secure']\t",
						"current key name: " + e
					);
				n && n.constructor === Object && (n = JSON.stringify(n));
				var a = "; max-age=86400";
				if ((t = t || c.expires))
					switch (t.constructor) {
						case Number:
							a =
								t === 1 / 0 || -1 === t
									? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
									: "; max-age=" + t;
							break;
						case String:
							if (/^(?:\d{1,}(y|m|d|h|min|s))$/i.test(t)) {
								var s = t.replace(/^(\d{1,})(?:y|m|d|h|min|s)$/i, "$1");
								switch (
									t.replace(/^(?:\d{1,})(y|m|d|h|min|s)$/i, "$1").toLowerCase()
								) {
									case "m":
										a = "; max-age=" + 2592e3 * +s;
										break;
									case "d":
										a = "; max-age=" + 86400 * +s;
										break;
									case "h":
										a = "; max-age=" + 3600 * +s;
										break;
									case "min":
										a = "; max-age=" + 60 * +s;
										break;
									case "s":
										a = "; max-age=" + s;
										break;
									case "y":
										a = "; max-age=" + 31104e3 * +s;
										break;
									default:
										new Error("unknown exception of 'set operation'");
								}
							} else a = "; expires=" + t;
							break;
						case Date:
							a = "; expires=" + t.toUTCString();
					}
				return (
					(document.cookie =
						encodeURIComponent(e) +
						"=" +
						encodeURIComponent(n) +
						a +
						(i ? "; domain=" + i : "") +
						(o ? "; path=" + o : c.path) +
						(r ? "; secure" : "")),
					this
				);
			},
			remove: function (e, n, t) {
				return (
					!(!e || !this.isKey(e)) &&
					((document.cookie =
						encodeURIComponent(e) +
						"=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
						(t ? "; domain=" + t : "") +
						(n ? "; path=" + n : c.path)),
					this)
				);
			},
			isKey: function (e) {
				return new RegExp(
					"(?:^|;\\s*)" +
						encodeURIComponent(e).replace(/[\-\.\+\*]/g, "\\$&") +
						"\\s*\\="
				).test(document.cookie);
			},
			keys: function () {
				if (!document.cookie) return [];
				for (
					var e = document.cookie
							.replace(
								/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,
								""
							)
							.split(/\s*(?:\=[^;]*)?;\s*/),
						n = 0;
					n < e.length;
					n++
				)
					e[n] = decodeURIComponent(e[n]);
				return e;
			},
		};
	"object" == typeof exports
		? (module.exports = e)
		: "function" == typeof define && define.amd
		? define([], function () {
				return e;
		  })
		: window.Vue && Vue.use(e),
		"undefined" != typeof window && (window.$cookies = e);
})();

Vue.component("modal", {
	template: `
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="vue-modal-container">
					<div class="vue-modal-header">
						<span class="vue-modal-close" @click="$emit('close')">&times;</span>
						<slot name="header"></slot>
					</div>
					<div class="vue-modal-body">
						<slot name="body"></slot>
					</div>
				</div>
			</div>
		</div>
    `,
});

(function($){
	new Vue({
		el: "#modal-newsletter",
		data: {
			showModal: false,
		},
		created: function () {
			this.seeShowModal();
		},
		methods: {
			seeShowModal: function () {
				if (!$cookies.get("show_modal")) {
					self = this;
					setTimeout(function () {
						self.showModal = true;
						$cookies.set("show_modal", "true");
						
						setTimeout(function(){

							var w = $('.box-newsletter-popup').width() - 14;
							$('.vue-modal-close').css('margin-left', w);
							$('.vue-modal-close').css('margin-top', 6);

							$(document).on('click','.vue-modal-close', function(){
								$('#modal-newsletter').empty();
							});
						}, 300);

					}, 4000);
				}
			},
		},
	});
})(jQuery);

