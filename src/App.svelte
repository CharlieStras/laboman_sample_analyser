<script>
  const { remote } = require("electron");
  const conn = remote.require("./main.js").conn;

  import SearchBar from "./SearchBar.svelte";
  import SampleTable from "./SampleTable.svelte";
  import SampleInfo from "./SampleInfo.svelte";
  import VerticalTimeline from "./VerticalTimeline.svelte";

  import { parseSampleProcess } from "./utils";
  import { processes, searched, samples, sampleInfo } from "./store.js";

  import DATA from "./data.js";

  const production = process.env.NODE_ENV != "development";

  function searchSampleProcess(index) {
    var { sampleda: sampleDate, sampleno: sampleID } = $samples[index];
    sampleDate = `${sampleDate.split(" ")[0]}%`;

    if (production) {
      conn.exec(
        "SELECT * FROM sample_process WHERE record_time LIKE ? AND sampleno = ? ORDER BY record_time",
        [sampleDate, sampleID],
        handleSearchProcess
      );
    } else {
      searchSampleProcessByID(sampleID);
    }
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
            if ($samples.length == 0) {
              searchSampleProcessByID(sampleID);
            }
          }
        }
      );
    } else {
      const testSamples = [
        {
          sampleda: new Date().toLocaleDateString("zh-CN"),
          sampleno: "1"
        },
        {
          sampleda: new Date().toLocaleDateString("zh-CN"),
          sampleno: "2"
        }
      ];
      samples.set(testSamples);
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
      if (DATA[sampleID]) {
        handleSearchProcess(null, DATA[sampleID]);
      }
    }
  }

  function handleSearchProcess(err, result) {
    if (err) {
      console.error(err);
    } else {
      const {
        processes: parsedProcesses,
        sampleInfo: parsedSampleInfo
      } = parseSampleProcess(result);
      processes.set(parsedProcesses);
      sampleInfo.set(parsedSampleInfo);
    }
  }
</script>

<style>
  main {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  main.searched {
    display: block;
    height: auto;
  }

  h1 {
    font-size: 3rem;
    color: #fff;
    margin-top: -3.75rem;
    text-align: center;
  }
</style>

<main class:searched={$searched}>
  {#if !$searched}
    <h1>Laboman标本流程查询工具</h1>
  {/if}
  <SearchBar {searchSample} />
  <SampleTable {searchSampleProcess} />
  {#if $processes.length > 0}
    <SampleInfo />
    <VerticalTimeline processes={$processes} />
  {/if}
</main>
