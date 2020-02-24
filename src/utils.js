var sampleInfo = { errors: [] };

const LIS_NO_ORDER = "未收到LIS指令";
const LIS_ORDER_LATE = "LIS指令时间晚于标本上机时间";
const LIS_ORDER_FORMAT_ERROR = "LIS指令格式有误";
const CT_NO_BT = "标本未经过BT或TS-10";
const LAB_ORDER_ERROR = "Laboman所下指令与LIS指令不符";

function parseSampleProcess(data) {
  sampleInfo = { errors: [] };

  var processes = data.map(parseNode);

  return { processes, sampleInfo };
}

function parseNode(node, index, nodes) {
  var result = {};
  var record = {};
  const nodeCount = nodes.length;

  record.recordTime = node.record_time;
  record.sampleID = node.sampleno;
  record.recordSource = node.record_source;
  record.serialNO = node.serialno;
  record.recordType = node.record_type;
  record.rackID = node.rack;
  record.tubePosition = node.tube;
  record.order = node.item;
  record.archivingInstruction = node.area;
  record.archivingResult = node.store;
  record.lisNO = node.lisno;
  record.index = index;

  if (record.sampleID && !sampleInfo.sampleID) {
    sampleInfo.sampleID = record.sampleID;
  }

  if (record.rackID && !sampleInfo.rackID) {
    sampleInfo.rackID = record.rackID;
  }

  if (record.tubePosition && !sampleInfo.tubePosition) {
    sampleInfo.tubePosition = record.tubePosition;
  }

  if (record.recordType == "0") {
    sampleInfo.lisOrder = record.order;
  }

  [
    record.recordInstrument,
    record.recordPosition,
    record.recordUnitNO
  ] = record.recordSource.split("^");

  if (record.archivingResult) {
    const archivingInfos = record.archivingResult.split("^");
    const archivingType = archivingInfos[0];
    if (archivingType == "STORE-F") {
      [
        ,
        record.sortingIndex,
        record.trayNO,
        ,
        ,
        record.positionInRack
      ] = archivingInfos;
    }
  }

  result.recordTime = new Date(record.recordTime).toLocaleTimeString("en-GB");
  result.iconName = getIconName(record);
  result.iconType = getIconType(record);

  const pad = constructPad(record, nodeCount);
  result.title = pad.title;
  result.content = pad.content;

  result.status = "NORMAL";

  return result;
}

function getIconName(record) {
  var iconName;

  const {
    recordInstrument: instrument,
    recordPosition: position,
    recordType
  } = record;

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

function getIconType(record) {
  var iconType;

  const { recordPosition: position, recordType } = record;

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

function constructPad(record, nodeCount) {
  var title = "";
  var content = "";

  const {
    recordType,
    recordInstrument,
    recordPosition,
    serialNO,
    archivingInstruction,
    order,
    lisNO,
    sortingIndex,
    trayNO,
    positionInRack,
    index
  } = record;

  switch (recordType) {
    case "0":
      title = `接收到LIS发送的指令`;
      {
        const regex = RegExp(/^\+?([a-zA-Z]+)?(\+[a-zA-Z]+)*\+?$/);
        if (!regex.test(order)) {
          const errorMessage = LIS_ORDER_FORMAT_ERROR;
          sampleInfo.errors.indexOf(errorMessage) == -1 &&
            sampleInfo.errors.push(errorMessage);
          content = `指令内容: <strong class="error">${order}</strong>`;
        } else {
          content = `指令内容: ${order}`;
        }
      }
      break;
    case "1":
      title = `接收到LIS发送的病人信息`;
      content = `LIS短号: ${lisNO}`;
      break;
    case "2":
      title = `生成标本结果文件(*.cdf)供LIS解析`;
      break;
    case "Q":
      title = `接收到${recordInstrument}${
        serialNO ? "(" + serialNO + ")" : ""
      }发送的指令询问`;
      if (
        recordInstrument == "CT90" &&
        (recordPosition == "SI" || recordPosition == "B")
      ) {
        sampleInfo.passedSIOrBT = true;
        if (!sampleInfo.lisOrder) {
          const errorMessage = LIS_ORDER_LATE;
          sampleInfo.errors.indexOf(errorMessage) == -1 &&
            sampleInfo.errors.push(errorMessage);
        }
      }
      break;
    case "O":
      if (archivingInstruction) {
        title = `发送归档指令至${recordInstrument}`;
        content = `归档区域: ${archivingInstruction}`;
      } else if (order) {
        title = `发送指令至${recordInstrument}`;

        const parameters = order.split("+");
        const lisParameters = sampleInfo.lisOrder
          ? sampleInfo.lisOrder.split("+")
          : [];
        if (
          lisParameters.length > 0 &&
          recordInstrument != "SP-10" &&
          !sampleInfo.XNOrdered &&
          !parameters.every(parameter => lisParameters.includes(parameter))
        ) {
          const errorMessage = LAB_ORDER_ERROR;
          sampleInfo.errors.indexOf(errorMessage) == -1 &&
            sampleInfo.errors.push(errorMessage);
          content = `指令内容: <strong class="error">${order}</strong>`;
        } else {
          content = `指令内容: ${order}`;
        }

        if (recordInstrument == "XN") {
          sampleInfo.XNOrdered = true;
        }
      } else {
        title = `发送空指令至${recordInstrument}`;
      }
      break;
    case "R":
      if (recordInstrument.includes("CT90")) {
        title = `接收到${recordInstrument}发送的标本归档结果`;
        content = `归档区域: ${sortingIndex}，托盘序号: ${trayNO}，位置: ${positionInRack}`;
      } else {
        title = `接收到${recordInstrument}发送的结果`;
      }
      break;
  }

  // 该标本的最后一条记录
  if (index + 1 == nodeCount) {
    if (!sampleInfo.lisOrder) {
      const errorMessage = LIS_NO_ORDER;
      sampleInfo.errors.indexOf(errorMessage) == -1 &&
        sampleInfo.errors.unshift(errorMessage);

      const indexOfMessage = sampleInfo.errors.indexOf(LIS_ORDER_LATE);
      if (indexOfMessage >= 0) {
        sampleInfo.errors.splice(indexOfMessage, 1);
      }
    }
    if (!sampleInfo.passedSIOrBT) {
      const errorMessage = CT_NO_BT;
      sampleInfo.errors.indexOf(errorMessage) == -1 &&
        sampleInfo.errors.push(errorMessage);
    }
  }

  return { title, content };
}

export { parseSampleProcess };
