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
      <v-btn outlined class="ml-3" color="blue" @click="setAll()">
        Set All
      </v-btn>
      <v-btn outlined class="ml-3" color="red" @click="clearAll()">
        Reset
      </v-btn>
      <v-spacer />
    </v-toolbar>

    <v-container>
      <v-row
        v-for="row in [0, 1, 2, 3, 4, 5, 6, 7, 8]"
        v-bind:key="row"
        class="flex-nowrap"
      >
        <v-col
          v-for="seg in rowSegments(row)"
          v-bind:key="seg.id"
          @click="segmentClick(seg)"
          :class="'fill-height segment-cell segment-cell-' + seg.type"
        >
          <div
            :style="'background-color: ' + seg.color"
            :class="'segment segment-' + seg.type"
          >
            &nbsp;
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
      "#333333",
    ],
    segments: [],
    socket: null,
  }),
  methods: {
    setState(state) {
      this.socket.emit("state", state);
    },
    setAll() {
      this.socket.emit("segment-change-all", this.color);
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
      if (!seg.type.includes("block")) {
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
.segment-cell {
  padding: 0;
}
.segment {
  margin: 3px !important;
  position: sticky;
  border-radius: 12px;
  user-select: none;
  min-height: 80px;
}
.segment-horiz,
.segment-hblock,
.segment-cell-horiz,
.segment-cell-hblock {
  min-height: 24px;
}
.segment-vert,
.segment-hblock,
.segment-cell-vert,
.segment-cell-hblock {
  width: 24px;
  flex-grow: 0;
}
</style>