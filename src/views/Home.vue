<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <add-ticker-form :addedTickers="addedTickers" @addTicker="addTicker" />

      <added-tickers-list
        v-if="addedTickers.length"
        :addedTickers="addedTickers"
        :selectedTicker="selectedTicker"
        @selectTicker="selectTicker"
        @handleDelete="handleDelete"
      />

      <tickers-graph
        v-if="selectedTicker"
        :graph="graph"
        :tickerName="selectedTicker.name"
        @closeGraph="selectedTicker = null"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { subscribeToTickerUpdate, unsubscribeFromTickerUpdate } from "../api";

import TickersGraph from "../components/TickersGraph.vue";
import AddedTickersList from "../components/AddedTickersList.vue";
import AddTickerForm from "../components/AddTickerForm.vue";
import { ITicker, IAppData } from "../types";

export default defineComponent({
  name: "App",
  components: {
    TickersGraph,
    AddedTickersList,
    AddTickerForm,
  },

  data() {
    const data: IAppData = {
      addedTickers: [],
      graph: [],
      selectedTicker: null,
      addingError: null,
    };
    return data;
  },

  created() {
    this.setAddedTickersOnLoad();
  },

  methods: {
    addTicker(ticker: ITicker) {
      this.addedTickers = [...this.addedTickers, ticker];
      subscribeToTickerUpdate(ticker.name, (newPrice: number) =>
        this.updateTickerPrice(ticker.name, newPrice),
      );
    },

    handleDelete(tickerToRemove: ITicker) {
      this.addedTickers = this.addedTickers.filter((t) => t !== tickerToRemove);

      if (this.selectedTicker === tickerToRemove) this.selectedTicker = null;

      unsubscribeFromTickerUpdate(tickerToRemove.name, () => {
        this.addedTickers = this.addedTickers.filter(
          (t) => t.name === tickerToRemove.name,
        );
      });
    },

    setAddedTickersOnLoad() {
      this.addedTickers =
        JSON.parse(localStorage.getItem("cryptonomicon-list") as string) || [];
      this.addedTickers.forEach((t) => {
        subscribeToTickerUpdate(t.name, (newPrice: number) =>
          this.updateTickerPrice(t.name, newPrice),
        );
      });
    },

    updateTickerPrice(tickerName: string, price: number) {
      this.addedTickers = this.addedTickers.map((t) => {
        if (t.name !== tickerName) return t;

        return {
          name: tickerName,
          price,
        };
      });
    },

    selectTicker(t: ITicker) {
      this.selectedTicker = t;
    },
  },

  watch: {
    selectedTicker() {
      this.graph = [];
    },

    addedTickers() {
      localStorage.setItem(
        "cryptonomicon-list",
        JSON.stringify(this.addedTickers),
      );

      if (this.selectedTicker) {
        const currentTicker = this.addedTickers.find(
          (t) => t.name === this.selectedTicker?.name,
        );

        //Снятия фокуса с монеты при её удалении из массива addedTickers
        if (!currentTicker) {
          this.selectedTicker = null;
          return;
        }

        if (
          currentTicker.price !== null &&
          currentTicker.price !== this.graph[this.graph.length - 1]
        ) {
          this.graph.push(currentTicker.price);
        }
      }
    },
  },
});
</script>
