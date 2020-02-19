var baseState = {};

function parseSampleProcess(data) {
  var processes = data.map(parseNode);

  return processes;
}

function parseNode(node) {
  var time = new Date(node.record_time);
  time = time.toLocaleTimeString("en-GB");

  var {
    serialno: serialNO,
    item,
    rack: rackID,
    tube: tubePosition,
    area,
    store,
    lisno: lisNO,
    record_type: recordType,
    record_source: recordSource
  } = node;

  if (!baseState.rackID) {
    baseState.rackID = rackID;
  }

  if (!baseState.tubePosition) {
    baseState.tubePosition = tubePosition;
  }

  // TODO: 暂时去除不必要的仪器名称部分的内容
  var recordInstrument = recordSource.split("^")[0];
  if (recordInstrument != "CT90") {
    recordSource = recordInstrument;
  } else {
    var recordPosition = recordSource.split("^")[1];
  }

  // TODO: 由于数据库里的连接符号可能改为+，故需去掉此处处理
  if (item) {
    item = item.split("\\").join("+");
  }

  if (store) {
    const storeInfos = store.split("^");
    let [storeType] = storeInfos;
    if (storeType == "STORE-F") {
      var [sortingIndex, trayNO, , , positionInRack] = storeInfos.slice(1);
    }
  }

  var iconName = getIconName(recordInstrument, recordPosition, recordType);
  var iconType = getIconType(recordPosition, recordType);
  var title = getTitle(recordType, recordSource, area, item);
  var status = getStatus(rackID, tubePosition);

  return {
    time,
    content: {
      title,
      serialNO,
      rackID,
      tubePosition,
      item,
      area,
      lisNO,
      sortingIndex,
      trayNO,
      positionInRack
    },
    iconName,
    iconType,
    status,
    blockRef: null,
    hide: false,
    bounceIn: false
  };
}

function getIconName(instrument, position, recordType) {
  var iconName;

  if (position == "SI" || position == "SO") {
    iconName = "TS";
  } else if (instrument == "CT90") {
    iconName = "CT";
  } else if (recordType == "0" || recordType == "1" || recordType == "2") {
    iconName = "LIS";
  } else {
    iconName = "INSTR";
  }

  return iconName;
}

function getIconType(position, recordType) {
  var iconType;

  if (recordType == "2" || recordType == "O") {
    iconType = `${
      position == "SI" || position == "B"
        ? "RIGHT-"
        : position == "SO"
        ? "LEFT-"
        : ""
    }OUT`;
  } else {
    iconType = `${
      position == "SI" || position == "B"
        ? "RIGHT-"
        : position == "SO"
        ? "LEFT-"
        : ""
    }IN`;
  }

  return iconType;
}

function getTitle(recordType, recordSource, area, item) {
  var title = "";
  switch (recordType) {
    case "0":
      title = `接收到LIS发送的指令`;
      break;
    case "1":
      title = `接收到LIS发送的病人信息`;
      break;
    case "2":
      title = `生成CDF文件供LIS解析`;
      break;
    case "Q":
      title = `接收到${recordSource}发送的指令询问`;
      break;
    case "O":
      title = `发送${area ? "归档" : !item ? "空" : ""}指令至${recordSource}`;
      break;
    case "R":
      title = `接收到${recordSource}发送的${
        recordSource.includes("CT-90") ? "标本回收" : ""
      }结果`;
      break;
  }
  return title;
}

function getStatus(rackID, tubePosition) {
  var status = "NORMAL";

  if (
    (baseState.rackID && rackID && rackID != baseState.rackID) ||
    (baseState.tubePosition &&
      tubePosition &&
      tubePosition != baseState.tubePosition)
  ) {
    status = "DANGER";
  }

  return status;
}

export { parseSampleProcess };
