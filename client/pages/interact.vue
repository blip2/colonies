<template>
  <div>
    <v-toolbar>
      <v-btn color="primary" nuxt to="/"> Back </v-btn>
      <v-spacer />
      <v-btn
        light
        color="green"
        @click="setState('Creative')"
        v-if="state == 'Random'"
        >Auto On</v-btn
      >
      <v-btn light color="white" @click="setState('Random')" v-else
        >Auto Off</v-btn
      >
      <v-btn
        v-for="c in colors"
        v-bind:key="c"
        :color="c"
        class="ml-3"
        @click="color = c"
        fab
        small
        :style="color == c ? 'border: 5px solid gold;' : ''"
      ></v-btn>
      <v-btn outlined class="ml-3" color="red" @click="clearAll()">
        Reset
      </v-btn>
      <v-spacer />
    </v-toolbar>

    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12">
          <div
            v-for="row in [0, 1, 2, 3, 4, 5, 6, 7, 8]"
            v-bind:key="row"
            class="segment-row"
          >
            <div
              v-for="seg in rowSegments(row)"
              v-bind:key="seg.id"
              @click="segmentClick(seg)"
              :style="'background-color: ' + seg.color"
              :class="'segment segment-' + seg.type"
            >
              &nbsp;
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const sortRow = function (a, b) {
  if (a.col < b.col) {
    return -1;
  }
  if (a.col > b.col) {
    return 1;
  }
  return 0;
};

export default {
  data: () => ({
    random: true,
    state: "",
    color: "#FF0000",
    colors: [
      "#FF0000",
      "#FFFF66",
      "#66FF33",
      "#00FFFF",
      "#0000FF",
      "#FF00AA",
      "#CCCCCC",
      "#000000",
    ],
    segments: [],
    socket: null,
  }),
  methods: {
    setState(state) {
      this.socket.emit("state", state);
    },
    clearAll() {
      this.socket.emit("reset");
    },
    rowSegments(row) {
      return this.segments
        .filter((x) => {
          return x.row == row;
        })
        .sort(sortRow);
    },
    segmentClick(seg) {
      if (seg.type != "block") {
        seg.color = this.color;
        this.socket.emit("segment-change", seg);
      }
    },
  },
  mounted() {
    console.log(this.$config.socketPath);
    this.socket = this.$nuxtSocket({ name: "service" });
    this.socket.on("segments", (msg) => {
      this.segments = msg;
    });
    this.socket.on("segment-change", (msg) => {
      this.segments = this.segments.map(
        (obj) => [msg].find((o) => o.id === obj.id) || obj
      );
    });
    this.socket.on("state", (msg) => {
      this.state = msg;
    });
  },
};
</script>

<style scoped>
.segment-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}
.segment {
  border-radius: 30px;
  margin: 3px;
  user-select: none;
}
.segment-block {
  display: inline-block;
  flex-grow: 10;
  min-height: 180px;
  background-color: black !important;
}
.segment-vert {
  display: inline-block;
  flex-grow: 1;
}
.segment-horiz {
  display: inline-block;
  flex-grow: 10;
  height: 20px;
}
</style>