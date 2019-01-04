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
    files: []
  },
  methods: {
    async save() {
      const res = await save(this.key, this.input);
      if (res.success) {
        this.key = res.key;
      }
    },
    load() {},
    async select(filename) {
      this.key = filename;
      this.input = (await read(filename)).data;
    }
  },
  async mounted() {
    this.files = await get();
  }
});
