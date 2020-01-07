<script>
  import { onMount } from "svelte";

  const { remote } = require("electron");
  const conn = remote.require("./main.js").conn;

  import SearchBar from "./SearchBar.svelte";
  import SampleTable from "./SampleTable.svelte";
  import VerticalTimeline from "./VerticalTimeline.svelte";

  import { parseSampleProcess } from "./utils";
  import { processes, needInit, searched, samples } from "./store.js";

  import DATA from "./data.js";

  const production = process.env.NODE_ENV != "development";

  function searchSampleProcess(index) {
    var { sampleda: sampleDate, sampleno: sampleID } = $samples[index];
    sampleDate = `${sampleDate.split(" ")[0]}%`;
    conn.exec(
      "SELECT * FROM sample_process WHERE record_time LIKE ? AND sampleno = ? ORDER BY record_time",
      [sampleDate, sampleID],
      handleSearchProcess
    );
  }

  function searchSample(sampleID) {
    if (production) {
      conn.exec(
        "SELECT sampleda, sampleno FROM labmain WHERE sampleno = ? ORDER BY sampleda DESC",
        [sampleID],
        function handleSearchSample(err, result) {
          if (err) {
            console.error(err);
          } else {
            samples.set(result);
            searched.set(true);
            if (result.length == 0) {
              searchSampleProcessByID(sampleID);
            }
          }
        }
      );
    } else {
      searched.set(true);
      searchSampleProcessByID(sampleID);
    }
  }

  function searchSampleProcessByID(sampleID) {
    if (production) {
      conn.exec(
        "SELECT * FROM sample_process WHERE sampleno = ? ORDER BY record_time",
        [sampleID],
        handleSearchProcess
      );
    } else {
      handleSearchProcess(null, DATA);
    }
  }

  function handleSearchProcess(err, result) {
    if (err) {
      console.error(err);
    } else {
      processes.set(parseSampleProcess(result));
      needInit.set(true);
    }
  }
</script>

<main class:searched="{$searched}">
  {#if !$searched}
  <h1>Laboman标本流程查询工具</h1>
  {/if}
  <SearchBar {searchSample}></SearchBar>
  <SampleTable {searchSampleProcess}></SampleTable>
  {#if $processes.length > 0}
  <VerticalTimeline processes="{$processes}"></VerticalTimeline>
  {/if}
</main>

<style>
  main {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 1em;
  }

  main.searched {
    display: block;
    height: auto;
  }

  h1 {
    font-size: 3em;
    color: #fff;
    margin-top: -60px;
    text-align: center;
  }
</style>
