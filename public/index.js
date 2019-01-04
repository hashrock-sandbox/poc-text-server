const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

async function save(key, contents) {
  const obj = { key, contents };
  const method = "POST";
  const body = JSON.stringify(obj);
  const res = await fetch("/api", { method, headers, body });
  const json = await res.json();
  console.log(json);
}

async function get() {
  const res = await fetch("/files");
  const json = await res.json();
  return json;
}

new Vue({
  el: "#app",
  data: {
    input: "#test",
    key: "test",
    files: []
  },
  methods: {
    save() {
      save(this.key, this.input);
    },
    load() {}
  },
  async mounted() {
    this.files = await get();
  }
});
