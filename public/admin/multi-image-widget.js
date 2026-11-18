/* Widget "multiimage": várias fotos de uma vez (arrastar ou selecionar), com pré-visualização,
   remoção individual e envio pelo mesmo mecanismo do campo de imagem nativo do Decap
   (as fotos são gravadas no repositório junto com a entrada, ao clicar em Publicar). */
(function () {
  if (!window.CMS) return;
  var h = window.h;
  var DEFAULT_PUBLIC = "/fotos/uploads";
  var MAX_BYTES = 10 * 1024 * 1024;
  var COMPRESS_OVER = 2 * 1024 * 1024;
  var MAX_SIDE = 2560;

  function toList(v) {
    if (!v) return [];
    if (v.toJS) v = v.toJS();
    return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string" && x; }) : [];
  }
  function mb(bytes) { return (bytes / 1024 / 1024).toFixed(1).replace(".", ",") + " MB"; }
  function slug(name, forceExt) {
    var dot = name.lastIndexOf(".");
    var base = (dot > 0 ? name.slice(0, dot) : name).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "foto";
    var ext = forceExt || (dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "") || "jpg";
    return Date.now() + "-" + Math.random().toString(36).slice(2, 6) + "-" + base + "." + ext;
  }
  function fieldValue(field, key, fallback) {
    var v = field && field.get ? field.get(key) : field && field[key];
    return v || fallback;
  }

  // Reduz fotos grandes (ex.: de celular) para evitar falhas no envio.
  function compress(file) {
    if (file.size <= COMPRESS_OVER || !/^image\/(jpeg|png|webp)$/.test(file.type)) return Promise.resolve(file);
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        try {
          var scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
          var canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(function (blob) {
            URL.revokeObjectURL(url);
            resolve(blob && blob.size < file.size ? new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }) : file);
          }, "image/jpeg", 0.85);
        } catch (e) { URL.revokeObjectURL(url); resolve(file); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  async function prepareAndPersist(props, original) {
    if (typeof props.onPersistMedia !== "function") {
      throw new Error("O painel não conseguiu preparar o envio. Recarregue a página e tente novamente.");
    }
    var file = await compress(original);
    if (file.size > MAX_BYTES) {
      throw new Error("A foto \"" + original.name + "\" é grande demais (" + mb(file.size) + "). O limite é 10 MB por foto. Reduza a imagem e tente novamente.");
    }
    var name = slug(file.name, file.type === "image/jpeg" && file !== original ? "jpg" : "");
    var renamed = new File([file], name, { type: file.type });
    var result;
    try {
      result = await props.onPersistMedia(renamed, { field: props.field });
    } catch (e) {
      result = { type: "MEDIA_PERSIST_FAILURE" };
    }
    if (result && result.type === "MEDIA_PERSIST_FAILURE") {
      throw new Error("Não foi possível adicionar a foto \"" + original.name + "\". Verifique sua internet e se você ainda está conectada ao painel (saia e entre de novo, se preciso) e tente outra vez.");
    }
    return { path: fieldValue(props.field, "public_folder", DEFAULT_PUBLIC).replace(/\/$/, "") + "/" + name, file: renamed };
  }

  var box = {"border": "2px dashed #2f7a4a", "borderRadius": "10px", "padding": "24px", "textAlign": "center", "cursor": "pointer", "background": "#f3faf5", "color": "#1f5133"};
  var grid = {"display": "grid", "gridTemplateColumns": "repeat(auto-fill,minmax(110px,1fr))", "gap": "10px", "marginTop": "12px"};
  var tile = {"position": "relative", "borderRadius": "8px", "overflow": "hidden", "aspectRatio": "1", "background": "#eee"};
  var del = {"position": "absolute", "top": "4px", "right": "4px", "background": "#b71c1c", "color": "#fff", "border": "none", "borderRadius": "50%", "width": "24px", "height": "24px", "cursor": "pointer", "fontWeight": "bold"};
  var btn = {"marginTop": "12px", "background": "#2f7a4a", "color": "#fff", "border": "none", "borderRadius": "6px", "padding": "10px 16px", "cursor": "pointer", "fontWeight": "600"};
  var errorBox = {"marginTop": "10px", "padding": "10px 12px", "borderRadius": "6px", "background": "#fdecea", "border": "1px solid #f5c2c0", "color": "#8a1c14", "fontSize": "14px"};
  var okBox = {"marginTop": "10px", "padding": "10px 12px", "borderRadius": "6px", "background": "#e8f5ec", "border": "1px solid #b9dfc6", "color": "#1f5133", "fontSize": "14px"};

  var Control = window.createClass({
    getInitialState: function () { return { pending: [], busy: false, error: "", notice: "", over: false, local: {} }; },
    componentWillUnmount: function () {
      this.state.pending.forEach(function (p) { URL.revokeObjectURL(p.url); });
      var local = this.state.local;
      Object.keys(local).forEach(function (k) { URL.revokeObjectURL(local[k]); });
    },
    addFiles: function (files) {
      if (this.state.busy) return;
      var imgs = Array.prototype.filter.call(files, function (f) { return /^image\//.test(f.type); });
      var add = imgs.map(function (f) { return { file: f, url: URL.createObjectURL(f) }; });
      this.setState({ pending: this.state.pending.concat(add), notice: "", error: imgs.length < files.length ? "Alguns arquivos não são imagens e foram ignorados." : "" });
    },
    removePending: function (i) {
      var p = this.state.pending.slice();
      URL.revokeObjectURL(p[i].url);
      p.splice(i, 1);
      this.setState({ pending: p });
    },
    removeSaved: function (i) {
      if (this.state.busy) return;
      var v = toList(this.props.value);
      v.splice(i, 1);
      this.props.onChange(v);
    },
    uploadAll: async function () {
      if (this.state.busy) return;
      var self = this;
      self.setState({ busy: true, error: "", notice: "" });
      var saved = toList(self.props.value);
      var left = self.state.pending.slice();
      var local = Object.assign({}, self.state.local);
      var done = 0;
      while (left.length) {
        try {
          var res = await prepareAndPersist(self.props, left[0].file);
          saved = saved.concat(res.path);
          local[res.path] = left[0].url;
          left.shift();
          done++;
          self.props.onChange(saved);
          self.setState({ pending: left.slice(), local: local });
        } catch (e) {
          if (window.console) console.error("Falha ao adicionar foto:", e);
          var prefix = done ? done + " foto(s) adicionada(s). " : "";
          self.setState({ busy: false, local: local, error: prefix + ((e && e.message) || "Não foi possível adicionar a foto. Tente novamente.") + " As fotos que faltam continuam na lista." });
          return;
        }
      }
      self.setState({ busy: false, notice: done + " foto(s) adicionada(s). Clique em Publicar para salvar a galeria no site." });
    },
    render: function () {
      var self = this;
      var saved = toList(this.props.value);
      var input;
      return h("div", { className: this.props.classNameWrapper },
        h("div", {
          style: Object.assign({}, box, this.state.over ? { background: "#dff1e5" } : {}),
          onClick: function () { input && input.click(); },
          onDragOver: function (e) { e.preventDefault(); self.setState({ over: true }); },
          onDragLeave: function () { self.setState({ over: false }); },
          onDrop: function (e) { e.preventDefault(); self.setState({ over: false }); self.addFiles(e.dataTransfer.files); },
        },
          h("strong", null, "Arraste as fotos aqui ou clique para selecionar"),
          h("div", { style: {"fontSize": "12px", "marginTop": "4px"} }, "Você pode escolher várias imagens de uma vez (até 10 MB cada)."),
          h("input", { type: "file", accept: "image/*", multiple: true, disabled: this.state.busy, onClick: function (e) { e.stopPropagation(); }, style: {"display": "none"},
            ref: function (el) { input = el; },
            onChange: function (e) { self.addFiles(e.target.files); e.target.value = ""; } })
        ),
        this.state.pending.length ? h("div", null,
          h("div", { style: {"marginTop": "12px", "fontWeight": "600"} }, "Prontas para adicionar (" + this.state.pending.length + ")"),
          h("div", { style: grid }, this.state.pending.map(function (p, i) {
            return h("div", { key: p.url, style: tile },
              h("img", { src: p.url, alt: p.file.name, style: {"width": "100%", "height": "100%", "objectFit": "cover"} }),
              !self.state.busy && h("button", { type: "button", style: del, title: "Remover", onClick: function () { self.removePending(i); } }, "×"));
          })),
          h("button", { type: "button", style: Object.assign({}, btn, this.state.busy ? { opacity: 0.6 } : {}), disabled: this.state.busy, onClick: this.uploadAll },
            this.state.busy ? "Adicionando..." : "Adicionar " + this.state.pending.length + " foto(s)")
        ) : null,
        this.state.error ? h("div", { role: "alert", style: errorBox }, this.state.error) : null,
        this.state.notice ? h("div", { role: "status", style: okBox }, this.state.notice) : null,
        saved.length ? h("div", null,
          h("div", { style: {"marginTop": "16px", "fontWeight": "600"} }, "Fotos da galeria (" + saved.length + ")"),
          h("div", { style: grid }, saved.map(function (src, i) {
            return h("div", { key: src + i, style: tile },
              h("img", { src: self.state.local[src] || src, alt: "", style: {"width": "100%", "height": "100%", "objectFit": "cover"} }),
              h("button", { type: "button", style: del, title: "Remover", disabled: self.state.busy, onClick: function () { self.removeSaved(i); } }, "×"));
          }))
        ) : null,
        h("div", { style: {"fontSize": "12px", "marginTop": "10px", "color": "#555"} }, "As fotos são gravadas no site quando você clica em Publicar. Se a publicação falhar, o painel mostra um aviso no topo da tela.")
      );
    },
  });

  var Preview = window.createClass({
    render: function () {
      return h("div", { style: grid }, toList(this.props.value).map(function (src, i) {
        return h("img", { key: i, src: src, style: {"width": "100%", "aspectRatio": "1", "objectFit": "cover", "borderRadius": "8px"} });
      }));
    },
  });

  window.CMS.registerWidget("multiimage", Control, Preview);
})();
