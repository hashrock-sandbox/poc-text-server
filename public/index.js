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
    async fetch() {},

    async save() {
      this.saving = true;
      const res = await save(this.key, this.input);
      if (res.success) {
        this.key = res.key;
        this.select(this.key);
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
