const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

async function save(key, contents) {
  const obj = { key, contents };
  const method = "POST";
  const body = JSON.stringify(obj);
  const res = await fetch(`/api/files/${key}`, { method, headers, body });
  return await res.json();
}

async function read(key) {
  const res = await fetch(`/api/files/${key}`);
  return await res.json();
}

async function get() {
  const res = await fetch("/api/files");
  return await res.json();
}

var dmp = new diff_match_patch();

Vue.filter("hms", input => {
  const d = new Date(input);
  const hh = ("00" + d.getHours()).slice(-2);
  const mm = ("00" + d.getMinutes()).slice(-2);
  const ss = ("00" + d.getSeconds()).slice(-2);
  return `${hh}:${mm}:${ss}`;
});

new Vue({
  el: "#app",
  data: {
    input: "#test",
    key: "",
    files: [],
    saving: false,
    original: ""
  },
  watch: {
    input: function() {
      if (this.dirty) {
        this.triggerSave();
      }
    }
  },
  computed: {
    status() {
      return this.saving ? "Saving..." : this.dirty ? "*" : "Saved.";
    },
    dirty() {
      return this.original !== this.input;
    }
  },
  methods: {
    triggerSave: _.debounce(function() {
      this.save();
    }, 1000),
    async create() {
      this.key = "new";
      this.input = "";
      this.original = "";
      const res = await save(this.key, this.input);
      if (res.success) {
        this.key = res.key;
        this.select(this.key);
        this.files = await get();
      }
    },
    async save() {
      this.saving = true;

      const remoteNew = (await read(this.key)).data;
      const diff = dmp.diff_main(this.original, remoteNew, true);
      if (diff.length > 2) {
        dmp.diff_cleanupSemantic(diff);
      }
      const patch_list = dmp.patch_make(this.original, remoteNew, diff);
      const patch_text = dmp.patch_toText(patch_list);
      const patches = dmp.patch_fromText(patch_text);

      const result = dmp.patch_apply(patches, this.input);
      if (result[1]) {
        this.input = result[0];
      } else {
        if (
          window.confirm("コンフリクトが発生しました。やっちゃっていいですか？")
        ) {
          //nothing to do
        } else {
          this.input = remoteNew;
        }
      }

      const res = await save(this.key, this.input);
      if (res.success) {
        this.key = res.key;
        this.select(this.key);
        this.files = await get();
      }
    },
    async select(filename) {
      this.saving = false;
      this.key = filename;
      this.input = (await read(filename)).data;
      this.original = this.input;
    }
  },
  async mounted() {
    this.files = await get();
  }
});
