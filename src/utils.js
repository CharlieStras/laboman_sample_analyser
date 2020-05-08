var sampleInfo = {};

const LIS_NO_ORDER = "未收到LIS指令";
const LIS_ORDER_LATE = "LIS指令时间晚于标本上机时间";
const LIS_NO_INFO = "未收到LIS发送的病人信息";
const LIS_INFO_LATE = "LIS发送的病人信息晚于标本上机时间";
const LIS_INFO_NO_NUMBER = "LIS发送的病人信息中不包含短号";
const LIS_ORDER_FORMAT_ERROR = "LIS指令格式有误";
const CT_NO_BT = "标本未经过BT或TS-10";
const LAB_ORDER_ERROR = "Laboman所下指令与LIS指令不符";

function parseSampleProcess(data) {
  sampleInfo = { lisOrder: "", instrLogs: [], errors: [], ctTimer: [] };

  var processes = data.filter((x) => x.record_type != "X").map(parseNode);

  return { processes, sampleInfo };
}

function parseNode(node, index, nodes) {
  var result = {};
  var record = {};
  const nodeCount = nodes.length;

  record.recordTime = node.record_time ?? "";
  record.sampleID = node.sampleno ?? "";
  record.recordSource = node.record_source ?? "";
  record.serialNO = node.serialno ?? "";
  record.recordType = node.record_type ?? "";
  record.rackID = node.rack ?? "";
  record.tubePosition = node.tube ?? "";
  record.order = node.item == null ? "" : node.item.toUpperCase();
  record.order = record.order.replace(/^\+/, "").replace(/\+$/, "");
  record.archivingInstruction = node.area ?? "";
  record.archivingResult = node.store ?? "";
  record.lisNO = node.lisno ?? "";
  record.archivingReason = node.sort_reason ?? "";
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

  const [orderContent] = record.order.split("^");

  if (record.recordType == "0") {
    sampleInfo.lisOrder = orderContent;
  }

  [
    record.recordInstrument,
    record.recordPosition,
    record.recordUnitNO,
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
        record.positionInRack,
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
    recordType,
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
    recordTime,
    recordInstrument,
    recordPosition,
    serialNO,
    archivingInstruction,
    order,
    lisNO,
    sortingIndex,
    trayNO,
    positionInRack,
    archivingReason,
    index,
  } = record;

  switch (recordType) {
    case "0":
      title = `接收到LIS发送的指令`;
      {
        const [orderContent, orderType] = order.split("^");
        const regex = RegExp(/^\+?([0-9a-zA-Z]+)?(\+[0-9a-zA-Z]+)*\+?$/);
        if (!regex.test(orderContent)) {
          addError(LIS_ORDER_FORMAT_ERROR);
          content = `指令内容: <strong class="error">${orderContent}</strong>`;
        } else {
          content = `指令内容: ${orderContent}<br>指令类型：${
            orderType == "L" ? "LIS指令" : "共享指令"
          }`;
        }
      }
      break;
    case "1":
      title = `接收到LIS发送的病人信息`;
      if (lisNO) {
        content = `LIS短号: ${lisNO}`;
      } else {
        addError(LIS_INFO_NO_NUMBER);
        content = `<strong class="error">无LIS短号</strong>`;
      }
      sampleInfo.hasLISInfo = true;
      break;
    case "2":
      title = `生成标本结果文件(*.cdf)供LIS解析`;
      break;
    case "Q":
      title = `接收到${recordInstrument}${
        serialNO ? "(" + serialNO + ")" : ""
      }发送的指令询问`;

      if (recordInstrument == "CT90") {
        sampleInfo.ctTimer.push(recordTime);
      }

      if (
        recordInstrument == "CT90" &&
        (recordPosition == "SI" || recordPosition == "B")
      ) {
        sampleInfo.passedSIOrBT = true;
        if (!sampleInfo.lisOrder) {
          addError(LIS_ORDER_LATE);
        }
      }

      if (recordInstrument != "CT90" && !sampleInfo.hasLISInfo) {
        addError(LIS_INFO_LATE);
      }

      addInstrLog(recordInstrument, recordPosition);

      break;
    case "O":
      if (archivingInstruction) {
        title = `发送归档指令至${recordInstrument}`;
        content = `归档区域: ${archivingInstruction}`;
      } else {
        title = `发送指令至${recordInstrument}`;

        var orderMatched = true;
        const [orderContent, orderType] = order.split("^");

        if (sampleInfo.lisOrder) {
          orderMatched = compareOrders(
            recordInstrument,
            recordPosition,
            orderContent,
            sampleInfo.lisOrder
          );

          if (!orderMatched) {
            addError(LAB_ORDER_ERROR);
          }
        }

        if (orderContent) {
          const orderTypeText =
            orderType == "D"
              ? "<br>指令类型: 默认指令"
              : orderType == "E"
              ? "<br>指令类型: 默认管架指令"
              : "";
          if (!orderMatched) {
            content = `指令内容: <strong class="error">${orderContent}</strong>${orderTypeText}`;
          } else {
            content = `指令内容: ${orderContent}${orderTypeText}`;
          }
        } else {
          if (!orderMatched) {
            content = `<strong class="error">空指令</strong>`;
          } else {
            content = `空指令`;
          }
        }

        if (recordInstrument == "XN") {
          sampleInfo.XNOrdered = true;
        }
      }

      changeInstrLog({
        instrument: recordInstrument,
        position: recordPosition,
        type: recordType,
        archivingInstruction,
        order,
      });
      break;
    case "R":
      if (recordInstrument.includes("CT90")) {
        title = `接收到${recordInstrument}发送的标本归档结果`;
        content = `归档区域: ${sortingIndex}，托盘序号: ${trayNO}，位置: ${positionInRack}<br>`;
        content += `归档原因: ${archivingReason}`;
      } else {
        title = `接收到${recordInstrument}发送的结果`;
      }

      changeInstrLog({
        instrument: recordInstrument,
        position: recordPosition,
        type: recordType,
      });
      break;
  }

  // 该标本的最后一条记录
  if (index + 1 == nodeCount) {
    if (!sampleInfo.passedSIOrBT) {
      addError(CT_NO_BT);
    }

    if (!sampleInfo.hasLISInfo) {
      addError(LIS_NO_INFO);

      const indexOfMessage = sampleInfo.errors.indexOf(LIS_INFO_LATE);
      if (indexOfMessage >= 0) {
        sampleInfo.errors.splice(indexOfMessage, 1);
      }
    }

    if (!sampleInfo.lisOrder) {
      addError(LIS_NO_ORDER);

      const indexOfMessage = sampleInfo.errors.indexOf(LIS_ORDER_LATE);
      if (indexOfMessage >= 0) {
        sampleInfo.errors.splice(indexOfMessage, 1);
      }
    }

    analyzeInstrLog();
  }

  return { title, content };
}

function compareOrders(instrument, position, order, lisOrder) {
  const parameters = order.split("+");
  const lisParameters = lisOrder.split("+");

  const CT90_PARAMETERS = [
    "CBC",
    "DIFF",
    "RET",
    "PLT-F",
    "WPC",
    "SP",
    "SPDI",
    "A1C",
  ];
  const XN_PARAMETERS = ["CBC", "DIFF", "RET", "PLT-F", "WPC"];

  if (
    instrument == "CT90" &&
    position != "C" &&
    !CT90_PARAMETERS.every(checkOrder)
  ) {
    return false;
  } else if (
    instrument == "XN" &&
    !sampleInfo.XNOrdered &&
    !XN_PARAMETERS.every(checkOrder)
  ) {
    return false;
  }

  return true;

  function checkOrder(parameter) {
    const lisIncludes = lisParameters.includes(parameter);
    const labomanIncludes = parameters.includes(parameter);
    return (
      (!lisIncludes && !labomanIncludes) || (lisIncludes && labomanIncludes)
    );
  }
}

function addInstrLog(instrument, position) {
  sampleInfo.instrLogs.push({ instrument, position });
}

function changeInstrLog(info) {
  var { instrument, position, type, archivingInstruction, order } = info;
  var matchedLog = sampleInfo.instrLogs
    .filter(function filterInstr(log) {
      if (type == "R" && instrument == "CT90") {
        position = "SI";
      }
      return log.instrument == instrument && log.position == position;
    })
    .slice(-1)[0];
  if (matchedLog) {
    if (type == "O") {
      if (archivingInstruction) {
        matchedLog.archivingOrdered = true;
      }
      if (!order) {
        matchedLog.emptyOrder = true;
      }
      matchedLog.ordered = true;
    } else {
      if (matchedLog.archivingOrdered) {
        matchedLog.archivingResult = true;
      }
      matchedLog.result = true;
    }
  }
}

function analyzeInstrLog() {
  const noOrderLogs = sampleInfo.instrLogs.filter(function filterNoOrderLogs(
    log
  ) {
    return !log.ordered;
  });
  const noResultLogs = sampleInfo.instrLogs.filter(function filterNoOrderLogs(
    log
  ) {
    return (
      log.instrument != "CT90" &&
      log.instrument != "SP-10" &&
      log.ordered &&
      !log.emptyOrder &&
      !log.result
    );
  });
  const noArchivingResult = sampleInfo.instrLogs.some(
    function checkArchivingResult(log) {
      return log.archivingOrdered && !log.archivingResult;
    }
  );

  noOrderLogs.forEach(function addNoOrderError(log) {
    const { instrument, position } = log;
    const errorMessage = `Laboman未回复${instrument}指令`;
    addError(errorMessage);
  });
  noResultLogs.forEach(function addNoOrderError(log) {
    const { instrument } = log;
    const errorMessage = `Laboman未收到${instrument}的结果`;
    addError(errorMessage);
  });
  if (noArchivingResult) {
    const errorMessage = `Laboman未收到归档结果`;
    addError(errorMessage);
  }
}

function addError(errorMessage) {
  var func = Array.prototype.push;
  if (
    errorMessage == CT_NO_BT ||
    errorMessage == LIS_NO_ORDER ||
    errorMessage == LIS_NO_INFO
  ) {
    func = Array.prototype.unshift;
  }

  !sampleInfo.errors.includes(errorMessage) &&
    func.call(sampleInfo.errors, errorMessage);
}

export { parseSampleProcess };
