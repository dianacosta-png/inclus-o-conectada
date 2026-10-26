/* Widget "multiimage": envio de várias fotos de uma vez (arrastar ou selecionar),
   com pré-visualização, remoção individual e upload pelo Git Gateway do Netlify. */
(function () {
  if (!window.CMS) return;
  var h = window.h;
  var BRANCH = "main";
  var FOLDER = "public/fotos/uploads";
  var PUBLIC = "/fotos/uploads";

  function toList(v) {
    if (!v) return [];
    if (v.toJS) v = v.toJS();
    return Array.isArray(v) ? v.filter(Boolean) : [];
  }
  function slug(name) {
    var dot = name.lastIndexOf(".");
    var base = (dot > 0 ? name.slice(0, dot) : name).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "foto";
    var ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "jpg";
    return Date.now() + "-" + Math.random().toString(36).slice(2, 6) + "-" + base + "." + ext;
  }
  function toBase64(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(",")[1]); };
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }
  async function uploadFile(file) {
    var user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
    if (!user) throw new Error("Faça login novamente no painel.");
    var token = await user.jwt();
    var name = slug(file.name);
    var resp = await fetch("/.netlify/git/github/contents/" + FOLDER + "/" + name, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Upload de foto " + name, content: await toBase64(file), branch: BRANCH }),
    });
    if (!resp.ok) throw new Error("Falha ao enviar " + file.name + " (" + resp.status + ")");
    return PUBLIC + "/" + name;
  }

  var box = "border:2px dashed #2f7a4a;border-radius:10px;padding:24px;text-align:center;cursor:pointer;background:#f3faf5;color:#1f5133;";
  var grid = "display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;margin-top:12px;";
  var tile = "position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;background:#eee;";
  var del = "position:absolute;top:4px;right:4px;background:#b71c1c;color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-weight:bold;";
  var btn = "margin-top:12px;background:#2f7a4a;color:#fff;border:none;border-radius:6px;padding:10px 16px;cursor:pointer;font-weight:600;";

  var Control = window.createClass({
    getInitialState: function () { return { pending: [], busy: false, error: "", over: false }; },
    componentWillUnmount: function () { this.state.pending.forEach(function (p) { URL.revokeObjectURL(p.url); }); },
    addFiles: function (files) {
      var imgs = Array.prototype.filter.call(files, function (f) { return /^image\//.test(f.type); });
      var add = imgs.map(function (f) { return { file: f, url: URL.createObjectURL(f) }; });
      this.setState({ pending: this.state.pending.concat(add), error: imgs.length < files.length ? "Alguns arquivos não são imagens e foram ignorados." : "" });
    },
    removePending: function (i) {
      var p = this.state.pending.slice();
      URL.revokeObjectURL(p[i].url);
      p.splice(i, 1);
      this.setState({ pending: p });
    },
    removeSaved: function (i) {
      var v = toList(this.props.value);
      v.splice(i, 1);
      this.props.onChange(v);
    },
    uploadAll: async function () {
      var self = this;
      self.setState({ busy: true, error: "" });
      var saved = toList(self.props.value);
      var left = self.state.pending.slice();
      while (left.length) {
        try {
          var path = await uploadFile(left[0].file);
          saved = saved.concat(path);
          URL.revokeObjectURL(left[0].url);
          left.shift();
          self.props.onChange(saved);
          self.setState({ pending: left.slice() });
        } catch (e) {
          self.setState({ busy: false, error: e.message });
          return;
        }
      }
      self.setState({ busy: false });
    },
    render: function () {
      var self = this;
      var saved = toList(this.props.value);
      var input;
      return h("div", { className: this.props.classNameWrapper },
        h("div", {
          style: box + (this.state.over ? "background:#dff1e5;" : ""),
          onClick: function () { input && input.click(); },
          onDragOver: function (e) { e.preventDefault(); self.setState({ over: true }); },
          onDragLeave: function () { self.setState({ over: false }); },
          onDrop: function (e) { e.preventDefault(); self.setState({ over: false }); self.addFiles(e.dataTransfer.files); },
        },
          h("strong", null, "Arraste as fotos aqui ou clique para selecionar"),
          h("div", { style: "font-size:12px;margin-top:4px;" }, "Você pode escolher várias imagens de uma vez."),
          h("input", { type: "file", accept: "image/*", multiple: true, style: "display:none;",
            ref: function (el) { input = el; },
            onChange: function (e) { self.addFiles(e.target.files); e.target.value = ""; } })
        ),
        this.state.pending.length ? h("div", null,
          h("div", { style: "margin-top:12px;font-weight:600;" }, "Prontas para enviar (" + this.state.pending.length + ")"),
          h("div", { style: grid }, this.state.pending.map(function (p, i) {
            return h("div", { key: p.url, style: tile },
              h("img", { src: p.url, style: "width:100%;height:100%;object-fit:cover;" }),
              !self.state.busy && h("button", { type: "button", style: del, title: "Remover", onClick: function () { self.removePending(i); } }, "×"));
          })),
          h("button", { type: "button", style: btn + (this.state.busy ? "opacity:.6;" : ""), disabled: this.state.busy, onClick: this.uploadAll },
            this.state.busy ? "Enviando..." : "Enviar " + this.state.pending.length + " foto(s)")
        ) : null,
        this.state.error ? h("div", { style: "color:#b71c1c;margin-top:8px;" }, this.state.error) : null,
        saved.length ? h("div", null,
          h("div", { style: "margin-top:16px;font-weight:600;" }, "Fotos salvas (" + saved.length + ")"),
          h("div", { style: grid }, saved.map(function (src, i) {
            return h("div", { key: src + i, style: tile },
              h("img", { src: src, style: "width:100%;height:100%;object-fit:cover;" }),
              h("button", { type: "button", style: del, title: "Remover", onClick: function () { self.removeSaved(i); } }, "×"));
          }))
        ) : null,
        h("div", { style: "font-size:12px;margin-top:10px;color:#555;" }, "Depois de enviar, clique em Publicar para salvar a galeria.")
      );
    },
  });

  var Preview = window.createClass({
    render: function () {
      return h("div", { style: grid }, toList(this.props.value).map(function (src, i) {
        return h("img", { key: i, src: src, style: "width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;" });
      }));
    },
  });

  window.CMS.registerWidget("multiimage", Control, Preview);
})();
